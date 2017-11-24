var app = angular.module('sfJira', [
    'ui.router',
    'ngTextcomplete',
    'uiMicrokernel',
    'angular.filter',
    'angular-cron-generator'
]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('landing', {
            url: '/',
            templateUrl: 'content/home/landing.html'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'content/home/home.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'content/home/dashboard.html'
        })
        .state('rule', {
            url: '/rule',
            templateUrl: 'content/rule/rule.html'
        })
        .state('rule.details', {
            url: '/rule-details',
            templateUrl: 'content/rule/details/rule-details.html'
        })
        .state('rule.variables', {
            url: '/rule-variables',
            templateUrl: 'content/rule/variables/rule-variables-aui.html'
        })
        .state('pagenotfound', {
            url: '/pagenotfound',
            templateUrl: 'content/pagenotfound/pagenotfound.html'
        })
        .state('rule.workflow', {
            url: '/rule-workflow',
            templateUrl: 'content/rule/workflow/rule-workflow.html',
        })
        .state('rule.triggers', {
            url: '/rule-triggers',
            templateUrl: 'content/rule/triggers/rule-triggers-aui.html',
            controller: 'TriggerController'
        }).state('rule.audit', {
            url: '/rule-audit',
            templateUrl: 'content/rule/auditlog/rule-audit-aui.html',
            controller: 'AuditController'
        }).state('rule.container', {
            url: '/rule-container',
            templateUrl: 'content/rule/container/rule-container.html'
        }).state('rule.schedule', {
            url: '/rule-schedule',
            templateUrl: 'content/rule/schedule/rule-schedule.html'
        }).state('rule.notifications', {
            url: '/rule-notifications',
            templateUrl: 'content/rule/notifications/rule-notifications.html'
        }).state('rule.api', {
            url: '/rule-api',
            templateUrl: 'content/rule/api/rule-api.html'
        }).state('rule.feedback', {
            url: '/rule-feedback',
            templateUrl: 'content/rule/feedback/rule-feedback.html'
        });

}




);