const rp = require('request-promise');
// require('request-debug')(rp);
let constants = require('../config/constants');

module.exports = function (Shopify) {
    return {

        createOrder: (orderObject) => {

            let totalAmount = 0;
            orderObject.lineItems.forEach(lineItem => {
                totalAmount += parseFloat(lineItem.price * lineItem.quantity);
            });

            let order = {
                "order": {
                    "line_items": orderObject.lineItems,
                    "customer": {
                        "id": orderObject.customer_id
                    },
                    "fulfillment_status": (orderObject.isFulfilled ? orderObject.isFulfilled : null),
                    "financial_status": (orderObject.isPaid ? "paid" : "authorized"),
                    "currency": orderObject.currency ? orderObject.currency : "USD",
                    "transactions": [
                        {
                            "kind": "authorization",
                            "status": "success",
                            "amount": totalAmount
                        }
                    ]
                }
            };

            let options = {
                method: 'POST',
                uri: Shopify.getApiField('domain') + constants.ordersUrl + ".json",
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: order,
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => resolve(data.order))
                    .catch(err => reject(err));
            });
        },

        markOrderAsPaid: (orderId) => {

            let transaction = {
                "transaction": {
                    "kind": "capture"
                },
            };

            let options = {
                method: 'POST',
                uri: Shopify.getApiField('domain') + constants.ordersUrl + "/" + orderId + "/transactions.json",
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: transaction,
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        let response = {};
                        if (data.transaction && data.transaction.status) {
                            response.status = data.transaction.status;
                            response.message = data.transaction.message;
                        } else
                            response.message = constants.ErrorMessages.ORDER_UPDATE_FAILED;

                        resolve(response);
                    }).catch(err => reject(err));
            });
        },

        createFulfillment: (orderId, tracking_number) => {

            let fulfillment = {
                "fulfillment": {
                    "tracking_number":tracking_number
                }
            };

            let options = {
                method: 'POST',
                uri: Shopify.getApiField('domain') + constants.ordersUrl + "/" + orderId + "/fulfillments.json",
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: fulfillment,
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(response => resolve(response))
                    .catch(err => reject(err));
            });

        },


        fetchOrder: (orderId) => {
            let options = {
                uri: Shopify.getApiField('domain') + constants.ordersUrl + "/" + orderId + ".json",
                headers: {
                    'Authorization': Shopify.getApiField('auth')
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => resolve(data.order))
                    .catch(err => reject(err));
            });
        },

        getAllOrdersDetails: (idsArray) => {
            let ids = idsArray.toString();
            let options = {
                method: 'GET',
                uri: Shopify.getApiField('domain') + constants.ordersUrl + ".json?ids=" + ids,
                headers: {
                    'Authorization': Shopify.getApiField('auth')
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        console.log({orders: data.orders});
                        resolve(data)})
                    .catch(err => reject(err)
                );
            });
        },

        getAllOrdersForCustomer: (customer_id, order_status) => {
            let options = {
                method: 'GET',
                uri: Shopify.getApiField('domain') + constants.customersUrl + "/"+ customer_id + "/orders.json?status=" + order_status,
                headers: {
                    'Authorization': Shopify.getApiField('auth')
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        }
    }
};