var landingapp = angular.module('landingJira', ['ui.router', 'uiMicrokernel']);

landingapp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/landing');

    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl: 'index.html'
        });

});