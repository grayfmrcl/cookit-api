const jwt = require('jsonwebtoken')

const User = require('../models/user')

module.exports = {
  register: (req, res, next) => {
    const { name, email, password } = req.body

    User.findByEmail(email)
      .then(user => {
        if (user) {
          res.status(400).json({ error: `email is already registered` })
        } else {
          User.create({ name, email, password })
            .then(new_user => {
              res.status(201).json({ success: true })
            })
            .catch(err => next(err))
        }
      })
      .catch(err => next(err))

    let user = new User({ name, email, password })
    user.save()
      .then(new_user => {
        res.status(201).json({ success: true })
      })
      .catch(err => next(err))
  },

  login: (req, res, next) => {
    const { email, password } = req.body

    User.findByEmail(email)
      .then(user => {
        if (user && user.validPassword(password)) {
          jwt.sign({ id: user.id }, process.env.JWT_KEY, (err, token) => {
            res.status(200).json({
              success: true,
              auth_token: token
            })
          })
        } else {
          res.status(400).json({ error: `invalid email/password` })
        }
      })
      .catch(err => next(err))
  }
}