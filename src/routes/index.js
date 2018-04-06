import express from 'express';
const router = express.Router();
const httpStatus = require('http-status');
import RequestIntercepter from '../helpers/RequestIntercepter'
import ODataRoutes from './routes.odata'
import CartitemsRoutes from './routes.cartitem'
import CategoryController from '../controllers/category.controller'
import CollectionsController from '../controllers/collections.controller'
import CustomersController from '../controllers/customers.controller'
import ProductsController from '../controllers/products.controller'
import WebhooksController from '../controllers/webhooks.controller'
import initController from './routes.initDB'
import OrdersController from '../controllers/orders.controller'
import StoresController from '../controllers/stores.webhook.controller'
const Validator = require('../helpers/Validator')();


/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {title: 'Shopping MicroService'});
});

router.get('/ping', (req, res) => {
    res.status(httpStatus.OK).send({success: true})
});

// add request intercepter here
router.use('/', RequestIntercepter);

// Create new store
router.post('/stores', CollectionsController.createStore);
// Update existing store
router.put('/stores/:id', CollectionsController.updateStore);

// Update existing category image
router.patch('/categories/:id', CategoryController.updateCategoryImage);

// Create new customer
router.post('/customers', CustomersController.createCustomer);

// Update existing customer
router.put('/customers/:id', CustomersController.updateCustomer);

// Delete existing customer
router.delete('/customers/:id', CustomersController.deleteCustomer);

// Create a new Webhook
router.post('/webhooks', WebhooksController.createWebhook);

// Get Webhooks
/**
 * USAGE:
 * {{host}}/api/v1/shopping/webhooks?entity=products&event=create  //GET webhooks for a specific topic
 * OR
 * {{host}}/api/v1/shopping/webhooks                               //GET All Webhooks
 * */
router.get('/webhooks', WebhooksController.getWebhooks);

// Delete a Webhook
router.delete('/webhooks/:webhookID', WebhooksController.deleteWebhook);

// Cart operations
router.use('/cartitems', CartitemsRoutes);

//Place an Order
router.post('/orders', OrdersController.checkoutAndClearCart);

//Get all orders placed by user
router.get('/orders', OrdersController.getAllOrdersForUser);

//Get specific order only details
router.get('/orders/:orderId', OrdersController.getOrderById);

/**
 * Fulfills the order.
 * Marks order as paid. (Transaction kind : Capture)
 * Marks fulfillment_status (shipment) of the order as fulfilled.
 *
 * Optional request body parameter:
 {
   "tracking_number": "SHIPMENT_TRACKING_ID"
 }
 * */
router.put('/orders/:orderId/fulfillments', OrdersController.fulfillOrder);

// oData GET routes
router.use('/', ODataRoutes);

router.post('/init', initController.initializeDataBaseForceFully);

// Get newly created product from Webhook
router.post('/products/create/webhook', ProductsController.getProductFromWebhook);

// Get updated product from Webhook
router.post('/products/update/webhook', ProductsController.getProductUpdateFromWebhook);

// Delete product Webhook
router.post('/products/delete/webhook', ProductsController.deleteProductFromWebhook);

// Get updated store from Webhook
router.post('/collections/update/webhook', StoresController.updateStoreFromWebhook);

// Delete store Webhook
router.post('/collections/delete/webhook', StoresController.deleteStoreFromWebhook);

module.exports = router;

