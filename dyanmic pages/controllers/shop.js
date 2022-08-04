const Product = require("../model/product");
// const Cart = require("../model/cart.js");
// const Order=require("../model/order");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/all-product-list", {
        prods: products,
        pageTitle: "all products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getindex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
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
  req.user
    .getCart()
    .then((products) => {
      console.log(products);
      res.render("shop/cart", {
        products: products,
        pageTitle: "cart",
        path: "/cart",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkouts",
    pageTitle: "Checkout",
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
  req.user
    .getOrders()
    .then((orders) => {

      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "your orders",
        orders: orders,
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

  //mongodb
  console.log(productId);
  Product.findById(productId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-details", {
        product: product,
        pageTitle: "details page",
        path: `/products`,
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
  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      console.log(result);
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
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
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
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
