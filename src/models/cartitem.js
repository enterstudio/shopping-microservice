/* jshint indent: 1 */

import JsonFieldSerializer from '../helpers/SequelizeJSONSerializer';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cartitem', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
        app_id: {
            type: DataTypes.STRING(65),
            allowNull: false
        },
		user_id: {
            type: DataTypes.STRING(65),
            allowNull: false
        },
        store_id: {
            type: DataTypes.DECIMAL(65),
            allowNull: false,
            references: {
                model: 'store',
                key: 'id'
            }
        },
        prod_id: {
            type: DataTypes.DECIMAL(65),
            allowNull: false,
            references: {
                model: 'product',
                key: 'id'
            }
        },
        variant_id: {
        	type: DataTypes.STRING(45),
        	allowNull: false
        },
        unit_price: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            defaultValue: 0
        },
        quantity: {
        	type: DataTypes.INTEGER(11),
        	allowNull: false
        },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('NOW()')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('NOW()')
		}
	}, {
		tableName: 'cartitem',
        instanceMethods : {
            toJSON : function(){
                let values = this.get();
                delete values.app_id;
                delete values.user_id;
                return values;
            }
        }
	}, {
        indexes: [{unique: true, fields: ['customer_id', 'store_id', 'prod_id', 'variant_id']}]
    });
};
