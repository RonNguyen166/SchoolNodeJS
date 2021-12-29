const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/ApiError");
const Review = require("./../models/reviewModel");
const School = require("./../models/schoolModel");
const httpStatus = require("http-status");

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.school) {
    const school = await School.findOne({ slug: req.params.slug });
    req.body.school = school._id;
  }
  const used = await Review.findOne({
    school: req.body.school,
    email: req.body.email,
  });
  if (!used) {
    const doc = await Review.create(req.body);
    res.redirect("/school/" + req.params.slug);
    res.status(201).json(doc);
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "Email của bạn đã được đánh giá!");
  }
  // const user = await Review.
});

exports.getAll = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.slug) {
    const school = await School.findOne({ slug: req.params.slug });
    filter = { school: school._id };
  }

  const docs = await Review.find(filter).populate("school", "name");
  res.status(200).json({
    status: "success",
    data: {
      data: docs,
    },
  });
});
