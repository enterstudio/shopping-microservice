/**
 * Created by mayujain on 5/17/17.
 */

import _ from 'underscore';
const httpStatus = require('http-status');
const Validator = require('../helpers/Validator')();
const shopifyHandler = require('../handlers/shopify.handler');
const customerController = require('./customers.controller');
const orderHandler = require('../handlers/order.handler');

module.exports = {

    //Create order for an existing cart, and clear the cart on success
    checkoutAndClearCart: (req, res) => {
        if (req.user_id !== null || req.user_id !== undefined || req.user_id !== '')
            getShopifyCustomerAndPlaceOrder(req, res);
        else
            res.status(httpStatus.BAD_REQUEST).send({success: false, error: `Please make sure your request headers are valid. User Not Found.`})
    },

    /**
     * Fulfills the order.
     * Marks order as paid. (Transaction kind : Capture)
     * Marks fulfillment_status (shipment) of the order as fulfilled.
     *
     * Optional request body parameter:
     {
       "tracking_number": "SHIPMENT_TRACKING_ID"
     }
     * */
    fulfillOrder: (req, res) => {
        req.checkParams('orderId', 'Invalid value of `orderId`').notEmpty().isInt();
        req.getValidationResult()
            .then(async result => {
                if (!result.isEmpty()) {
                    res.status(httpStatus.BAD_REQUEST).send({
                        "message": 'There have been validation errors',
                        "details": result.array()
                    });
                } else {
                    try {
                        const orderId = req.params.orderId;
                        let tracking_number = (req.body.tracking_number ? req.body.tracking_number : null);
                        const response = await shopifyHandler.updateOrderAsPaid(orderId);

                        if (response && response.status == 'success') {
                            const fulfillmentResponse = await shopifyHandler.markOrderAsFulfilled(orderId, tracking_number);
                            response.fulfillment = fulfillmentResponse.fulfillment;
                            res.status(httpStatus.OK).send(response);
                        }
                    }
                    catch (error) {
                        console.error(`\nError updating status for order (order_id: ${req.params.orderId})`);
                        if (error.error)
                            res.status(httpStatus.BAD_REQUEST).send(error.error);
                        else if (error.message)
                            res.status(httpStatus.BAD_REQUEST).send(error.message);
                        else
                            res.status(httpStatus.BAD_REQUEST).send(error);
                    }
                }
            })
    },

    getOrderById: (req, res) => {
        req.checkParams('orderId', 'Invalid value of `orderId`').notEmpty().isInt();
        req.getValidationResult().then(async result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {

                try {
                    const orderId = req.params.orderId;
                    const order = await orderHandler.checkIfOrderExistsForUser(req.user_id, orderId);

                    if (order !== null) {
                        const orderDetails = await shopifyHandler.getOrderDetails(orderId);

                        delete orderDetails["customer"]; //remove customer information from response

                        res.status(httpStatus.OK).send(orderDetails);
                    }
                    else
                        res.status(httpStatus.NOT_FOUND).send({success: false, error: `Order does not exist for user (user_id: ${req.user_id})`});
                }
                catch (error) {
                    console.error(`\nError fetching order (order_id: ${req.params.orderId})`);
                    if (error.error)
                        res.status(httpStatus.BAD_REQUEST).send(error.error);
                    else if (error.message)
                        res.status(httpStatus.BAD_REQUEST).send(error.message);
                    else
                        res.status(httpStatus.BAD_REQUEST).send(error);
                }
            }
        })
    },

    getAllOrdersForUser: async(req, res) => {
        try {
            const order_status = (req.query.status ? req.query.status : 'any');

            const orders = await orderHandler.findOrderForUser(req.user_id);

            if (orders !== null && orders.customer_id !== undefined) {

                console.log("\nFetching order details for user: " + req.user_id);

                let orderDetails = await shopifyHandler.getOrdersForCustomer(orders.customer_id, order_status);

                //remove customer information from response
                orderDetails = _.each(orderDetails.orders, order => {
                    delete order["customer"];
                });

                res.status(httpStatus.OK).send(orderDetails);
            }
            else
                res.status(httpStatus.NOT_FOUND).send({
                    success: false,
                    message: `No orders found for user (user_id: ${req.user_id})`
                });
        }
        catch (error) {
            console.error(`\nError fetching orders for user (user_id: ${req.user_id})`);
            if (error.error)
                res.status(httpStatus.BAD_REQUEST).send(error.error);
            else if (error.message)
                res.status(httpStatus.BAD_REQUEST).send(error.message);
            else
                res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }
};

const checkoutCart = async(customer, request, response) => {
    try {
        let customerId;
        if (customer && (!!customer) && (customer.constructor === Object))
            customerId = await customerController.createNewCustomer(customer, request.user_id);
        else
            customerId = customer;

        if (customerId !== undefined || customerId !== null) {
            const order = await orderHandler.placePendingOrder(request.app_id, request.user_id, customerId, request.body.currency, request.body.fulfillment, request.body.isPaid);
            if (!order.status)
                response.status(httpStatus.BAD_REQUEST).send({success: false, error: "Cannot create order with empty cart. Please add items to cart."});
            else
                response.status(httpStatus.CREATED).send(order.result);
        }
    }
    catch (err) {
        response.status(httpStatus.BAD_REQUEST).send({
            success: false,
            error: `Error Placing Order for user (user_id: ${request.user_id}). ${err}`
        })
    }
};

const getShopifyCustomerAndPlaceOrder = async(request, response) => {
    try {
        let customer_id = await customerController.getCustomerId(request.user_id);
        if (customer_id == null) {
            Validator.validateCustomerRequest(request);
            request.getValidationResult().then(result => {
                if (!result.isEmpty()) {
                    response.status(httpStatus.BAD_REQUEST).send({
                        "message": 'Please provide customer details to place an order.',
                        "details": result.array()
                    });
                } else {
                    let customer = {
                        email: request.body.email,
                        first_name: request.body.first_name,
                        last_name: request.body.last_name,
                        phone: request.body.phone,
                        addresses: request.body.addresses,
                        verified_email: true
                    };
                    checkoutCart(customer, request, response);
                }
            });
        }
        else
            checkoutCart(customer_id, request, response);
    } catch (err) {
        response.status(httpStatus.BAD_REQUEST).send({success: false, error: `Error creating/getting shopify customer. ${err} `})
    }
};