// const { INTEGER } = require("sequelize");
// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");
const mongodb = require("mongodb");
const getdb = require("../util/database").getdb;

// const User = sequelize.define("user", {
//      id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },

//   name: Sequelize.STRING,
//   email: Sequelize.STRING,
// });
// module.exports = User;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    const db = getdb();
    db.collection("users")
      .insertOne(this)
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getOrders(){
    const db=getdb();
   return db.collection("orders").find({"user._id":new mongodb.ObjectId(this._id)}).toArray();
  }
  deleteItemFromCart(productId) {
    const currentProductIndex = this.cart.items.findIndex((p) => {
      return p.productId.toString() === productId.toString();
    });

    let updatedCartItems = [...this.cart.items];
    updatedCartItems.splice(currentProductIndex, 1);
    const db = getdb();
    const updatedcart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedcart } }
      );
  }

  addOrder() {
    const db = getdb();
    return this.getCart()
      .then((products) => {
        const orders = {
          items: products,
          user: {
            name: this.name,
            _id: new mongodb.ObjectId(this._id),
          },
        };

        return db.collection("orders").insertOne(orders);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
    const currentProductIndex = this.cart.items.findIndex((p) => {
      return p.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedcartItems = [...this.cart.items];
    if (currentProductIndex >= 0) {
      newQuantity = this.cart.items[currentProductIndex].quantity + 1;
      updatedcartItems[currentProductIndex].quantity = newQuantity;
    } else {
      updatedcartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1,
      });
    }
    const updatedcart = { items: updatedcartItems };
    const db = getdb();
    return db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      {
        $set: { cart: updatedcart },
      }
    );
  }
  static findById(id) {
    const db = getdb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getCart() {
    const db = getdb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    console.log(productIds);
    return db
      .collection("product")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }
}
module.exports = User;
