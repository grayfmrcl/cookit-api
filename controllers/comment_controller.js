const Recipe = require('../models/recipe')
const Comment = require('../models/comment')

module.exports = {
  all: (req, res, next) => {
    Comment.find({ recipe: req.params.recipe_id })
      .populate('user')
      .then(comments => {
        res.status(200).json(comments)
      })
      .catch(err => next(err))
  },
  add: (req, res, next) => {
    let recipe_id = req.params.recipe_id
    let message = req.body.message
    let user = req.user.id

    Recipe.findById(recipe_id)
      .then(recipe => {
        if (recipe) {

          Comment.create({ recipe: recipe_id, user, message })
            .then(new_comment => {
              res.status(200).json({ success: true })
            })
            .catch(err => next(err))

        } else { next() }
      })
      .catch(err => next(err))
  },
  remove: (req, res, next) => {
    let id = req.params.id
    let recipe = req.params.recipe_id
    let user = req.user.id

    Comment.deleteOne({ id, recipe, user, })
      .then(() => {
        res.status(200).json({ success: true })
      })
      .catch(err => next(err))
  }
}