Mist.controller('MainCtrl', function MainCtrl($scope, $http) {

});

Mist.controller('HubCtrl', function HubCtrl($scope, $http) {

});

Mist.controller('QuestionCtrl', function QuestionCtrl($scope, $http) {

});

Mist.controller('ProjectCtrl', function ProjectCtrl($scope, $http) {
    //Handle the project code editor:
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
});

Mist.controller('LoginCtrl', function LoginCtrl($scope, $http) {

});