/**
 * Created by mayujain on 4/6/17.
 */

const httpStatus = require('http-status');
const shopifyHandler = require('../handlers/shopify.handler');
const storesHandler = require('../handlers/store.handler');
const productsHandler = require('../handlers/product.handler.js');
const categoriesHandler = require('../handlers/category.handler.js');
const associationsHandler = require('../handlers/association.handler');
const util = require('util');
import _ from 'underscore';
const async = require('async');

module.exports = {

    //save Product And Associations in Database
    getProductFromWebhook: (req, res, next) => {
        saveProductAndAssociations(req.body);
        console.log(`** Tasks for Webhook 'products/create' completed. ** ${'\n'}`);
        res.status(httpStatus.OK).send("OK");
    },

    //Update product
    getProductUpdateFromWebhook: (req, res, next) => {
        updateProductAndAssociations(req.body);
        console.log(`** Tasks for Webhook 'products/update' completed. ** ${'\n'}`);
        res.status(httpStatus.OK).send("OK");
    },

    //delete product and join association
    deleteProductFromWebhook: (req, res, next) => {
        deleteProductAndAssociations(req.body);
        console.log(`** Tasks for Webhook 'products/delete' completed. ** ${'\n'}`);
        res.status(httpStatus.OK).send("OK");
    }

};

const saveProductAndAssociations = async(product) => {
    try {
        const collectsArray = await shopifyHandler.getCollectsFromShopify({product_id: product.id});
        let collectionIds = _.map(collectsArray, (collect) => {
            return collect.collection_id
        });
        const storeId = await storesHandler.findStoresWithMatchingCollection(collectionIds);
        const savedProduct = await productsHandler.saveProduct(product);
        if (product.product_type !== undefined && product.product_type != '') {
            const category = await categoriesHandler.saveCategory(product.product_type);
            await associationsHandler.saveAssociation(storeId, savedProduct.id, category.id);
            if (product.tags !== undefined && product.tags != '')
                createAssociationForSubCategory(product, category, storeId, null);
        }
        else {
            const category = await categoriesHandler.saveCategory('default_category');
            await associationsHandler.saveAssociation(storeId, savedProduct.id, category.id);
        }
    } catch (err) {
        console.error(`Error while handling products/create webhook: ${'\n'} ${err}`);
    }
};

const deleteProductAndAssociations = async(product) => {
    try {
        await associationsHandler.removeAssociation(product.id);
        await productsHandler.removeProduct(product);
    } catch (err) {
        console.error(`Error while handling products/delete webhook: ${'\n'} ${err}`);
    }
};

const updateProductAndAssociations = async(product) => {
    try {
        const success = await productsHandler.updateProductInfo(product);
        if (success) {
            updateStore(product);
            const parent_category_name = await associationsHandler.getParentCategoryName(product.id);
            const parentCategory = await categoriesHandler.getCategoryByName(parent_category_name);
            if (product.product_type !== undefined && product.product_type != '') {

                if (product.product_type !== parent_category_name) {
                    const category = await categoriesHandler.saveCategory(product.product_type);
                    await associationsHandler.removeAssociation(product.id);
                    await associationsHandler.updateAssociation(product.id, category.id);
                    if (category && product.tags)
                        await createAssociationForSubCategory(product, category, null, null);
                }
                else { //Update tags. Save sub categories if any tags are present
                    if (product.tags !== undefined && product.tags !== '') {
                        const new_sub_category = (product.tags.split(","))[0];
                        const subCat_names_array = await categoriesHandler.getSubCategoriesForCategory(parent_category_name);
                        checkAndUpdateTags(parent_category_name, parentCategory, product, new_sub_category, subCat_names_array);
                    }
                }
            }
            else {
                const category = await categoriesHandler.saveCategory('default_category');
                await associationsHandler.removeAssociation(product.id);
                await associationsHandler.updateAssociation(product.id, category.id);
            }
        }
        else {
            await saveProductAndAssociations(product);
        }
    } catch (err) {
        console.error(`Error while handling products/update webhook: ${'\n'} ${err}`);
    }
};

function checkAndUpdateTags(parent_category_name, parentCategory, product, new_sub_category, subCat_names_array) {
    async.series({
        one: checkForNewTags,
        two: updateTags,
    }, function (err, results) {
        if (err) console.log(`Async error ${err}`);
    });

    function checkForNewTags(callback) {
        if (product.tags.length > 0 && _.indexOf(subCat_names_array, new_sub_category) == -1) {
            //add new sub-category
            categoriesHandler.saveTagAsSubCategory(parentCategory, product);
        }
        callback(null);
    }

    function updateTags(callback) {
        //check if sub-cat exists in join table, if not then create a row in join table
        associationsHandler
            .checkIfAnySubCategoryExistsInAssociation(product.id)
            .then((response) => {
                if (response == null || response == undefined || response.length == 0) {
                    return categoriesHandler.getCategoryByName(new_sub_category)
                        .then((subCategory) => {
                            return createAssociationForSubCategory(product, parentCategory, null, subCategory);
                        });
                } else {  // otherwise update row
                    return associationsHandler.updateAssociationForSubCategory(parent_category_name, new_sub_category, product.id);
                }
            })
            .catch((err) => {
                console.error(`Error : ${err}`);
            });

        callback(null);
    }
}

function createAssociationForSubCategory(product, parentCategory, storeId, subCategory) {

    async.waterfall([

            function (callback) {
                if (storeId === null || storeId === undefined || storeId === '') {
                    //Get the storeID of that product using the fact that the product belongs to only one category
                    associationsHandler
                        .getStoreIdForProduct(product.id)
                        .then(storeId => {
                            if(storeId != null)
                                callback(null, storeId);
                            else
                                callback(null);
                        });
                } else {
                    callback(null, storeId)
                }
            },

            function (storeId, callback) {

                if (subCategory === null || subCategory == undefined || subCategory === '') {
                    // console.log(`{${ '\n'} parentCategory ID: ${parentCategory.id}, ${'\n'} tags: ${product.tags}, ${'\n'} product ID: ${product.id} ${'\n'}}`);
                    return categoriesHandler
                        .saveTagAsSubCategory(parentCategory, product)
                        .then((savedSubCategory) => {
                            //Add subcategory to association table.
                            return associationsHandler.saveAssociation(storeId, product.id, savedSubCategory.id);
                        })
                        .then(() => {
                            callback(null)
                        })
                        .catch((err) => {
                            console.error(`Error : ${err}`);
                        });
                }
                else {
                    //Add subcategory to association table.
                    return associationsHandler
                        .saveAssociation(storeId, product.id, subCategory.id)
                        .then(() => {
                            callback(null)
                        })
                        .catch(err => {
                            console.error(`Error : ${err}`);
                            callback(err);
                        });
                }
            }
        ],
        function (err, results) {
            if (err) console.log(`Async error ${err}`);
        });
}

const updateStore = async(product) => {
    const currentStoreId = await associationsHandler.getStoreIdForProduct(product.id);
    const collectsArray = await shopifyHandler.getCollectsFromShopify({product_id: product.id});
    if (currentStoreId && collectsArray) {

        let collectionIds = _.map(collectsArray, (collect) => {
            return collect.collection_id
        });
        if (collectionIds && collectionIds.length > 0) {
            let newStoreId = collectionIds[0];
            console.log(`currentStoreId: ${currentStoreId}, newStoreId: ${newStoreId}`);
            if (newStoreId === currentStoreId) {  //don't update the store-id
                console.log(`Product's store-id not changed; skipping store update.`);
            } else { //change product's store-id
                //check whether new exists in DB before updating
                const newStore = await storesHandler.getStoreDetails(newStoreId);
                if (newStore !== null)
                    await associationsHandler.updateStoreIdForProduct(product.id, currentStoreId, newStoreId);
                else
                    console.log(`Cannot update store-id to (${newStoreId}) since this store does not exist in database.`)
            }
        }
    }
};


