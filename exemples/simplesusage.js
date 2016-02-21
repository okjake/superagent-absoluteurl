var request = require('superagent'),
    absoluteurl = require('../index.js');

request.get('https://www.npmjs.com')
.end(function(err, res){
    res = absoluteurl(res, true);
    // Do something
});