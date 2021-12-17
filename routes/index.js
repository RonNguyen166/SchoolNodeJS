var express = require("express");

var router = express.Router();
var schoolController = require("../controllers/schoolController");
var authController = require("../controllers/authController");

/* GET home page. */
router.get("/", schoolController.getAll);
router.post("/signUp", authController.signUp);

module.exports = router;
