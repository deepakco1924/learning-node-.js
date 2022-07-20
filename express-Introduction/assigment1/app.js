const express = require("express");
const app = express();
const path = require("path");
const rootdir = require("./util/path");

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const bodyParser = require("body-parser");

// app.use((req, res, next) => {
//   console.log("we are in first middleware");
//   next();
// });
// app.use((req, res, next) => {
//   console.log("we are in second middleware");
//   res.send("<h1>hello bro</h1> ");
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use((req, res, next) => {
  res.statusCode = 404;
  console.log(__dirname);
  res.sendFile(path.join(rootdir, "views", "error.html"));
});
app.listen(8000);
