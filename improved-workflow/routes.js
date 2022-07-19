const fs = require("fs");

const requesHandler = (req, res) => {
  const url = req.url;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(`<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">
    send
    </button></form></body>`);
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      // console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsebody = Buffer.concat(body).toString();
      const message = parsebody.split("=")[1].split("+").join(" ");

      fs.writeFileSync("message.txt", message);
      res.statusCode = 202;
      res.setHeader("Location", "/");
      res.end();
    });
  }
  res.setHeader("Content-type", "text/html");
  res.write("<h1>we are for you </h1>");
  res.end();
};
module.exports = {
  handler: requesHandler,
  someText: "some dummy text",
  roll_no: "co19524",
};
