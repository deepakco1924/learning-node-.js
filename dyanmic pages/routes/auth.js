const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth");
const User = require("../model/user");
router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("please Enter valid email")
      .custom((value, { req }) => {
        return User.find({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("E-mail not exist");
          }
          return true;
        });
      }),
    body("password", "please Enter valid password with 5 characters atleast")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);
router.get("/logout", authController.postLogout);
router.get("/signup", authController.getSignUp);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("please enter valid email")
      .custom((value, { req }) => {
        return User.find({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("E-mail already  exist");
          }
          return true;
        });
      }),
    body("password", "please enter valid password with min 5 characters")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passoword not match");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
module.exports = router;
