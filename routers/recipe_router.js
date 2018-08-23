const router = require('express').Router()

const recipes = require('../controllers/recipe_controller')

const { bearerAuthentication } = require('../helpers/auth_helper')

router.get('/', recipes.all)
router.get('/:id', recipes.single)
router.post('/', bearerAuthentication, recipes.add)
router.put('/:id', bearerAuthentication, recipes.edit)
router.delete('/:id', bearerAuthentication, recipes.remove)

module.exports = router