const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
require('dotenv').config()

const should = chai.should()

chai.use(chaiHttp)

const base_url = process.env.HOST

const User = require('../models/user')
const Recipe = require('../models/recipe')

const createTestUser = () => {
  return User.create({
    name: `John Doe`,
    email: `johndoe@mail.com`,
    password: `Test@1234`
  })
}

const createTestRecipes = () => {
  return createTestUser()
    .then(user => {
      Recipe.insertMany([
        {
          user: user.id,
          title: `Basic Omelette`,
          content: `First get some eggs...`,
          tags: ['omelette', 'egg']
        },
        {
          user: user.id,
          title: `Steak`,
          content: `First get some meat...`,
          tags: ['steak', 'meat']
        },
        {
          user: user.id,
          title: `Pizza`,
          content: `First get some flour...`,
          tags: ['italian', 'bake']
        }
      ])
    })
}

describe('Recipes', () => {

  beforeEach(done => {
    mongoose.connect(process.env.DB_TEST_URL)
    User.remove({}, err => {
      Recipe.remove({}, err => {
        done()
      })
    })
  })

  describe('GET /recipes', () => {

    it(`should success and return all recipes`, done => {
      createTestRecipes()
        .then(recipes => {
          chai.request(base_url)
            .get('/recipes')
            .end((err, res) => {
              res.status.should.equal(200)
              res.body.should.be.a('array').with.length(3)
              res.body[0].should.have.property('_id')
              res.body[0].should.have.property('title')
              res.body[0].should.have.property('content')
              res.body[0].should.have.property('tags')
              res.body[0].title.should.equal(`Basic Omelette`)
              done()
            })
        })
    })

  })


})