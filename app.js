var http = require('http'),
    express = require('express'),
    routes = require('./routes'),
    angular = require('angular'),
    compiler = require('./service/compiler/compiler'),
    api = require('./routes/api'),
    mongoose = require('mongoose'),
    dbschema = require('./models/dbschema'),
    mistdatabase = require('./service/db/db'),
    DI = require('dependency-injector');

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


//Dependencies:
var db = new mistdatabase();

//Prepare the Direct Injector:
var injector = new DI();
injector.register(
    {
        mistdatabase: db,
        bcrypt: require('bcrypt'),
        statuscode: require('./service/constants/statuscode'),
        ideone: require('./service/compiler/IdeOne/ideone'),
        constants: require('./service/constants/constants')
    }
);


//Routes:
//* - Route all to index.
app.get('*', routes.index);
//API:

//Hub-Related Retrievals:
app.get('/api/questions', injector.inject(api.questions).call());
app.get('/api/projects', injector.inject(api.projects).call());

//Compiler-Related Actions
//Note -> api.check is a middleware function that checks if the user is logged in.
app.post('/api/submit', api.check, injector.inject(api.submit).call());
app.get('/api/status/:compileID', api.check, injector.inject(api.status).call());

//Project-Related Actions
app.post('/api/begin/:questionID', api.check, injector.inject(api.begin).call());
app.get('/api/project/:projectID/open', api.check, injector.inject(api.open).call());
app.put('/api/project/:projectID/save', api.check, injector.inject(api.save).call());

//Account Management:
app.post('/api/login', injector.inject(api.login).call());
app.post('/api/register', injector.inject(api.register).call());

app.listen(process.env.VMC_APP_PORT || 1337, null);