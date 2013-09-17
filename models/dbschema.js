var mongoose = require('mongoose');

///
// Database Schema definitions: All in one file because of dependencies.
// Note: Database models do not need to be redefined: Mongoose handles that.
///

var Case = mongoose.Schema({input: {type: String}, output: {type: String}});

var Challenge = mongoose.Schema(
    {
        title: {type: String, default: ""},
        shortdesc: {type: String, default: ""},
        fulldesc: {type: String, default: ""},
        samplecases: [Case],
        testcases: [Case],
        timegiven: {type: Number, default: 3600}, //Default is one hour.
        difficulty: {type: String, default: 'Novice', enum: ['Novice', 'Intermediate', 'Master', 'Ninja']},
        userscompleted: {type: Number, default: 0 },
        usersfailed: {type: Number, default: 0},
        challengeid: {type: Number, default: 0},
        completionvalue: {type: Number, default: 0}
    }
);

var Project = mongoose.Schema(
    {
        challenge: { type: Object, ref: "Challenge" },
        projectid: {type: Number, default: 0},
        timeremaining: {type: Number, default: 0},
        sourcecode: {type: String, default: ""},
        language: {type: Number, default: 1} //Represents the preferred programming language.
    }
);

var Member = mongoose.Schema(
    {
        username: {type: String, default: ""},
        password: {type: String, default: ""},
        email: {type: String, default: ""},
        verified: {type: Boolean, default: false},
        joined: {type: Date, default: Date.now},
        challengescomplete: [Number], //An array containing all id's of completed challenges.
        projects: [Project]
         });


///
// CheckPassword(): Sees if a user has actually logged in.
///
Member.methods.CheckPassword = function (bcrypt, inputpassword, callback) {
    bcrypt.compare(inputpassword, this.password, function (err, isMatch) {
        callback(err, isMatch);
    });
}

///
// GetClientJSON(statuscode, options): Returns a JSON string with a response JSON structure.
// statuscode: The status of the client.
// options: An object containing options. If this is not null, then a structure in the form of a
// response is sent. client => client, options => the actual options.
//
///
Member.methods.GetClientJSON = function (statuscode, options) {
    var objToJSON = {
        status: statuscode,
        username: this.username,
        joined: this.joined,
        verified: this.verified,
        challengescomplete: this.challengescomplete,
        email: this.email,
        projects: this.projects,
        language: this.language
    };

    //This client should get send with no options:
    if (options == null) {
        return JSON.stringify(objToJSON);
    }

    var objToReturn = {
        client: objToJSON,
        options: options
    }

    return JSON.stringify(objToReturn);
}


module.exports.Member = Member;
module.exports.Challenge = Challenge;