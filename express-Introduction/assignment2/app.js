const express = require("express");
const app = express();
const path = require("path");
const router = require("./routes");
const rootdir = require("./util/path");
app.use(express.static(path.join(__dirname, "public")));
app.use(router);
app.use((req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "error.html"));
});
app.listen(3000);
