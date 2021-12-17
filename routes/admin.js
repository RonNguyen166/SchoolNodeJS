var express = require("express");

var router = express.Router();
var schoolController = require("../controllers/schoolController");
var authController = require("../controllers/authController");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("images");

router.post("/search", schoolController.searchSchool_admin);

router.get("/", schoolController.admin);
router.post("/", authController.login);

router.get("/logout", authController.logout);

router.get("/school/add", schoolController.viewAdd_school);
router.post("/add", upload, schoolController.create);

router.get("/school/edit/:id", schoolController.edit_school);

router.post("/update/:id", upload, schoolController.update);
router.get("/delete/:id", schoolController.delete);

module.exports = router;
