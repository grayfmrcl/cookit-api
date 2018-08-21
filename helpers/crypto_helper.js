const crypto = require('crypto')

const genRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
}

const hashString = (value, salt) => {
  return crypto
    .createHmac('md5', salt)
    .update(value)
    .digest('hex')
}

const hashWithSalt = value => {
  const salt = genRandomString(10)
  return {
    salt,
    hash: hashString(value, salt)
  }
}

module.exports = {
  hashString,
  hashWithSalt
}