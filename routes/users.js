var express = require("express");
var userController = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */
router.get("/", userController.getAllUsers);
router.post("/", userController.create);
module.exports = router;
