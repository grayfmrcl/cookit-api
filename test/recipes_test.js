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

const mockUpLoginAndCreateTestRecipe = (callback) => {
  return mockUpLogin((err, token) => {
    if (err) throw err

    chai
      .request(base_url)
      .post('/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Basic Omelette`,
        content: `First get some eggs...`,
        tags: ['omelette', 'egg']
      })
      .end((err, res) => {
        if (err) callback(err)
        callback(null, token, res.body.data)
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

  describe('GET /recipes/:id', () => {
    it('shold return recipe with the specified id', done => {
      createTestRecipes()
        .then(() => {

          chai.request(base_url)
            .get('/recipes')
            .then(res => {

              chai.request(base_url)
                .get('/recipes/' + res.body[0]._id)
                .then(res2 => {
                  res2.status.should.eql(200)
                  res2.body._id.should.eql(res.body[0]._id)
                  res2.body.title.should.eql(res.body[0].title)
                  res2.body.content.should.eql(res.body[0].content)
                  res2.body.tags.should.eql(res.body[0].tags)
                  done()
                })
                .catch(err => done(err))

            })
            .catch(err => { throw err })

        })
    })

    it('should fail when the recipe id is invalid or not exist', done => {
      chai.request(base_url)
        .get('/recipes/5b7e31f4a422a688e9c69efa')
        .then(res => {
          res.status.should.eql(404)
          done()
        })
        .catch(err => done(err))
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
          chai
            .request(base_url)
            .post('/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send(recipe)
            .then(res => {
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

  describe('PUT /recipes/:id', () => {

    it('should success and return the updated recipe object when the to be updated recipe is present and the recipe owner is the user and user is authenticated', done => {
      mockUpLoginAndCreateTestRecipe((err, token, initialRecipe) => {
        if (err) throw err
        else {
          let updateRecipe = {
            title: 'Advance omelette',
            content: 'Second, get some bacon ...',
            tags: ['omelette', 'eggs', 'bacon']
          }

          chai
            .request(base_url)
            .put('/recipes/' + initialRecipe._id)
            .set('Authorization', 'Bearer ' + token)
            .send(updateRecipe)
            .then(res => {
              res.status.should.eql(200)
              res.body.success.should.be.true
              res.body.data._id.should.eql(initialRecipe._id)
              res.body.data.user.should.eql(initialRecipe.user)
              res.body.data.title.should.eql(updateRecipe.title)
              res.body.data.content.should.eql(updateRecipe.content)
              res.body.data.tags.should.eql(updateRecipe.tags)

              let updatedAt = new Date(res.body.data.updated_at)
              let initialDate = new Date(initialRecipe.updated_at)
              updatedAt.should.be.gt(initialDate)
              done()
            })
            .catch(err => done(err))
        }
      })
    })

    it('should fail when user is not authenticated', done => {
      mockUpLoginAndCreateTestRecipe((err, token, initialRecipe) => {
        if (err) throw err
        else {
          let updateRecipe = {
            title: 'Advance omelette',
            content: 'Second, get some bacon ...',
            tags: ['omelette', 'eggs', 'bacon']
          }

          chai
            .request(base_url)
            .put('/recipes/' + initialRecipe._id)
            .send(updateRecipe)
            .then(res => {
              res.status.should.eql(401)
              done()
            })
            .catch(err => done(err))
        }
      })
    })

    it('should fail when invalid recipe id', done => {
      mockUpLoginAndCreateTestRecipe((err, token, initialRecipe) => {
        if (err) throw err
        else {
          let updateRecipe = {
            title: 'Advance omelette',
            content: 'Second, get some bacon ...',
            tags: ['omelette', 'eggs', 'bacon']
          }

          chai
            .request(base_url)
            .put('/recipes/' + '5b7cd5f35f40022010eca05a')
            .set('Authorization', 'Bearer ' + token)
            .send(updateRecipe)
            .then(res => {
              res.status.should.eql(404)
              done()
            })
            .catch(err => done(err))
        }
      })
    })

  })

  describe('DELETE /recipes/:id', () => {

    it('should success when the to be deleted recipe is present and user is authenticated', done => {
      mockUpLoginAndCreateTestRecipe((err, token, initialRecipe) => {
        if (err) throw err
        else {
          chai
            .request(base_url)
            .delete('/recipes/' + initialRecipe._id)
            .set('Authorization', 'Bearer ' + token)
            .then(res => {
              res.status.should.eql(200)
              res.body.success.should.be.true

              chai
                .request(base_url)
                .get('/recipes')
                .then(res2 => {
                  res2.status.should.eql(200)
                  res2.body.should.be.a('array').with.length(0)
                  done()
                })
                .catch(err => done(err))

            })
            .catch(err => done(err))
        }
      })
    })

    it('should fail when user is not authenticated', done => {
      mockUpLoginAndCreateTestRecipe((err, token, initialRecipe) => {
        if (err) throw err
        else {
          chai
            .request(base_url)
            .delete('/recipes/' + initialRecipe._id)
            .then(res => {
              res.status.should.eql(401)
              done()
            })
            .catch(err => done(err))
        }
      })
    })

    it('should fail when recipe id is invalid', done => {
      mockUpLoginAndCreateTestRecipe((err, token, initialRecipe) => {
        if (err) throw err
        else {
          chai
            .request(base_url)
            .delete('/recipes/' + '5b7cd5f35f40022010eca05a')
            .set('Authorization', 'Bearer ' + token)
            .then(res => {
              res.status.should.eql(404)
              done()
            })
            .catch(err => done(err))
        }
      })
    })

  })

})

