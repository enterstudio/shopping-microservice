/**
 * Created by kaile on 4/24/17.
 */

const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
import {Categories} from '../models/models.index'

module.exports = {

    //Change image url of existing category
    updateCategoryImage: function updateCategoryImage(req, res, next) {
        req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty().isInt();
        req.checkBody('image_url', 'image_url required');

        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                res.status(httpStatus.BAD_REQUEST).send({
                    "message": 'There have been validation errors',
                    "details": result.array()
                });
            } else {
                Categories.update({
                    image_url: req.body.image_url
                }, {
                    where: {
                        id: Number(req.params.id)
                    },
                    fields: ['image_url'],
                    validate: true,
                    limit: 1
                }).then(results => {
                    if (results[0] === 1) {
                        return Categories.findById(Number(req.params.id)).then(category => {
                                if (category) {
                                    category = category.toJSON();
                                    res.status(httpStatus.OK).send(category);
                                } else {
                                    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                        "message": 'Error retrieving category entity'
                                    });
                                }
                            }).catch(err => {
                                console.log(`ERROR updating category : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                            });
                    } else {
                        res.status(httpStatus.NOT_FOUND).send({
                            "message": 'Category not exist'
                        });
                    }
                }).catch(err => {
                    console.log(`ERROR updating category : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                });
            }
        })
    }

};