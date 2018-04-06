/**
 * Created by kaile on 4/17/17.
 */

const httpStatus = require('http-status');
const Validator = require('../helpers/Validator')();
const shopifyHandler = require('../handlers/shopify.handler');
const OrderHandler = require('../handlers/order.handler');
const util = require('util');

module.exports = {

    //Create a customer
    createCustomer: (req, res) => {
        Validator.validateCustomerRequest(req);

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'Please provide customer details.',
                    "details": result.array()
                });
            } else {

                let customer = {
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone: req.body.phone,
                    addresses: req.body.addresses,
                    verified_email: true
                };

                return shopifyHandler
                    .createCustomer(customer)
                    .then(returnedCustomer => {
                        console.log(returnedCustomer);
                        return returnedCustomer;
                    })
                    .then(returnedCustomer => {
                        OrderHandler.save({
                            user_id: req.user_id,
                            customer_id: returnedCustomer.id,
                            order_id: null
                        });
                        return returnedCustomer;
                    })
                    .then(returnedCustomer => {
                        res.status(httpStatus.CREATED).send(returnedCustomer);
                    })
                    .catch(err => {
                        res.status(httpStatus.BAD_REQUEST).send(err.error);
                    })
            }
        })
    },

    //Update an existing customer
    updateCustomer: (req, res) => {
        Validator.validateCustomerRequest(req);
        req.checkParams('id', 'Invalid value of customer ID in the params of URL').notEmpty().isInt();

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {

                let customer = {
                    id: Number(req.params.id),
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone: req.body.phone,
                    addresses: req.body.addresses,
                    verified_email: true
                };

                return shopifyHandler.updateCustomer(customer)
                    .then(returnedCustomer => {
                        returnedCustomer.user_id = req.body.user_id;
                        res.status(httpStatus.OK).send(returnedCustomer);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(httpStatus.BAD_REQUEST).send(err);
                    })
            }
        })
    },

    //Delete a customer
    deleteCustomer: (req, res) => {
        req.checkParams('id', 'Invalid value of customer ID in the params of URL').notEmpty().isInt();

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {

                return shopifyHandler.deleteCustomer(Number(req.params.id))
                    .then(response => {
                        // console.log(response);
                        return;
                    })
                    .then(() => {
                        return OrderHandler.deleteOrderForCustomer({id: Number(req.params.id)});
                    })
                    .then(response => {
                        res.sendStatus(httpStatus.OK);
                    })
                    .catch(err => {
                        if (err.error) {
                            res.status(httpStatus.UNPROCESSABLE_ENTITY).send({statusCode: err.statusCode, error: err.error, source: "Shopify"});
                        } else {
                            console.log(err);
                            res.status(httpStatus.FORBIDDEN).send(err);
                        }
                    })
            }
        })
    },

    getCustomerId: (user_id) => {
        //check if user mapping already exists for that user_id otherwise return null
        return OrderHandler
            .findOrderForUser(user_id)
            .then(mapping => {
                if (mapping !== null)
                    return mapping.customer_id;
                else
                    return null;
            })
            .catch(err => {
                return null;
            });
    },

    createNewCustomer: function (customerObj, user_id) {

        return new Promise((resolve, reject) => {

            shopifyHandler.createCustomer(customerObj)
                .then(returnedCustomer => {
                    return returnedCustomer;
                })
                .then(customer => {
                    return OrderHandler.save({
                        user_id: user_id,
                        customer_id: customer.id,
                        order_id: null
                    })
                })
                .then(customer => {
                    console.log(`created new customer : ${customer.customer_id}`);
                    resolve(customer.customer_id);
                })
                .catch(err => {
                    console.log(`Error creating customer. ${err}`);
                    reject(err);

                })
        });
    }
};