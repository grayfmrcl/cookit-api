const router = require('express').Router()

const recipes = require('../controllers/recipe_controller')

const { bearerAuthentication } = require('../helpers/auth_helper')

router.get('/', recipes.get)
router.post('/', bearerAuthentication, recipes.add)
router.put('/:id', bearerAuthentication, recipes.edit)

module.exports = router