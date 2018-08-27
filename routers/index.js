const router = require('express').Router()

const auth = require('./auth_router')
const recipes = require('./recipe_router')
const comments = require('./comment_router')

router.get('/', (req, res) => {
  res.status(200).json({ message: `Connected to Cook It API.` })
})

router.use('/auth', auth)
router.use('/recipes', recipes)
router.use('/comments', comments)

module.exports = router