///
// GET: /api/questions - Retrieves questions specific to the user account, and query body parameters.
///
module.exports.questions = function(req, res) {

}
///
// GET: /api/projects - Retrieves projects under the user account.
///
module.exports.projects = function(req, res) {

}

///
// PUT: /api/begin/:questionID - Creates a new project under the account, with a question specified in the url.
///
module.exports.begin = function(res, req) {
    //res.params.questionID
}

///
// PUT: api/submit - Submit code for compilation. Returns an id.
///
module.exports.submit = function(res, req) {

}

///
// PUT: api/submit - Submit code for compilation. Returns an id.
///
module.exports.submit = function (req, res) {

};

///
// api/status/:compileID - Retrieve the status of the submitted code, via id.
///
module.exports.status = function (req, res) {
    //req.params.compileID
}

///
//GET: /api/project/:projectID/open - Opens a project.
module.exports.open = function(req, res) {
    //req.params.projectID
}

///
// /api/project/:projectID/save - Saves the code under the users account.
///
module.exports.save = function(req, res) {
   //req.params.projectID
}
