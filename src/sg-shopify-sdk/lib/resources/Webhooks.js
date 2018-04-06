/**
 * Created by mayujain on 4/6/17.
 */

const rp = require('request-promise');
let constants = require('../config/constants');
// require('request-debug')(rp);

module.exports = function (Shopify) {
    return {
        createWebhook: (webhookObject) => {

            let webhook = {
                webhook: {
                    topic: webhookObject.topic,
                    address: webhookObject.address,
                    format: "json"
                }
            };

            let options = {
                method: 'POST',
                uri: Shopify.getApiField('domain') + constants.webhooksUrl + ".json",
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: webhook,
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.webhook);
                    }).catch(err => {
                    reject(err);
                });
            });
        },

        getWebhooks: (queryObject) => {

            let options = {
                uri: Shopify.getApiField('domain') + constants.webhooksUrl + ".json",
                qs: {
                    address: queryObject.address,
                    topic: queryObject.topic,
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
                        resolve(data.webhooks);
                    }).catch(err => {
                    reject(err);
                });
            });
        },

        deleteWebhook: (webhookID) => {

            let options = {
                method: 'DELETE',
                uri: Shopify.getApiField('domain') + constants.webhooksUrl + "/" + webhookID + ".json",
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.webhook);
                    }).catch(err => {
                    reject(err);
                });
            });
        }

    }
}
