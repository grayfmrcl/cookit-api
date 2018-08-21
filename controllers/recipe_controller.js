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

  },
  edit: (req, res, next) => {

  },
  delete: (req, res, next) => {

  }
}