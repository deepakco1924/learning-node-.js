const path = require("path");
const Product = require("../model/product");
const { ITEMS_PER_PAGE } = require("../util/config");
const stripe = require("stripe")(
  "sk_test_51LVhQ2SC2rie05slHzuUIGHYg6HLh75YWIqal8ImIG97Z7gIEe9QQktccRt84FIeJf58pnF1GDjdDZBIkymBxnfB00aAg4sC6s"
);
const fs = require("fs");
const pdfDocument = require("pdfkit");
// const Cart = require("../model/cart.js");
// const Order=require("../model/order");
const Order = require("../model/order");
exports.getProducts = (req, res, next) => {
  // Product.fetchAll()
  //   .then((products) => {
  //     res.render("shop/all-product-list", {
  //       prods: products,
  //       pageTitle: "all products",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // Product.find()
  //   .then((products) => {
  //     res.render("shop/all-product-list", {
  //       prods: products,
  //       pageTitle: "all products",
  //       path: "/products",
  //       isAuthenicated: req.session.isLoggedIn,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  let page = 1;
  if (req.query.page) {
    page = Number(req.query.page);
  }
  console.log(page);
  console.log(ITEMS_PER_PAGE);

  let totalProducts = 0;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/all-product-list", {
        prods: products,
        pageTitle: "all products",
        path: "/products",
        isAuthenicated: req.session.isLoggedIn,
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Number(Math.ceil(totalProducts / ITEMS_PER_PAGE)),
        currentPage: page,
      });
    })
    .catch((err) => {
      console.log("wer");
      return next(err);
    });
};
exports.getindex = (req, res, next) => {
  console.log("i am in page");
  console.log(ITEMS_PER_PAGE);
  // Product.fetchAll()
  //   .then((products) => {
  //     res.render("shop/index", {
  //       prods: products,
  //       pageTitle: "shop",
  //       path: "/",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  let page = 1;
  if (req.query.page) {
    page = +req.query.page;
  }
  let totalProducts = 0;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "shop",
        path: "/",
        isAuthenicated: req.session.isLoggedIn,
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Number(Math.ceil(totalProducts / ITEMS_PER_PAGE)),
        currentPage: page,
      });
    })
    .catch((err) => {
      console.log("wer");
      return next(err);
    });
};

exports.getCart = (req, res, next) => {
  // Cart.getProducts((cart) => {
  //   Product.fetchAll((prod) => {
  //     const cartProducts=[];
  //     prod.forEach(element => {
  //         const ispresent=cart.products.find(ele=>ele.id===element.id);
  //         if(ispresent){
  //           cartProducts.push({product :element,qty:ispresent.qty});
  //         }
  //     });
  //     res.render("shop/cart",{
  //       products :cartProducts,
  //       pageTitle :"cart",
  //       path :"/cart"
  //     })
  //   });
  // });
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     console.log(cart);
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     console.log(products);
  //     res.render("shop/cart", {
  //       products: products,
  //       pageTitle: "cart",
  //       path: "/cart",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // req.user
  //   .getCart()
  //   .then((products) => {
  //     console.log(products);
  //     res.render("shop/cart", {
  //       products: products,
  //       pageTitle: "cart",
  //       path: "/cart",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //moongose

  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        products: products,
        pageTitle: "cart",
        path: "/cart",
        isAuthenicated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCheckout = (req, res, next) => {
  let sum = 0;
  let prod;
  req.user
    .getCart()
    .then((products) => {
      products.forEach((p) => {
        sum += p._doc.price * p.quantity;
      });
      prod = products;
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            price_data: p._doc.price * 100,
          };
        }),
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success", // => http://localhost:3000
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        products: prod,
        pageTitle: "checkout",
        path: "/checkout",
        isAuthenicated: req.session.isLoggedIn,
        totalsum: sum,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getorders = (req, res, next) => {
  // req.user.getOrders({include:["products"]}).then(orders=>{
  //     res.render("shop/orders", {
  //   path: "/orders",
  //   pageTitle: "your orders",
  //   orders:orders
  // });

  // }).catch(err=>{
  //   console.log(err);
  // })
  // req.user
  //   .getOrders()
  //   .then((orders) => {
  //     res.render("shop/orders", {
  //       path: "/orders",
  //       pageTitle: "your orders",
  //       orders: orders,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //mongogose
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "your orders",
        orders: orders,
        isAuthenicated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  // Product.findAll({ where: { id: productId } })
  //   .then((products) => {
  //     res.render("shop/product-details", {
  //       product: products[0],
  //       pageTitle: "details page",
  //       path: `/products`,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // Product.findById(productId).then(([ct])=>{
  //    const product=ct[0];

  // }).catch(err=>{
  //   console.log(err);
  // });

  //mongodb and same for mongose
  console.log(productId);
  Product.findById(productId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-details", {
        product: product,
        pageTitle: "details page",
        path: `/products`,
        isAuthenicated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCartDeleteProduct = (req, res, next) => {
  // console.log("we are in postCartdlete produjc");
  // const productId = req.body.productId;
  // req.user.getCart().then(cart=>{
  //   return cart.getProducts({where:{id:productId}})
  // }).then(products=>{
  //   const product=products[0];
  //   return product.cartitem.destroy();
  // })
  // .then(result=>{
  //   res.redirect("/cart");
  // }).catch(err=>{
  //   console.log(err);
  // })
  const productId = req.body.productId;
  // req.user
  //   .deleteItemFromCart(productId)
  //   .then((result) => {
  //     console.log(result);
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  req.user
    .removeFromCart(productId)
    .then((result) => {
      req.session.user = req.user;
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postOrder = (req, res, next) => {
  // let fetchCart;
  // req.user.getCart().then(cart=>{
  //   fetchCart=cart;
  //   return cart.getProducts();
  // })
  // .then(products=>{
  //   return req.user.createOrder().then(order=>{
  //     order.addProducts(products.map(product=>{
  //       product.orderitem={
  //         quantity:product.cartitem.quantity,
  //       }
  //       return product;
  //     }))
  //   });
  //   console.log(products);
  // })
  // .then(result=>{
  //   fetchCart.setProducts(null);
  // })
  // .then(result=>{
  //   res.redirect("/orders")

  // })
  // .catch(err=>{

  //   console.log(err);
  // })

  // req.user
  //   .addOrder()
  //   .then(() => {
  //     res.redirect("/orders");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  req.user
    .getCart()
    .then((products) => {
      const newProduct = products.map((p) => {
        return {
          product: p._doc,
          quantity: p.quantity,
        };
      });
      console.log(newProduct);

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: newProduct,
      });
      return order.save();
      // res.redirect("/");
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  // let fetchCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchCart = cart;
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     let newQuantity = 1;
  //     if (product) {
  //       newQuantity=product.cartitem.quantity+1;
  //       return Product.findByPk(productId).then(product=>{
  //         return fetchCart.addProduct(product,{
  //           through:{quantity:newQuantity}
  //         });
  //       }).catch(err=>{
  //         console.log(err);
  //       })
  //     }
  //     return Product.findByPk(productId)
  //       .then((product) => {
  //         return fetchCart.addProduct(product, {
  //           through: { quantity: newQuantity },
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // Product.findById(productId, (product) => {
  //   Cart.addProduct(productId, product.price);
  // });
  // res.redirect("/");
  console.log(productId, "we are herer");
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      req.session.user = req.user;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice_` + orderId + ".pdf";
  const invoicepath = path.join("data", "invoices", invoiceName);
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("order not found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("unauthorize user"));
      }
      // fs.readFile(invoicepath, "utf-8", (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "Application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     "inline; filename=" + invoiceName + ""
      //   );
      //   console.log(data);
      //   res.send(data);
      // });
      //now we streamming
      // const file = fs.createReadStream(invoicepath);
      // res.setHeader("Content-Type", "Application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   "inline; filename=" + invoiceName + ""
      // );
      // file.pipe(res);
      //now making pdf invoice on fly

      const pdfmaker = new pdfDocument();
      res.setHeader("Content-Type", "Application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=" + invoiceName + ""
      );
      pdfmaker.pipe(fs.createWriteStream(invoicepath));
      pdfmaker.pipe(res);
      pdfmaker.fontSize(30).text("Invoice");
      pdfmaker
        .fontSize(11)
        .text("product_name          price      quantity   product_Price");

      pdfmaker
        .fontSize(11)
        .text(
          "--------------------------------------------------------------------------"
        );
      let totalPrice = 0;
      order.products.forEach((p) => {
        totalPrice += p.product.price * p.quantity;
        pdfmaker
          .fontSize(15)
          .text(
            `${p.product.title}          ${p.product.price}    *   ${
              p.quantity
            }      =    $${p.product.price * p.quantity}`
          );
      });
      pdfmaker
        .fontSize(11)
        .text(
          "---------------------------------------------------------------------------"
        );
      pdfmaker.fontSize(25).text("Total price : $" + totalPrice);
      pdfmaker.end();
    })
    .catch((err) => next(err));
};
