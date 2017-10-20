// Express is a minimal and flexible Node.js web application framework that
// provides a robust set of features for web and mobile applications.
var express = require('express'); // A refernce to 'express'

// Create an instance of express
var app = express();

//------------------------------------------------------------------------------
// Static directory
//------------------------------------------------------------------------------

// To not set up routes for all .css and .js files, a static directory is created
// With '.use' middleware can be set up. Express will use this first before
// anything else. So routes are executed afterwards.
// Test if it works by opening 'localhost:3000\css\styles.css'
app.use(express.static('public'));
// app.use('views', './src/views');

//------------------------------------------------------------------------------
// Routing
//------------------------------------------------------------------------------

// Global navigation definition, which will passed to the router files
var nav = [{
        Link: '/Books',
        Text: 'Books'
    }, {
        Link: '/Authors',
        Text: 'Authors'
    }];

// Router files for books and authors and admins
var bookRouter = require('./src/routes/bookRoutes')(nav);
var authorRouter = require('./src/routes/authorRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);

app.use('/Books', bookRouter);
app.use('/Authors', authorRouter);
app.use('/Admin', adminRouter);

// When on Home Route a function should be executed
// Parameters:
// - request 'req' is information from the browsers (e.g. if it is a POST it will
//   be all the body) to figure out what is requested
// - response 'res' is what is going to be dealt with
app.get('/',function(req, res) {
    res.render('index',{
        title: 'Hello from render',
        nav: nav
    });
});

//------------------------------------------------------------------------------
// Define View Engine and View folder
//------------------------------------------------------------------------------
// Setting variable views
app.set('views', './src/views');

// EJS view engine
app.set('view engine', 'ejs');

// Handbars view engine
//var handlebars = require('express-handlebars');
//app.engine('.hbs', handlebars({extname: '.hbs'}));
//app.set('view engine', '.hbs');

// Jade view engine
// app.set('view engine', 'jade');

//------------------------------------------------------------------------------
// Listening
//------------------------------------------------------------------------------

// Use the environment PORT parameter specified in the gulpfile if available
var port = process.env.PORT || 5000;

// Express instance will listen on the given port
// In the callback function a message on the console is given
app.listen(port, function(err) {
    console.log('running server on port ' + port);
});
