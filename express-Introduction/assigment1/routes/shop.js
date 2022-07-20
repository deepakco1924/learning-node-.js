const express = require("express");
const router = express.Router();
const path = require("path");
const rootdir = require("../util/path");

router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "shop.html"));
});
module.exports = router;
