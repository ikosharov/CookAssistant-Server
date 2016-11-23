var assert = require('assert');
var request = require('supertest');
var _ = require('lodash');

describe('Routes', function () {
    var url = 'http://localhost:3000';

    // function to generate random usernames
    var generateRandomString = function () {
        var randomNumStr = Math.random().toString();
        return randomNumStr.substr(randomNumStr.indexOf(".") + 1);
    }

    // users that will be reused between tests
    var sharedUser = {
        username: "common" + generateRandomString(),
        password: "commonPassword"
    };

    var otherUser = {
        username: "other" + generateRandomString(),
        password: "password"
    };

    // recipes that will be reused between tests
    var privateRecipeOfSharedUser = {
        title: "potatoes",
        public: "false"
    };

    var publicRecipeOfSharedUser = {
        title: "potatoes",
        public: "true"
    };

    var privateRecipeOfOtherUser = {
        title: "potatoes",
        public: "false"
    };

    var publicRecipeOfOtherUser = {
        title: "potatoes",
        public: "true"
    };

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
                        .post("/recipes/personal")
                        .set('Authorization', 'JWT ' + token)
                        .send(privateRecipeOfSharedUser)
                        .end(function (err, res) {
                            if (err) reject();
                            privateRecipeOfSharedUser._id = res.body._id;

                            request(url)
                                .post("/recipes/personal")
                                .set('Authorization', 'JWT ' + token)
                                .send(publicRecipeOfSharedUser)
                                .end(function (err, res) {
                                    if (err) reject();
                                    publicRecipeOfSharedUser._id = res.body._id;
                                    resolve();
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
                        .post("/recipes/personal")
                        .set('Authorization', 'JWT ' + token)
                        .send(privateRecipeOfOtherUser)
                        .end(function (err, res) {
                            if (err) reject();
                            privateRecipeOfOtherUser._id = res.body._id;

                            request(url)
                                .post("/recipes/personal")
                                .set('Authorization', 'JWT ' + token)
                                .send(publicRecipeOfOtherUser)
                                .end(function (err, res) {
                                    if (err) reject();
                                    publicRecipeOfOtherUser._id = res.body._id;
                                    resolve();
                                });
                        });
                });
        });

        Promise.all([p1, p2]).then(function () {
            // ready to run tests
            done();
        });

    });

    describe('root route', function () {
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

    // describe('users controller', function () {
    //     it('should be able to sign up users', function (done) {
    //         // generate random user
    //         var credentials = {
    //             username: 'user' + generateRandomString(),
    //             password: 'password1'
    //         }

    //         // register the user
    //         request(url)
    //             .post('/signup')
    //             .send(credentials)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     throw err;
    //                 }

    //                 // check you get status 200 and an access token
    //                 assert.equal(200, res.status);
    //                 assert(res.body.token);
    //                 done();
    //             });
    //     });

    //     it('should be able to sign in users', function (done) {
    //         // sign in the shared user
    //         request(url)
    //             .post('/signin')
    //             .send(sharedUser)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     throw err;
    //                 }

    //                 // make sure you get status 200 and an access token
    //                 assert.equal(200, res.status);
    //                 assert(res.body.token);
    //                 done();
    //             });
    //     });

    //     it('should not be able to overwrite users', function (done) {
    //         // try to register the already registered shared user
    //         request(url)
    //             .post('/signup')
    //             .send(sharedUser)
    //             .end(function (err, res) {
    //                 assert(!res.body.token);
    //                 done();
    //             });
    //     })
    // });

    // describe("recipes controller", function() {
    //     it('should be able to get recipes', function(done) {
    //         // sign in the shared user
    //         request(url)
    //             .post('/signin')
    //             .send(sharedUser)
    //             .end(function(err, res) {
    //                 request(url)
    //                     .get("/recipes/personal")
    //                     .set('Authorization', `JWT ${res.body.token}`)
    //                     .expect('Content-Type', /json/)
    //                     .end(function(err, res) {
    //                         if (err) {
    //                             throw err;
    //                         }

    //                         // make sure you get status 200 + an array of recipes, one of which is the sharedUserrecipe
    //                         assert.equal(200, res.status);
    //                         assert.equal(true, Array.isArray(res.body));

    //                         var idx = _.findIndex(res.body, function(recipe) {
    //                             return recipe._id == recipeOfSharedUser._id;
    //                         });
    //                         assert.ok(idx != -1);
    //                         done();
    //                     });
    //             });
    //     });

    //     it('should be able to create and delete recipes', function(done) {
    //         // generate some recipe
    //         var recipe = {
    //             title: "temp task",
    //             dueDate: new Date(),
    //             isDone: false
    //         }

    //         // sign in the shared user
    //         request(url)
    //             .post('/signin')
    //             .send(sharedUser)
    //             .end(function(err, res) {
    //                 var token = res.body.token;
    //                 request(url)
    //                     .post("/recipes/personal")
    //                     .send(recipe)
    //                     .set('Authorization', `JWT ${res.body.token}`)
    //                     .end(function(err, res) {
    //                         if (err) {
    //                             throw err;
    //                         }

    //                         // make sure you get status 200 and the recipe you just created 
    //                         // make sure it now has _id property
    //                         assert.equal(200, res.status);
    //                         assert.ok(res.body._id);
    //                         assert.ok(res.body.title);
    //                         assert.ok(res.body.dueDate);
    //                         assert.ok(res.body.isDone != null);

    //                         // delete the recipe we just created
    //                         request(url)
    //                             .del("/recipes/personal/" + res.body._id)
    //                             .set('Authorization', `JWT ${token}`)
    //                             .end(function(err, res) {
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

    //     it('should be able to update recipes', function(done) {
    //         // sign in the shared user
    //         request(url)
    //             .post('/signin')
    //             .send(sharedUser)
    //             .end(function(err, res) {
    //                 var token = res.body.token;

    //                 // get all recipes
    //                 request(url)
    //                     .get("/recipes/personal")
    //                     .set('Authorization', `JWT ${token}`)
    //                     .end(function(err, res) {

    //                         // find the sharedUserrecipe which we know already exists
    //                         var idx = _.findIndex(res.body, function(recipe) {
    //                             return recipe._id == recipeOfSharedUser._id;
    //                         });

    //                         // modify the recipe returned from the server
    //                         var recipe = res.body[idx];
    //                         recipe.title = "modified";

    //                         // send the modified recipe back to the server
    //                         request(url)
    //                             .put("/recipes/personal/" + recipe._id)
    //                             .set('Authorization', `JWT ${token}`)
    //                             .end(function(err, res) {
    //                                 assert.equal(200, res.status);
    //                                 done();
    //                             });
    //                     });
    //             });
    //     });
    // });
});