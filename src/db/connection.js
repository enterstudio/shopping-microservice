/**
 * Created by mayujain on 3/30/17.
 */

import Sequelize from 'sequelize';

const constants = require('../helpers/Constants');
const ConfigUtils = require('../helpers/ConfigUtils');
let configUtils = new ConfigUtils(constants.CONFIG);

async function init(){
    await configUtils.loadContent();
}

init();

let db_user = configUtils.getParameter(constants.KEY_NAMES.db_username);
let db_password = configUtils.getParameter(constants.KEY_NAMES.db_password);
let db_host = configUtils.getParameter(constants.KEY_NAMES.db_hostname);
let db_schema = configUtils.getParameter(constants.KEY_NAMES.db_db_name);

let sequelize = new Sequelize( db_schema, db_user, db_password, {
    host: db_host,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }

});

module.exports = {sequelize};
