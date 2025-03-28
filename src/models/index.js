const { Sequelize, DataTypes } = require("sequelize")
const path = require("path")
const config = require("../config/config")
const sequelize = require("../config/database")
const orderModel = require("./order")
const eventModel = require("./event")
const waitingListModel = require("./waitingList")


const Order = orderModel(sequelize, DataTypes)
const Event = eventModel(sequelize, DataTypes)
const WaitingList = waitingListModel(sequelize, DataTypes)


sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Connection error:", err))


sequelize
  .sync({ force: false })
  .then(() => console.log("Models synced"))
  .catch((err) => console.error("Model sync error:", err))

module.exports = {
  sequelize,
  Order,
  Event,
  WaitingList,
}

