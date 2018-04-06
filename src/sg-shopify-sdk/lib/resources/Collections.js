const rp = require('request-promise');
let constants = require('../config/constants');

module.exports = function (Shopify) {
    return {
        //returns collections based on the ids provided
        fetchCollection: function fetchCollection(collectionId) {
            let options = {
                uri: Shopify.getApiField('domain') + constants.collectionsUrl + '.json',
                qs: {
                    ids: collectionId
                },
                headers: {
                    'Authorization': Shopify.getApiField('auth')
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.custom_collections[0]);
                    }).catch(err => {
                    reject(err);
                });
            });
        },

        //Returns collections based on query object, only two options in the query object possible  - page, limit
        fetchQueryCollections: function fetchQueryCollections(queryObject) {
            let options = {
                uri: Shopify.getApiField('domain') + constants.collectionsUrl + '.json',
                qs: {
                    ids: queryObject.ids,
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

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.custom_collections);
                    }).catch(err => {
                    reject(err);
                });
            });
        },

        //create new collection
        createCollection: function createCollection(collectionObject) {

            let collection = {
                custom_collection: {
                    title: collectionObject.title,
                    body_html: collectionObject.description
                }
            };
            if (collectionObject.image_url) {
                collection.custom_collection.image = {
                    src: collectionObject.image_url
                }
            }

            let options = {
                method: 'POST',
                uri: Shopify.getApiField('domain') + constants.collectionsUrl + '.json',
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: collection,
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.custom_collection);
                    }).catch(err => {
                    reject(err);
                });
            });
        },

        //update existing collection
        updateCollection: function updateCollection(collectionObject) {

            let collection = {
                custom_collection: {
                    id: collectionObject.id,
                    title: collectionObject.title,
                    body_html: collectionObject.description
                }
            };
            if (collectionObject.image_url) {
                collection.custom_collection.image = {
                    src: collectionObject.image_url
                };
            } else {
                collection.custom_collection.image = '';
            }

            var updateCollectionUrl = constants.collectionsUrl+'/'+collectionObject.id+'.json';
            let options = {
                method: 'PUT',
                uri: Shopify.getApiField('domain') + updateCollectionUrl,
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: collection,
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.custom_collection);
                    }).catch(err => {
                    reject(err);
                });
            });
        }
    }
}