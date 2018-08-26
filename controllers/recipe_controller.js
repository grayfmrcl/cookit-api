const Recipe = require('../models/recipe')

const mapRecipeBody = reqBody => {
  return {
    title,
    img_url,
    description,
    ingredients,
    directions,
    estimated_time,
    notes,
    tags
  } = reqBody
}
module.exports = {
  all: (req, res, next) => {
    Recipe.find()
      .then(recipes => {
        res.status(200).json(recipes)
      })
      .catch(err => next(err))
  },
  single: (req, res, next) => {
    Recipe.findById(req.params.id)
      .then(recipe => {
        if (recipe) {
          res.status(200).json(recipe)
        } else { next() }
      })
      .catch(err => next(err))
  },

  add: (req, res, next) => {
    let recipe = new Recipe(
      Object.assign(
        { user: req.user.id },
        mapRecipeBody(req.body)
      )
    )
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