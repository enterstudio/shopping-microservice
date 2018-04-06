const Promise = require('bluebird');
const shortid = require('shortid');
// const Cart = require('../models/Cart');
const Constants = require('../helpers/Const');
const constants = require('../helpers/Constants');
const ConfigUtils = require('../helpers/ConfigUtils');
let configUtils = new ConfigUtils(constants.CONFIG);

async function init() {
    await configUtils.loadContent();
}

init();

const ShopifySDK = require('../sg-shopify-sdk/lib/shopify')({
    myShopifyDomain: configUtils.getParameter(constants.KEY_NAMES.shopify_url),
    apiKey: configUtils.getParameter(constants.KEY_NAMES.shopify_api_key),
    password: configUtils.getParameter(constants.KEY_NAMES.shopify_password)
});

function createCustomer(customer) {

    return new Promise((resolve, reject) => {
        ShopifySDK.customers.createCustomer(customer)
            .then(customer => {
                resolve({
                    id: customer.id,
                    email: customer.email,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone: customer.phone,
                    default_address: customer.default_address,
                    addresses: customer.addresses
                });
            })
            .catch(err => reject(err));
    });
}

function updateCustomer(customer) {

    return new Promise((resolve, reject) => {
        ShopifySDK.customers.updateCustomer(customer)
            .then(customer => {
                resolve({
                    id: customer.id,
                    email: customer.email,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone: customer.phone,
                    default_address: customer.default_address,
                    addresses: customer.addresses
                });
            })
            .catch(err => reject(err));
    });
}

function deleteCustomer(customerId) {

    return new Promise((resolve, reject) => {
        ShopifySDK.customers.deleteCustomer(customerId)
            .then((response) => {
                resolve(response);
            })
            .catch(err => reject(err));
    });
}

function createCollection(collection) {

    return new Promise((resolve, reject) => {
        ShopifySDK.collections.createCollection(collection)
            .then(store => {
                resolve(store);
            })
            .catch(err => reject(err));
    });
}

function updateCollection(collection) {

    return new Promise((resolve, reject) => {
        ShopifySDK.collections.updateCollection(collection)
            .then(store => {
                resolve(store);
            })
            .catch(err => reject(err));
    });
}

function getCollections(filter) {

    return new Promise((resolve, reject) => {
        ShopifySDK.collections.fetchQueryCollections({limit: filter.limit})
            .then(collections => {
                let collectionsList = [];
                collections.forEach(collection => {
                    collectionsList.push({
                        id: collection.id,
                        title: collection.title ? collection.title : '',
                        description: collection.body_html ? collection.body_html : ''
                    })
                });
                resolve(collectionsList);
            })
            .catch(err => reject(err));
    });
}

function getCollection(collectionId) {

    return new Promise((resolve, reject) => {
        ShopifySDK.collections.fetchCollection(collectionId)
            .then(collection => {
                resolve({
                    title: collection.title ? collection.title : '',
                    description: collection.body_html ? collection.body_html : ''
                });
            })
            .catch(err => reject(err));
    });
}

function getProducts(collectionId) {

    return new Promise((resolve, reject) => {
        ShopifySDK.products.fetchProducts({collectionId: collectionId})
            .then(products => {
                let productsList = [];
                products.forEach(product => {
                    productsList.push({
                        id: product.id,
                        title: product.title ? product.title : '',
                        description: product.body_html ? product.body_html : ''
                    })
                });
                resolve(productsList);
            })
            .catch(err => reject(err));
    });
}

function getProduct(productId) {

    return new Promise((resolve, reject) => {
        ShopifySDK.products.fetchProduct(productId)
            .then(product => {
                let productDetail = {
                    title: product.title,
                    description: product.body_html,
                    variants: []
                };
                if (product.variants) {
                    product.variants.forEach(variant => {
                        productDetail.variants.push({
                            variantId: variant.id,
                            title: variant.title,
                            price: variant.price,
                        })
                    })
                }
                resolve(productDetail);
            })
            .catch(err => reject(err));
    });
}

function createOrder(orderRequest) {

    return new Promise((resolve, reject) => {
        ShopifySDK.orders.createOrder(orderRequest)
            .then(order => resolve(order))
            .catch(err => reject(err));
    });
}

function markOrderAsFulfilled(orderId, tracking_number) {

    return new Promise((resolve, reject) => {
        ShopifySDK.orders.createFulfillment(orderId, tracking_number)
            .then(fulfillment => resolve(fulfillment))
            .catch(err => reject(err));
    });
}


function updateOrderAsPaid(orderId) {

    return new Promise((resolve, reject) => {
        ShopifySDK.orders.markOrderAsPaid(orderId)
            .then(orderPayment => resolve(orderPayment))
            .catch(err => reject(err));
    });
}

/**
 * Returns details about the specified order_id
 * */
function getOrderDetails(orderId) {

    return new Promise((resolve, reject) => {
        ShopifySDK.orders.fetchOrder(orderId)
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * Returns details of all orders that belong to this customer
 * */
function getOrdersForCustomer(customer_id, order_status) {

    return new Promise((resolve, reject) => {
        ShopifySDK.orders.getAllOrdersForCustomer(customer_id, order_status)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
}

function createWebhook(webhookObj) {

    return new Promise((resolve, reject) => {
        ShopifySDK.webhooks.createWebhook(webhookObj)
            .then(response => resolve(response))
            .catch(err => reject(err))
    });
}

function getWebhooks(webhookObj) {

    return new Promise((resolve, reject) => {
        ShopifySDK.webhooks.getWebhooks(webhookObj)
            .then(response => resolve(response))
            .catch(err => reject(err))
    });
}

function deleteWebhook(webhookID) {

    return new Promise((resolve, reject) => {
        ShopifySDK.webhooks.deleteWebhook(webhookID)
            .then(response => resolve(response))
            .catch(err => reject(err))
    });
}

function getCollectsFromShopify(Obj) {

    return new Promise((resolve, reject) => {
        ShopifySDK.collects.getCollects(Obj)
            .then(response => resolve(response))
            .catch(err => reject(err))
    });
}


module.exports = {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCollections,
    getCollection,
    getProducts,
    getProduct,
    createOrder,
    markOrderAsFulfilled,
    updateOrderAsPaid,
    getOrderDetails,
    getOrdersForCustomer,
    createCollection,
    updateCollection,
    createWebhook,
    getWebhooks,
    deleteWebhook,
    getCollectsFromShopify
};