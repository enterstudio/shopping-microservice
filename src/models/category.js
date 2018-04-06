/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('category', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
            unique: true
		},
		description: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
        image_url: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        parentCategoryId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null
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
		tableName: 'category'
	});
};
