const jwt = require('jsonwebtoken')

const User = require('../models/user')

const reject = res => res.status(401).json({ error: `You are unauthorized to make this request.` })

module.exports = {
  bearerAuthentication: (req, res, next) => {
    if (req.headers['authorization']) {
      let fragments = req.headers.authorization.split(' ')
      if (fragments[0].toLowerCase() === 'bearer') {
        jwt.verify(fragments[1], process.env.JWT_KEY, (err, payload) => {
          if (err) reject(res)
          else {
            User.findById(payload.id)
              .then(user => {
                if (user) {
                  req.user = payload
                  next()
                }
                else { reject(res) }
              })
          }
        })
      } else { reject(res) }
    } else { reject(res) }
  }
}