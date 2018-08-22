const router = require('express').Router()

const auth = require('./auth_router')
const recipes = require('./recipe_router')

router.get('/', (req, res) => {
  res.status(200).json({ message: `Connected to Cook It API.` })
})

router.use('/auth', auth)
router.use('/recipes', recipes)

module.exports = router