var http = require('http'),
    express = require('express'),
    routes = require('./routes'),
    angular = require('angular'),
    compiler = require('./service/compiler/compiler'),
    api = require('./routes/api'),
    mongoose = require('mongoose'),
    mistdatabase = require('./service/db/db'),
    DI = require('dependency-injector'),
    sessions = require("client-sessions");

var app = express();

app.configure(function () {
    //App requires sessions:
    app.use(sessions({cookieName: 'usersession', secret: 'asdfkjj34l2jupiuiikjasdlfj59995liI'}));
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
//* - Route all GET requests to index.
app.get('*', routes.index);
//API:

//Hub-Related Retrievals (Note, PUT is used instead of GET because of get rerouting by *):
app.put('/api/questions', injector.inject(api.questions).call());
app.put('/api/projects', injector.inject(api.projects).call());

//Compiler-Related Actions
//Note -> api.check is a middleware function that checks if the user is logged in.
app.post('/api/submit', injector.inject(api.check).call(), injector.inject(api.submit).call());
app.put('/api/status/:compileid', injector.inject(api.check).call(), injector.inject(api.status).call());

//Project-Related Actions
app.post('/api/begin/:questionid', injector.inject(api.check).call(), injector.inject(api.begin).call());
app.put('/api/project/:projectid/open', injector.inject(api.check).call(), injector.inject(api.open).call());
app.put('/api/project/:projectid/save', injector.inject(api.check).call(), injector.inject(api.save).call());

//Account Management:
app.post('/api/login', injector.inject(api.login).call());
app.post('/api/register', injector.inject(api.register).call());
app.put('/api/ready', injector.inject(api.ready).call());
app.put('/api/logout', injector.inject(api.logout).call());

app.listen(process.env.VMC_APP_PORT || 1337, null);