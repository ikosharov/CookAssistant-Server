var assert = require('assert');
var request = require('supertest');
var base64 = require('base-64');
var _ = require('lodash');

describe('routes', function () {
    var url = "http://localhost:3000";

    // function to generate random usernames
    var generateRandomString = function () {
        var randomNumStr = Math.random().toString();
        return randomNumStr.substr(randomNumStr.indexOf(".") + 1);
    }

    // a shared user between tests
    var sharedUser = {
        username: "common" + generateRandomString(),
        password: "commonPassword"
    };

    var sharedUserEncodedCredentials = base64.encode(sharedUser.username + ":" + sharedUser.password);

    // recipe for the shared user. It will be created and then reused accross tests
    var recipeOfSharedUser = {
        title: "chushki"
    };

    before(function (done) {
        // create the shared user
        request(url)
            .post('/users')
            .send(sharedUser)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                assert.equal(200, res.status);

                // create the recipe of the shared user
                request(url)
                    .post("/recipes")
                    .set('Authorization', "Basic " + sharedUserEncodedCredentials)
                    .send(recipeOfSharedUser)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

                        recipeOfSharedUser._id = res.body._id;
                        // now we're ready to run the tests
                        done();
                    });
            });
    });

    describe('root route', function () {
        it('should reply with hello message', function (done) {
            request(url)
                .get('/')
                .end(function (err, res) {
                    assert.equal(200, res.status);
                    assert.equal('Hello authenticated dude!', res.text);
                    done();
                });
        });
    });

    describe('users controller', function () {
        it('should be able to register users', function (done) {
            // generate random user
            var credentials = {
                username: 'user' + generateRandomString(),
                password: 'password1'
            }

            // register the user
            request(url)
                .post('/users')
                .send(credentials)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    // check you get status 200 and an access token
                    assert.equal(200, res.status);
                    done();
                });
        });
    });

    describe("recipes controller", function () {
        it('should be able to get recipes', function (done) {
            request(url)
                .get("/recipes")
                .set('Authorization', "Basic " + sharedUserEncodedCredentials)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    // make sure you get status 200 + an array of recipes, one of which is the recipeOfSharedUser 
                    assert.equal(200, res.status);
                    assert.equal(true, Array.isArray(res.body));

                    var idx = _.findIndex(res.body, function (recipe) {
                        return recipe._id == recipeOfSharedUser._id;
                    });
                    assert.ok(idx != -1);
                    done();
                });
        });

        it('should be able to create and delete recipes', function (done) {
            var tempRecipe = {
                title: "temp recipe",
            }

            request(url)
                .post("/recipes")
                .set('Authorization', "Basic " + sharedUserEncodedCredentials)
                .send(tempRecipe)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    // make sure you get status 200 and the recipe you just created 
                    // make sure it now has _id property
                    assert.equal(200, res.status);
                    assert.ok(res.body._id);
                    assert.ok(res.body.title);

                    // delete the recipe we just created
                    request(url)
                        .del("/recipes/" + res.body._id)
                        .set('Authorization', "Basic " + sharedUserEncodedCredentials)
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

        it('should be able to update recipes', function (done) {
            request(url)
                .get('/recipes')
                .set('Authorization', "Basic " + sharedUserEncodedCredentials)
                .end(function (err, res) {

                    // find the recipeOfSharedUser which we know already exists
                    var idx = _.findIndex(res.body, function (recipe) {
                        return recipe._id == recipeOfSharedUser._id;
                    });

                    // modify the recipe
                    var recipe = res.body[idx];
                    recipe.title = "modified";

                    // send the modified recipes back to the server
                    request(url)
                        .put("/recipes/" + recipe._id)
                        .set('Authorization', "Basic " + sharedUserEncodedCredentials)
                        .end(function (err, res) {
                            assert.equal(200, res.status);
                            done();
                        });
                });
        });
    });
});