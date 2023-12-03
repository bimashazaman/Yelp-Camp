const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

const Campground = require('./models/campground')

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

//static files
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

//middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground)
  await campground.save()

  res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
})

//edit
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
})

//update
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })
  res.redirect(`/campgrounds/${req.params.id}`)
})

//delete
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
})

const port = 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
