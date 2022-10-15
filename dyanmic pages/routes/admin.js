const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const path = require("path");
const rootdir = require("../util/path");
const admincontroller = require("../controllers/admin.js");
const isAuth = require("../middleware/is-auth");
//this is form POST request
const product = [];
router.get("/add-product", isAuth, admincontroller.postAddProduct);
router.post(
  "/add-product",
  [
    body("title").trim().isLength({ min: 3 }).isString(),
    body("price").isFloat(),
  ],
  isAuth,
  admincontroller.getAddProducts
);
// // admin/add-product
router.get("/product", isAuth, admincontroller.getProducts);
// //this is from GET request
router.get("/edit-product/:productId", isAuth, admincontroller.getEditProducts);
router.post("/edit-product", isAuth, admincontroller.postEditProduct);
router.delete("/product/:productId", isAuth, admincontroller.deleteProduct);

module.exports = router;
