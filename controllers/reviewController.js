const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/ApiError");
const Review = require("./../models/reviewModel");
const School = require("./../models/schoolModel");

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.school) {
    const school = await School.findOne({ slug: req.params.slug });
    req.body.school = school._id;
  }
  const doc = await Review.create(req.body);
  res.redirect("/school/" + req.params.slug);
  res.status(201).json(doc);
});

exports.getAll = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.schoolId) filter = { school: req.params.schoolId };
  const docs = await Review.find(filter).populate("school", "name");
  res.status(200).json({
    status: "success",
    data: {
      data: docs,
    },
  });
});
