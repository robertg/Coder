///
// g_user: Represents a global user, used by the context of the single page app.
///
var g_user = {
    //Base fields of a global user context:
    fields: {username: "", joined: "", verified: "", challengescomplete: [], email : "", projects : []},
    ready: function () {
        if (this.fields.username.length > 0) { //This is a real user, otherwise it is a template.
            return true;
        }
        return false;
    },
    reset : function() {
        this.fields = {username: "", joined: "", verified: "", challengescomplete: [], email : "", projects : []}
    },
    getRequestObject : function() {
        return this.fields;
    },
    ///
    // getProject(id): Returns a project from the user, depending on projectID.
    ///
    getProject: function(id) {
        for(var i = 0; i < this.fields.projects.length; i++) {
            if(id == this.fields.projects[i].projectid) {
                return this.fields.projects[i];
            }
        }
        return null;
    },
    setProject: function(project) {
        for(var i = 0; i < this.fields.projects.length; i++) {
            if(project.projectid == this.fields.projects[i].projectid) {
                this.fields.projects[i] = project;
            }
        }
    }
};


///
// Console(): Represents a console found in the project page:
///
function Console() {
    this.text = "> --Output--";
}

///
// write(): Write a newline to the console.
///
Console.prototype.write = function(text) {
    this.text += "\r> " + text;
}

///
// flush(): Clear out the text.
///
Console.prototype.flush = function() {
    this.text = "";
}