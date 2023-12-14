const express = require('express')
const User = require('../models/user')
const router = express.Router()
const passport = require('passport')

// Route to show registration form
router.get('/signup', (req, res) => {
  res.render('users/register')
})

// Route to handle registration form submission
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
      if (err) return next(err)
      res.redirect('/campgrounds')
    })
  } catch (e) {
    console.log(e)
    res.redirect('signup')
  }
})

// Route to show login form
router.get('/login', (req, res) => {
  res.render('users/login')
})

// Route to handle login form submission
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/campgrounds',
    successFlash: 'Welcome back!',
  })
)

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
  })
})

module.exports = router
