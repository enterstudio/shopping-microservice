/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('prd_ctg_assc', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        store_id: {
            type: DataTypes.DECIMAL(65),
            allowNull: true,
            references: {
                model: 'store',
                key: 'id'
            }
        },
        prod_id: {
            type: DataTypes.DECIMAL(65),
            allowNull: true,
            references: {
                model: 'product',
                key: 'id'
            }
        },
        ctg_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'category',
                key: 'id'
            }
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
        tableName: 'prd_ctg_assc',

    },{
        indexes: [{unique: true, fields: ['store_id', 'prod_id', 'ctg_id']}]
    });
};
