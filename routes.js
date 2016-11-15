var router = require('express').Router();

var usersController = require('./controllers/users');
var recipesController = require('./controllers/recipes');
var authController = require('./controllers/auth');

router.route('/')
    .get(function (req, res) {
        res.end("Hello authenticated dude!");
    });

router.route('/recipes')
    .post(authController.isAuthenticated, recipesController.postRecipe)
    .get(authController.isAuthenticated, recipesController.getRecipes);

router.route('/recipes/:recipe_id')
    .get(authController.isAuthenticated, recipesController.getRecipe)
    .put(authController.isAuthenticated, recipesController.putRecipe)
    .delete(authController.isAuthenticated, recipesController.deleteRecipe);

// Create endpoint handlers for /users
router.route('/users')
    .post(usersController.postUsers)
    .get(usersController.getUsers);

module.exports = router;