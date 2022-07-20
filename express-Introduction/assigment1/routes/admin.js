const express = require("express");
const router = express.Router();
const path = require("path");
const rootdir = require("../util/path");
//this is form POST request
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/admin/add-product");
});
//this is from GET request
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "add-product.html"));
});
module.exports = router;
