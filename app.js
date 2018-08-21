const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const routers = require('./routers')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/cook-it'
mongoose.connect(db_url)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`connected to ${db_url}`)
});

app.use('/', routers)

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found.' })
})

app.use((err, req, res) => {
  console.log(err)
  res.status(500).json({ error: 'Something went wrong in the server.' })
})

app.listen(port, () => console.log(`listening to port ${port}`))