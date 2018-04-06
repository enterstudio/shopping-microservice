/**
 * Created by mayujain on 4/6/17.
 */

const httpStatus = require('http-status');
const shopifyHandler = require('../handlers/shopify.handler');
const util = require('util');
import url from 'url';

module.exports = {

    //Create a webhook for products
    createWebhook: (req, res, next) => {
        req.checkBody('entity', 'webhook entity required').notEmpty();
        req.checkBody('event', 'webhook event required').notEmpty();

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {
                let webhook_url = process.env.WEBHOOK_SERVER_URL + "/api/v1/shopping/" + req.body.entity + "/" + req.body.event + "/webhook";
                let webhookRequestObj = {
                    "topic": req.body.entity + "\/" + req.body.event,
                    "address": webhook_url
                };

                shopifyHandler.createWebhook(webhookRequestObj)
                    .then(response => {
                        res.status(httpStatus.CREATED).send(response);
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
                            status: "Failed to create webhook",
                            message: err.message,
                            statusCode: err.statusCode
                        })
                    })
            }
        })


    },

    //Get Webhooks
    getWebhooks: async(req, res, next) => {
        let queryObject = url.parse(req.url, true).query;
        let webhookRequestObj;

        if (!queryObject.entity || !queryObject.event) {
            webhookRequestObj = {};
        }
        else {
            webhookRequestObj = {
                topic: queryObject.entity + "\/" + queryObject.event
            };
        }
        shopifyHandler.getWebhooks(webhookRequestObj)
            .then(response => {
                res.status(httpStatus.OK).send(response);
            })
            .catch(err => {
                console.log(err.message);
                res.status(httpStatus.NOT_FOUND).send({
                    status: "Failed to Get Webhooks",
                    message: err.message,
                    statusCode: err.statusCode
                })
            })
    },

    //Get Webhooks
    deleteWebhook: (req, res, next) => {
        req.checkParams('webhookID', 'Invalid urlparam. Must be integer only.').notEmpty().isInt();
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {
                shopifyHandler.deleteWebhook(req.params.webhookID)
                    .then(response => {
                        res.status(httpStatus.OK).send(response);
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.status(httpStatus.NOT_FOUND).send({
                            status: "Failed",
                            message: err.message,
                            statusCode: err.statusCode
                        })
                    })
            }
        })
    }
};