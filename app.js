var http = require('http'),
    express = require('express'),
    routes = require('./routes'),
    angular = require('angular');

var app = express();

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs' );
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});


//All routes:
require('./routes/index')(app);


app.listen(process.env.VMC_APP_PORT || 1337, null);