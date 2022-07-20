const express = require("express");
const path = require("path");
const router = express.Router();
const rootdir = require("./util/path.js");
router.get("/user", (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "user.html"));
});
router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "frontpage.html"));
});

module.exports = router;
