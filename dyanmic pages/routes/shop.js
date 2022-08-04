const express = require("express");
const router = express.Router();
const shopcontroller = require("../controllers/shop");
const path = require("path");
const rootdir = require("../util/path");
const admintdata = require("./admin.js");
router.get("/", shopcontroller.getindex);
router.get("/products",shopcontroller.getProducts);
router.get("/products/:productId",shopcontroller.getProduct)
router.get("/cart",shopcontroller.getCart)
router.post("/cart",shopcontroller.postCart)
router.get("/orders",shopcontroller.getorders)
// router.get("/checkout",shopcontroller.getCheckout)
router.post("/cart-delete-item",shopcontroller.postCartDeleteProduct)
router.post("/create-order",shopcontroller.postOrder);

module.exports = router;
