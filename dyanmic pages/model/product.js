// const { json } = require("express");
const mongodb = require("mongodb");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productShema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Product", productShema);
// const db=require("../util/database")

// const Cart=require("./cart")
// const fs = require("fs");
// const path = require("path");
// const { threadId } = require("worker_threads");
// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.title = title;
//     this.id = id;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
//   static delete(id){

//   }
//   save() {
//     return db.execute("INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)",[this.title,this.price,this.imageUrl,this.description])
//   }

//   static fetchAll() {
//    return db.execute("SELECT * FROM products")

//   }
//   static findById(id, cb) {
//     return db.execute("SELECT * FROM products WHERE products.id=? ",[id]);

//   }
// };
//mongodb product

// const getdb = require("../util/database").getdb;
// class Product {
//   constructor(title, price, description, imageUrl, id, userid) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id;
//     this.userId = userid;
//   }
//   save() {
//     const db = getdb();
//     let dbop;
//     if (this._id) {
//       dbop = db
//         .collection("product")
//         .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
//     } else {
//       dbop = db.collection("product").insertOne(this);
//     }
//     return dbop
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static fetchAll() {
//     const db = getdb();
//     return db
//       .collection("product")
//       .find({})
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static findById(id) {
//     const db = getdb();
//     return db
//       .collection("product")
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static deleteByid(id) {
//     const db = getdb();
//     return db
//       .collection("product")
//       .deleteOne({ _id: new mongodb.ObjectId(id) })
//       .then((result) => {
//         return result;
//       })
//       .catch((err) => {
//         console.log();
//       });
//   }
// }

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");
// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });
// module.exports = Product;
