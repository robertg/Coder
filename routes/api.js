///
// GET: /api/questions - Retrieves questions specific to the user account, and query body parameters.
///
module.exports.questions = require('./api/questions');

///
// PUT: /api/projects - Retrieves projects under the user account.
///
module.exports.projects = require('./api/projects');

///
// PUT: /api/begin/:questionID - Creates a new project under the account, with a question specified in the url.
///
module.exports.begin = require('./api/begin');

///
// POST: api/submit - Submit code for compilation. Returns an id.
///
module.exports.submit = require('./api/submit');

///
// PUT: api/status/:compileID - Retrieve the status of the submitted code, via id.
///
module.exports.status = require('./api/status');

///
//PUT: /api/project/:projectID/open - Opens a project.
///
module.exports.open = require('./api/open');

///
// POST: /api/project/:projectID/save - Saves the code under the users account.
///
module.exports.save = require('./api/save');

///
// POST: /login - Logins into the Mist service.
//
///
module.exports.login = require('./api/login');

///
// PUT: /register - Registers into the Mist service.
///
module.exports.register = require('./api/register');

///
// check(): A middleware function that sees if a user is already logged in.
///
module.exports.check = function (req, res, next) {
    if (!req.session.usercredentials) {
        res.send(errorcode.UNAUTHORIZED);
    } else {
        next();
    }
}