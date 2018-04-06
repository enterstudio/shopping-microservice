const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Constants = require('../helpers/Const');
const shopifyHandler = require('../handlers/shopify.handler');
const util = require('util');
const Validator = require('../helpers/Validator')();

module.exports = {

    //Create a customer
    createCustomer: function (req, res, next) {
        req.checkBody('email', 'Missing email or not a valid email').notEmpty().isEmail();
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                next(new APIError('There have been validation errors: ' + util.inspect(result.array()), httpStatus.BAD_REQUEST, true));
            } else {
                shopifyHandler.createCustomer({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                })
                    .then(collections => {
                        res.status(201).json(collections);
                    })
                    .catch(err => {
                        next(new APIError(err.message, err.statusCode, true));
                    })
            }
        })
    },

    //Get all collections
    getCollections: function (req, res, next) {
        shopifyHandler.getCollections({limit: req.query.limit})
            .then(collections => {
                res.json(collections);
            })
            .catch(err => {
                next(new APIError(err.message, err.statusCode, true));
            })
    },

    //Get specific collection
    getCollection: function (req, res, next) {
        shopifyHandler.getCollection(req.params.collectionId)
            .then(collection => {
                res.json(collection);
            })
            .catch(err => {
                next(new APIError(err.message, err.statusCode, true));
            })
    },

    //Get all products of a collection
    getProducts: function (req, res, next) {
        shopifyHandler.getProducts(req.params.collectionId)
            .then(products => {
                res.json(products);
            })
            .catch(err => {
                next(new APIError(err.message, err.statusCode, true));
            })
    },

    //Get speficic product
    getProduct: function (req, res, next) {
        shopifyHandler.getProduct(req.params.productId)
            .then(product => {
                res.json(product);
            })
            .catch(err => {
                next(new APIError(err.message, err.statusCode, true));
            })
    },

    //create cart for a customer
    createCart: function (req, res, next) {
        if (req.body.lineItems) {
            Validator.validateCartRequest(req);
        }
        shopifyHandler.createCart({
            customerId: req.params.customerId,
            lineItems: req.body.lineItems
        })
            .then(cart => {
                res.status(201).json(cart);
            })
            .catch(err => {
                next(new APIError(err.message, err.statusCode, true));
            })
    },

    //Get cart for a customer
    getCart: function (req, res, next) {
        shopifyHandler.getCart(req.params.customerId)
            .then(cart => {
                res.status(200).json(cart);
            })
            .catch(err => {
                next(new APIError(err.message, err.statusCode, true));
            })
    },

    //updates product items to the cart
    updateCartItems: function (req, res, next) {
        Validator.validateCartRequest(req);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                next(new APIError('There have been validation errors: ' + util.inspect(result.array()), httpStatus.BAD_REQUEST, true));
            } else {
                shopifyHandler.updateCart(req.params.customerId, req.body.lineItems, false)
                    .then(cart => {
                        res.status(200).json(cart);
                    })
                    .catch(err => {
                        next(new APIError(err.message, err.statusCode, true));
                    })
            }
        })
    },

    //delete product items from the cart
    deleteCartItems: function (req, res, next) {
        Validator.validateCartRequest(req);
        shopifyHandler.updateCart(req.params.customerId, req.body.lineItems, true)
            .then(cart => {
                res.status(200).json(cart);
            })
            .catch(err => {
                next(new APIError(err.message, err.statusCode, true));
            })
    },

    //Create an order with lineItems
    createOrder: function (req, res, next) {
        Validator.validateOrderRequest(req);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                next(new APIError('There have been validation errors: ' + util.inspect(result.array()), httpStatus.BAD_REQUEST, true));
            } else {
                shopifyHandler.createOrder(req.body)
                    .then(order => {
                        res.status(201).json(order);
                    })
                    .catch(err => {
                        next(new APIError(err.message, err.statusCode, true));
                    })
            }
        })
    },

    //update order status - only making order as paid allowed for now
    updateOrder: function (req, res, next) {
        req.checkBody('isPaid', 'Missing isPaid').notEmpty().isBoolean();
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                next(new APIError('There have been validation errors: ' + util.inspect(result.array()), httpStatus.BAD_REQUEST, true));
            } else {
                if (req.body.isPaid) { //only if isPaid is true
                    shopifyHandler.updateOrderAsPaid(req.params.orderId)
                        .then(orderPayment => {
                            res.status(200).json(orderPayment);
                        })
                        .catch(err => {
                            next(new APIError(err.message, err.statusCode, true));
                        })
                } else {
                    var response = {
                        message: Constants.ErrorMessages.ORDER_ISPAID_FAILED_MESSAGE
                    }
                    res.status(httpStatus.BAD_REQUEST).json(response)
                }
            }
        })
    },

    //Create order using cart
    createOrderFromCart: function (req, res, next) {
        req.checkBody('isPaid', 'Missing isPaid').notEmpty().isBoolean();
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                next(new APIError('There have been validation errors: ' + util.inspect(result.array()), httpStatus.BAD_REQUEST, true));
            } else {
                shopifyHandler.createOrderFromCart(req.params.customerId, req.body.isPaid)
                    .then(order => {
                        res.status(201).json(order);
                    })
                    .catch(err => {
                        next(new APIError(err.message, err.statusCode, true));
                    })
            }
        })
    }

}
