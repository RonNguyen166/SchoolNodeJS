const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");
const reviewRouter = require("./review");

router.use("/:slug/review", reviewRouter);

router.get("/", schoolController.searchSchool);
router.post("/", schoolController.searchSchool);

router.get("/:slug", schoolController.showSchool);

router;
//localhost:3000/school/slug=dai-hoc-dong-a
http: module.exports = router;
