///
// POST: /login - Logins into the Mist service.
//
// Params:
// username, password
///
module.exports = function (statuscode, mistdatabase, bcrypt) {
    return function (req, res) {
        //The user is already logged in:
        if (req.session.usercredentials) {
            res.send(statuscode.AUTHORIZED);
        }
        //Attempt a login:
        else {
            var member = mistdatabase.Read('Member', {username: req.body.username});
            if(member.CheckPassword(bcrypt, req.body.password)) {
                res.send(statuscode.AUTHORIZED);
            } else {
                res.send(statuscode.UNAUTHORIZED);
            }
        }
    }
}