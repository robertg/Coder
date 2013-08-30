// POST: /register - Registers into the Mist service.
module.exports = function (statuscode, constants, bcrypt, mistdatabase) {
    return function (req, res) {
        var name = req.body.username.toLowerCase();
        var password = req.body.password;

        //Check Email:
        mistdatabase.Read('Member', {email: req.body.email}, function (err, member) {
            if (member != null) {
                statuscode.BadResponse(res, statuscode.EMAIL_EXISTS);
            } else {
                mistdatabase.Read('Member', {username: name}, function (err, member) {
                    if (err) console.log(err);
                    if (member != null) { //The user already exists:
                        statuscode.BadResponse(res, statuscode.USER_EXISTS);
                    } else {
                        //Filter an invalid password
                        if (!password || password.length < 1) {
                            statuscode.BadResponse(res, statuscode.BAD_PASSWORD);
                        }

                        //Generate a password:
                        bcrypt.genSalt(constants.SALT_WORK_FACTOR, function (err, salt) {
                            if (err) console.log(err);
                            bcrypt.hash(password, salt, function (err, hash) {
                                if (err) console.log(err);

                                var user = mistdatabase.Create('Member', {
                                    username: name,
                                    password: hash,
                                    joined: Date.now(),
                                    projects: [],
                                    challengescomplete: [],
                                    verified: false, //By default, the user can verify later.
                                    email: req.body.email
                                });

                                //Update the username session:
                                req.usersession.username = user.username;

                                res.writeHead(200, {"Content-Type": "application/json"});
                                res.write(user.GetClientJSON(statuscode.USER_CREATED));
                                res.send();
                            });
                        });
                    }
                });
            }
        });


    };
}
///
// POST: /register - Registers into the Mist service.
// Params:
//  username: The username to register.
//  password: the password to encrypt.
//  email: Email that is registered with the account.
//
//  Example Good Response:
//    {
//      "status": "USER_CREATED",
//      "username": "name123",
//      "joined": "2013-08-21T02:39:09.930Z",
//      "verified": false,
//      "challengescomplete": [],
//      "email": "s@hotmail.com",
//      "projects": []
//    }
//
//  Example Bad Response:
//  {
//     "status": "EMAIL_EXISTS"
//  }
///