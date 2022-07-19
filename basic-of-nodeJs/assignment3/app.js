// const fs = require("fs");
// const http = require("http");
// const server = http.createServer((req, res) => {
//   if (req.url === "/") {
//     res.end("hello from other side");
//   } else if (req.url === "/about") {
//     res.end("hello from about side");
//   } else if (req.url === "/contacts") {
//     res.end("from contacts side");
//   } else if (req.url === "/userapi") {
//     fs.readFile(`${__dirname}/userapi.json`, "utf-8", (err, data) => {
//       const finalarray = JSON.parse(data);
//       console.log(finalarray);
//     });
//     res.end("<h1>hello from user api</h1>");
//   } else {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//     });
//     res.end("<h1>404 error page ,page does'nt exist</h1>");
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("listneing to the server");
// });

// const EventEmitter = require("events");
// const event = new EventEmitter();
// event.on("sayMyName", () => {
//   console.log("my name is deepak");
// });
// event.on("sayMyName", () => {
//   console.log("my name is deepak pal");
// });
// event.on("sayMyName", () => {
//   console.log("my name is deepak pal kumar");
// });
// event.on("checkPage", (statuscode, message) => {
//   console.log(`statusCode is ${statuscode} and message is ${message}`);
// });
// event.emit("checkPage", 200, "ok");

const fs = require("fs");
const http = require("http");
const server = http.createServer();
server.on("request", (req, res) => {
  //   fs.readFile("input.txt", function (err, data) {
  //     if (err) return console.error(err);
  //     res.end(data.toString());
  //   });
  //2nd way
  //   const rstream = fs.createReadStream("inputs.txt");
  //   rstream.on("data", (chunk) => {
  //     res.write(`<h1>${chunk}</h1>`);
  //   });
  //   rstream.on("end", () => {
  //     res.end();
  //   });
  //   rstream.on("error", (err) => {
  //     console.log(err);
  //     res.end("file not found");
  //   });
  //3re way
  const rstream = fs.createReadStream("input.txt");
  rstream.pipe(res);
});
server.listen(8000, "127.0.0.1");
