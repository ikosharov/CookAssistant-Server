var assert = require('assert');
var request = require('supertest');
var _ = require('lodash');
var utils = require('./utils');
var path = require('path');

var prerequisites = require('./prerequisites');

describe('Routes', function () {
    var url = 'http://localhost:3000';

    var generateRandomString = prerequisites.generateRandomString;
    var sharedUser = prerequisites.sharedUser;
    var otherUser = prerequisites.otherUser;
    var privateRecipeOfSharedUser = prerequisites.privateRecipeOfSharedUser;
    var publicRecipeOfSharedUser = prerequisites.publicRecipeOfSharedUser;
    var privateRecipeOfOtherUser = prerequisites.privateRecipeOfOtherUser;
    var publicRecipeOfOtherUser = prerequisites.publicRecipeOfOtherUser;

    before(function (done) {
        // create shared user and its recipes
        var p1 = new Promise(function (resolve, reject) {
            request(url)
                .post('/signup')
                .send(sharedUser)
                .end(function (err, res) {
                    if (err) reject();
                    var token = res.body.token;
                    request(url)
                        .post("/recipes")
                        .set('Authorization', 'JWT ' + token)
                        .field('recipe', JSON.stringify(privateRecipeOfSharedUser))
                        .end(function (err, res) {
                            if (err) reject();
                            privateRecipeOfSharedUser._id = res.body._id;

                            request(url)
                                .post("/recipes")
                                .set('Authorization', 'JWT ' + token)
                                .field('recipe', JSON.stringify(publicRecipeOfSharedUser))
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
        var p2 = new Promise(function (resolve, reject) {
            request(url)
                .post('/signup')
                .send(otherUser)
                .end(function (err, res) {
                    if (err) reject();
                    var token = res.body.token;
                    request(url)
                        .post("/recipes")
                        .set('Authorization', 'JWT ' + token)
                        .field('recipe', JSON.stringify(privateRecipeOfOtherUser))
                        .end(function (err, res) {
                            if (err) reject();
                            privateRecipeOfOtherUser._id = res.body._id;

                            request(url)
                                .post("/recipes")
                                .set('Authorization', 'JWT ' + token)
                                .field('recipe', JSON.stringify(publicRecipeOfOtherUser))
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

    describe('welcome controller', function () {
        it('should reply with hello message', function (done) {
            request(url)
                .get('/')
                .end(function (err, res) {
                    assert.equal(200, res.status);
                    assert.equal('Hello from Recipes API', res.text);
                    done();
                });
        });
    });

    describe('users controller', function () {
        it('should be able to sign up users', function (done) {
            var credentials = {
                username: 'user' + generateRandomString(),
                password: 'password1'
            }

            request(url)
                .post('/signup')
                .send(credentials)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    assert.equal(200, res.status);
                    assert(res.body.token);
                    done();
                });
        });

        it('should be able to sign in users', function (done) {
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    assert.equal(200, res.status);
                    assert(res.body.token);
                    done();
                });
        });

        it('should not be able to overwrite users', function (done) {
            // try to register the already registered shared user
            request(url)
                .post('/signup')
                .send(sharedUser)
                .end(function (err, res) {
                    assert(!res.body.token);
                    done();
                });
        });

        it('should not be able to sign up with invalid credentials', function (done) {
            var invalidCredentials = {
                username: "aa",
                password: "bb"
            };
            request(url)
                .post('/signup')
                .send(invalidCredentials)
                .end(function (err, res) {
                    assert(!res.body.token);
                    done();
                });
        });

        it('should not be able to sign up with missing password', function (done) {
            var missingPasswordCredentials = {
                username: "someuser"
            };
            request(url)
                .post('/signup')
                .send(missingPasswordCredentials)
                .end(function (err, res) {
                    assert(!res.body.token);
                    done();
                });
        });

        it('should not be able to sign in with wrong credentials', function (done) {
            var invalidCredentials = {
                username: sharedUser.username,
                password: "ivalidPassword"
            };
            request(url)
                .post('/signin')
                .send(invalidCredentials)
                .end(function (err, res) {
                    assert(!res.body.token);
                    done();
                });
        });

        it('should not be able to sign in with missing password', function (done) {
            var missingPasswordCredentials = {
                username: "someuser"
            };
            request(url)
                .post('/signin')
                .send(missingPasswordCredentials)
                .end(function (err, res) {
                    assert(!res.body.token);
                    done();
                });
        });
    });

    describe("recipes controller", function () {
        it('user should be able to get all public recipes', function (done) {
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    request(url)
                        .get("/recipes?visibility=public")
                        .set('Authorization', `JWT ${res.body.token}`)
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            assert.equal(200, res.status);
                            assert(Array.isArray(res.body));

                            var recipes = res.body;
                            assert(recipes.length > 0);
                            recipes.forEach(function (recipe) {
                                assert(recipe.isPublic);
                            });
                            done();
                        });
                });
        });

        it('user should be able to get all personal recipes', function (done) {
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    request(url)
                        .get("/recipes?visibility=personal&user=current")
                        .set('Authorization', `JWT ${res.body.token}`)
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            assert.equal(200, res.status);
                            assert(Array.isArray(res.body));

                            var recipes = res.body;
                            assert(recipes.length > 0);
                            recipes.forEach(function (recipe) {
                                assert.equal(sharedUser._id, recipe.userId);
                            });
                            done();
                        });
                });
        });

        it('user should be able to get specific public recipe', function (done) {
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    request(url)
                        .get("/recipes/" + publicRecipeOfOtherUser._id)
                        .set('Authorization', `JWT ${res.body.token}`)
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            assert.equal(200, res.status);
                            assert(res.body._id == publicRecipeOfOtherUser._id);
                            done();
                        });
                });
        });

        it('user should be able to get specific personal recipe', function (done) {
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    request(url)
                        .get("/recipes/" + privateRecipeOfSharedUser._id)
                        .set('Authorization', `JWT ${res.body.token}`)
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            assert.equal(200, res.status);
                            assert(res.body._id == privateRecipeOfSharedUser._id);
                            done();
                        });
                });
        });

        it('user should be able to create and delete recipes', function (done) {
            // generate some recipe
            var recipe = {
                title: "new recipe",
                isPublic: "false",
            }

            // sign in the shared user
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    var token = res.body.token;
                    request(url)
                        .post("/recipes")
                        .field('recipe', JSON.stringify(recipe))
                        .set('Authorization', `JWT ${token}`)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            assert.equal(200, res.status);
                            assert.ok(res.body._id);
                            assert.ok(res.body.title);
                            assert.ok(typeof (res.body.isPublic) != 'undefined');

                            // delete the recipe we just created
                            request(url)
                                .del("/recipes/" + res.body._id)
                                .set('Authorization', `JWT ${token}`)
                                .end(function (err, res) {
                                    if (err) {
                                        throw err;
                                    }
                                    // make sure we get status 204. nothing else is returned
                                    assert.equal(204, res.status);
                                    done();
                                });
                        });
                });
        });

        it('user should be able to create recipes with images', function (done) {
            // generate some recipe
            var recipe = {
                title: "new recipe",
                isPublic: "false",
            }

            // sign in the shared user
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    var token = res.body.token;

                    var testsDir = path.resolve("tests");
                    var testImagePath = path.join(testsDir, "test.png");

                    request(url)
                        .post("/recipes")
                        .field('recipe', JSON.stringify(recipe))
                        .attach("image", testImagePath)
                        .set('Authorization', `JWT ${token}`)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            assert.equal(200, res.status);
                            assert.ok(res.body._id);
                            assert.ok(res.body.title);
                            assert.ok(res.body.image);
                            assert.ok(typeof (res.body.isPublic) != 'undefined');
                            done();
                        });
                });
        });

        it('user should be able to update recipes', function (done) {
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    var token = res.body.token;

                    // get all recipes
                    request(url)
                        .get("/recipes?user=current")
                        .set('Authorization', `JWT ${token}`)
                        .end(function (err, res) {

                            // find the sharedUserrecipe which we know already exists
                            var idx = _.findIndex(res.body, function (recipe) {
                                return recipe._id == privateRecipeOfSharedUser._id;
                            });

                            // modify the recipe returned from the server
                            var returnedRecipe = res.body[idx];
                            var recipe = {
                                _id: returnedRecipe._id,
                                title: "modified",
                                isPublic: returnedRecipe.isPublic.toString()
                            }

                            // send the modified recipe back to the server
                            request(url)
                                .put("/recipes/" + recipe._id)
                                .field('recipe', JSON.stringify(recipe))
                                .set('Authorization', `JWT ${token}`)
                                .end(function (err, res) {
                                    assert.equal(204, res.status);
                                    done();
                                });
                        });
                });
        });

        it('user should not be able to delete personal recipe of another user', function (done) {
            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    request(url)
                        .del("/recipes/" + privateRecipeOfOtherUser._id)
                        .set('Authorization', `JWT ${res.body.token}`)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            assert(res.status == 401)
                            done();
                        });
                });
        });

        it('user should not be able to update personal recipe of another user', function (done) {
            var modifiedRecipe = utils.clone(privateRecipeOfOtherUser);
            modifiedRecipe.title = "modified";
            modifiedRecipe.isPublic = "true";

            request(url)
                .post('/signin')
                .send(sharedUser)
                .end(function (err, res) {
                    request(url)
                        .put("/recipes/" + privateRecipeOfOtherUser._id)
                        .field('recipe', JSON.stringify(modifiedRecipe))
                        .set('Authorization', `JWT ${res.body.token}`)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            assert(res.status == 401)
                            done();
                        });
                });
        });
    });
});