/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('store', {
        id: {
            type: DataTypes.DECIMAL(65),
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        handle: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        alias: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT(),
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING(256),
            allowNull: true
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
        tableName: 'store'
    });
};
