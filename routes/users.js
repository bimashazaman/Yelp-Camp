const express = require('express')
const User = require('../models/user')
const router = express.Router()

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

module.exports = router
