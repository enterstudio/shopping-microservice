/**
 * Created by mayujain on 4/9/17.
 */

import {sequelize} from '../db/connection';
let initializeData = require('../db/initdata');
const httpStatus = require('http-status');


function initializeDataBaseForceFully(req, res, next) {

    console.log("Initializing Database");
    sequelize
        .sync({force: true})
        .then(function (r) {
            var initData = req.query.initdata || false;
            if (initData && (initData.toUpperCase() === 'TRUE' || initData.toUpperCase() === '1')) {
                initializeData(function() {
                    res.status(httpStatus.OK).send({
                        status: "success",
                        message: "Database seeded successfully with initialization data."
                    });
                }); // Insert test data.
            } else {
                res.status(httpStatus.OK).send({
                    status: "success",
                    message: "Database seeded successfully"
                });
            }
        }, function (err) {
            console.log('Recreating tables to database failed:', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                status: "failure",
                message: "Database failed to be seeded"
            });
        });
}

module.exports = {
    initializeDataBaseForceFully
};


