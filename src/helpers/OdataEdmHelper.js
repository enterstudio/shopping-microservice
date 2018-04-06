/**
 * Created by kaile on 4/05/17.
 */

import { sequelize } from '../db/connection';
import models from '../models/models.index';

var EdmNavigation = {};

// Tests OK.
EdmNavigation[models.Stores.name] = {
	categories: {
		navigationName: 'categories',
		targetModel: models.Categories,
		targetTableName: 'category_T',
		baseModel: models.Stores,
		baseTableName: 'store_B',
		baseIndexName: '_store_id',
		pointerFields: 'store_B.`id` as `_store_id`',
		joinType: 'JOIN',
		joinWith: '(store store_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'category_T.id = prd_ctg_assc_1.ctg_id AND store_B.id = prd_ctg_assc_1.store_id',
		extraFilter: 'category_T.parentCategoryId IS NULL'
	},
	subcategories: {
		navigationName: 'subcategories',
		targetModel: models.Categories,
		targetTableName: 'category_T',
		baseModel: models.Stores,
		baseTableName: 'store_B',
		baseIndexName: '_store_id',
		pointerFields: 'store_B.`id` as `_store_id`',
		joinType: 'JOIN',
		joinWith: '(store store_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'category_T.id = prd_ctg_assc_1.ctg_id AND store_B.id = prd_ctg_assc_1.store_id',
		extraFilter: 'category_T.parentCategoryId IS NOT NULL'
	},
	products: {
		navigationName: 'products',
		targetModel: models.Products,
		targetTableName: 'product_T',
		baseModel: models.Stores,
		baseTableName: 'store_B',
		baseIndexName: '_store_id',
		pointerFields: 'store_B.`id` as `_store_id`',
		joinType: 'JOIN',
		joinWith: '(store store_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'product_T.id = prd_ctg_assc_1.prod_id AND store_B.id = prd_ctg_assc_1.store_id',
		extraFilter: null
	}
};

// Tests OK.
EdmNavigation[models.Categories.name] = {
	stores: {
		navigationName: 'stores',
		targetModel: models.Stores,
		targetTableName: 'store_T',
		baseModel: models.Categories,
		baseTableName: 'category_B',
		baseIndexName: '_category_id',
		pointerFields: 'category_B.`id` as `_category_id`',
		joinType: 'JOIN',
		joinWith: '(category category_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'store_T.id = prd_ctg_assc_1.store_id AND category_B.id = prd_ctg_assc_1.ctg_id',
		extraFilter: null
	},
	subcategories: {
		navigationName: 'subcategories',
		targetModel: models.Categories,
		targetTableName: 'category_T',
		baseModel: models.Categories,
		baseTableName: 'category_B',
		baseIndexName: '_category_id',
		pointerFields: 'category_B.`id` as `_category_id`',
		joinType: 'INNER JOIN',
		joinWith: '(category category_B)',
		association: 'category_T.parentCategoryId = category_B.id',
		extraFilter: null
	},
	products: {
		navigationName: 'products',
		targetModel: models.Products,
		targetTableName: 'product_T',
		baseModel: models.Categories,
		baseTableName: 'category_B',
		baseIndexName: '_category_id',
		pointerFields: 'category_B.`id` as `_category_id`',
		joinType: 'JOIN',
		joinWith: '(category category_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'product_T.id = prd_ctg_assc_1.prod_id AND category_B.id = prd_ctg_assc_1.ctg_id',
		extraFilter: null
	}
};

// Tests OK.
EdmNavigation[models.Products.name] = {
	stores: {
		navigationName: 'stores',
		targetModel: models.Stores,
		targetTableName: 'store_T',
		baseModel: models.Products,
		baseTableName: 'product_B',
		baseIndexName: '_product_id',
		pointerFields: 'product_B.`id` as `_product_id`',
		joinType: 'JOIN',
		joinWith: '(product product_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'store_T.id = prd_ctg_assc_1.store_id AND product_B.id = prd_ctg_assc_1.prod_id',
		extraFilter: null
	},
	categories: {
		navigationName: 'categories',
		targetModel: models.Categories,
		targetTableName: 'category_T',
		baseModel: models.Products,
		baseTableName: 'product_B',
		baseIndexName: '_product_id',
		pointerFields: 'product_B.`id` as `_product_id`',
		joinType: 'JOIN',
		joinWith: '(product product_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'category_T.id = prd_ctg_assc_1.ctg_id AND product_B.id = prd_ctg_assc_1.prod_id',
		extraFilter: 'category_T.parentCategoryId IS NULL'
	},
	subcategories: {
		navigationName: 'subcategories',
		targetModel: models.Categories,
		targetTableName: 'category_T',
		baseModel: models.Products,
		baseTableName: 'product_B',
		baseIndexName: '_product_id',
		pointerFields: 'product_B.`id` as `_product_id`',
		joinType: 'JOIN',
		joinWith: '(product product_B, prd_ctg_assc prd_ctg_assc_1)',
		association: 'category_T.id = prd_ctg_assc_1.ctg_id AND product_B.id = prd_ctg_assc_1.prod_id',
		extraFilter: 'category_T.parentCategoryId IS NOT NULL'
	}
};

EdmNavigation[models.Cartitems.name] = {
	store: {
		navigationName: 'store',
		targetModel: models.Stores,
		targetTableName: 'store_T',
		baseModel: models.Cartitems,
		baseTableName: 'cartitem_B',
		baseIndexName: '_cartitem_id',
		pointerFields: 'cartitem_B.`id` as `_cartitem_id`',
		joinType: 'JOIN',
		joinWith: '(cartitem cartitem_B)',
		association: 'store_T.id = cartitem_B.store_id',
		extraFilter: null
	},
	product: {
		navigationName: 'product',
		targetModel: models.Products,
		targetTableName: 'product_T',
		baseModel: models.Cartitems,
		baseTableName: 'cartitem_B',
		baseIndexName: '_cartitem_id',
		pointerFields: 'cartitem_B.`id` as `_cartitem_id`',
		joinType: 'JOIN',
		joinWith: '(cartitem cartitem_B)',
		association: 'product_T.id = cartitem_B.prod_id',
		extraFilter: null
	}
};

module.exports = { EdmNavigation };
