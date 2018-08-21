const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
require('dotenv').config()

const expect = chai.expect

chai.use(chaiHttp)

const base_url = process.env.HOST
const User = require('../models/user')

describe('User', () => {

  beforeEach(done => {
    mongoose.connect(process.env.DB_TEST_URL)
    User.remove({}, err => {
      done()
    })
  })

  describe('/POST Register', () => {
    it('should success when all credentials are valid', done => {
      let user = {
        name: `John Doe`,
        email: `johndoe@mail.com`,
        password: `Test@1234`
      }
      chai.request(base_url)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201)
          expect(res.body).have.property('success').to.be.true
          done()
        })
    })

    it('should fail when the email is empty or invalid', done => {
      let user = {
        name: `John Doe`,
        email: `johndoe`, //not a valid email
        password: `Test@1234`
      }
      chai.request(base_url)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          done()
        })
    })

    it('should fail when the password is empty or invalid', done => {
      let user = {
        name: `John Doe`,
        email: `johndoe@mail.com`,
        password: `1234` //not a valid password
      }
      chai.request(base_url)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          done()
        })
    })
  })

  describe('/POST Login', () => {

    it('should success when the credentials are valid', done => {
      User.create({
        name: `John Doe`,
        email: `johndoe@mail.com`,
        password: `Test@1234`
      })
        .then(() => {

          let user = {
            email: `johndoe@mail.com`,
            password: `Test@1234`
          }

          chai.request(base_url)
            .post('/auth/login')
            .send(user)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body).have.property('success').to.be.true
              expect(res.body).have.property('auth_token')
              done()
            })

        })
    })

    it('should fail when wrong password', done => {
      User.create({
        name: `John Doe`,
        email: `johndoe@mail.com`,
        password: `Test@1234`
      })
        .then(() => {

          let user = {
            email: `johndoe@mail.com`,
            password: `1234`
          }

          chai.request(base_url)
            .post('/auth/login')
            .send(user)
            .end((err, res) => {
              expect(res.status).to.equal(400)
              done()
            })

        })
    })

  })

})