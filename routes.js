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

router.route('/currentUser')
    .get(authController.isAuthenticated, usersController.currentUser);

router.route('/recipes/personal')
    .get(authController.isAuthenticated, recipesController.getUserRecipes)
    .post(authController.isAuthenticated, recipesController.postUserRecipe);

router.route('/recipes/personal/:recipe_id')
    .get(authController.isAuthenticated, recipesController.getUserRecipe)
    .put(authController.isAuthenticated, recipesController.putUserRecipe)
    .delete(authController.isAuthenticated, recipesController.deleteUserRecipe);

router.route('/recipes/public')
    .get(authController.isAuthenticated, recipesController.getPublicRecipes);

router.route('/recipes/public/:recipe_id')
    .get(authController.isAuthenticated, recipesController.getPublicRecipe);

module.exports = router;