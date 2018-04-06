const rp = require('request-promise');
let constants = require('../config/constants');

module.exports = function (Shopify) {
    return {

        createCustomer: function createCustomer(customerObject) {

            let options = {
                method: 'POST',
                uri: Shopify.getApiField('domain') + constants.customersUrl + '.json',
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: {
                    customer: customerObject
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.customer);
                    }).catch(err => {
                    reject(err);
                });
            });
        },

        updateCustomer: function updateCustomer(customerObject) {

            let customer = {
                customer: customerObject
            };

            let updateCustomerUrl = constants.customersUrl + '/' + customerObject.id + '.json';
            let options = {
                method: 'PUT',
                uri: Shopify.getApiField('domain') + updateCustomerUrl,
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                body: customer,
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then(data => {
                        resolve(data.customer);
                    }).catch(err => {
                    reject(err);
                });
            });
        },

        deleteCustomer: function deleteCustomer(customerId) {

            let deleteCustomerUrl = constants.customersUrl + '/' + customerId + '.json';
            let options = {
                method: 'DELETE',
                uri: Shopify.getApiField('domain') + deleteCustomerUrl,
                headers: {
                    'Authorization': Shopify.getApiField('auth'),
                    'Content-type': 'application/json'
                },
                json: true
            };

            return new Promise((resolve, reject) => {
                rp(options)
                    .then((response) => {
                        resolve(response);
                    }).catch(err => {
                    reject(err);
                });
            });
        }

    }
}