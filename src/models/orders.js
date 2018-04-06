/**
 * Created by mayujain on 5/22/17.
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        customer_id: {
            type: DataTypes.DECIMAL(65),
            allowNull: false,
        },
        order_id: {
            type: DataTypes.DECIMAL(65),
            allowNull: true,
            defaultValue: null,
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
        tableName: 'order',

    },{
        indexes: [{unique: true, fields: ['user_id', 'customer_id', 'order_id']}]
    });
};
