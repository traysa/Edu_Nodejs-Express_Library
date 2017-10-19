var express = require('express');

var authorRouter = express.Router();

var router = function(nav) {
    var authors = [
        {
            name: 'Ofelia',
            birthday: '10.10.1956'
        },
        {
            name: 'Madsen',
            birthday: '19.07.1972'
        }
    ];

    authorRouter.route('/')
        .get(function(req, res) {
            res.render('authorListView',{
                title: 'Authors',
                nav: nav,
                authors: authors
            });
        });

    authorRouter.route('/:id')
        .get(function(req, res) {
            var id = req.params.id;
            res.render('authorView',{
                title: 'Author',
                nav: nav,
                author: authors[id]
            });
        });

    return authorRouter;
};

module.exports = router;
