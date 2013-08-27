// POST: /api/begin/:challengeid - Creates a new project in the user, saves it, and then returns an updated user.
module.exports = function (statuscode, mistdatabase) {
    return function (req, res) {

        mistdatabase.Read('Member', {username: req.body.username }, function (err, userdb) {
            //res.params.questionid
            var projectid = userdb.projects.length + 1; //Each projectID
            //Ensure projectid does not match any old id's.
            var notMatched = true;
            while (notMatched) {
                notMatched = false;
                for (var i = 0; i < userdb.projects.length; i++) {
                    if (userdb.projects.projectid == projectid) {
                        //Hmm, that's not good, we found a match. Let's try that again:
                        projectid++;
                        notMatched = true;
                        break;
                    }
                }
            }
            if (err) console.log(err);
            mistdatabase.Read('Challenge', {challengeid: req.params.questionid}, function (err, challenge) {
                if (err) console.log(err);

                //Push the new project:
                userdb.projects.push(
                    {
                        challenge: challenge,
                        projectid: projectid,
                        timeremaining: challenge.timegiven
                    });

                //Update the user:
                mistdatabase.Update('Member', userdb, function (err) {
                    if(err) console.log(err);
                    //Let's send out the new user:
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.write(userdb.GetClientJSON(statuscode.AUTHORIZED, {projectid: projectid}));
                    res.send();
                });

            });
        });
    }
}

///
// POST: /api/begin/:challengeid - Creates a new project in the user, saves it, and then returns an updated user.
// Params:
// client, :challengeid
//
// Example Response:
//
// { "client":
//   {
//  "client": {
//      "status": "AUTH_OK",
//          "username": "username",
//          "joined": "2013-08-27T03:51:48.146Z",
//          "verified": false,
//          "challengescomplete": [],
//          "email": "username",
//          "projects": [
//          {
//              "challenge": {
//                  "title": "Travel Time",
//                  .
//                  .
//                  .
//              "projectid": 1
//          }....
//      ]
//  },
//  "options": {
//    "projectid": 14
//  }
//}
///