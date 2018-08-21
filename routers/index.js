const router = require('express').Router()

const auth = require('./auth_router')

router.get('/', (req, res) => {
  res.status(200).json({ message: `Connected to Cook It API.` })
})

router.use('/auth', auth)

module.exports = router