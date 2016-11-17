var router = require('express').Router();

var usersController = require('./controllers/users');
var recipesController = require('./controllers/recipes');
var authController = require('./controllers/auth');

router.route('/')
    .get(authController.isAuthenticated, function(req, res) {
        res.end("Hello authenticated dude!");
    });

// router.route('/recipes')
//     .post(authController.isAuthenticated, recipesController.postRecipe)
//     .get(authController.isAuthenticated, recipesController.getRecipes);

// router.route('/recipes/:recipe_id')
//     .get(authController.isAuthenticated, recipesController.getRecipe)
//     .put(authController.isAuthenticated, recipesController.putRecipe)
//     .delete(authController.isAuthenticated, recipesController.deleteRecipe);

router.route('/users/signup')
    .post(usersController.signUp);
router.route('/users/signin')
    .post(usersController.signIn);

module.exports = router;