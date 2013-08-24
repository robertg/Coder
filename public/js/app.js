var Mist = angular.module('Mist', ['ngProgress']).config(
    ['$routeProvider',
        '$locationProvider',
        function ($routeProvider, $locationProvider) {
                //Landing Page of Mist, describes the product.
                // If the user is already logged in, this page is skipped.
            $routeProvider.when('/', { templateUrl: 'main.html', controller: 'MainCtrl'})
                //Main Page of Mist, basically the "Hub".
                .when('/hub', { templateUrl: 'hub.html', controller: 'HubCtrl'})
                //Begins a Project under a specific question. Redirects to /project/:id.
                .when('/question/:id', {templateUrl: 'question.html', controller: 'QuestionCtrl'})
                //Opens a Project under a specific id.
                .when('/project', {templateUrl: 'project.html', controller: 'ProjectCtrl'})
                .when('/login', {templateUrl: 'login.html', controller: 'LoginCtrl'});
            $locationProvider.html5Mode(true);
        }
    ]);
