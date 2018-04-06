/**
 * Created by akakade on 10/26/17.
 */

const constants = {
    CONFIG: {
        PARAM_NAMES: ["SHOPIFY_API_KEY", "SHOPIFY_PASSWORD", "SHOPIFY_URL", "SHOPIFY_DOMAIN", "DB_USERNAME", "DB_PASSWORD", "DB_HOSTNAME", "DB_NAME", "SERVICE_API_KEY", "SERVICE_SHARED_SECRET", "WEBHOOK_SERVER_URL"]
    },
    KEY_NAMES: {
        db_username: "DB_USERNAME",
        db_password: "DB_PASSWORD",
        db_hostname: "DB_HOSTNAME",
        db_db_name: "DB_NAME",
        shopify_api_key: "SHOPIFY_API_KEY",
        shopify_password: "SHOPIFY_PASSWORD",
        shopify_url: "SHOPIFY_URL",
        shopify_domain: "SHOPIFY_DOMAIN",
        service_api_key: "SERVICE_API_KEY",
        service_shared_secret: "SERVICE_SHARED_SECRET",
        webhook_server_url: "WEBHOOK_SERVER_URL"
    },
    FULFILLMENT_STATUS_ENUM: ["pending", "open", "success", "cancelled", "failure"]
};


module.exports = constants;