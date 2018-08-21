const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  tags: [{ type: String }],
  created_at: Date,
  updated_at: Date
})

recipeSchema.pre('save', function (next) {
  if (this.isNew) {
    this.created_at = new Date
    this.updated_at = new Date
  } else {
    this.updated_at = new Date
  }
})

recipeSchema.statics.findByUserId = function (user_id) {
  return this.find({ user: user_id })
}

module.exports = mongoose.model('Recipe', recipeSchema)