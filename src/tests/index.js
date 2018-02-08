let assert = require('assert');
let request = require('supertest');
let _ = require('lodash');
let utils = require('./utils');
let path = require('path');

let prerequisites = require('./prerequisites');

describe('Routes', function () {
  let url = 'http://localhost:3000';

  let generateRandomString = prerequisites.generateRandomString;
  let sharedUser = prerequisites.sharedUser;
  let otherUser = prerequisites.otherUser;
  let privateRecipeOfSharedUser = prerequisites.privateRecipeOfSharedUser;
  let publicRecipeOfSharedUser = prerequisites.publicRecipeOfSharedUser;
  let privateRecipeOfOtherUser = prerequisites.privateRecipeOfOtherUser;
  let publicRecipeOfOtherUser = prerequisites.publicRecipeOfOtherUser;

  before(function (done) {
    // create shared user and its recipes
    let p1 = new Promise(function (resolve, reject) {
      request(url)
        .post('/signup')
        .send(sharedUser)
        .end(function (err, res) {
          if (err) reject();
          let token = res.body.token;
          request(url)
            .post("/recipes")
            .set('Authorization', 'JWT ' + token)
            .send(privateRecipeOfSharedUser)
            .end(function (err, res) {
              if (err) reject();
              privateRecipeOfSharedUser._id = res.body._id;

              request(url)
                .post("/recipes")
                .set('Authorization', 'JWT ' + token)
                .send(publicRecipeOfSharedUser)
                .end(function (err, res) {
                  if (err) reject();
                  publicRecipeOfSharedUser._id = res.body._id;

                  request(url)
                    .get('/userInfo')
                    .set('Authorization', 'JWT ' + token)
                    .end(function (err, res) {
                      if (err) reject();
                      sharedUser._id = res.body._id;
                      resolve();
                    });
                });
            });
        });
    });

    // create the other user and one recipe for it
    let p2 = new Promise(function (resolve, reject) {
      request(url)
        .post('/signup')
        .send(otherUser)
        .end(function (err, res) {
          if (err) reject();
          let token = res.body.token;
          request(url)
            .post("/recipes")
            .set('Authorization', 'JWT ' + token)
            .send(privateRecipeOfOtherUser)
            .end(function (err, res) {
              if (err) reject();
              privateRecipeOfOtherUser._id = res.body._id;

              request(url)
                .post("/recipes")
                .set('Authorization', 'JWT ' + token)
                .send(publicRecipeOfOtherUser)
                .end(function (err, res) {
                  if (err) reject();
                  publicRecipeOfOtherUser._id = res.body._id;

                  request(url)
                    .get('/userInfo')
                    .set('Authorization', 'JWT ' + token)
                    .end(function (err, res) {
                      if (err) reject();
                      otherUser._id = res.body._id;
                      resolve();
                    });
                });
            });
        });
    });

    Promise.all([p1, p2]).then(function () {
      // ready to run tests
      done();
    });

  });

  // describe('welcome controller', function () {
  //     it('should reply with hello message', function (done) {
  //         request(url)
  //             .get('/')
  //             .end(function (err, res) {
  //                 assert.equal(200, res.status);
  //                 assert.equal('Hello from Recipes API', res.text);
  //                 done();
  //             });
  //     });
  // });
  //
  // describe('users controller', function () {
  //     it('should be able to sign up users', function (done) {
  //         let credentials = {
  //             username: 'user' + generateRandomString(),
  //             password: 'password1'
  //         }
  //
  //         request(url)
  //             .post('/signup')
  //             .send(credentials)
  //             .end(function (err, res) {
  //                 if (err) {
  //                     throw err;
  //                 }
  //
  //                 assert.equal(200, res.status);
  //                 assert(res.body.token);
  //                 done();
  //             });
  //     });
  //
  //     it('should be able to sign in users', function (done) {
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 if (err) {
  //                     throw err;
  //                 }
  //
  //                 assert.equal(200, res.status);
  //                 assert(res.body.token);
  //                 done();
  //             });
  //     });
  //
  //     it('should not be able to overwrite users', function (done) {
  //         // try to register the already registered shared user
  //         request(url)
  //             .post('/signup')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 assert(!res.body.token);
  //                 done();
  //             });
  //     });
  //
  //     it('should not be able to sign up with missing password', function (done) {
  //         let missingPasswordCredentials = {
  //             username: "someuser"
  //         };
  //         request(url)
  //             .post('/signup')
  //             .send(missingPasswordCredentials)
  //             .end(function (err, res) {
  //                 assert(!res.body.token);
  //                 done();
  //             });
  //     });
  //
  //     it('should not be able to sign in with wrong credentials', function (done) {
  //         let invalidCredentials = {
  //             username: sharedUser.username,
  //             password: "ivalidPassword"
  //         };
  //         request(url)
  //             .post('/signin')
  //             .send(invalidCredentials)
  //             .end(function (err, res) {
  //                 assert(!res.body.token);
  //                 done();
  //             });
  //     });
  //
  //     it('should not be able to sign in with missing password', function (done) {
  //         let missingPasswordCredentials = {
  //             username: "someuser"
  //         };
  //         request(url)
  //             .post('/signin')
  //             .send(missingPasswordCredentials)
  //             .end(function (err, res) {
  //                 assert(!res.body.token);
  //                 done();
  //             });
  //     });
  // });
  //
  // describe("recipes controller", function () {
  //     it('user should be able to get all public recipes', function (done) {
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 request(url)
  //                     .get("/recipes?visibility=public")
  //                     .set('Authorization', `JWT ${res.body.token}`)
  //                     .expect('Content-Type', /json/)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //
  //                         assert.equal(200, res.status);
  //                         assert(Array.isArray(res.body));
  //
  //                         let recipes = res.body;
  //                         assert(recipes.length > 0);
  //                         recipes.forEach(function (recipe) {
  //                             assert(recipe.isPublic);
  //                         });
  //                         done();
  //                     });
  //             });
  //     });
  //
  //     it('user should be able to get all personal recipes', function (done) {
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 request(url)
  //                     .get("/recipes?visibility=personal&user=current")
  //                     .set('Authorization', `JWT ${res.body.token}`)
  //                     .expect('Content-Type', /json/)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //
  //                         assert.equal(200, res.status);
  //                         assert(Array.isArray(res.body));
  //
  //                         let recipes = res.body;
  //                         assert(recipes.length > 0);
  //                         recipes.forEach(function (recipe) {
  //                             assert.equal(sharedUser._id, recipe.userId);
  //                         });
  //                         done();
  //                     });
  //             });
  //     });
  //
  //     it('user should be able to get specific public recipe', function (done) {
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 request(url)
  //                     .get("/recipes/" + publicRecipeOfOtherUser._id)
  //                     .set('Authorization', `JWT ${res.body.token}`)
  //                     .expect('Content-Type', /json/)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //
  //                         assert.equal(200, res.status);
  //                         assert(res.body._id === publicRecipeOfOtherUser._id);
  //                         done();
  //                     });
  //             });
  //     });
  //
  //     it('user should be able to get specific personal recipe', function (done) {
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 request(url)
  //                     .get("/recipes/" + privateRecipeOfSharedUser._id)
  //                     .set('Authorization', `JWT ${res.body.token}`)
  //                     .expect('Content-Type', /json/)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //
  //                         assert.equal(200, res.status);
  //                         assert(res.body._id === privateRecipeOfSharedUser._id);
  //                         done();
  //                     });
  //             });
  //     });
  //
  //     it('user should be able to create and delete recipes', function (done) {
  //         // generate some recipe
  //         let recipe = {
  //             title: "new recipe",
  //             isPublic: "false",
  //         }
  //
  //         // sign in the shared user
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 let token = res.body.token;
  //                 request(url)
  //                     .post("/recipes")
  //                     .send(recipe)
  //                     .set('Authorization', `JWT ${token}`)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //
  //                         assert.equal(200, res.status);
  //                         assert.ok(res.body._id);
  //                         assert.ok(res.body.title);
  //                         assert.ok(typeof (res.body.isPublic) !== 'undefined');
  //
  //                         // delete the recipe we just created
  //                         request(url)
  //                             .del("/recipes/" + res.body._id)
  //                             .set('Authorization', `JWT ${token}`)
  //                             .end(function (err, res) {
  //                                 if (err) {
  //                                     throw err;
  //                                 }
  //                                 // make sure we get status 204. nothing else is returned
  //                                 assert.equal(204, res.status);
  //                                 done();
  //                             });
  //                     });
  //             });
  //     });
  //
  //     it('user should be able to update recipes', function (done) {
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 let token = res.body.token;
  //
  //                 // get all recipes
  //                 request(url)
  //                     .get("/recipes?user=current")
  //                     .set('Authorization', `JWT ${token}`)
  //                     .end(function (err, res) {
  //
  //                         // find the sharedUserRecipe which we know already exists
  //                         let idx = _.findIndex(res.body, function (recipe) {
  //                             return recipe._id === privateRecipeOfSharedUser._id;
  //                         });
  //
  //                         // modify the recipe returned from the server
  //                         let recipe = res.body[idx];
  //                         recipe.title = 'modified'
  //
  //                         // send the modified recipe back to the server
  //                         request(url)
  //                             .put("/recipes/" + recipe._id)
  //                             .send(recipe)
  //                             .set('Authorization', `JWT ${token}`)
  //                             .end(function (err, res) {
  //                                 assert.equal(204, res.status);
  //                                 done();
  //                             });
  //                     });
  //             });
  //     });
  //
  //     it('user should not be able to delete personal recipe of another user', function (done) {
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 request(url)
  //                     .del("/recipes/" + privateRecipeOfOtherUser._id)
  //                     .set('Authorization', `JWT ${res.body.token}`)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //                         assert(res.status === 401)
  //                         done();
  //                     });
  //             });
  //     });
  //
  //     it('user should not be able to update personal recipe of another user', function (done) {
  //         let modifiedRecipe = utils.clone(privateRecipeOfOtherUser);
  //         modifiedRecipe.title = "modified";
  //         modifiedRecipe.isPublic = "true";
  //
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 request(url)
  //                     .put("/recipes/" + privateRecipeOfOtherUser._id)
  //                     .send(JSON.stringify(modifiedRecipe))
  //                     .set('Authorization', `JWT ${res.body.token}`)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //                         assert(res.status === 401)
  //                         done();
  //                     });
  //             });
  //     });
  // });
  //
  // describe("ingredients controller", function () {
  //     it('user should be able to add, update and delete ingredient', function (done) {
  //         // add ingredient to recipe
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 let token = res.body.token;
  //                 request(url)
  //                     .post(`/recipes/${privateRecipeOfSharedUser._id}/ingredients`)
  //                     .send({ title: 'ingr 1' })
  //                     .set('Authorization', `JWT ${token}`)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //
  //                         assert.equal(200, res.status);
  //                         assert(res.body._id);
  //                         assert(res.body.title);
  //
  //                         let ingredient = res.body;
  //
  //                         // update the ingredient
  //                         request(url)
  //                             .put(`/recipes/${privateRecipeOfSharedUser._id}/ingredients/${ingredient._id}`)
  //                             .send({ title: 'ingr 1 - altered' })
  //                             .set('Authorization', `JWT ${token}`)
  //                             .end(function (err, res) {
  //                                 if (err) {
  //                                     throw err;
  //                                 }
  //
  //                                 assert.equal(200, res.status);
  //
  //                                 // delete the ingredient
  //                                 request(url)
  //                                     .delete(`/recipes/${privateRecipeOfSharedUser._id}/ingredients/${ingredient._id}`)
  //                                     .set('Authorization', `JWT ${token}`)
  //                                     .end(function (err, res) {
  //                                         if (err) {
  //                                             throw err;
  //                                         }
  //
  //                                         assert.equal(204, res.status);
  //                                         done();
  //                                     });
  //                             });
  //                     });
  //             });
  //     });
  // });
  //
  // describe("steps controller", function () {
  //     it('user should be able to add, update and delete step', function (done) {
  //         // add step to recipe
  //         request(url)
  //             .post('/signin')
  //             .send(sharedUser)
  //             .end(function (err, res) {
  //                 let token = res.body.token;
  //                 request(url)
  //                     .post(`/recipes/${privateRecipeOfSharedUser._id}/steps`)
  //                     .send({ title: 'step 1' })
  //                     .set('Authorization', `JWT ${token}`)
  //                     .end(function (err, res) {
  //                         if (err) {
  //                             throw err;
  //                         }
  //
  //                         assert.equal(200, res.status);
  //                         assert(res.body._id);
  //                         assert(res.body.title);
  //
  //                         let step = res.body;
  //
  //                         // update the step
  //                         request(url)
  //                             .put(`/recipes/${privateRecipeOfSharedUser._id}/steps/${step._id}`)
  //                             .send({ title: 'step 1 - altered' })
  //                             .set('Authorization', `JWT ${token}`)
  //                             .end(function (err, res) {
  //                                 if (err) {
  //                                     throw err;
  //                                 }
  //
  //                                 assert.equal(200, res.status);
  //
  //                                 // delete the step
  //                                 request(url)
  //                                     .delete(`/recipes/${privateRecipeOfSharedUser._id}/steps/${step._id}`)
  //                                     .set('Authorization', `JWT ${token}`)
  //                                     .end(function (err, res) {
  //                                         if (err) {
  //                                             throw err;
  //                                         }
  //
  //                                         assert.equal(204, res.status);
  //                                         done();
  //                                     });
  //                             });
  //                     });
  //             });
  //     });
  // });

  describe("images controller", function () {
    it('user should be able to upload and request images', function (done) {
      const testImagePath = path.join(__dirname, "test.png");

      request(url)
        .post('/signin')
        .send(sharedUser)
        .end(function (err, res) {
          let token = res.body.token;
          request(url)
            .post(`/images`)
            .attach("image", testImagePath)
            .set('Authorization', `JWT ${token}`)
            .end(function (err, res) {
              if (err) {
                throw err;
              }

              assert.equal(200, res.status);
              assert(res.body.id);

              let imageId = res.body.id;

              // update the step
              request(url)
                .get(`/images/${imageId}`)
                .end(function (err, res) {
                  if (err) {
                    throw err;
                  }

                  assert.equal(200, res.status);
                  done();
                });
            });
        });
    });
  });
});