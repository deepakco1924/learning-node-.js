const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Cart = require("./cart");
const OrderItem= sequelize.define("orderitem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});
module.exports=OrderItem;