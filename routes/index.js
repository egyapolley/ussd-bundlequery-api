const express = require("express");
const router = express.Router();
const User = require("../model/user");
const validator = require("../utils/validators");
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

const appData = require("../utils/data")


const soapRequest = require("easy-soap-request");
const parser = require('fast-xml-parser');
const he = require('he');
const options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: true,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false,
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
    tagValueProcessor: (val, tagName) => he.decode(val),
    stopNodes: ["parse-me-as-string"]
};

passport.use(new BasicStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            user.comparePassword(password, function (error, isMatch) {
                if (err) return done(error);
                else if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false);
                }

            })

        });
    }
));


router.get("/bundles", passport.authenticate('basic', {
    session: false
}), async (req, res) => {

    const {error} = validator.validatePackageQuery(req.query);
    if (error) {
        return res.json({
            status: 2,
            reason: error.message
        })
    }
    const {subscriberNumber, channel} = req.query;
    if (channel.toLowerCase() !== req.user.channel) {
        return res.json({
            status: 2,
            reason: `Invalid Request channel ${channel}`
        })

    }

    const url = "http://172.25.39.16:2222";
    const sampleHeaders = {
        'User-Agent': 'NodeApp',
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'http://SCLINSMSVM01P/wsdls/Surfline/VoucherRecharge_USSD/VoucherRecharge_USSD',
        'Authorization': `Basic ${process.env.OSD_AUTH}`
    };

    let xmlRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pac="http://SCLINSMSVM01P/wsdls/Surfline/Package_Query_USSD.wsdl">
   <soapenv:Header/>
   <soapenv:Body>
      <pac:PackageQueryUSSDRequest>
         <CC_Calling_Party_Id>${subscriberNumber}</CC_Calling_Party_Id>
      </pac:PackageQueryUSSDRequest>
   </soapenv:Body>
</soapenv:Envelope>`;
    try {
        const {response} = await soapRequest({url: url, headers: sampleHeaders, xml: xmlRequest, timeout: 10000}); // Optional timeout parameter(milliseconds)

        const {body} = response;

        let jsonObj = parser.parse(body, options);
        let result = jsonObj.Envelope.Body;
        if (result.PackageQueryUSSDResult) {


            let packages = result.PackageQueryUSSDResult;

            const categoriesSet = new Set();
            const bundleEl_Value_Array = [];
            let resultEl_value;
            let acctType = null;

            for (const [k, v] of Object.entries(packages)) {

                if (k.startsWith("bundle")) {
                    let regex = /(.+?)\|/
                    let match = regex.exec(v.toString());
                    categoriesSet.add(match[1]);
                    bundleEl_Value_Array.push(v.toString())

                }
                if (k.startsWith("Result")) {
                    resultEl_value = v.toString();

                }
                if (k.startsWith("AccountType")) {
                    acctType = v.toString();

                }


            }

            if (acctType === 'PayWeekly') {

                let payWeeklyBundles = [...appData.payWeekly_bundles_2]

                let bundles_temp = null;

                const internalBndleID = await getBundlePurchased(subscriberNumber)
                if (internalBndleID && internalBndleID >= 5000 && internalBndleID <= 5007) {
                    let temp = payWeeklyBundles.filter(bundle => bundle.id >= internalBndleID)
                    bundles_temp = temp.map(bundle => {
                        return {
                            bundle_menu_message: bundle.bundle_menu_message,
                            bundle_value: bundle.bundle_value,
                            bundle_price: bundle.bundle_price,
                            bundle_validity: bundle.bundle_validity,
                            bundle_id :bundle.bundle_id,
                            bundle_subscriptionType: bundle.bundle_subscriptionType,
                            message_on_select: bundle.message_on_select
                        }
                    })


                } else {
                    bundles_temp = payWeeklyBundles.map(bundle => {
                        return {
                            bundle_menu_message: bundle.bundle_menu_message,
                            bundle_value: bundle.bundle_value,
                            bundle_price: bundle.bundle_price,
                            bundle_validity: bundle.bundle_validity,
                            bundle_subscriptionType: bundle.bundle_subscriptionType,
                            message_on_select: bundle.message_on_select
                        }
                    })

                }

                return res.json({
                    subscriberNumber: subscriberNumber,
                    subscriberAcctType: acctType,
                    status: 0,
                    reason: "success",
                    internetBundles: [{
                        name: "Pay Weekly",
                        bundles: bundles_temp
                    }]

                })

            }

            if (categoriesSet.size > 0 && bundleEl_Value_Array.length > 0) {
                const final_bundles = [];
                let catArray = [...categoriesSet];
                for (let i = 0; i < catArray.length; i++) {
                    let catValue = catArray[i];
                    let catObject = {};
                    catObject.name = catValue;
                    catObject.bundles = [];
                    for (let j = 0; j < bundleEl_Value_Array.length; j++) {
                        if (bundleEl_Value_Array[j].startsWith(catValue)) {
                            let tempStringArray = bundleEl_Value_Array[j].split("|");
                            let bundleDetails = tempStringArray[1];
                            let bundleId = tempStringArray[2];
                            let autorenewal = tempStringArray[3];
                            let bundleDetailtemp = bundleDetails.split(/\s@|\s\//g);
                            let dataValue = bundleDetailtemp[0];
                            let price = bundleDetailtemp[1].substring(3);
                            let validity = bundleDetailtemp[2];

                            let subscriptionType_temp = ["One-Time"]
                            if (autorenewal > 1) subscriptionType_temp.push("Auto-Renewal")

                            catObject.bundles.push(
                                {
                                    bundle_menu_message: bundleDetails,
                                    bundle_value: dataValue,
                                    bundle_price: parseFloat(price).toFixed(2),
                                    bundle_validity: validity,
                                    bundle_id: bundleId,
                                    bundle_subscriptionType: subscriptionType_temp,
                                    message_on_select: getMessageOnSelect(acctType,catValue)

                                });
                        }

                    }
                    final_bundles.push({
                        ...catObject
                    })

                }
                if (["SurfPlus", "Surf"].includes(acctType.toString())) {
                    final_bundles.push({
                        name: "Pay Weekly",
                        bundles: appData.payWeekly_bundles
                    })
                }

                res.json({
                    subscriberNumber: subscriberNumber,
                    subscriberAcctType: acctType,
                    status: 0,
                    reason: "success",
                    internetBundles: final_bundles,
                });


            } else {
                res.json({
                    subscriberNumber: subscriberNumber,
                    subscriberAcctType: acctType,
                    status: 1,
                    reason: resultEl_value,
                    internetBundles: null,


                });


            }
        }


    } catch (e) {
        console.log(e)
        res.json({
            status: 1,
            reason: "System failure",
        });

    }


})

router.post("/user", async (req, res) => {
    try {
        let {username, password, channel} = req.body;
        let user = new User({
            username,
            password,
            channel,
        });
        user = await user.save();
        res.json(user);

    } catch (error) {
        res.json({error: error.toString()})
    }


});

async function getBundlePurchased(subscriberNumber) {

    try {
        const soapUrl = "http://172.25.39.13:3004";
        const soapHeaders = {
            'User-Agent': 'NodeApp',
            'Content-Type': 'text/xml;charset=UTF-8',
            'SOAPAction': 'urn:CCSCD1_QRY',
        };

        let getBalanceXml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pi="http://xmlns.oracle.com/communications/ncc/2009/05/15/pi">
   <soapenv:Header/>
   <soapenv:Body>
      <pi:CCSCD1_QRY>
         <pi:username>${process.env.PI_USER}</pi:username>
         <pi:password>${process.env.PI_PASS}</pi:password>
         <pi:MSISDN>${subscriberNumber}</pi:MSISDN>
         <pi:LIST_TYPE>BALANCE</pi:LIST_TYPE>
         <pi:WALLET_TYPE>Primary</pi:WALLET_TYPE>
         <pi:BALANCE_TYPE>internalBdlId Count</pi:BALANCE_TYPE>
      </pi:CCSCD1_QRY>
   </soapenv:Body>
</soapenv:Envelope>`;

        const {response} = await soapRequest({url: soapUrl, headers: soapHeaders, xml: getBalanceXml, timeout: 10000}); // Optional timeout parameter(milliseconds)
        const {body} = response;
        let jsonObj = parser.parse(body, options);
        const soapResponseBody = jsonObj.Envelope.Body;
        if (soapResponseBody.CCSCD1_QRYResponse && parseInt(soapResponseBody.CCSCD1_QRYResponse.BALANCE.toString()) > 0) {
            return parseInt(soapResponseBody.CCSCD1_QRYResponse.BALANCE.toString());
        } else return null;

    } catch (error) {
        console.log(error);
        return null;

    }

}


function getMessageOnSelect(acctType, bundleCategory){
    if ((acctType === "SurfPlus" || acctType ==='SurfPlus-WithoutPayWeekly') && bundleCategory === "All Weather") return null
    if (acctType === bundleCategory) return  null
    if (acctType !== bundleCategory && appData.messages[bundleCategory]) return  appData.messages[bundleCategory]
    return  null
}


module.exports = router;

