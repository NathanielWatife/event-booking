const { DataTypes, where } = require('sequelize');

module.exports =  (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status:{
            type: DataTypes.ENUM('confirmed', 'waiting', 'cancelled'),
            allowNull: false
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },{
        indexes: [
            {
                unique: true,
                fields: ['userId', 'eventId'],
                where: {
                    status: 'confirmed',
                }
            }
        ]
    });
    return Order;
};