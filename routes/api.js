///
// GET: /api/questions - Retrieves questions specific to the user account, and query body parameters.
///
module.exports.questions = require('./api/questions');

///
// PUT: /api/projects - Retrieves projects under the user account.
///
//module.exports.projects = require('./api/projects');

///
// PUT: /api/begin/:questionid - Creates a new project under the account, with a question specified in the url.
///
module.exports.begin = require('./api/begin');

///
// POST: /api/project/:projectid/compile - Submit code for compilation. Returns an id.
///
module.exports.submit = require('./api/compile');

///
// PUT: /api/compiler/:compileid/status - Retrieve the status of the submitted code, via id.
///
module.exports.status = require('./api/status');

///
//PUT: /api/project/:projectid/open - Opens a project.
///
module.exports.open = require('./api/open');

///
// POST: /api/project/:projectid/save - Saves the code under the users account.
///
module.exports.save = require('./api/save');

///
// POST: /login - Logins into the Mist service.
///
module.exports.login = require('./api/login');

///
// PUT: /register - Registers into the Mist service.
///
module.exports.register = require('./api/register');

///
// PUT: /api/compiler/languages - Retrieves all supported languages.
///

module.exports.languages = require('./api/languages');

///
// check(): A middleware function that sees if a user is already logged in.
///
module.exports.check = function (statuscode) {
    return function (req, res, next) {
        if (req.usersession.username) {
            next();
        } else {
            statuscode.BadResponse(res, statuscode.UNAUTHORIZED);
        }
    }
}

///
// ready(): An api call that checks to see if the user is already logged in.
///
module.exports.ready = function (statuscode, mistdatabase) {
    return function (req, res) {
        if (req.usersession.username) {
            mistdatabase.Read('Member', {username: req.usersession.username}, function (err, instance) {
                if (instance == null) {
                    statuscode.BadResponse(res, statuscode.BAD_USERNAME);
                } else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.write(instance.GetClientJSON(statuscode.AUTHORIZED));
                    res.send();
                }
            });
        } else {
            statuscode.BadResponse(res, statuscode.UNAUTHORIZED);
        }
    }
}
///
// logout(): An api call that clears the user session.
///
module.exports.logout = function(statuscode) {
    return function(req, res) {
        //Resets the User Session, so another user can log in.
        req.usersession.reset();
        statuscode.BadResponse(res, statuscode.SUCCESS);
    }
}