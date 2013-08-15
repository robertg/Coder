var soap = require('soap'),
    compiler = require('../compiler');

//For debugging purposes, provides a recursive deep log via console.log.
function deepLog(obj) {
    if (obj)
        for (var key in obj) {
            if (typeof obj[key] == "object")
                deepLog(obj[key]);
            else if (typeof obj[key] != "function")
                console.log(obj[key])
        }

    return;
}


function IdeOneCompiler() {
    this.soapURL = 'http://ideone.com/api/1/service.wsdl';

    soap.createClient(this.soapURL, function (err, client) {
        this.service = new IdeOneService(client);
    })
}

IdeOneCompiler.prototype = new compiler.Compiler();

IdeOneCompiler.prototype.SupportedLanguages = function () {

}

///
// SubmissionStatus: Represents an object containing the current state of the submission.
///
function SubmissionStatus(status, result) {
    this.Status = status;
    this.Result = result;
}

///
// SubmissionDetails: Represents the submission details.
///
function SubmissionDetails(status, result, date, memory, input, output, compilerInfo) {
    this.Status = status;
    this.Result = result;
    this.Date = date;
    this.Memory = memory;
    this.Input = input;
    this.Output = output;
    this.CompilerInfo = compilerInfo;
}
///
// Create a wrapper for the IdeOne WDSL Client.
///
function IdeOneService(client) {
    this.client = client;

    //Default Beta Credentials:
    this.devCredentials = {User: 'coderdev', Pass: 'dev_pass'};
    this.createSubmissionEnum = {Error: 0, Link: 1};

    this.getSubmissionStatusEnum = {Error: 0, Status: 1, Result: 2};
    this.statusEnum = {WAIT: -1, DONE: 0 };
    this.resultEnum = {NOT_RUNNING: 0, COMPILE_ERR: 11, RUNTIME_ERR: 12, TIMEOUT: 13, SUCCESS: 15, MEMORY_OUT: 17, ILLEGAL_CALL_ERR: 19, INTERNAL_ERR: 20 };

    this.getSubmissionDetailEnum =
    {
        Error: 0, LangId: 1, LangName: 2, LangVersion: 3, Time: 4, Date: 5, Status: 6, Result: 7, Memory: 8, Signal: 9,
        Public: 10, Input: 11, Output: 12, CompilerInfo: 13
    };

    this.getLanguagesEnum = {Error: 0, Languages: 1};
}

///
// createSubmission(): returns a link to a Submission. An example output:
// Output:
// mVbN3S
///
IdeOneService.prototype.createSubmission = function (language, sourceCode, input) {
    var service = this;
    service.client.createSubmission(
        {user: service.devCredentials.User, pass: service.devCredentials.Pass,
            sourceCode: sourceCode, language: language.langKey, run: true, private: true   },
        function (err, result) {
            if (err) console.log(err);

            return result.return.item[service.createSubmissionEnum.Link].value;
        }
    );
}

///
// getSubmissionStatus: returns a SubmissionStatus object, with a Status & ResultID:
///
IdeOneService.prototype.getSubmissionStatus = function (link) {
    var service = this;

    service.client.getSubmissionStatus({user: service.devCredentials.User, pass: service.devCredentials.Pass,
            link: link},
        function (err, result) {
            if (err) console.log(err);
            //Default values for both:
            var SubStatus = service.statusEnum.WAIT,
                SubResult = service.resultEnum.NOT_RUNNING;
            //Let's set the current status from the IdeOne API:
            switch (parseInt(result.return.item[service.getSubmissionStatusEnum.Status].value)) {
                case 0:
                    SubStatus = service.statusEnum.DONE;
                    break;
                default:
                    SubStatus = service.statusEnum.WAIT;
            }

            //Let's set the current result from the IdeOne API:
            SubResult = parseInt(result.return.item[service.getSubmissionStatusEnum.Result].value);

            return new SubmissionStatus(SubStatus, SubResult);
        }
    );
}

///
// getSubmissionDetails(): returns a SubmissionDetails object:
///
IdeOneService.prototype.getSubmissionDetails = function (link) {
    var service = this;


    this.client.getSubmissionDetails({user: service.devCredentials.User, pass: service.devCredentials.Pass,
            link: link, withInput: true, withOutput: true, withCmpinfo: true },
        function (err, result) {
            //Handle Status & Result:
            var SubStatus = service.statusEnum.WAIT,
                SubResult = service.resultEnum.NOT_RUNNING,
                SubDate = result.return.item[service.getSubmissionDetailEnum.Date].value,
                SubMemory = result.return.item[service.getSubmissionDetailEnum.Memory].value,
                SubInput = result.return.item[service.getSubmissionDetailEnum.Input].value,
                SubOutput = result.return.item[service.getSubmissionDetailEnum.Output].value,
                SubCompilerInfo = result.return.item[service.getSubmissionDetailEnum.CompilerInfo].value;
            //Let's set the current status from the IdeOne API:
            switch (parseInt(result.return.item[service.getSubmissionStatusEnum.Status].value)) {
                case 0:
                    SubStatus = service.statusEnum.DONE;
                    break;
                default:
                    SubStatus = service.statusEnum.WAIT;
            }

            //Let's set the current result from the IdeOne API:
            SubResult = parseInt(result.return.item[service.getSubmissionDetailEnum.Result].value);
            console.log(new SubmissionDetails(SubStatus, SubResult, SubDate, SubMemory, SubInput, SubOutput, SubCompilerInfo));
            return new SubmissionDetails(SubStatus, SubResult, SubDate, SubMemory, SubInput, SubOutput, SubCompilerInfo);
        }
    );
}

///
// getLanguages: Returns an array of supported languages. An example output:
// Output:
//[ { key: '7', value: 'Ada (gnat-4.6)' },
//  { key: '13', value: 'Assembler (nasm-2.10.01)' },...
// ]
///
IdeOneService.prototype.getLanguages = function () {
    //Make this scope explicit, so it won't be confused.
    var service = this;
    service.client.getLanguages({user: service.devCredentials.User, pass: service.devCredentials.Pass}, function (err, result) {
        if (err) console.log(err);

        //The array of Languages:
        return result.return.item[service.getLanguagesEnum.Languages].value.item;
    });
}

module.exports = IdeOneCompiler;


//Unused Code, for possible reuse:
/*
 switch () {
 case 0:
 SubResult = service.resultEnum.NOT_RUNNING;
 break;
 case 11:
 SubResult = service.resultEnum.COMPILE_ERR;
 break;
 case 12:
 SubResult = service.resultEnum.RUNTIME_ERR;
 break;
 case 13:
 SubResult = service.resultEnum.TIMEOUT;
 break;
 case 15:
 SubResult = service.resultEnum.SUCCESS;
 break;
 case 17:
 SubResult = service.resultEnum.MEMORY_OUT;
 break;
 case 19:
 SubResult = service.resultEnum.ILLEGAL_CALL_ERR;
 break;
 case 20:
 SubResult = service.resultEnum.INTERNAL_ERR;
 break;
 }
 */