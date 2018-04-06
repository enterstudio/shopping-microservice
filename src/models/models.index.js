/**
 * Created by mayujain on 3/30/17.
 */

import { sequelize } from '../db/connection';

let Stores = sequelize.import(__dirname + "/store");
let Categories = sequelize.import(__dirname + "/category");
let Products = sequelize.import(__dirname + "/product");
let Associations = sequelize.import(__dirname + "/prd_ctg_assc");
let Cartitems = sequelize.import(__dirname + "/cartitem");
let Orders = sequelize.import(__dirname + "/orders");

module.exports = {
	Stores,
	Categories,
	Products,
	Associations,
	Cartitems,
    Orders
};
