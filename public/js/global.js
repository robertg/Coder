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
    }
};