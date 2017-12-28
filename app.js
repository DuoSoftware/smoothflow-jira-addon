var app = angular.module('sfJira', [
    'ui.router',
    'ngTextcomplete',
    'uiMicrokernel',
    'angular.filter',
    'angular-cron-generator',
    'angular-screenshot',
    'ngSanitize',
	'angular-intro'
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
        }).state('feedback', {
            url: '/feedback',
            templateUrl: 'content/home/feedback/feedback.html',
            controller: 'FeedbackController'
        });

}

// Kasun_Wijeratne_27_DEC_2017
/** User validation before loading the Add-on **/
$.get( "json/config.json", function( data ) {
	debugger;
	var domain = null;
	var url = data.checkUserValidity.URL;
	var xdm = window.location.href.split('&');

	for(var i=0;i<xdm.length;i++){
		if(xdm[i].split('=')[0] == 'xdm_e'){
			domain = xdm[i].split('=')[1].split('.')[0].replace('https%3A%2F%2F','') + 'jira';
		}
	}

	$.ajax({
		url			: url + domain,
		type		: 'GET',
		beforeSend	: function(xhr){
			xhr.setRequestHeader('securityToken', 'ignore');
		},
		success		: function (sucres) {
			if (sucres.Status) {
				angular.element(document).ready(function(){
					angular.bootstrap(document, ["sfJira"]);
				});
			} else {
				window.location = window.location.href.split('?')[0] + 'access-denied.html';
			}
		},
		error		: function (errres) {
			window.location = window.location.href.split('?')[0] + 'access-denied.html';
		}
	});
});
/** ----------------------------------------------- **/
// Kasun_Wijeratne_27_DEC_2017 - END


);