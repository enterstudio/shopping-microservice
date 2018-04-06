/**
 * Created by kaile on 4/04/17.
 */

import express from 'express';
const router = express.Router();
import odataController from '../controllers/odata.controller';

router.get('/products', odataController.getProductEntitySet);

router.get('/products(:id)', odataController.getProductEntity);

router.get('/categories', odataController.getCategoryEntitySet);

router.get('/categories(:id)', odataController.getCategoryEntity);

router.get('/stores', odataController.getStoreEntitySet);

router.get('/stores(:id)', odataController.getStoreEntity);

// router.get('/customers', odataController.getCustomerEntitySet);

// router.get('/customers(:id)', odataController.getCustomerEntity);

router.get('/cartitems', odataController.getCartItemEntitySet);

router.get('/cartitems(:id)', odataController.getCartItemEntity);

module.exports = router;
