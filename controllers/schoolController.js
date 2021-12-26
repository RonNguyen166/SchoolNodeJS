const School = require("../models/schoolModel");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const slugify = require("slugify");
const Review = require("../models/reviewModel");

var repFindLike = function (obj) {
  Object.keys(obj).forEach(function (key) {
    obj[key] = new RegExp(`${obj[key]}`, "i");
  });
  return obj;
};

exports.create = catchAsync(async (req, res, next) => {
  const school = await School.create({
    ...req.body,
    images: req.file.filename,
  });
  req.session.message = {
    type: "success",
    message: "Trường đã thêm thành công!",
  };
  res.redirect("/admin");
  res.status(httpStatus.CREATED).json(school);
});

exports.findById = catchAsync(async (req, res, next) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, "School not found");
  }
  res.status(httpStatus.OK).json(school);
});

exports.viewAdd_school = catchAsync((req, res, next) => {
  res.render("add", { title: "Thêm sinh viên" });
  res.status(httpStatus.OK);
});

exports.searchSchool = catchAsync(async (req, res, next) => {
  if (req.body.slug)
    req.body.slug = await slugify(req.body.slug, { lower: true, locale: "vi" });
  const newObj = repFindLike({ ...req.body });
  const schools = await School.find(newObj).populate("reviews");
  if (!schools.length) {
    res.render("search", {
      message: "Trường không tìm thấy",
      title: "Search School",
    });
  } else {
    res.render("search", {
      schools: schools,
      title: "Search School",
    });
  }
  res.status(httpStatus.Ok).json(schools);
});

exports.searchSchool_admin = catchAsync(async (req, res, next) => {
  const newObj = repFindLike({ ...req.body });
  const schools = await School.find(newObj);
  if (!schools.length) {
    req.session.message = {
      type: "danger",
      message: "Trường không tìm thấy!",
    };
    res.redirect("/admin");
  } else {
    res.render("admin", { schools: schools, email: req.session.email });
  }
});

exports.showSchool = catchAsync(async (req, res, next) => {
  const school = await School.findOne({ slug: req.params.slug });
  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, "School not found");
  } else {
    const reviews = await Review.find({ school: school._id });
    res.render("show", {
      title: `${school.name}`,
      school: school,
      reviews: reviews,
    });
  }
});
exports.edit_school = catchAsync(async (req, res, next) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, "School not found");
  } else {
    res.render("edit", {
      title: "Edit School",
      school: school,
    });
  }
});

exports.getAll = catchAsync(async (req, res, next) => {
  const schools = await School.find().populate("reviews");
  res.render("index", {
    title: "School Page",
    schools: schools,
  });
});
exports.update = catchAsync(async (req, res, next) => {
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("../public/uploads" + req.body.old_filename);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_filename;
  }
  const school = await School.findByIdAndUpdate(req.params.id, req.body);
  req.session.message = {
    type: "success",
    message: "Trường đã sửa đổi!",
  };
  res.redirect("/admin");
  res.status(httpStatus.OK).json(school);
});
exports.delete = catchAsync(async (req, res, next) => {
  const school = await School.findByIdAndRemove(req.params.id);
  if (school.images != "") {
    try {
      fs.unlinkSync("../public/uploads/" + school.images);
    } catch (err) {
      console.log(err);
    }
  }
  req.session.message = {
    type: "info",
    message: "Trường đã xóa thành công!",
  };
  res.redirect("/admin");
  res.status(httpStatus.NO_CONTENT).json();
});

/// admin
exports.admin = catchAsync(async (req, res, next) => {
  const schools = await School.find();
  if (!req.session.email) {
    res.render("login");
  } else {
    res.render("admin", { schools: schools, email: req.session.email });
  }
});
