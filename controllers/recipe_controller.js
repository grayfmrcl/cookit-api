const Recipe = require('../models/recipe')

module.exports = {
  get: (req, res, next) => {
    Recipe.find()
      .then(recipes => {
        res.status(200).json(recipes)
      })
      .catch(err => next(err))
  },

  add: (req, res, next) => {
    const { title, content, tags } = req.body
    let recipe = new Recipe({ user: req.user.id, title, content, tags })
    recipe.save()
      .then(new_recipe => {
        res.status(201).json({
          success: true,
          data: new_recipe
        })
      })
      .catch(err => next(err))
  },

  edit: (req, res, next) => {

  },

  delete: (req, res, next) => {

  }
}