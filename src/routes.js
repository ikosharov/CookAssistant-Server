const router = require('express').Router();

const welcomeController = require('./controllers/welcome');
const usersController = require('./controllers/users');
const recipesController = require('./controllers/recipes');
const ingredientsController = require('./controllers/ingredients');
const stepsController = require('./controllers/steps');
const authController = require('./controllers/auth');
const imagesController = require('./controllers/images')

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

router.route('/images')
  .post(authController.isAuthenticated, imagesController.postImage)

router.route('/images/:image_id')
  .get(imagesController.getImage)

module.exports = router;