const http = require("http");
const chalk = require("chalk");
const fs = require("fs");
const routes = require("./routes.js");

// const rqListner = function (request, response) {
//   //   console.log(request);
//   console.log(
//     request.url,
//     chalk.blue(request.method),
//     chalk.red(request.headers)
//   );
//   response.setHeader("Content-type", "text/html");
//   response.write("<h1>we are for you </h1>");
//   response.end();
// };
// const server = http.createServer(rqListner);
// server.listen(3000);

const server = http.createServer(routes.handler);
server.listen(3000);
console.log(routes.roll_no);
