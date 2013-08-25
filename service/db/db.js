var mongoose = require('mongoose'),
    dbschema = require('../../models/dbschema');

///
// MistDatabase(): Represents a Mist database, and all it's properties and encapsulations.
///
function MistDatabase() {
    //Instantiate all properties:
    this.connection = mongoose.connect("mongodb://mist:mist_dev@ds041238.mongolab.com:41238/mist", {auto_reconnect: true});
    this.MemberModel = mongoose.model('Member', dbschema.Member);
    this.ChallengeModel = mongoose.model('Challenge', dbschema.Challenge);

    //Fields Present within the database and schema:
    this.MemberFields = [
        'username',
        'password',
        'email',
        'verified',
        'joined',
        'challengescomplete',
        'projects'
    ];
    this.ChallengeFields = [
        'title',
        'shortdesc',
        'fulldesc',
        'samplecases',
        'testcases',
        'timegiven',
        'difficulty',
        'userscompleted',
        'usersfailed',
        'challengeid',
        'completionvalue'
    ];

    //TEST
    var created = new this.MemberModel();
    created.email = "Modified #2";
    this.Update("Member", created);
}
///
// GetModel(): Encapsulated Model Retrieval based on a modelname, which is a string.
///
MistDatabase.prototype.GetModel = function (modelName) {
    switch (modelName) {
        case "Member":
            return this.MemberModel;
        case "Challenge":
            return this.ChallengeModel;
        default:
            return null;
    }
}

MistDatabase.prototype.GetFields = function (modelName) {
    switch (modelName) {
        case "Member":
            return this.MemberFields;
        case "Challenge":
            return this.ChallengeFields;
        default:
            return null;
    }
}

// -- CRUD Database Operations --

///
// create():
// Initializes all properties of a model, saves it to db, and returns it.
// params: An object with all instantiable properties. Example - { username: "Hello" }
//
//Sample Usages: Creating a user.
///
MistDatabase.prototype.Create = function (modelname, params) {
    var Model = this.GetModel(modelname);

    var returnable = new Model();
    for (var property in params) {
        if (property in returnable) {
            returnable[property] = params[property];
        }
    }

    returnable.save();
    return returnable;
}

///
// read():
// Attempts to retrieve an object from the db based on search params.
// search: An object representing the search params: Ex: {username: "Hello"}
///
MistDatabase.prototype.Read = function (modelname, search, callback) {
    var Model = this.GetModel(modelname);

    Model.findOne(search, function (err, instance) {
        callback(err, instance);
    });
}

///
//ReadAll(): Reads all objects from the db.
///
MistDatabase.prototype.ReadAll = function (modelname, callback) {
    var Model = this.GetModel(modelname);

    Model.find({}, function (err, instance) {
        callback(err, instance);
    });
}

///
// Updates an object in the database.
///
MistDatabase.prototype.Update = function (modelname, instance) {
    var Model = this.GetModel(modelname);
    var fields = this.GetFields(modelname);


    //A clean object without a link to a Mongoose Schema must be passed into the model.update().
    var updateObj = new Object();

    for (var i = 0; i < fields.length; i++) {
        updateObj[fields[i]] = instance[fields[i]];
    }

    Model.update({__id: instance.__id}, updateObj, false, true);
}

MistDatabase.prototype.Delete = function (modelname, instance) {
    var Model = this.GetModel(modelname);

    Model.findById(instance.__id, function (err, product) {
        product.remove();
        callback(err, null); //The product does not exist anymore.
    });
}

// -- END CRUD Database Operations --

module.exports = MistDatabase;