app.controller('FeedbackController', ['$scope', '$http', '$v6urls', '$rootScope', 'dataHandler', '$uploader', '$storage', function ($scope, $http, $v6urls, $rootScope, dataHandler, uploader, storage) {
    $scope.IsNew = false;
    $scope.Tasktypes = ['Bug', 'Improvement', 'New Feature', 'Support'];
    $scope.IsImageShow = false;
    $scope.IsFirst = true;
    $scope.IsSatus = false;

    /** Test Data */
    // var response = { "Status": true, "Message": "Successfully created the Issue!", "Data": { "IssueID": "52981", "IssueKey": "DSF-1079", "IssueUrl": "https://duosoftware.atlassian.net/rest/api/2/issue/52981" } }
    // $scope.ticketDetails = response.Data;
    // $scope.Message = response.Message;
    // $scope.Status = response.Status;
    var res = "";
    $scope.tasklist = "";
    $scope.name = "New";

    //Issue attachments
    function Addattachment() {
        // $http({
        //     method: 'POST',
        //     url: $v6urls.processManager + '/processengine/jira/helpdesk/createissue',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     data: ticket
        // }).then(function successCallback(response) {
        //     console.log(response.data);
        // }, function errorCallback(response) {

        //     console.log(response.data);
        // });
    };
    $scope.CreateNewTicket = function (IsNew) {
        AJS.dialog2("#new-feedback-dialog").show();
        if (IsNew) {
            $scope.IsNew = false;
            $scope.IsFirst = true;
            $scope.IsSatus = false;
            $scope.name = "New";
        } else {
            $scope.IsNew = true;
            $scope.IsFirst = false;
            $scope.IsSatus = false;
            $scope.name = "Details";
        }

        $scope.ticket = [];
        $rootScope.imageUrl = "";
    };
    //Create Ticket
    $scope.uploadImage = function () {
        debugger;
        angular.element(document.querySelector('#file')).on('change', function () {
            $scope.name = this.files[0].name;
            $rootScope.ShowBusyContainer("Uploading Image");
            uploader.V1uploadMedia(window.location.hostname, this.files[0], $scope.name);
        })


    };
    $rootScope.$on('uploader_success', function (event, data) {
        debugger;
        $rootScope.HideBusyContainer();
        console.log('uploader_success recived:', data);
        $rootScope.imageUrl = storage.getMediaUrl(window.location.hostname, $scope.name);
        $scope.IsImageShow = true;
        console.log('Image Url', $rootScope.imageUrl);        //set image name
    });

    $rootScope.$on('uploader_fail', function (event, data) {
        debugger;
        $rootScope.HideBusyContainer();
        $rootScope.DisplayMessage("Uploader Fail", 'error', "Please Contact Administrator");
        console.log('uploader_fail recived:', data);

    });
    $scope.CreateTicket = function () {
        $rootScope.ShowBusyContainer("Processing");
        var ticket =
            {
                "channel": "api",
                "description": $scope.ticket.description,
                "attachmant": [$rootScope.imageUrl],
                "subject": $scope.ticket.taskcode,
                "tags": ["SmoothFlow", "V6", "HelpDesk", $rootScope.SessionDetails.Domain],
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
            $rootScope.HideBusyContainer();
            if (response.data.Status) {
                $scope.ticketDetails = response.data;
                // $scope.Message = response.Message;
                $scope.IsNew = false;
                $scope.IsFirst = false;
                $scope.IsSatus = true;
                $rootScope.DisplayMessage("feedback successfully created", 'success');
                AJS.dialog2("#new-feedback-dialog").hide();
            }
        }, function errorCallback(response) {
            $rootScope.HideBusyContainer();
            $rootScope.DisplayMessage(response.Message, 'error', "Please Contact Administrator");
            $scope.IsNew = false;
            $scope.IsFirst = true;
            $scope.IsSatus = false;
            console.log(response.data);
            AJS.dialog2("#new-feedback-dialog").hide();
        });
    }

    $scope.getAllTicket = function () {
        $rootScope.ShowBusyContainer("Loading Feedback");
        $http({
            method: 'GET',
            url: $v6urls.processManager + '/processengine/jira/helpdesk/getissues/' + $rootScope.SessionDetails.Domain + '?skip=0&take=50',
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            console.log(response.data.Data.issues);
            $rootScope.HideBusyContainer();
            $scope.tasklist = response.data.Data.issues;
        }, function errorCallback(response) {
            $rootScope.HideBusyContainer();
            console.log(response.data);
        });
    };
    $scope.getAllTicket();
}])