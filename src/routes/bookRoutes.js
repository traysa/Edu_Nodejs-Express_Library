var express = require('express');
var bookRouter = express.Router();

var router = function(nav) {
    // Book service, which is calling the goodreads API service
    var bookService =
        require('../services/goodreadsService')();
    // Book controller, which is handling getting the book data and deliver it in a JSON
    var bookController =
        require('../controllers/bookController')(bookService, nav);

    // Securing multiple routes
    // In order to not allow user to access books when he is not logged in, add
    // middleware to entire bookRouter
    bookRouter.use(bookController.middleware);

    bookRouter.route('/')
        .get(bookController.getIndex);

    bookRouter.route('/:id') // with :id anything behind the slash is given as a request parameter called 'id'
        .get(bookController.getById);

    return bookRouter;
};

module.exports = router;
