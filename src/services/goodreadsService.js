// Service for handling GoodReads API calls
// GoodReads API return XML data, which needs to be parsed to JSON
var http = require('http');
var xml2js = require('xml2js');
var parser = xml2js.Parser({explicitArray: false});

var goodreadsService = function() {

    var getBookById = function(id, cb) {
        var options = {
            host: 'www.goodreads.com',
            path: '/book/show/' + id + '?format=xml&key=xVH2ih15iAI79D2z2DF3YQ'
        };

        // Callback: What to do with the response from goodreads API
        var callback = function(response) {
            var str = '';
            // when data comes back, execute a function which appends the data chunks
            response.on('data', function(chunk) {
                str += chunk;
            });
            // when no data comes and the response ends, parse the collected chunks
            response.on('end', function() {
                console.log(str);
                parser.parseString(str,
                    function(err, result) {
                        // Return book JSON object to the service
                        cb(null, result.GoodreadsResponse.book);
                    });
            });
        };

        http.request(options, callback).end();
    };

    return {
        getBookById: getBookById
    };
};

module.exports = goodreadsService;
