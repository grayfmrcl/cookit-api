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
    const { title, content, tags } = req.body
    Recipe.findByIdAndUser(req.params.id, req.user.id)
      .then(recipe => {
        if (recipe) {
          recipe.title = title || recipe.title
          recipe.content = content || recipe.content
          recipe.tags = tags || recipe.tags
          recipe.save()
            .then(updated_recipe => {
              res.status(200).json({
                success: true,
                data: updated_recipe
              })
            })
            .catch(err => next(err))
        } else { next() }
      })
      .catch(err => next(err))
  },

  remove: (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id, user: req.user.id })
      .then(deleted => {
        console.log('DELETED', deleted)
        if (deleted.n === 1) {
          res.status(200).json({ success: true })
        } else { next() }
      })
      .catch(err => next(err))
  }
}