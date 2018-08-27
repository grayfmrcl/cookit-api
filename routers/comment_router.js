const router = require('express').Router()

const comments = require('../controllers/comment_controller')
const { bearerAuthentication } = require('../helpers/auth_helper')

router.get('/:recipe_id', comments.all)
router.post('/:recipe_id', bearerAuthentication, comments.add)
router.delete('/:recipe_id/:id', bearerAuthentication, comments.remove)

module.exports = router