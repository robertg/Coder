Mist.controller('ToolBarCtrl', function ToolBarCtrl($scope, $http) {
        //Let's show the toollogin if the user isn't logged in:
        console.log($scope);
        //$scope.toolbaruser.loggedin = (g_user) ? true : false;

});

Mist.controller('MainCtrl', function MainCtrl($scope, $http) {
    if(!g_user.ready()) { //There is no global user, try retrieving from session.
        //TODO: Implement nodejs sessions.
    }
});

Mist.controller('HubCtrl', function HubCtrl($scope, $http) {

});

Mist.controller('QuestionCtrl', function QuestionCtrl($scope, $http) {

});

///
// ProjectCtrl: Manages the projects of a user.
///
Mist.controller('ProjectCtrl', function ProjectCtrl($scope, $http) {
    //Handle the project code editor:
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
});

///
// LoginCtrl: Manages the login of a user.
///
Mist.controller('LoginCtrl', function LoginCtrl($scope, $http, progressbar, $location) {
    $scope.login = {
        submit: function (form) {
            if (form.$valid) {
                progressbar.start();
                $http({method: 'POST', url: '/api/login', data: $scope.login}).success(
                    function (data) {
                        switch(data.status) { //Set error message, if server responds with an error.
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
                        if(data.status == statuscode.AUTHORIZED) {
                            g_user.fields = data;
                            $location.path('/hub');
                        }
                        progressbar.complete();

                    });
            }
        }
    };

    $scope.register = {
        submit: function (form) {
            if (form.$valid) {
                progressbar.start();
                console.log($scope.register);
                $http({method: 'POST', url: '/api/register', data: $scope.register}).success(
                    function (data) {
                        switch(data.status) { //Set error message, if server responds with an error.
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

                        g_user.fields = data;

                        progressbar.complete();
                    });
            }
        }
    };
});