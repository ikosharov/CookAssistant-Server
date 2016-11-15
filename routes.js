var router = require('express').Router();

var usersController = require('./controllers/users');
var beersController = require('./controllers/beers');
var authController = require('./controllers/auth');

router.route('/greeting')
    .get(authController.isAuthenticated, function(req, res) {
        res.end("Hello authenticated dude!");
    });

router.route('/beers')
  .post(authController.isAuthenticated, beersController.postBeers)
  .get(authController.isAuthenticated, beersController.getBeers);

// Create endpoint handlers for /beers/:beer_id
router.route('/beers/:beer_id')
  .get(authController.isAuthenticated, beersController.getBeer)
  .put(authController.isAuthenticated, beersController.putBeer)
  .delete(authController.isAuthenticated, beersController.deleteBeer);

// Create endpoint handlers for /users
router.route('/users')
    .post(usersController.postUsers)
    .get(usersController.getUsers);

module.exports = router;