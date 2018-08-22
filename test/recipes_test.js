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

const mockUpLogin = (callback) => {
  createTestUser()
    .then(user => {
      chai
        .request(base_url)
        .post('/auth/login')
        .send({ email: `johndoe@mail.com`, password: `Test@1234` })
        .end((err, res) => {
          if (err) callback(err)
          else { callback(null, res.body.auth_token) }
        })
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
            .then(res => {
              res.status.should.equal(200)
              res.body.should.be.a('array').with.length(3)
              res.body[0].should.have.property('_id')
              res.body[0].should.have.property('title')
              res.body[0].should.have.property('content')
              res.body[0].should.have.property('tags')
              res.body[0].title.should.equal(`Basic Omelette`)
              done()
            })
            .catch(err => { throw err })
        })
    })
  })

  describe('POST /recipes', () => {

    it('should success and return the created recipe when using bearer authentiation with valid token', done => {
      let recipe = {
        title: `Basic Omelette`,
        content: `First get some eggs...`,
        tags: ['omelette', 'egg']
      }

      mockUpLogin((err, token) => {
        if (err) { throw err }
        else {
          console.log('TOKEN >>', token)
          chai
            .request(base_url)
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send(recipe)
            .then(res => {
              console.log('RES: ', res.body)
              res.status.should.eql(201)
              res.body.should.have.property('success')
              res.body.success.should.be.true
              res.body.data.should.have.property('_id')
              res.body.data.should.have.property('user')
              res.body.data.should.have.property('title')
              res.body.data.should.have.property('content')
              res.body.data.should.have.property('tags')
              res.body.data.should.have.property('updated_at')
              res.body.data.title.should.eql(recipe.title)
              res.body.data.content.should.eql(recipe.content)
              res.body.data.tags.should.eql(recipe.tags)
              done()
            })
            .catch(err => done(err))
        }
      })
    })

    it('should fail when no authentication provided', done => {
      let recipe = {
        title: `Basic Omelette`,
        content: `First get some eggs...`,
        tags: ['omelette', 'egg']
      }

      chai.request(base_url)
        .post('/recipes')
        .send(recipe)
        .end((err, res) => {
          res.status.should.eql(401)
          done()
        })
    })

  })

})