const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp')
  console.log('Mongo connection open')
}

const app = express()

//views
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
app.use(session(sessionConfig))

//middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(methodOverride('_method'))

//routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

//error handling
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
