const express = require("express");
const app = express();
const path = require("path");
const rootdir = require("./util/path");
const mongoConnect=require("./util/database").mongoConnect;
const errorController = require("./controllers/error.js");
// const sequelize = require("./util/database");

const router = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const bodyParser = require("body-parser");
const User=require("./model/user");
// const Product = require("./model/product");
// const User = require("./model/user");
// const Cart = require("./model/cart");
// const cartItem = require("./model/cart-item");
// const Order=require("./model/order");
// const OrderItem=require("./model/order-items");
// Order.belongsToMany(Product,{through:OrderItem})
// Order.belongsTo(User);
// User.hasMany(Order);

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: cartItem });
// Product.belongsToMany(Cart, { through: cartItem });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));



// app.use((req, res, next) => {
//   console.log("we are in first middleware");
//   next();
// });

// app.use((req, res, next) => {
//   console.log("we are in second middleware");
//   res.send("<h1>hello bro</h1> ");
// });
// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       console.log(user);
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.use((req,res,next)=>{
  User.findById("62e3b1d52553211aa2276a8f").then(user=>{
    req.user=new User(user.name,user.email,user.cart,user._id);
   
    next();
  })
  .catch(err=>{
    console.log(err);
    next();
  })

})

app.use("/admin", router);
app.use(shopRoutes);
app.use(errorController.getErrorfunction);

// sequelize
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) return User.create({ name: "deepak", email: "deeproy@8790" });
//     return user;
//   })
//   .then((user) => {
//      Cart.findByPk(1).then(cart=>{
//         if(!cart)return user.createCart();
//         return cart;
//      }).then(cart=>{
//         app.listen(3000);
//      })
//      .catch(err=>{
//         console.log(err);
//      })
//   })
//   .catch((err) => {
//     console.log(err);
//   });











//mongodb learning from here


mongoConnect(() => {
  app.listen(3000);
});
