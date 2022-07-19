const fs = require("fs");
// const http = require("http");
// const server = http.createServer((req, res) => {
//   if (req.url === "/") {
//     res.end("hello from other side");
//   } else if (req.url === "/about") {
//     res.end("hello from about side");
//   } else if (req.url === "/contacts") {
//     res.end("from contacts side");
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

const bioData = {
  name: "deepak pal",
  age: 23,
  channel: "code with pal",
  college: "chandigarh college of engineering and technology",
};
// console.log(bioData.channel);
// const Jsonobject = JSON.stringify(bioData);
// console.log(Jsonobject);
// console.log(Jsonobject.channel);

//to convert json to object use JSON.parse(json)
// to convert object to Json JSON.stringify(object)
const Jsonobject = JSON.stringify(bioData);
fs.writeFile("message.json", Jsonobject, (err) => {
  console.log(err);
});

fs.readFile("message.json", "utf-8", (err, data) => {
  const finaldata = JSON.parse(data);
  console.log(finaldata);
});
