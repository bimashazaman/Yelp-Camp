const express = require('express')
const router = express.Router()

const campgroundsController = require('../controllers/campgroundsController')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const catchAsync = require('../utils/catchAsync')

router
  .route('/')
  .get(isLoggedIn, catchAsync(campgroundsController.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundsController.createCampground)
  )

router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

router
  .route('/:id')
  .get(isLoggedIn, catchAsync(campgroundsController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgroundsController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsController.deleteCampground)
  )

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsController.renderEditForm)
)

module.exports = router
