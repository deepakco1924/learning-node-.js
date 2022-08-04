// const path = require("path");
// const fs = require("fs");
// const { json } = require("express");
// const p = path.join(path.dirname(require.main.filename), "data", "cart.json");
// module.exports = class Cart {
//   static addProduct(id, productPrice) {
//     fs.readFile(p, "utf-8", (err, fileContent) => {
//       if (!err) {
//         let cart = {
//           products: [],
//           totalPrice: 0,
//         };
//         if (fileContent.length > 0) {
//           cart = JSON.parse(fileContent);
//         }
//         const exisitingProductindex = cart.products.findIndex(
//           (prod) => prod.id === id
//         );
//         let exisitingProduct =
//           exisitingProductindex == -1
//             ? ""
//             : cart.products[exisitingProductindex];
//         if (exisitingProduct) {
//           const updateProduct = { ...exisitingProduct };
//           updateProduct.qty = updateProduct.qty + 1;
//           console.log("existring product");
//           cart.products = [...cart.products];
//           cart.products[exisitingProductindex] = updateProduct;
//         } else {
//           const updateProduct = {
//             id: id,
//             qty: Number(1),
//           };
//           cart.products = [...cart.products, updateProduct];
//         }
//         cart.totalPrice = cart.totalPrice + +productPrice;

//         fs.writeFile(p, JSON.stringify(cart), (err) => {
//           console.log(err, "not added content ");
//         });
//       }
//     });
//   }
//   static deleteProduct(id, productPrice) {
//     fs.readFile(p, "utf-8", (err, fileContent) => {
//         if(err)return;
//       const cart = JSON.parse(fileContent);
//       let updatedcart={...cart};
//       const productget=updatedcart.products.find(prod=>prod.id===id);
//       if(!productget)return;
//       updatedcart.products=cart.products.filter(prod=>prod.id!==id);
//       updatedcart.totalPrice=cart.totalPrice-(productPrice*(Number(productget.qty)));
//       fs.writeFile(p,JSON.stringify(updatedcart),(err)=>{
//         console.log(err,"unable to done ");
//       })
//     });
//   }

//   static getProducts(cb){
//     fs.readFile(p,(err,fileContent)=>{
//         if(err){
//             return cb(null);
//         }
//         else{
//         const cart=JSON.parse(fileContent);
//         cb(cart)
//         }

//     })
//   }
// };

const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

module.exports=Cart;