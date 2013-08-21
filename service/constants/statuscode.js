///
// Represents all possible response codes the API can output.
///
module.exports = {
    AUTHORIZED: "AUTH_OK",
    UNAUTHORIZED: "AUTH_BAD",
    USER_EXISTS: "USER_EXISTS",
    USER_CREATED: "USER_CREATED",
    EMAIL_EXISTS: "EMAIL_EXISTS",
    BAD_PASSWORD: "BAD_PASSWORD",
    BAD_USERNAME: "BAD_USERNAME"
}

///
// Respond(): Send out a bad REST response detailing the status update.
///
module.exports.BadResponse = function(res, status) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify({status: status }));
    res.send();
}