/**
 * Created by kaile on 4/03/17.
 */

import { sequelize } from '../db/connection';
import models from '../models/models.index';
import httpStatus from 'http-status';


var initData = function(callback) {

	var insertDataTasks = [
		models.Stores.create({
					id: 1,
					name: 'myStore 1',
					handle: 'myStore-1',
					alias: 'hello store',
					description: 'myStore description 1'
				}),
		models.Stores.create({
					id: 2,
					name: 'myStore 2',
	                handle: 'myStore-2',
	                alias: 'hey store',
					description: 'myStore description 2'
				}),

		models.Products.create({
					id: 1001,
					title: 'glass',
					vendor: 'visaaa',
					description: 'glass description 1',
					handle: null,
					images: {},
					options: {name: 'uuu'},
					variants: [
						{
							id: 6001,
							name: 'glass variant 1'
						},
						{
							id: 6002,
							name: 'glass variant 2'
						}
					]
				}),
		models.Products.create({
					id: 1002,
					title: 'coffee',
					vendor: 'devvv',
					description: 'coffee description 2',
					handle: null,
					images: {},
					options: {},
					variants: [
						{
							id: 6011,
							name: 'coffee variant 1',
							price: 29,
							hey: {
								vars: ['a', 'b', 'c']
							}
						}, 
						{
							id: 6012,
							name: 'coffee variant 2',
							price: 31,
							hey: {
								vars: ['uuu', 'ddd', 'mmm']
							}
						}
					]
				}),

		models.Categories.create({
					id: 1,
					name: 'cheap category',
					description: 'include coffee'
				}),
		models.Categories.create({
					id: 2,
					name: 'city category',
					description: 'include glass and coffee'
				}),
		models.Categories.create({
					id: 3,
					name: 'drink subcategory',
					description: 'include coffee',
					parentCategoryId: 2
				}),

		models.Associations.create({
					id: 701,
					store_id: 1,
					prod_id: 1002, // coffee
					ctg_id: 2 // city category
				}),
		models.Associations.create({
					id: 702,
					store_id: 1,
					prod_id: 1002, // coffee
					ctg_id: 3 // drink subcategory
				}),
		models.Associations.create({
					id: 703,
					store_id: 1,
					prod_id: 1002, // coffee
					ctg_id: 1 // cheap category
				}),
		models.Associations.create({
					id: 704,
					store_id: 2,
					prod_id: 1001, // glass
					ctg_id: 2 // city category
				}), 
		models.Cartitems.create({
					id: 99001,
					app_id: 'app1',
					user_id: 'user1',
					store_id: 1,
					prod_id: 1002,
					variant_id: 6011,
					unit_price: 59,
					quantity: 2
				}),
		models.Cartitems.create({
					id: 99002,
					app_id: 'app1',
					user_id: 'user1',
					store_id: 2,
					prod_id: 1001,
					variant_id: 6001,
					unit_price: 29.9,
					quantity: 5
				})
	];

	sequelize.Promise.all(insertDataTasks).then(function(results) {
		console.log('Load test data successfully!');
		callback();
	}).catch(function(error) {
    	error._statusCode = error._statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    	throw error;
    });
};



module.exports = initData;