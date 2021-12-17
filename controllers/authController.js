const User = require("../models/userModel");
const School = require("../models/schoolModel");
const catchAsync = require("../utils/catchAsync");
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
