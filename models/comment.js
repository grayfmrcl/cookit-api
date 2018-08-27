const mongoose = require('mongoose')
const Schema = mongoose.Schema
const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  message: {
    type: String
  }
})

module.exports = mongoose.model('Comment', commentSchema)