/**
 * Created by mayujain on 5/18/17.
 */

import {Cartitems} from '../models/models.index'
import {sequelize} from '../db/connection';


//Add product item to cart
function createOrUpdateCartItem(obj) {
    return new Promise((resolve, reject) => {
        Cartitems
            .findOrCreate({
                where: {
                    app_id: obj.app_id,
                    user_id: obj.user_id,
                    store_id: obj.store_id,
                    prod_id: obj.prod_id,
                    variant_id: obj.variant_id,
                    unit_price: obj.price
                },
                defaults: {
                    quantity: obj.quantity
                }
            })
            .spread((cartItem, created) => {

                if (created) { // successfully created new item in cart
                    cartItem = cartItem.toJSON();
                    let datetime = new Date().toISOString();
                    cartItem.createdAt = datetime;
                    cartItem.updatedAt = datetime;

                    resolve(cartItem);

                } else { // product item already exist in cart, need to update quantity
                    return Cartitems
                        .update({
                            quantity: obj.quantity
                        }, {
                            where: {
                                id: cartItem.id
                            },
                            fields: ['quantity'],
                            validate: true,
                            limit: 1
                        })
                        .then((results) => {
                            if (results[0] === 1) {
                                cartItem.quantity = obj.quantity;
                                resolve(cartItem);
                            } else
                                reject({"message": 'Failed to update cart item quantity, cart item does not exist.'})
                        })
                        .catch(err => {
                            console.log(`ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                            reject({"message": `ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`})
                        });
                }
            })
            .catch(err => {
                console.log(`ERROR finding cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject({"message": `ERROR finding cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`})
            });
    });
}

//Change product item quantity
function updateCartItemQuantity(obj) {

    return new Promise((resolve, reject) => {
        Cartitems
            .update({
                quantity: obj.quantity
            }, {
                where: {
                    id: obj.cartItemId,
                    app_id: obj.app_id,
                    user_id: obj.user_id
                },
                fields: ['quantity'],
                validate: true,
                limit: 1
            })
            .then((results) => {
                if (results[0] === 1) {
                    return Cartitems
                        .findById(Number(obj.cartItemId))
                        .then(cartItem => {
                            if (cartItem) {
                                cartItem = cartItem.toJSON();
                                resolve(cartItem);
                            } else
                                reject({"message": 'Error retrieving cart item entity'});

                        }).catch(err => {
                            console.log(`ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                            reject({"message": err});
                        });
                } else {
                    reject({"message": 'Cart item does not exist for user (user_id: ' + obj.user_id + ') in request'});
                }
            })
            .catch(err => {
                console.log(`ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject({"message": `ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`});
            });

    });
}

//Delete product item from cart
function deleteCartItem(obj) {
    return new Promise((resolve, reject) => {
        return Cartitems
            .destroy({
                where: {
                    id: obj.cartItemId,
                    app_id: obj.app_id,
                    user_id: obj.user_id
                },
                limit: 1
            })
            .then(response => {
                if (response === 1) {
                    console.log(`Deleted cart item with id '${obj.cartItemId}'`);
                    resolve({success: true});
                } else {
                    console.log(`Unable to delete nonexistent cart item with id '${obj.cartItemId}'`);
                    reject({"message": `Unable to delete nonexistent cart item with id '${obj.cartItemId}'`});
                }
            })
            .catch(err => {
                console.log(`ERROR deleting cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject({"message": `ERROR deleting cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`})
            });


    });
}

function emptyShoppingCartForUser(obj) {
    return new Promise((resolve, reject) => {
        return Cartitems
            .destroy({
                where: {
                    app_id: obj.app_id,
                    user_id: obj.user_id
                }
            })
            .then(response => {
                if (response > 0) {
                    console.log(`Deleted all cart items for user id ${obj.user_id}`);
                    resolve({success: true});
                } else {
                    console.log(`Unable to delete nonexistent cart item for user with id '${obj.user_id}'`);
                    reject({"message": `Unable to delete nonexistent cart item for user with id '${obj.user_id}'`});
                }
            })
            .catch(err => {
                console.log(`ERROR deleting cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject({"message": `ERROR deleting cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`})
            });


    });
}

function getVariantsArray(variantId) {
    return new Promise((resolve, reject) => {

        let str = "select v.* from (select JSON_EXTRACT(variants, '$[*].id') as variant_id, JSON_EXTRACT(variants, '$[*].price') as price from product) AS v where JSON_CONTAINS(v.variant_id, '[?]');";
        sequelize
            .query(str, {
                replacements: [variantId],
                type: sequelize.QueryTypes.SELECT
            })
            .then((result) => {
                // console.log(result);
                resolve(result[0]);
            })
            .catch((err) => {
                console.log(`ERROR getting variants : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

module.exports = {
    createOrUpdateCartItem,
    updateCartItemQuantity,
    deleteCartItem,
    emptyShoppingCartForUser,
    getVariantsArray
};

