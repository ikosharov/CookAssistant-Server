var router = require('express').Router();

var welcomeController = require('./controllers/welcome');
var usersController = require('./controllers/users');
var recipesController = require('./controllers/recipes');
var ingredientsController = require('./controllers/ingredients');
var stepsController = require('./controllers/steps');
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

router.route('/recipes/:recipe_id/ingredients')
    .post(authController.isAuthenticated, ingredientsController.postIngredient);

router.route('/recipes/:recipe_id/ingredients/:ingredient_id')
    .put(authController.isAuthenticated, ingredientsController.putIngredient)
    .delete(authController.isAuthenticated, ingredientsController.deleteIngredient);

router.route('/recipes/:recipe_id/steps')
    .post(authController.isAuthenticated, stepsController.postStep);

router.route('/recipes/:recipe_id/steps/:step_id')
    .put(authController.isAuthenticated, stepsController.putStep)
    .delete(authController.isAuthenticated, stepsController.deleteStep);

module.exports = router;