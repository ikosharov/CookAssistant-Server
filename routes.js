var router = require('express').Router();

var welcomeController = require('./controllers/welcome');
var usersController = require('./controllers/users');
var recipesController = require('./controllers/recipes');
var authController = require('./controllers/auth');

router.route('/')
    .get(welcomeController.greet);

router.route('/signup')
    .post(usersController.signUp);

router.route('/signin')
    .post(usersController.signIn);

router.route('/userInfo')
    .get(authController.isAuthenticated, usersController.userInfo);

router.route('/recipes')
    .get(authController.isAuthenticated, recipesController.getRecipes)
    .post(authController.isAuthenticated, recipesController.postRecipe);

router.route('/recipes/:recipe_id')
    .get(authController.isAuthenticated, recipesController.getRecipe)
    .put(authController.isAuthenticated, recipesController.putRecipe)
    .delete(authController.isAuthenticated, recipesController.deleteRecipe);

module.exports = router;