var adminapp = angular.module('adminJira', ['ui.router', 'uiMicrokernel']);

adminapp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/admin');

    $stateProvider

        .state('admin', {
            url: '/admin',
            templateUrl: 'index.html',
        });

}

);