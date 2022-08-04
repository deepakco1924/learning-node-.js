const Product = require("../model/product");
const mongodb=require("mongodb");
exports.getAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.Description;
  // Product.create({
  //   title: title,
  //   imageUrl: imageUrl,
  //   price: price,
  //   description: description,
  //   userId: req.user.id,
  // });
  // req.user
  //   .createProduct({
  //     title: title,
  //     imageUrl: imageUrl,
  //     price: price,
  //     description: description,
  //     userId: req.user.id,
  //   })
  const product=new Product(title,price,description,imageUrl,null,req.user._id);
    product.save().then((result) => {
      console.log(result);
      res.redirect("/admin/product");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product page",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(req.query.edit);
  console.log(req.url);
  if (!editMode) {
    return res.redirect("/");
  }
  const id = req.params.productId;
  // req.user.getProducts({
  //   where: {
  //     id: id,
  //   },
  // })
  //   .then((products) => {
  //     if (products.length == 0) return res.redirect("/");
  //     res.render("admin/edit-product", {
  //       pageTitle: "Edit product",
  //       path: "/admin/edit-product",
  //       editing: editMode,
  //       product: products[0],
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // Product.findById(id, (product) => {
  //   if (!product) return res.redirect("/");
  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit product",
  //     path: "/admin/edit-product",
  //     editing: editMode,
  //     product: product,
  //   });
  // });
  Product.findById(id).then(product=>{
    if (!product) return res.redirect("/");
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  }).catch(err=>{
    console.log(err);
  })
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin product",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updateTitle = req.body.title;
  const updatePrice = req.body.price;
  const updateImageUrl = req.body.imageUrl;
  const updateDescription = req.body.Description;
  //now we need to updata teh answers
  // Product.findByPk(productId)
  //   .then((product) => {
  //     product.title = updateTitle;
  //     product.price = updatePrice;
  //     product.imageUrl = updateImageUrl;
  //     product.description = updateDescription;
  //     return product.save();
  //   })
  //   .then((result) => {
  //     console.log(result);
  //     res.redirect("/admin/product");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  


  //mongodb
  const product=new Product(updateTitle,updatePrice,updateDescription,updateImageUrl,new mongodb.ObjectId(productId));
  product.save().then(result=>{
    console.log(result);
      res.redirect("/admin/product");
  }).catch(err=>{
    console.log(err);
  })
};
exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  // console.log(productId);
  // Product.findByPk(productId)
  //   .then((product) => {
  //     return product.destroy();
  //   })
  //   .then((result) => {
  //     console.log(result);
  //     res.redirect("/admin/product");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  Product.deleteByid(productId).then(result=>{
    console.log(result);
    res.redirect("/admin/product");
  })
  .catch(err=>{
    console.log(err);
  })
};
