var QuestionnaireApp = angular.module('QuestionnaireApp', ['ngRoute']).
    config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/templates/start.html'
        })
        .when('/questionnaire/:questionNumber', {
          templateUrl: '/templates/questionnaire.html',
          controller: 'QuestionnaireCtrl'
        })
        .when('/summary', {
          templateUrl: '/templates/summary.html'
        });
}]);

