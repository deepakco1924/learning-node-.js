const User = require("../model/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "co19524@ccet.ac.in",
    pass: "dkroy8790",
  },
});
exports.getLogin = function (req, res, next) {
  // const isLoggedIn = req.get("Cookie")?.split("=")[1].trim();
  const isLoggedIn = req.session?.isLoggedIn;
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    isAuthenicated: isLoggedIn,
    errorMessage: message,
  });
};
exports.getSignUp = (req, res, next) => {
  const isLoggedIn = req.session?.isLoggedIn;
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "signup page",
    isAuthenicated: isLoggedIn,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "signup page",
      isAuthenicated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        password: hashPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail(
        {
          from: "co19524@ccet.ac.in",
          to: email,
          subject: "Sending Email using Node.js",
          text: "That was easy!",
        },
        (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
    });
};
exports.postLogin = function (req, res, next) {
  // res.setHeader("Set-Cookie", "loggedIn=true");

  // User.findById("62ece78634f419c501d66d3a")
  //   .then((user) => {
  //     // req.user = new User(user.name, user.email, user.cart, user._id);
  //     req.session.user = user;
  //     req.session.isLoggedIn = true;
  //     req.session.save((err) => {
  //       console.log(err);
  //       res.redirect("/");
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login page",
      isAuthenicated: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "E-mail not found");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((domatch) => {
        if (domatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "invalid email or password");

        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.postLogout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
};
exports.getReset = (req, res, next) => {
  const isLoggedIn = req.session?.isLoggedIn;
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset page",
    isAuthenicated: isLoggedIn,
    errorMessage: message,
  });
};
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail(
          {
            from: "co19524@ccet.ac.in",
            to: req.body.email,
            subject: "Reset password",
            html: `<p>You requested for password reset</p>
                 <p>Clike this <a href="http://localhost:3000/reset/${token}">Link</a> to set new password </p>
            `,
          },
          (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/new-password", {
      path: "new-passoword",
      pageTitle: "password reset",
      errorMessage: message,
      userId: user._id,
      passwordToken: token,
      isAuthenicated: false,
    });
  });
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  const newPassword = req.body.password;
  User.findOne({
    $and: [
      { resetToken: passwordToken },
      { resetTokenExpiration: { $gt: Date.now() } },
    ],
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashPassword) => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });

  // let resetUser;
  // User.findOne({
  //   resetToken: passwordToken,
  //   resetTokenExpiration: { $gt: Date.now() },
  // })
  //   .then((user) => {
  //     resetUser = user;
  //     return bcrypt.hash(newPassword);
  //   })
  //   .then((hashPassword) => {
  //     resetUser.password = hashPassword;
  //     resetUser.resetToken = undefined;
  //     resetUser.resetTokenExpiration = undefined;
  //     return resetUser.save();
  //   })
  //   .then((result) => {
  //     res.redirect("/login");
  //   })

  //   .catch((err) => {});
};
