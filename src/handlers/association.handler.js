/**
 * Created by mayujain on 4/9/17.
 */


import {Associations} from '../models/models.index';
import _ from 'underscore';
import {sequelize} from '../db/connection';
const storesHandler = require('./store.handler');
const shopifyHandler = require('./shopify.handler');


function saveAssociation(storeId, productId, categoryId) {

    return new Promise((resolve, reject) => {

        Associations
            .findOrCreate({
                where: {
                    store_id: storeId,
                    prod_id: productId,
                    ctg_id: categoryId
                }
            })
            .spread((association, created) => {
                // console.log({association: association.toJSON()});
                if (created)
                    console.log(`Saved Store-Product-Category association '${association.id}' info in ASSOCIATION table.`);
                else
                    console.log(`Association '${association.id}' already exists in ASSOCIATION table.`);

                resolve(association.toJSON());
            })
            .catch((err) => {
                console.log(`ERROR creating Join-Associations : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function removeAssociation(productId) {

    return new Promise((resolve, reject) => {

        Associations
            .destroy({
                where: {
                    prod_id: {$eq: productId}
                }
            })
            .then((response) => {
                // console.log(response);
                if (response) {
                    console.log(`Deleted Association for product '${productId}'`);
                    resolve(response);
                }
                else {
                    reject("Cannot Delete Product with id=" + productId + ". Product does not exist in the ASSOCIATION");
                }
            })
            .catch((err) => {
                console.log(`ERROR deleting Association : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function updateAssociation(productId, newCategoryId) {

    return new Promise((resolve, reject) => {

        Associations
            .update({
                    ctg_id: newCategoryId
                },
                {
                    where: {
                        prod_id: productId,
                    }
                })
            .then((response) => {
                if (response[0] == 1) {
                    // console.log(`Updated Store-Product-Category association info in ASSOCIATIONS table. `);
                    resolve(response);
                }
                else {
                    console.log(`Association not found hence creating new association for category id '${newCategoryId}' `);
                    //Create association
                    return shopifyHandler.getCollectsFromShopify({product_id: productId})
                        .then((collectsArray) => {
                            let collectionIds = _.map(collectsArray, (collect) => {
                                return collect.collection_id
                            });
                            return storesHandler
                                .findStoresWithMatchingCollection(collectionIds)
                                .then((storeId) => {
                                    //save store_id, prod_id, category_id in join table
                                    saveAssociation(storeId, productId, newCategoryId)
                                        .then((response) => {
                                            resolve(response);
                                        })
                                        .catch((err) => {
                                            console.error(`Error creating new association ${err}`);
                                            reject(err);
                                        })
                                })
                                .catch((err) => {
                                    console.error(`Error: ${'\n'} ${err}`);
                                })
                        });
                }
            })
            .catch((err) => {
                console.log(`ERROR updating Store-Product-Category association : ${err.message} Error: ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function getParentCategoryName(productId) {
    return new Promise((resolve, reject) => {

        let str = "SELECT DISTINCT category.name FROM category JOIN prd_ctg_assc  ON prd_ctg_assc.prod_id = ? AND category.id = prd_ctg_assc.ctg_id AND category.parentCategoryId IS NULL;";

        sequelize.query(str, {
            replacements: [productId],
            type: sequelize.QueryTypes.SELECT
        })
            .then((result) => {
                resolve(result[0]["name"]);
            })
            .catch((err) => {
                console.log(`ERROR getting Category from Join-Associations : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function updateAssociationForSubCategory(parentCategoryName, newCategoryName, productId) {

    return new Promise((resolve, reject) => {

        let str = "UPDATE `prd_ctg_assc` SET `ctg_id`= " +
            "IFNULL((SELECT c1.id AS `new_cid` FROM category c1, category p WHERE c1.parentCategoryId = p.id AND lower(trim(p.name)) = ? AND lower(trim(c1.name))= ? AND c1.parentCategoryId IS NOT NULL), ctg_id) " +
            "WHERE `prd_ctg_assc`.`id` IN " +
            "(SELECT t.assc_id  " +
            "FROM (SELECT c.id AS `c_id`, c.name as `c_name`, c.parentCategoryId as `parentCategoryId`, a.id AS `assc_id` FROM category c JOIN prd_ctg_assc a ON trim(a.prod_id) = ? AND c.id = a.ctg_id) " +
            "AS t " +
            "WHERE " +
            "parentCategoryId IS NOT NULL);";


        /**
         IFNULL(expr1,expr2):
         If expr1 is not NULL, IFNULL() returns expr1; otherwise it returns expr2.
         IFNULL() returns a numeric or string value, depending on the context in which it is used.
         */

        sequelize
            .query(str, {
                replacements: [parentCategoryName, newCategoryName, productId]
            })
            .then((response) => {
                console.log(`Status: ${response[0]["message"]} ${'\n'}`);
                resolve(response[0]["message"]);
            })
            .catch((err) => {
                console.log(`ERROR updating sub-category in Associations : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function getAssociation(productId) {

    return new Promise((resolve, reject) => {

        Associations
            .findAll({
                where: {
                    prod_id: {$eq: productId}
                }
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log(`ERROR getting Join-Associations for Product : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });

    });
}

function getStoreIdForProduct(productId) {
    return new Promise((resolve, reject) => {

        let str = "SELECT t.store_id FROM (SELECT c.id AS c_id, c.name as c_name, c.parentCategoryId as parent, a.id AS `assc_id`, a.store_id FROM category c JOIN prd_ctg_assc a ON a.prod_id = ? AND c.id = a.ctg_id) AS t WHERE parent IS NULL";
        sequelize
            .query(str, {
                replacements: [productId],
                type: sequelize.QueryTypes.SELECT
            })
            .then((result) => {
                console.log(result);
                console.log(!result.isEmpty);
                if (!result.isEmpty && result[0] != undefined)
                    resolve(result[0]["store_id"]);
                else resolve(null);
            })
            .catch((err) => {
                console.log(`ERROR getting storeId from Join-Associations : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function checkIfAnySubCategoryExistsInAssociation(productId) {
    return new Promise((resolve, reject) => {

        let str = "SELECT t.* FROM (SELECT c.id AS c_id, c.name as c_name, c.parentCategoryId as parent, a.id AS `assc_id`, a.store_id FROM category c JOIN prd_ctg_assc a ON trim(a.prod_id) = ? AND c.id = a.ctg_id) AS t WHERE parent IS NOT NULL";
        sequelize
            .query(str, {
                replacements: [productId],
                type: sequelize.QueryTypes.SELECT
            })
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                console.log(`ERROR getting association from Join-Associations : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function updateStoreIdForProduct(productId, oldStoreId, newStoreId) {

    return new Promise((resolve, reject) => {

        Associations
            .update({
                    store_id: newStoreId
                },
                {
                    where: {
                        prod_id: productId,
                        store_id: oldStoreId,
                    }
                })
            .then((response) => {
                if (response[0] >= 1) {
                    console.log(`Updated store-id for product (productId: ${productId}) in ASSOCIATIONS table. Rows Updated : ${response[0]}`);
                    resolve(response);
                }
                else {
                    console.log(`Could not update store-id for product (productId: ${productId}) in ASSOCIATIONS table. Rows Updated : ${response[0]}`);
                }

            })
            .catch((err) => {
                console.log(`ERROR updating store-id association : ${err.message} Error: ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function deleteStore(storeId) {

    return new Promise((resolve, reject) => {

        Associations
            .destroy({where: {store_id: {$eq: storeId}}, force: true})
            .then((response) => {
                if (response > 0) {
                    console.log(`Deleted associations for store '${storeId}. Total deleted rows: ${response}'`);
                    resolve(true);
                }
                else {
                    console.log("Cannot delete store with id=" + storeId + ". Store does not exist in the ASSOCIATION");
                    resolve(false);
                }
            })
            .catch((err) => {
                console.log(`ERROR deleting Association : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

module.exports = {
    saveAssociation,
    removeAssociation,
    getParentCategoryName,
    getAssociation,
    updateAssociation,
    updateAssociationForSubCategory,
    getStoreIdForProduct,
    checkIfAnySubCategoryExistsInAssociation,
    updateStoreIdForProduct,
    deleteStore
};

