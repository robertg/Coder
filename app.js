var http = require('http'),
    express = require('express'),
    routes = require('./routes'),
    angular = require('angular'),
    compiler = require('./service/compiler/compiler'),
    ideone = require('./service/compiler/IdeOne/ideone'),
    api = require('./routes/api');

var app = express();



app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    //App first uses static files, then the router.
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});


//Routes:
//Route all to index.
app.get('*', routes.index);
//API:

//Hub-Related Retrievals:
app.get('/api/questions', api.questions);
app.get('/api/projects', api.projects);

//Compiler-Related Actions
app.put('/api/submit', api.submit);
app.get('/api/status/:compileID', api.status);

//Project-Related Actions
app.put('/api/begin/:questionID', api.begin);
app.get('/api/project/:projectID/open', api.open);
app.post('/api/project/:projectID/save', api.save);

app.listen(process.env.VMC_APP_PORT || 1337, null);

var test = ideone();
