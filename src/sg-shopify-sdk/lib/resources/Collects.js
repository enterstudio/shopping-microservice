/**
 * Created by mayujain on 4/8/17.
 */

const rp = require('request-promise');
let constants = require('../config/constants');
// require('request-debug')(rp);

module.exports = function (Shopify) {
    return {

        getCollects: (queryObject) => {

            let options = {
                uri: Shopify.getApiField('domain') + constants.collectsUrl + ".json",
                qs:{
                    collection_id: queryObject.collection_id,
                    product_id: queryObject.product_id,
                    page: queryObject.page,
                    limit: queryObject.limit,
                },
                headers: {
                    'Authorization': Shopify.getApiField('auth')
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.collects);
                    }).catch(err => {
                    reject(err);
                });
            });
        }
    }
};
