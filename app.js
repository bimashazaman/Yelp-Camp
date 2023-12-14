const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const userRoutes = require('./routes/users')
const User = require('./models/user')

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp')
  console.log('Mongo connection open')
}

const app = express()

// views
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
  secret: 'vfkjvb244hbfjsdhu',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
}

// Session middleware
app.use(session(sessionConfig))

app.use(flash())

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Initialize Passport and Passport session
app.use(passport.initialize())
app.use(passport.session())

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

// Routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)
app.use('/', userRoutes)

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err
  res.status(statusCode).send(message)
})

app.use((req, res) => {
  res.status(404).send('404 Not Found')
})

const port = 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
