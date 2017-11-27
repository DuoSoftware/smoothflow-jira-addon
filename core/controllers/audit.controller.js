app.controller('AuditController', ['$scope', '$rootScope', '$http', '$auth', function ($scope, $rootScope, $http, $auth) {

    $scope.selectedRuleName = $rootScope.selectedRuleName;
    $scope.getAllLogs = function () {
        $http({
            method: "GET",
            url: "https://" + $scope.selectedRuleName + ".plus.smoothflow.io/" + $scope.selectedRuleName + "/smoothflow/logs/success?apikey=" + $rootScope.APIKey,

        }).then(function Success(response) {
            var index = 0;
            angular.forEach(response.data, function (log) {
                debugger
                response.data[index] = log.replace("Logs/SuccessLogs/", '');
                index++;
            });
            $scope.AllLogs = response.data;
        }, function Error(response) {
            console.log($scope.ErrorStatus);
        });
    };
    $scope.getAllLogs();

    $scope.selectedLogDetails = "";
    $scope.getLogDetails = function (logname) {
        $scope.selectedLogDetails = "";
        $http({
            method: "GET",
            url: "https://" + $scope.selectedRuleName + ".plus.smoothflow.io/" + $scope.selectedRuleName + "/smoothflow/Logs/success/" + logname + "?apikey=" + $rootScope.APIKey,
            transformResponse: [function (data) {
                return data;
            }]

        }).then(function Success(response) {
            debugger
            $scope.selectedLogDetails = response.data;
        }, function Error(response) {
            debugger
            console.log(response);
        });
    };

    // $scope.SessionDetails = $rootScope.SessionDetails;
    // $scope.searchlog = function (sessionId) {

    //     console.log('call Function '+sessionId);
    //     //-----PE----------------------------------
    //     getPE(sessionId);
    //     //---------ACT------------------------------------------
    //     getACT(sessionId);
    //     //------------WF---------------------------------------
    //     getWF(sessionId);
    // };
    // // $scope.getMoreDetails('bGFrbWluaS5kZXYuc21vb3RoZmxvdy5pby1hZTkzMzg')

    // function getPE (sessionId) {
    //     $http({
    //         method: "GET",
    //         url: 'http://dev.smoothflow.io:8093/processengine/GetSessionDetails/' + sessionId + '/PE',
    //         headers: {
    //             'SecurityToken': $scope.SessionDetails.SecurityToken
    //         },

    //     }).then(function Success(response) {
    //         $scope.processEngine = response.data;
    //         // console.log($scope.processEngine);
    //     }, function Error(response) {
    //         $scope.ErrorStatus = response.statusText;
    //         console.log($scope.ErrorStatus);
    //     });
    // };
    // function getACT (sessionId) {
    //     $http({
    //         method: "GET",
    //         url: 'http://dev.smoothflow.io:8093/processengine/GetSessionDetails/' + sessionId + '/ACT',
    //         headers: {
    //             'SecurityToken': $scope.SessionDetails.SecurityToken
    //         },

    //     }).then(function Success(response) {
    //         $scope.activity = response.data;
    //         // console.log($scope.activity);
    //     }, function Error(response) {
    //         $scope.ACTErrorStatus = response.statusText;
    //         console.log($scope.ACTErrorStatus);
    //     });
    // };

    // function getWF (sessionId) {
    //     $http({
    //         method: "GET",
    //         url: 'http://dev.smoothflow.io:8093/processengine/GetSessionDetails/' + sessionId + '/WF',
    //         headers: {
    //             'SecurityToken': $scope.SessionDetails.SecurityToken
    //         },

    //     }).then(function Success(response) {
    //         $scope.workflow = response.data;
    //         // console.log($scope.workflow);
    //     }, function Error(response) {
    //         $scope.WFErrorStatus = response.statusText;
    //         console.log($scope.WFErrorStatus);
    //     });
    // };




}]);