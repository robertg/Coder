///
// PUT: /api/questions - Retrieves questions specific to the user account, and query body parameters.
///
module.exports = function (statuscode, mistdatabase) {
    return function (req, res) {
        mistdatabase.ReadAll('Challenge', function(err, data) {
            if(err) console.log(err);
            else {
                res.writeHead(200, {"Content-Type" : "application/json"});
                res.write(JSON.stringify(data));
                res.send();
            }
        });
    }
}