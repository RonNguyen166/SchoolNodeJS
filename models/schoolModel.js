const mongoose = require("mongoose");
const slugify = require("slugify");
const domPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const htmlPurify = domPurifier(new JSDOM().window);
const { stripHtml } = require("string-strip-html");
const schoolSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  snippetDescribe: String,
  majors: {
    type: [String],
    default: ["Đa Ngành"],
  },
  minTuition: {
    type: Number,
    required: true,
  },
  maxTuition: {
    type: Number,
    required: true,
  },
  minPoint: {
    type: Number,
    required: true,
  },
  maxPoint: {
    type: Number,
    required: true,
  },
  admission: {
    type: String,
  },
  code: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  snippetContent: String,
  trainingSystem: {
    type: String,
    default: "Đại Học",
    trim: true,
  },
  evaluate: {
    type: Number,
    required: true,
  },
  facebook: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  web: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  images: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  slugAddress: String,
  slugTraining: String,
});

schoolSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, locale: "vi" });
  this.slugAddress = slugify(this.address, { lower: true, locale: "vi" });
  this.slugTraining = slugify(this.trainingSystem, {
    lower: true,
    locale: "vi",
  });
  next();
});

schoolSchema.pre("validate", function (next) {
  if (this.content) {
    this.content = htmlPurify.sanitize(this.content);
    this.snippetContent = stripHtml(this.content.substring(0, 200)).result;
  }
  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
    this.snippetDescribe = stripHtml(this.description.substring(0, 200)).result;
  }
  next();
});
module.exports = mongoose.model("School", schoolSchema);
