const router = require('express').Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: `Connected to Cook It API.` })
})

module.exports = router