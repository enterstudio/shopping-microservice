const rp = require('request-promise');
let constants = require('../config/constants');

module.exports = function (Shopify) {
    return {
        fetchProduct: function fetchProduct(productId) {
            let options = {
                uri: Shopify.getApiField('domain') + constants.productsUrl + "/" + productId + ".json",
                headers: {
                    'Authorization': Shopify.getApiField('auth')
                },
                json: true
            };

            return new Promise((resolve, reject)=> {
                rp(options)
                .then(data => {
                    resolve(data.product);
                }).catch(err => {
                    reject(err);
                });
            });
        },

        fetchProducts: function fetchProducts(queryObject) {
            let options = {
                uri: Shopify.getApiField('domain') + constants.productsUrl + ".json",
                qs: {
                    collection_id: queryObject.collectionId,
                    page: queryObject.page,
                    limit: queryObject.limit,
                    title: queryObject.title,
                    fields: queryObject.fields 
                },
                headers: {
                    'Authorization': Shopify.getApiField('auth')
                },
                json: true
            };

            return new Promise((resolve, reject)=> {
                rp(options)
                .then(data => {
                    resolve(data.products);
                }).catch(err => {
                    reject(err);
                });
            });
        }
    }
}