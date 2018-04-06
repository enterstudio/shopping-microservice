/* jshint indent: 1 */

import JsonFieldSerializer from '../helpers/SequelizeJSONSerializer';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('product', {
		id: {
			type: DataTypes.DECIMAL(65),
			allowNull: false,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
        vendor: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
		description: {
			type: DataTypes.TEXT(),
			allowNull: true
		},
        handle: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
			get: JsonFieldSerializer.getter('images')
        },
        options: {
            type: DataTypes.JSON,
            allowNull: true,
			get: JsonFieldSerializer.getter('options')
        },
		variants: {
			type: DataTypes.JSON,
			allowNull: true,
			get: JsonFieldSerializer.getter('variants')
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
		tableName: 'product'
	});
};
