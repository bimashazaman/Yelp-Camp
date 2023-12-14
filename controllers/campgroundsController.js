const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')

exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  if (!campgrounds) {
    req.flash('error', 'Cannot find campgrounds!')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/index', { campgrounds })
}

exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

exports.createCampground = async (req, res) => {
  if (!req.body.campground)
    throw new ExpressError('Invalid Campground Data', 400)
  const campground = new Campground(req.body.campground)
  campground.author = req.user._id
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}

exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate(
    'reviews'
  )
  if (!campground) {
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
}

exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}

exports.updateCampground = async (req, res) => {
  const { id } = req.params
  if (!req.body.campground)
    throw new ExpressError('Invalid Campground Data', 400)
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })
  res.redirect(`/campgrounds/${campground._id}`)
}

exports.deleteCampground = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}
