const express = require("express");
const csrf = require("csurf");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const rootdir = require("./util/path");
const flash = require("connect-flash");
// const mongoConnect = require("./util/database").mongoConnect;
const errorController = require("./controllers/error.js");
// const sequelize = require("./util/database");

const router = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth.js");
const bodyParser = require("body-parser");
const multer = require("multer");
// const User = require("./model/user");
// const Product = require("./model/product");
const User = require("./model/user");
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
const store = new MongoDBStore({
  uri: "mongodb+srv://deepak:palccet@nodecluster.nhmcuow.mongodb.net/shop",
  collection: "session",
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getMilliseconds().toString() + "_" + file.originalname);
  },
});
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const csrfProtection = csrf({});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: filefilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

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

app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          next();
        }
        // req.user = new User(user.name, user.email, user.cart, user._id);
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log("we are in error");
        next();
      });
  }
});
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", router);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.getErrorfunction);
// app.use("/500", errorController.get500);
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error 500",
    path: "/500",
  });
});
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

// mongoConnect(() => {
//   app.listen(3000);
// });

//learn aboutt the mongoose

mongoose
  .connect(
    "mongodb+srv://deepak:palccet@nodecluster.nhmcuow.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "deepak pal",
    //       email: "dkroy76890@gmail.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
