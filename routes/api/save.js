///
// POST: /api/project/:projectID/save - Saves the project code under the users account.
///
module.exports = function (statuscode, mistdatabase) {
    return function (req, res) {
        //req.params.projectID
        mistdatabase.Read('Member', {username: req.body.username }, function (err, userdb) {
            //Retrieve the new project:
            var newproject;
            for (var i = 0; i < req.body.projects.length; i++) {
                if (req.params.projectid == req.body.projects[i].projectid) {
                    newproject = req.body.projects[i];
                }
            }
            if (newproject) {
                //Override the old projects with the new project:
                for (var i = 0; i < userdb.projects.length; i++) {
                    if (req.params.projectid == userdb.projects[i].projectid) {
                        userdb.projects[i] = newproject;
                    }
                }
            } else {
                statuscode.BadResponse(statuscode.FAILURE);
            }

            userdb.projects = req.body.projects;

            //Update the user:
            mistdatabase.Update('Member', userdb, function (err) {
                if (err) console.log(err);
                //Let's send out the new user:
                res.writeHead(200, {"Content-Type": "application/json"});
                res.write(userdb.GetClientJSON(statuscode.AUTHORIZED));
                res.send();
            });
        });
    }
}