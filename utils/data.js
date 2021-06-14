const messages = {
    "Pay Weekly": "Please this bundle will switch you to the Pay Weekly Offer and cancel existing subscription.\n" +
        "Press 1 to confirm\n" +
        "Press 1# to go back.\n",
    "AlwaysON":"Please this bundle will switch you to the AlwaysON Offer and cancel existing subscription.\n" +
        "Press 1 to confirm\n" +
        "Press 1# to go back.\n",
    "All Weather":"Please this bundle will switch you to the All Weather Offer and cancel existing subscription.\n" +
        "Press 1 to confirm\n" +
        "Press 1# to go back.\n",
}

const payWeekly_bundles = [
    {
        bundle_menu_message: "30GB @GHc30/weekly",
        bundle_value: "7.5GB",
        bundle_price: "30.00",
        bundle_validity: "7days",
        bundle_id: "30pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
    {
        bundle_menu_message: "36GB @GHc40/weekly",
        bundle_value: "9GB",
        bundle_price: "40.00",
        bundle_validity: "7days",
        bundle_id: "36pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
    {
        bundle_menu_message: "45GB @GHc50/weekly",
        bundle_value: "11.25GB",
        bundle_price: "50.00",
        bundle_validity: "7days",
        bundle_id: "45pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
    {
        bundle_menu_message: "54GB @GHc60/weekly",
        bundle_value: "13.50GB",
        bundle_price: "60.00",
        bundle_validity: "7days",
        bundle_id: "54pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
    {
        bundle_menu_message: "68GB @GHc70/weekly",
        bundle_value: "17GB",
        bundle_price: "70.00",
        bundle_validity: "7days",
        bundle_id: "68pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
    {
        bundle_menu_message: "125GB @GHc80/weekly",
        bundle_value: "31.25GB",
        bundle_price: "80.00",
        bundle_validity: "7days",
        bundle_id: "125pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
    {
        bundle_menu_message: "185GB @GHc90/weekly",
        bundle_value: "46.25GB",
        bundle_price: "90.00",
        bundle_validity: "7days",
        bundle_id: "185pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
    {
        bundle_menu_message: "350GB @GHc100/weekly",
        bundle_value: "87.50GB",
        bundle_price: "100.00",
        bundle_validity: "7days",
        bundle_id: "350pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: messages["Pay Weekly"] ? messages["Pay Weekly"] : null
    },
]


const payWeekly_bundles_2=[
    {
        id:5000,
        bundle_menu_message: "30GB @GHc30/weekly",
        bundle_value: "7.5GB",
        bundle_price: "30.00",
        bundle_validity: "7days",
        bundle_id: "30pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select:  null
    },
    {
        id:5001,
        bundle_menu_message: "36GB @GHc40/weekly",
        bundle_value: "9GB",
        bundle_price: "40.00",
        bundle_validity: "7days",
        bundle_id: "36pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select:  null
    },
    {
        id:5002,
        bundle_menu_message: "45GB @GHc50/weekly",
        bundle_value: "11.25GB",
        bundle_price: "50.00",
        bundle_validity: "7days",
        bundle_id: "45pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: null
    },
    {
        id:5003,
        bundle_menu_message: "54GB @GHc60/weekly",
        bundle_value: "13.50GB",
        bundle_price: "60.00",
        bundle_validity: "7days",
        bundle_id: "54pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: null
    },
    {
        id:5004,
        bundle_menu_message: "68GB @GHc70/weekly",
        bundle_value: "17GB",
        bundle_price: "70.00",
        bundle_validity: "7days",
        bundle_id: "68pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: null
    },
    {
        id:5005,
        bundle_menu_message: "125GB @GHc80/weekly",
        bundle_value: "31.25GB",
        bundle_price: "80.00",
        bundle_validity: "7days",
        bundle_id: "125pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: null
    },
    {
        id:5006,
        bundle_menu_message: "185GB @GHc90/weekly",
        bundle_value: "46.25GB",
        bundle_price: "90.00",
        bundle_validity: "7days",
        bundle_id: "185pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select:  null
    },
    {
        id:5007,
        bundle_menu_message: "350GB @GHc100/weekly",
        bundle_value: "87.50GB",
        bundle_price: "100.00",
        bundle_validity: "7days",
        bundle_id: "350pw",
        bundle_subscriptionType: ["One-Time"],
        message_on_select: null
    },
 ]


module.exports = {
    messages,
    payWeekly_bundles,
    payWeekly_bundles_2
}
