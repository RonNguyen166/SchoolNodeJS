const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");

router.get("/", schoolController.searchSchool);
router.post("/", schoolController.searchSchool);

router.get("/:slug", schoolController.showSchool);
//localhost:3000/school/slug=dai-hoc-dong-a
http: module.exports = router;
