/**
 * Created by mayujain on 5/22/17.
 */

import _ from 'underscore';
import {Orders} from '../models/models.index';
import {sequelize} from '../db/connection';
import {Cartitems} from '../models/models.index';
const cartItemHandler = require('./cartitem.handler');
const shopifyHandler = require('./shopify.handler');

function save(obj) {

    return new Promise((resolve, reject) => {

        Orders
            .findOrCreate({
                where: {
                    user_id: obj.user_id,
                    customer_id: obj.customer_id,
                    order_id: obj.order_id
                }
            })
            .spread((newOrder, created) => {
                if (created)
                    console.log(`Saved Order '${newOrder.id}' info in Orders table.`);
                else
                    console.log(`Order '${newOrder.id}' already exists in Orders table.`);
                resolve(newOrder.toJSON());
            })
            .catch((err) => {
                console.log(`ERROR creating Order : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function updateOrderInfo(obj) {

    return new Promise((resolve, reject) => {

        Orders
            .update({
                    customer_id: obj.customer_id
                },
                {
                    where: {
                        user_id: {$eq: obj.user_id}
                    }
                })
            .then(response => {
                if (response[0] === 1) {
                    console.log(`Updated Order info.`);
                    resolve(true);
                } else
                    reject("Order does not exist in DB.")
            })
            .catch(err => {
                console.log(`ERROR updating Order : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });

    });
}

function deleteOrderForCustomer(obj) {

    return new Promise((resolve, reject) => {

        Orders
            .destroy({
                where: {
                    customer_id: {$eq: obj.id}
                }
            })
            .then(response => {
                console.log(`Deleted Order for customer id '${obj.id}'`);
                resolve(response);
            })
            .catch(err => {
                console.log(`ERROR deleting Order : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function findOrderForUser(user_id) {

    return new Promise((resolve, reject) => {
        Orders
            .findOne({
                where: {
                    user_id: user_id
                }
            })
            .then(userOrder => {
                if (userOrder)
                    resolve(userOrder.toJSON());
                else
                    resolve(null);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getOrderIds(user_id) {

    return new Promise((resolve, reject) => {
        let str = "SELECT * FROM `order` o WHERE trim(o.user_id) = ? AND o.order_id IS NOT NULL;";
        sequelize
            .query(str, {
                replacements: [user_id],
                type: sequelize.QueryTypes.SELECT
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.log(`ERROR getting orders for user ('user_id': ${user_id}) : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(err);
            });
    });
}

function placePendingOrder(app_id, user_id, customer_id, currency, isFulfilled, isPaid) {
    return new Promise((resolve, reject) => {

        Cartitems     //get all cart items for app-user combo
            .findAndCountAll({
                where: {
                    app_id: app_id,
                    user_id: user_id
                }
            })
            .then(result => {

                if (result.count > 0) {

                    let lineItems = _.map(result.rows, (item) => {
                        return {
                            variant_id: Number(item.variant_id),
                            quantity: item.quantity,
                            price: item.unit_price
                        }
                    });

                    //create shopify order
                    return shopifyHandler
                        .createOrder({
                            lineItems: lineItems,
                            customer_id: customer_id,
                            isFulfilled: isFulfilled,
                            isPaid: isPaid,
                            currency: currency
                        })
                        .then(createdOrder => {
                            //delete cart upon successfully creating order
                            if (createdOrder && createdOrder.id > 0)
                                return createdOrder;
                            else {
                                console.log(`Could not create order in shopify.`);
                                reject({error: `Could not create order in shopify.`});
                            }
                        })
                        .then(createdOrder => {
                            //save order_id in database
                            save({
                                user_id: user_id,
                                customer_id: customer_id,
                                order_id: createdOrder.id
                            });
                            return createdOrder;
                        })
                        .then(createdOrder => {
                            //clear shopping cart after placing an order
                             cartItemHandler
                                .emptyShoppingCartForUser({
                                    app_id: app_id,
                                    user_id: user_id
                                });
                            return createdOrder;
                        })
                        .then(createdOrder => {
                            //respond with the placed order details
                            delete createdOrder.customer;
                            delete createdOrder.shipping_lines;
                            delete createdOrder.refunds;
                            delete createdOrder.fulfillments;
                            resolve({status: true, result: createdOrder});
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        });

                }
                else
                    resolve({status: false, result: result});
            })
            .catch(err => {
                console.log(`Error getting cart items for this order. ${err}`);
                reject(`Error getting cart items for this order. ${err}`);
            });

    });

}

function checkIfOrderExistsForUser(user_id, order_id) {

    return new Promise((resolve, reject) => {
        Orders
            .findOne({
                where: {
                    user_id: user_id,
                    order_id: order_id
                }
            })
            .then(userOrder => {
                if (userOrder)
                    resolve(userOrder.toJSON());
                else
                    resolve(null);
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = {
    save,
    deleteOrderForCustomer,
    updateOrderInfo,
    findOrderForUser,
    getOrderIds,
    placePendingOrder,
    checkIfOrderExistsForUser
};
