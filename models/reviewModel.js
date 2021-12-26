const mongoose = require("mongoose");
const validator = require("validator");
const domPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const htmlPurify = domPurifier(new JSDOM().window);
const { stripHtml } = require("string-strip-html");
const reviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Vui lòng nhập email."],
    required: true,
  },
  school: {
    type: mongoose.Schema.ObjectId,
    ref: "School",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  snippet: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.pre("validate", function (next) {
  if (this.content) {
    this.content = htmlPurify.sanitize(this.content);
    this.snippet = stripHtml(this.content.substring(0, 200)).result;
  }
  next();
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
