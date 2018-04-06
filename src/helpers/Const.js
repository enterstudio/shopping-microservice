const constants = require('../helpers/Constants');
const ConfigUtils = require('../helpers/ConfigUtils');
let configUtils = new ConfigUtils(constants.CONFIG);

async function init() {
    await configUtils.loadContent();
}

init();

let VendorConfig = {};

VendorConfig[(configUtils.getParameter(constants.KEY_NAMES.service_api_key) + '')] = {
    service_api_key: configUtils.getParameter(constants.KEY_NAMES.service_api_key) || "no_service_api_key_found",
    vendor_name: 'Common Gateway',
    service_shared_secret: configUtils.getParameter(constants.KEY_NAMES.service_shared_secret) || "no_service_shared_secret_found",
    api_list: []
};

module.exports = {
    // Configuration of Vendor Authentication
    VendorConfig
};

