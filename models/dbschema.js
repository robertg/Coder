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
        challenge: { type: mongoose.Schema.ObjectId, ref: "Challenge" },
        timeremaining: {type: Number, default: 0},
        sourcecode: {type: String, default: ""}
    }
);

var Member = mongoose.Schema(
    {
        username: {type: String, default: ""},
        password: {type: String, default: ""},
        email: {type: String, default: ""},
        verified: {type: Boolean, default: false},
        joined: {type: Date, default: Date.now},
        challengescomplete: [Number],
        projects: [Project]
    });


///
// CheckPassword(): Sees if a user has actually logged in.
///
Member.methods.CheckPassword = function(bcrypt, inputpassword) {
    bcrypt.compare(inputpassword, this.password, function(err, isMatch) {
       if(err) console.log(err);
        return isMatch;
    });
}

module.exports.Member = Member;
module.exports.Challenge = Challenge;