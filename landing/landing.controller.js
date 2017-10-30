landingapp.controller('LandingController', ['$scope', '$rootScope', '$http', '$helpers', function ($scope, $rootScope, $http, $helpers) {

    console.log("Hello Landing");
    $scope.projects = [];

    $scope.listProjects = function () {
        AP.require('request', function (request) {
            request({
                url: '/rest/api/latest/project',
                success: function (response) {
                    // convert the string response to JSON
                    var converted = JSON.parse(response);
                    angular.forEach(converted, function (proj) {
                        $scope.projects.push(proj);
                    });

                    // dump out the response to the console
                    console.log(response);
                },
                error: function () {
                    console.log(arguments);
                }
            });
        });
    };

    $scope.clickMe = function () {

        AP.getLocation(function (location) {
            debugger;
            alert(location);
        });



        debugger
        AP.cookie.save('my_cookie', 'yo yo shehan', 1);
        AP.cookie.read('my_cookie', function (value) {
            alert('my_cookie : ' + value);
        });

        AP.cookie.read('JSESSIONID', function (value) {
            alert('JSESSIONID : ' + value);
        });
        AP.cookie.read('atlassian.xsrf.token', function (value) {
            alert('atlassian.xsrf.token : ' + value);
        });
        AP.cookie.read('cloud.session.token', function (value) {
            alert('cloud.session.token : ' + value);
        });
        AP.cookie.read('studio.crowd.tokenkey', function (value) {
            alert("studio.crowd.tokenkey : " + value);
        });
        var JSESSIONID = $helpers.getCookie('JSESSIONID');
        var atlassianxsrftoken = $helpers.getCookie('atlassian.xsrf.token');
        var cloudsessiontoken = $helpers.getCookie('cloud.session.token');
        var studiocrowdtokenkey = $helpers.getCookie('studio.crowd.tokenkey');
        $http({
            method: 'GET',
            url: 'https://dev.smoothflow.io/auth/addons/jira/verify',
            headers: {
                'Content-Type': 'application/json',
                'JSESSIONID': JSESSIONID,
                'atlassian.xsrf.token': atlassianxsrftoken,
                'cloud.session.token': cloudsessiontoken,
                'studio.crowd.tokenkey': studiocrowdtokenkey,
            }
        })
            .then(function (data) {
                debugger
                console.log(data)
            }, function (data) {
                debugger
                console.log(data)
            });
    }

    angular.element(document).ready(function () {
        $scope.listProjects();
    });

}]);