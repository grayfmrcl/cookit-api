const router = require('express').Router()

const recipes = require('../controllers/recipe_controller')

router.get('/', recipes.get)

module.exports = router