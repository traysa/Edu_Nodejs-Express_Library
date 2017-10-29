var express = require('express');
var authorRouter = express.Router();

var router = function(nav) {
    var authorController = require('../controllers/authorController')(null, nav);

    // Securing multiple routes
    // In order to not allow user to access authors when he is not logged in, add
    // middleware to entire authorRouter
    authorRouter.use(authorController.middleware);

    authorRouter.route('/')
        .get(authorController.getIndex);

    authorRouter.route('/:id')
        .get(authorController.getById);

    return authorRouter;
};

module.exports = router;
