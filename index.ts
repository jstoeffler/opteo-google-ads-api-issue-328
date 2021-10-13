import { GoogleAdsApi, enums, toMicros } from "google-ads-api";
require("dotenv").config();

if (
    !process.env.GOOGLE_ADS_CLIENT_ID ||
    !process.env.GOOGLE_ADS_CLIENT_SECRET ||
    !process.env.GOOGLE_ADS_CUSTOMER_ACCOUNT_ID ||
    !process.env.GOOGLE_ADS_REFRESH_TOKEN ||
    !process.env.GOOGLE_ADS_DEVELOPER_TOKEN ||
    !process.env.GOOGLE_ADS_MANAGER_ACCOUNT_ID
) {
    throw new Error("Please check your .env file");
}

const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ACCOUNT_ID.split("-").join(""),
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    login_customer_id:
        process.env.GOOGLE_ADS_MANAGER_ACCOUNT_ID.split("-").join(""),
});

(async () => {
    try {
        const budget_name = (
            await customer.campaignBudgets.create([
                {
                    name:
                        "budg-issue-328-" +
                        (Math.random() + 1).toString(36).substring(4),
                    amount_micros: toMicros(5),
                    status: enums.BudgetStatus.ENABLED,
                    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
                    explicitly_shared: false,
                    period: enums.BudgetPeriod.DAILY,
                    type: enums.BudgetType.STANDARD,
                },
            ])
        ).results[0].resource_name;

        if (!budget_name) {
            throw new Error("Budget not created");
        }

        const campaign_name = (
            await customer.campaigns.create([
                {
                    name:
                        "camp-issue-328-" +
                        (Math.random() + 1).toString(36).substring(4),
                    campaign_budget: budget_name,
                    advertising_channel_type:
                        enums.AdvertisingChannelType.SEARCH,
                    status: enums.CampaignStatus.ENABLED,
                    bidding_strategy_type:
                        enums.BiddingStrategyType.MAXIMIZE_CONVERSIONS,
                    maximize_conversions: {},
                },
            ])
        ).results[0].resource_name;

        if (!campaign_name) {
            throw new Error("Campaign not created");
        }

        console.log("");
        console.log("");
        console.log("");
        console.log("fetch campaign before update:");
        console.log(
            JSON.stringify(await customer.campaigns.get(campaign_name), null, 2)
        );

        await customer.campaigns.update([
            {
                resource_name: campaign_name,
                bidding_strategy_type:
                    enums.BiddingStrategyType.MAXIMIZE_CONVERSIONS,
                maximize_conversions: {
                    target_cpa: 250000,
                },
            },
        ]);
        
        console.log("");
        console.log("");
        console.log("");
        console.log("fetch campaign after 1st update:");
        console.log(
            JSON.stringify(await customer.campaigns.get(campaign_name), null, 2)
        );

        await customer.campaigns.update([
            {
                resource_name: campaign_name,
                bidding_strategy_type:
                    enums.BiddingStrategyType.MAXIMIZE_CONVERSIONS,
                maximize_conversions: {
                    target_cpa: 0,
                },
            },
        ]);

        console.log("");
        console.log("");
        console.log("");
        console.log("--------------------------------");
        console.log("fetch campaign after 2nd update:");
        console.log(
            JSON.stringify(await customer.campaigns.get(campaign_name), null, 2)
        );

    } catch (e) {
        console.log(e);
        console.log(JSON.stringify(e));
        throw e;
    }
})();
