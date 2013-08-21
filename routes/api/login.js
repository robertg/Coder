// POST: /login - Logins into the Mist service.
module.exports = function (statuscode, mistdatabase, bcrypt) {
    return function (req, res) {

        mistdatabase.Read('Member', {username: req.body.username}, function (err, instance) {
            if (instance == null) {
                statuscode.BadResponse(res, statuscode.BAD_USERNAME);
            } else {
                instance.CheckPassword(bcrypt, req.body.password, function (err, isMatch) {
                    if (isMatch) {
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.write(instance.GetClientJSON(statuscode.AUTHORIZED));
                        res.send();
                    } else {
                        statuscode.BadResponse(res, statuscode.UNAUTHORIZED);
                    }
                });
            }
        });
    }
}

///
// POST: /login - Logins into the Mist service.
//
// Params:
// username, password
//
//  Example Good Response:
//  {
//    "status": "AUTH_OK",
//    "username": "rgawdzik2",
//    "joined": "2013-08-21T03:27:45.424Z",
//    "verified": false,
//    "challengescomplete": [],
//    "email": "rgawdzik2@hotmail.com",
//    "projects": []
/   }
//
//  Example Bad Response:
//  {
//    "status": "AUTH_BAD"
//  }
///