const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  if (url === "/") {
    const markup = `
    <html>
    <head>
    </head>
    <body>
    <h1>welcome to my page</h1>
    <form action="/create-user" method="POST">
    <input type="text" name="username">
    <button type="submit">send</button>
    </form>
    </body>
    </html>
    `;
    res.write(markup);
    return res.end();
  }
  if (url === "/user") {
    const markup = `
    <html>
    <head>
    </head>
    <body>
    <h1>welcome to user page</h1>
    <ul>
    <li>use1 </li>
    <li>use2 </li>
    <li>use3 </li>
    </ul>
    </body>
    </html>
    `;
    res.write(markup);
    return res.end();
  }
  if (url === "/create-user" && req.method == "POST") {
    const body = [];
    req.on("data", (chunk) => {
      // console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsebody = Buffer.concat(body).toString();
      const message = parsebody.split("=")[1].split("+").join(" ");
      fs.writeFileSync("message.txt", message);
    });
    res.setHeader("location", "/");
    res.statusCode = 302;
    return res.end();
  }
};
module.exports = {
  handler: requestHandler,
};
