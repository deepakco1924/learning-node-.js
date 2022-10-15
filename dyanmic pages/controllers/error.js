exports.getErrorfunction = (req, res, next) => {
  res.statusCode = 404;
  res.render("404error", {
    pageTitle: "Error 404",
    isAuthenicated: req.session.isLoggedIn,
  });
};
exports.get500 = (req, res, next) => {
  res.statusCode(500).res.render("505", {
    pageTitle: "Error 500",
    isAuthenicated: req.session.isLoggedIn,
  });
};
