/**
 * Created by mayujain on 4/4/17.
 */

const httpStatus = require('http-status');
const shopifyHandler = require('../handlers/shopify.handler');
const util = require('util');
import StoreHandler from '../handlers/store.handler'

module.exports = {

    //Create a store
    createStore: function createStore(req, res, next) {
        req.checkBody('title', 'store name required').notEmpty();
        req.checkBody('alias', 'store alias required').notEmpty();
        req.checkBody('description', 'store description required').notEmpty();

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {

                let newStore = {
                    title: req.body.title,
                    description: req.body.description,
                    image_url: req.body.image_url
                };

                shopifyHandler.createCollection(newStore)
                    .then(store => {
                        store.alias = req.body.alias;
                        return StoreHandler.createNewStore(store)
                            .then((store) => {
                                res.status(httpStatus.CREATED).send(store);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(httpStatus.BAD_REQUEST).send(err);
                    })
            }
        })
    },

    //Update an existing store
    updateStore: function updateStore(req, res, next) {
        req.checkParams('id', 'store id is requred in parameter').notEmpty().isInt();
        req.checkBody('title', 'store name required').notEmpty();
        req.checkBody('alias', 'store alias required').notEmpty();
        req.checkBody('description', 'store description required').notEmpty();

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {

                let modifiedStore = {
                    id: Number(req.params.id),
                    title: req.body.title,
                    description: req.body.description,
                    image_url: req.body.image_url
                };

                shopifyHandler.updateCollection(modifiedStore)
                    .then(store => {
                        store.alias = req.body.alias;
                        return StoreHandler.updateExistingStore(store)
                            .then((store) => {
                                res.status(httpStatus.OK).send(store);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(httpStatus.BAD_REQUEST).send(err);
                    })
            }
        })
    }

};