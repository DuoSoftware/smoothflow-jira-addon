app.controller('FeedbackController', ['$scope', '$http', '$v6urls', '$rootScope', 'dataHandler', '$uploader', '$storage', function ($scope, $http, $v6urls, $rootScope, dataHandler, uploader, storage) {
    $scope.IsNew = true;
    $scope.Tasktypes = ['Complain', 'Bug', 'Improvement'];
    $scope.IsImageShow = false;
    /** Test Data */
    // var response = { "Status": true, "Message": "Successfully created the Issue!", "Data": { "IssueID": "52981", "IssueKey": "DSF-1079", "IssueUrl": "https://duosoftware.atlassian.net/rest/api/2/issue/52981" } }
    // $scope.ticketDetails = response.Data;
    // $scope.Message = response.Message;
    // $scope.Status = response.Status;



    $scope.CreateNewTicket = function (IsNew) {
        // if (IsNew) { $scope.IsNew = false; }
        // else { $scope.IsNew = true; }

        $scope.ticket = [];
    };
    //Create Ticket
    $scope.uploadImage = function () {
        debugger;
        angular.element(document.querySelector('#file')).on('change', function () {
            $scope.name = this.files[0].name;
            // var reader = new FileReader();
            // // file read
            // reader.onload = function (e) {
            //     $scope.dataUrl = e.target.result;
            // }
            // reader.readAsDataURL(this.files[0]);
            uploader.V1uploadMedia(window.location.hostname, this.files[0], $scope.name);
        })


    };
    $rootScope.$on('uploader_success', function (event, data) {
        debugger;
        console.log('uploader_success recived:', data);
        $rootScope.imageUrl = storage.getMediaUrl(window.location.hostname, $scope.name);
        $scope.IsImageShow = true;
        console.log('Image Url', $rootScope.imageUrl);        //set image name


    });

    $rootScope.$on('uploader_fail', function (event, data) {
        debugger;
        console.log('uploader_fail recived:', data);

    });
    $scope.CreateTicket = function () {
        var ticket =
            {
                "channel": "api",
                "description": $scope.ticket.description,
                "attachmant": [$rootScope.imageUrl],
                "subject": $scope.ticket.taskcode,
                "tags": ["SmoothFlow", "V6", "HelpDesk"],
                "type": $scope.ticket.typeaa,
                "domain": $rootScope.SessionDetails.Domain,
                "email": $rootScope.SessionDetails.emails[0],
                "name": $rootScope.CurrentUser.key,
                "displayname": $rootScope.SessionDetails.name
            }
        $http({
            method: 'POST',
            url: $v6urls.processManager + '/processengine/jira/helpdesk/createissue',
            headers: {
                'Content-Type': 'application/json'
            },
            data: ticket
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data.Status) {
                $scope.ticketDetails = response.data;
                // $scope.Message = response.Message;
                $scope.IsNew = false;
            }

        }, function errorCallback(response) {
            console.log(response.data);
        });
    }
}])