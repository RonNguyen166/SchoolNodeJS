const User = require("../models/userModel");
const School = require("../models/schoolModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

exports.login = catchAsync(async (req, res, next) => {
  const schools = await School.find();
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user && (await user.correctPassword(password, user.password))) {
    req.session.email = email;
    res.render("admin", { schools: schools, email: req.session.email });
  } else {
    res.redirect("/admin");
  }
});
exports.logout = catchAsync(async (req, res, next) => {
  if (req.session.email) {
    req.session.destroy();
  }
  res.redirect("/admin");
});
exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.body.email);
  const user = await User.findOne({ email: req.body.email });
  if (
    user &&
    (await user.correctPassword(req.body.currentPassword, user.password))
  ) {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.save();
    res.redirect("/admin");
  } else {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "The password entered is not correct"
    );
  }
});

exports.viewResetPassword = catchAsync(async (req, res, next) => {
  if (req.session.email) {
    res.render("resetPassword", {
      email: req.session.email,
      title: "Reset Password",
    });
    res.status(httpStatus.OK);
  }
});
