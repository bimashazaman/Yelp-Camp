const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

//database
mongoose
  .connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB!'))
  .catch((error) => console.log(error.message))

const app = express()

//views
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

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
