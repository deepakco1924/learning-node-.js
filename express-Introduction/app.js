const http = require("http");
const express = require("express");
const fs = require("fs");
const app = express();
// app.use((req, res, next) => {
//   console.log("In the middlewewar");
//   next();
// });
app.use("/add-products", (req, res, next) => {
  res.end("<h1>we are products page</h1>");
});
app.use("/", (req, res, next) => {
  console.log("IN another middlewaer");
  res.send(`<h1>hello from express js</h1>`);
});
app.listen(3000);
// const server = http.createServer(app);
// server.listen(3000);
