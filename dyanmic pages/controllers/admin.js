const Product = require("../model/product");
const fileHelper = require("../util/file");
const mongodb = require("mongodb");
const { validationResult } = require("express-validator");
exports.getAddProducts = (req, res, next) => {
  console.log("wer are in the this image");
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.Description;
  console.log(image);
  console.log(image);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product page",
      path: "/admin/add-product",
      editing: false,
      isAuthenicated: req.session.isLoggedIn,
      hasError: true,
      errorMessage: "attached file is not image",
      product: {
        title: title,
        price: price,
        description: description,
      },
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product page",
      path: "/admin/add-product",
      editing: false,
      isAuthenicated: req.session.isLoggedIn,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        price: price,
        description: description,
      },
    });
  }
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
  //mongo dbb
  // const product=new Product(title,price,description,imageUrl,null,req.user._id);
  //   product.save().then((result) => {
  //     console.log(result);
  //     res.redirect("/admin/product");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //mongoose
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
    isAuthenicated: req.session.isLoggedIn,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/admin/product");
    })
    .catch((err) => {
      // return res.status(500).render("admin/add-product", {
      //   pageTitle: "Add product page",
      //   path: "/admin/add-product",
      //   editing: false,
      //   isAuthenicated: req.session.isLoggedIn,
      //   hasError: true,
      //   errorMessage: errors.array()[0].msg,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description,
      //   },
      // });
      res.redirect("/500");
    });
};
exports.postAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product page",
    path: "/admin/add-product",
    editing: false,
    isAuthenicated: req.session.isLoggedIn,
    hasError: false,
    errorMessage: null,
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
  Product.findById(id)
    .then((product) => {
      if (!product) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        errorMessage: null,
        hasError: false,
        isAuthenicated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin product",
        path: "/admin/products",
        isAuthenicated: req.session.isLoggedIn,
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
  const image = req.file;
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
  // const product = new Product(
  //   updateTitle,
  //   updatePrice,
  //   updateDescription,
  //   updateImageUrl,
  //   new mongodb.ObjectId(productId)
  // );
  // product
  //   .save()
  //   .then((result) => {
  //     console.log(result);
  //     res.redirect("/admin/product");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  //moongose;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product page",
      path: "/admin/add-product",
      editing: true,
      isAuthenicated: req.session.isLoggedIn,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: updateTitle,
        price: updatePrice,
        description: updateDescription,
      },
    });
  }

  Product.findById(productId)
    .then((product) => {
      product.title = updateTitle;
      product.price = updatePrice;
      if (image) {
        fileHelper.deleteFile(image.path);
        product.imageUrl = image.path;
      }
      product.description = updateDescription;
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      return product
        .save()
        .then((result) => {
          res.redirect("/admin/product");
        })
        .catch((err) => {
          throw err;
        });
    })

    .catch((err) => {
      console.log(err);
    });
};
exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
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
  //mongodb
  // Product.deleteByid(productId)
  //   .then((result) => {
  //     console.log(result);
  //     res.redirect("/admin/product");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //mongooose
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("product not found"));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then((result) => {
      res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      res.status(500).json({ message: "deleting product failed" });
    });
};
