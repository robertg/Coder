///
// PUT: /register - Registers into the Mist service.
///
module.exports = function(statuscode, bcrypt, mistdatabase) {
    return function (req, res) {
        mistdatabase.Read('Member', {username: req.body.username}, function(err, member) {
            if(err) console.log(err);
            if(member != null) { //The user already exists:
                res.send(statuscode.USER_EXISTS);
            } else {
                res.send(statuscode.USER_CREATED);
            }
        });
    };
}