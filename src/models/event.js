const { DataTypes } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookedTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  })
  return Event
}

