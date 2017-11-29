app.controller('FeedbackController', ['$scope', '$http', '$v6urls', '$rootScope', 'dataHandler', function ($scope, $http, $v6urls, $rootScope, dataHandler) {
    $scope.IsNew = true;
    $scope.Tasktypes = ['Complain', 'Bug', 'Improvement', 'Suggestion'];

    $scope.CreateNewTicket = function (IsNew) {
        if (IsNew) { $scope.IsNew = false; }
        else { $scope.IsNew = true; }
    };
    //Create Ticket
    $scope.CreateTicket = function () {
        var ticket =
            {
                "channel": "api",
                "description": $scope.ticket.description,
                "attachmant": [$rootScope.imageUrl],
                "subject": $scope.ticket.taskcode,
                "tags": ["SmoothFlow", "V6"],
                "type": $scope.ticket.type,
                "domain": $rootScope.SessionDetails.Domain,
                "email": $rootScope.SessionDetails.emails[0],
                "name": $rootScope.CurrentUser.key,
                "displayname":$rootScope.SessionDetails.name
            }
        $http({
            method: 'POST',
            url: $v6urls.processManager + '/jira/helpdesk/createissue',
            headers: {
                'Content-Type': 'application/json'
            },
            data: ticket
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response) {
            console.log(response.data);
        });
    }
}])