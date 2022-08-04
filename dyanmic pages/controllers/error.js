exports.getErrorfunction = (req, res, next) => {
  res.statusCode = 404;
  res.render("404error", {
    pageTitle: "Error 404",
  });
};
