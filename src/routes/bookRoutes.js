var express = require('express');

var bookRouter = express.Router();

var router = function(nav) {
    var books = [
        {
            title: 'aaa',
            genre: 'aaa',
            author: 'aaa',
            read: false
        },
        {
            title: 'bbb',
            genre: 'bbb',
            author: 'bbb',
            read: false
        },
        {
            title: 'ccc',
            genre: 'ccc',
            author: 'ccc',
            read: false
        }
    ];

    bookRouter.route('/')
        .get(function(req, res) {
            res.render('bookListView', {
                title: 'Books',
                nav: nav,
                books: books
            });
        });

    bookRouter.route('/:id') // with :id anything behind the slash is given as a request parameter called 'id'
        .get(function(req, res) {
            var id = req.params.id; // request parameter 'id' obtained by the route. See above.
            res.render('bookView', {
                title: 'Books',
                nav: nav,
                book: books[id]
            });
        });

    return bookRouter;
};

module.exports = router;
