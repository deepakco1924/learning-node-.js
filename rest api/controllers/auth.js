const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "user created succesfully", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};

exports.login = (req, res, next) => {
  console.log("i am in login page");
  const Email = req.body.email;
  const password = req.body.password;
  console.log(Email, password);
  let loadedUser;
  User.findOne({ email: Email })
    .then((user) => {
      if (!user) {
        const error = new Error("Email does'nt exist");
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("password not match");
        error.statusCode = 422;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        "somesecratekey",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.userStatus = (req, res, next) => {
  console.log("my user di", req.userId, "");
  User.findById(req.userId)
    .then((user) => {
      res
        .status(200)
        .json({ message: "status fetched succesuflly", status: user.status });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};
exports.updateUserStatus = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "use status updated successfully",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        console.log(err);
        err.statusCode = 500;
      }
      next();
    });
};
