const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");

router
  .route("/")
  .get(reviewController.getAll)
  .post(reviewController.createReview);

module.exports = router;
