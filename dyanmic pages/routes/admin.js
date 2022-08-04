const express = require("express");
const router = express.Router();
const path = require("path");
const rootdir = require("../util/path");
const admincontroller = require("../controllers/admin.js");
//this is form POST request
const product = [];
router.get("/add-product", admincontroller.postAddProduct);
router.post("/add-product", admincontroller.getAddProducts);
// admin/add-product
router.get("/product", admincontroller.getProducts);
//this is from GET request
router.get("/edit-product/:productId",admincontroller.getEditProducts);
router.post("/edit-product",admincontroller.postEditProduct)
router.post("/delete-from-cart",admincontroller.deleteProduct)

module.exports = router;
