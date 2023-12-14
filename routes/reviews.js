const express = require('express')
const router = express.Router({ mergeParams: true })

const reviewsController = require('../controllers/reviewsController')
const { validateReview, isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')

router.post(
  '/',
  validateReview,
  isLoggedIn,
  catchAsync(reviewsController.createReview)
)

router.delete(
  '/:reviewId',
  isLoggedIn,
  catchAsync(reviewsController.deleteReview)
)

module.exports = router
