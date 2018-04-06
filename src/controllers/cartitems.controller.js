/**
 * Created by kaile on 4/18/17.
 */

import _ from 'underscore';
const httpStatus = require('http-status');
const util = require('util');
const Validator = require('../helpers/Validator')();
const cartItemHandler = require('../handlers/cartitem.handler');


module.exports = {

    //Add product item to cart
    addProductItem: (req, res, next) => {
        Validator.validateShoppingCartRequest(req);

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {

                if (req.body.quantity > 0) {
                    cartItemHandler
                        .getVariantsArray(req.body.variant_id)
                        .then(variants => {
                            console.log(variants);
                            if (variants) {
                                let variantIds = variants.variant_id;
                                let variantIndex = _.indexOf(variantIds, req.body.variant_id);
                                let price = variants.price[variantIndex];
                                cartItemHandler
                                    .createOrUpdateCartItem({
                                        app_id: req.app_id,
                                        user_id: req.user_id,
                                        store_id: req.body.store_id,
                                        prod_id: req.body.prod_id,
                                        variant_id: req.body.variant_id,
                                        price: price,
                                        quantity: req.body.quantity
                                    })
                                    .then(cartItem => {
                                        res.status(httpStatus.CREATED).send(cartItem);
                                    })
                                    .catch(err => {
                                        res.status(httpStatus.NOT_FOUND).send(err);
                                    });
                            }
                            else {
                                res.status(httpStatus.NOT_FOUND).send({error: `Could not add item to cart. Product/Variant not found.`});
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(httpStatus.NOT_FOUND).send(err);
                        });


                }
                else {
                    res.status(httpStatus.BAD_REQUEST).send({error: `Cannot add item to cart with 0 quantity`});
                }
            }
        })
    },

    //Change product item quantity
    updateItemQuantity: (req, res, next) => {
        req.checkParams('cartItemId', 'Invalid value of `cartItemId`').notEmpty().isInt();
        req.checkBody('quantity', 'quantity required').notEmpty();

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {
                if (req.body.quantity > 0) {
                    cartItemHandler
                        .updateCartItemQuantity({
                            quantity: req.body.quantity,
                            cartItemId: Number(req.params.cartItemId),
                            app_id: req.app_id,
                            user_id: req.user_id
                        })
                        .then(cartItem => {
                            res.status(httpStatus.CREATED).send(cartItem);
                        })
                        .catch(err => {
                            res.status(httpStatus.NOT_FOUND).send(err);
                        });
                }
                else {
                    cartItemHandler
                        .deleteCartItem({
                            cartItemId: Number(req.params.cartItemId),
                            app_id: req.app_id,
                            user_id: req.user_id
                        })
                        .then(response => {
                            res.status(httpStatus.OK).send(response);
                        })
                        .catch(err => {
                            res.status(httpStatus.NOT_FOUND).send(err);
                        });
                }
            }
        })
    },

    //Delete product item from cart
    deleteProductItem: (req, res, next) => {
        req.checkParams('cartItemId', 'Invalid value of `cartItemId` in the brackets of URL').notEmpty().isInt();

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {

                cartItemHandler
                    .deleteCartItem({
                        cartItemId: Number(req.params.cartItemId),
                        app_id: req.app_id,
                        user_id: req.user_id
                    })
                    .then(response => {
                        res.status(httpStatus.OK).send(response);
                    })
                    .catch(err => {
                        res.status(httpStatus.NOT_FOUND).send(err);
                    });
            }
        })
    },

};


