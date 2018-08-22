const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()

const routers = require('./routers')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const db_url = process.env.NODE_ENV === 'test' ?
  process.env.DB_URL :
  process.env.DB_TEST_URL

mongoose.connect(db_url, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`connected to ${db_url}`)
});

app.use(morgan('tiny'))

app.use('/', routers)

app.use('*', (req, res, next) => {
  res.status(404).json({ error: 'Resource not found.' })
})

app.use(function (err, req, res, next) {
  if (err.name == 'ValidationError') {
    res.status(400).json({
      error: Object.values(err.errors).map(e => e.message)
    })
  } else if (err.name == 'CastError' && err.kind == 'ObjectId') {
    res.status(404).json({ error: 'Resource not found.' })
  } else {
    console.log(err)
    res.status(500).json({
      error: 'Something went wrong in the server.'
    })
  }
})

app.listen(port, () => console.log(`Listening to port ${port}.`))