const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    console.log("1 we have not autheader");
    return next();
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersuperkey");
  } catch (err) {
    req.isAuth = false;
    console.log("3 tokent is not");
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    console.log("2 tokn");
    return next();
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  console.log(req.isAuth);
  console.log("we are come herer");
  next();
};
