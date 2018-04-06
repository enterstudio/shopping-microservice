/**
 * Created by mayujain on 4/4/17.
 */

import {Stores} from '../models/models.index';


function createNewStore(store) {

    let returnedCollection = {
        id: store.id,
        name: store.title,
        handle: store.handle,
        alias: store.alias,
        description: store.body_html
    };
    if (store.image && store.image.src) {
        returnedCollection.image_url = store.image.src;
    }

    return new Promise((resolve, reject) => {

        Stores
            .create(returnedCollection)
            .then(newStore => {
                newStore = newStore.toJSON();
                newStore.updatedAt = undefined;
                newStore.createdAt = undefined;
                resolve(newStore);
            })
            .catch(err => {
                reject(err);
            })
    });
}

function updateExistingStore(store) {

    let returnedCollection = {
        id: store.id,
        name: store.title,
        handle: store.handle,
        description: store.body_html
    };

    if (store.alias) returnedCollection.alias = store.alias;

    if (store.image && store.image.src) returnedCollection.image_url = store.image.src;
    else returnedCollection.image_url = null;


    return new Promise((resolve, reject) => {

        Stores
            .update(returnedCollection, {
                where: {
                    id: store.id
                },
                limit: 1
            })
            .then(results => {
                if (results[0] === 1) {
                    resolve(store);
                } else {
                    reject();
                }
            })
            .catch(err => {
                reject(err);
            })
    });
}

function findStoresWithMatchingCollection(collectionIds) {

    return new Promise((resolve, reject) => {

        let store_ids = [];
        Stores
            .findAll({
                where: {
                    id: {$in: collectionIds}
                },
                attributes: ['id']
            })
            .then(stores => {
                stores.forEach((store) => {
                    store_ids.push((store.get()).id);
                });
                if (store_ids != null && store_ids.length > 0)
                    resolve(store_ids[0]);
                else
                    reject("Store not found");
            })
            .catch(err => {
                reject(err);
            })
    });
}

function getStoreDetails(storeId) {

    return new Promise((resolve, reject) => {

        Stores
            .findOne({where: {id: storeId}})
            .then(store => {
                if (store)
                    resolve(store.toJSON());
                else
                    resolve(null);
            })
            .catch(err => {
                reject(err);
            })
    });
}

function deleteStore(storeId) {

    return new Promise((resolve, reject) => {

        Stores
            .destroy({
                where: {
                    id: {$eq: storeId}
                },
                force: true
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log(`ERROR deleting Store : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });

    });
}

module.exports = {
    createNewStore,
    updateExistingStore,
    findStoresWithMatchingCollection,
    getStoreDetails,
    deleteStore
};