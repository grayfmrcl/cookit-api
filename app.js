const express = require('express')
require('dotenv').config()

const routers = require('./routers')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', routers)

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found.' })
})

app.use((err, req, res) => {
  console.log(err)
  res.status(500).json({ error: 'Something went wrong in the server.' })
})

app.listen(port, () => console.log(`listening to port ${port}`))