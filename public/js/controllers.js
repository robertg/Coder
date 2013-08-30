///
// MainCtrl: Manages all global properties of the app.
///
Mist.controller('MainCtrl', function MainCtrl($scope, $http, $location, progressbar) {

    if (!g_user.ready()) { //There is no global user, try retrieving from the cookie session.
        $http({method: 'PUT', url: '/api/ready'})
            .success(
            function (data) {
                //This user is already logged in, let's get the fields:
                if (data.status == statuscode.AUTHORIZED) {
                    g_user.fields = data;
                    $scope.g_user = g_user;
                    $scope.toolbarlogin.loggedin = (g_user.ready()) ? true : false;
                }
            }
        )
    }

    //Allow the scope to linked to the global user, and to come into context on the UI.
    $scope.g_user = g_user;

    ///
    // ToolBar: Manages the login of a user, communicates with LoginCtrl.
    ///
    $scope.toolbarlogin = {
        submit: function (form) {
            if (form.$valid) {
                //Time to login:
                progressbar.start();

                $http({method: 'POST', url: '/api/login', data: $scope.toolbarlogin})
                    .success(
                    function (data) {
                        switch (data.status) { //Set error message, if server responds with an error.
                            case statuscode.BAD_USERNAME:
                                $scope.toolbarlogin.servererror = "Unknown Username!";
                                break;
                            case statuscode.UNAUTHORIZED:
                                $scope.toolbarlogin.servererror = "The password is incorrect!";
                                break;
                            case statuscode.AUTHORIZED:
                            default:
                                delete $scope.toolbarlogin.servererror;
                        }

                        //This user is ready to move to the hub.
                        if (data.status == statuscode.AUTHORIZED) {
                            g_user.fields = data;
                            $location.path('/hub');
                        }

                        progressbar.complete();

                        //Propagate the changes to all controllers:
                        $scope.toolbarlogin.loggedin = (g_user.ready()) ? true : false;
                        $scope.g_user = g_user;
                    });
            }
        }
    };
});

Mist.controller('HubCtrl', function HubCtrl($scope, $http) {
    //Retrieve Questions:
    $http({method: 'PUT', url: '/api/questions'})
        .success(
        function (data) {
            $scope.challenges = data;
        }
    );

    // ---JQUERY---
    function ResizeHub() {
        $('.hubbody').height($(window).height() - 125);
    }

    $(window).off('resize');
    $(window).resize(ResizeHub);
    ResizeHub();
});

///
// Begins a project under the user, and brings the user to the appropriate project:
// Route: /begin/:challengeID
///
Mist.controller('BeginCtrl', function BeginCtrl($scope, $http, $routeParams, $location) {
    $http({method: 'POST', url: '/api/begin/' + $routeParams.id,
        data: g_user.getRequestObject() })
        .success(function (data) {
            g_user.fields = data.client;
            $location.path('/project/' + data.options.projectid);
        });

});

Mist.controller('QuestionCtrl', function QuestionCtrl($scope, $http) {

});

///
// ProjectCtrl: Manages the projects of a user.
///
Mist.controller('ProjectCtrl', function ProjectCtrl($scope, $http, $routeParams) {
    $scope.project = g_user.getProject($routeParams.id);

    //Handle the project code editor:
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");


    // ---JQUERY---
    function ResizeAce() {
        $('#editor').height($(window).height() - 75);
        $('#editor').width($('#editorcontainer').width());
        $('.toolbarcontainer').height($(window).height() - 75);
        editor.resize();
    }

    $(window).off('resize');
    $(window).resize(ResizeAce);

    ResizeAce();
    // ---JQUERY END---

    // ---Manage Console---
    $scope.console = new Console();

    // ---Manage Tools
    $scope.tools = {
        save: function() {
            $scope.console.write("-- SAVED --");
        },
        compile: function() {

        }
    }
});


///
// LoginCtrl: Manages the login of a user, communicates to MainCtrl.
///
Mist.controller('LoginCtrl', function LoginCtrl($scope, $http, progressbar, $location) {
    //Let's make sure the user is not logged in:
    if (g_user.ready()) {
        //It's time to log out the user:
        g_user.reset();

        //Logout from the server session:
        $http({method: 'PUT', url: '/api/logout'})
            .success(
            function (data) {

            });

        UpdateMain();
    }

    ///
    // UpdateMain(): Update the whole app:
    ///
    function UpdateMain() {
        //Update the toolbar.
        $scope.toolbarlogin.loggedin = (g_user.ready()) ? true : false;
    }

    //Login form:
    $scope.login = {
        submit: function (form) {
            if (form.$valid) {

                progressbar.start();

                $http({method: 'POST', url: '/api/login', data: $scope.login})
                    .success(
                    function (data) {
                        switch (data.status) { //Set error message, if server responds with an error.
                            case statuscode.BAD_USERNAME:
                                $scope.login.servererror = "Unknown Username!";
                                break;
                            case statuscode.UNAUTHORIZED:
                                $scope.login.servererror = "The password is incorrect!";
                                break;
                            case statuscode.AUTHORIZED:
                            default:
                                delete $scope.login.servererror;
                        }

                        //This user is ready to move to the hub.
                        if (data.status == statuscode.AUTHORIZED) {
                            g_user.fields = data;
                            $location.path('/hub');
                        }

                        progressbar.complete();

                        UpdateMain();
                    });
            }
        }
    };
    //Register form:
    $scope.register = {
        submit: function (form) {
            if (form.$valid) {
                progressbar.start();
                $http({method: 'POST', url: '/api/register', data: $scope.register}).success(
                    function (data) {
                        switch (data.status) { //Set error message, if server responds with an error.
                            case statuscode.USER_EXISTS:
                                $scope.register.servererror = "Username Exists!";
                                break;
                            case statuscode.EMAIL_EXISTS:
                                $scope.register.servererror = "Email Exists!";
                                break;
                            case statuscode.USER_CREATED:
                            default:
                                delete $scope.register.servererror;
                        }
                        //Let's put the user in global scope:
                        if (data.status == statuscode.USER_CREATED) {
                            g_user.fields = data;

                            $location.path('/hub');
                        }

                        progressbar.complete();
                        UpdateMain();
                    });
            }
        }
    };
});