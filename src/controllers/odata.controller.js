/**
 * Created by kaile on 4/07/17.
 */

const httpStatus = require('http-status');
const Validator = require('../helpers/Validator')();
import models from '../models/models.index';
import { createQuery } from 'odata-v4-mysql';
import OdataHandler from '../handlers/odata.handler';

var takeNonOdataQuery = function(appUserComb, filterObj, model, res) {
    if (model.name === models.Cartitems.name) { // cartitems has to be filtered by app_id and user_id
        filterObj.app_id = appUserComb.app_id;
        filterObj.user_id = appUserComb.user_id;
    }
    model.findAndCountAll({
        where: filterObj
    }).then(function(result) {
        res.send(result);
    }).catch(function(error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            message: error.message,
            error: error
        });
    });
};


var takeOdataQuery = function(appUserComb, odataStr, model, res, extraFilter = null) {
    try {
        var odataQueryObj = createOdataQueryObj(odataStr);
        OdataHandler.executeOdataQuery(appUserComb, odataQueryObj, model, extraFilter).then(function(result) {
            res.send(result);
        }).catch(function(error) {
            res.status(error._statusCode).send({
                message: error.message,
                error: error
            });
        });
    } catch (error) {
        if (error._statusCode) {
            res.status(error._statusCode).send({
                message: error.message
            });
        } else {
            throw error;
        }
    }
};

var createOdataQueryObj = function(odataStr) {
    // console.log('\nthe odataStr is: ', odataStr);
    try {
        var odataQueryObj = createQuery(odataStr);
        // console.log('--- odataQueryObj is', odataQueryObj, '\n');
        return odataQueryObj;
    } catch (error) {
        throw {
            _statusCode: httpStatus.BAD_REQUEST,
            message: 'Odata syntax error.'
        };
    }
}

var getEntitySet = function(req, res, model) {
    const odataQueryIndex = req.url.indexOf('?');
    const appUserComb = {
            app_id: req.app_id,
            user_id: req.user_id
        };

    if (odataQueryIndex === -1) {
        takeNonOdataQuery(appUserComb, {}, model, res);
    } else {
        var odataStr = decodeURIComponent(req.url.substring(odataQueryIndex+1));
        takeOdataQuery(appUserComb, odataStr, model, res);
    }
};

var getEntityById = function(req, res, model) {
    const idVal = Number(req.params.id.substring(1,req.params.id.length-1));
    const odataQueryIndex = req.url.indexOf('?');
    const appUserComb = {
            app_id: req.app_id,
            user_id: req.user_id
        };
    if (odataQueryIndex === -1) {
        takeNonOdataQuery(appUserComb, {
                id: idVal
            }, model, res);
    } else {
        var odataStr = decodeURIComponent(req.url.substring(odataQueryIndex+1));
        takeOdataQuery(appUserComb, odataStr, model, res, '`id` = '+idVal);
    }
};


module.exports = {

    getProductEntitySet: function getProductEntitySet(req, res, next) {
        getEntitySet(req, res, models.Products);
    },

    getProductEntity: function getProductEntity(req, res, next) {
        Validator.validateOdataGetByIdRequest(req);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    message: 'There have been validation errors',
                    details: result.array()
                });
            } else {
                getEntityById(req, res, models.Products);
            }
        });
    },

    getCategoryEntitySet: function getCategoryEntitySet(req, res, next) {
        getEntitySet(req, res, models.Categories);
    },

    getCategoryEntity: function getCategoryEntity(req, res, next) {
        Validator.validateOdataGetByIdRequest(req);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    message: 'There have been validation errors',
                    details: result.array()
                });
            } else {
                getEntityById(req, res, models.Categories);
            }
        });
    },

    getStoreEntitySet: function getStoreEntitySet(req, res, next) {
        getEntitySet(req, res, models.Stores);
    },

    getStoreEntity: function getStoreEntity(req, res, next) {
        Validator.validateOdataGetByIdRequest(req);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    message: 'There have been validation errors',
                    details: result.array()
                });
            } else {
                getEntityById(req, res, models.Stores);
            }
        });
    },

    getCustomerEntitySet: function getCustomerEntitySet(req, res, next) {
        getEntitySet(req, res, models.Customers);
    },

    getCustomerEntity: function getCustomerEntity(req, res, next) {
        Validator.validateOdataGetByIdRequest(req);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    message: 'There have been validation errors',
                    details: result.array()
                });
            } else {
                getEntityById(req, res, models.Customers);
            }
        });
    },

    getCartItemEntitySet: function getCartItemEntitySet(req, res, next) {
        getEntitySet(req, res, models.Cartitems);
    },

    getCartItemEntity: function getCartItemEntity(req, res, next) {
        Validator.validateOdataGetByIdRequest(req);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    message: 'There have been validation errors',
                    details: result.array()
                });
            } else {
                getEntityById(req, res, models.Cartitems);
            }
        });
    }

};
