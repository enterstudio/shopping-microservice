/**
 * Created by kaile on 4/18/17.
 */

import express from 'express';
const router = express.Router();
import CartitemsController from '../controllers/cartitems.controller'

router.post('/', CartitemsController.addProductItem);

router.patch('/:cartItemId', CartitemsController.updateItemQuantity);

router.delete('/:cartItemId', CartitemsController.deleteProductItem);

module.exports = router;
