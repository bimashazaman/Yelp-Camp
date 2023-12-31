const Campground = require('../models/campground')
const Review = require('../models/review')

exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}

exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/campgrounds/${id}`)
}
