const express = require('express')
const path = require('path')
const app = express()

//views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//static files
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
