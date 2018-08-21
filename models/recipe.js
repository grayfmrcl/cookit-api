const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  user: {
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
  updated_at: Date
})

recipeSchema.pre('save', function (next) {
  this.updated_at = new Date
})

recipeSchema.statics.findByUserId = function (user_id) {
  return this.find({ user: user_id })
}

module.exports = mongoose.model('Recipe', recipeSchema)