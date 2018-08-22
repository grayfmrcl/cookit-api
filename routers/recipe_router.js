const router = require('express').Router()

const recipes = require('../controllers/recipe_controller')

const { bearerAuthentication } = require('../helpers/auth_helper')

router.get('/', recipes.get)
router.post('/', bearerAuthentication, recipes.add)

module.exports = router