const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: { type: String, default: 'untitled' },
  img_url: { type: String, default: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1bdd3a5305d7913b82929130ae81fef6&auto=format&fit=crop&w=1355&q=80' },
  description: String,
  ingredients: [{ type: String }],
  directions: [{ type: String }],
  estimated_time: { type: Number, default: 5 },
  tags: [{ type: String }],
  updated_at: Date
})

recipeSchema.pre('save', function (next) {
  this.updated_at = new Date
  next()
})

recipeSchema.statics.findByUserId = function (user_id) {
  return this.find({ user: user_id })
}

recipeSchema.statics.findByIdAndUser = function (post_id, user_id) {
  return this.findOne({ _id: post_id, user: user_id })
}

recipeSchema.methods.mapSummary = function () {
  return { _id, user, title, img_url, description, updated_at } = this
}

module.exports = mongoose.model('Recipe', recipeSchema)