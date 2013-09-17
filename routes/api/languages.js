///
//PUT: /api/compiler/languages - Retrieves all supported languages:
///
module.exports = function (compiler) {
    return function (req, res) {
        var compilerService = new compiler();
        compilerService.Start(function (err) {
            if (err) console.log(err);
            //Retrieve all languages:
            compilerService.SupportedLanguages(function (err, languages) {
                if (err) console.log(err);

                res.writeHead(200, {"Content-Type": "application/json"});
                res.write(JSON.stringify(languages));
                res.send();

            });
        });
    }
}