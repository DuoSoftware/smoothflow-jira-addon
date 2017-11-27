app.controller('HelpController', ['$scope', '$http', '$v6urls', '$rootScope', 'dataHandler', function ($scope, $http, $v6urls, $rootScope, dataHandler) {

    //Use for authorization
    $scope.IsNew = false;
    $scope.theme = sessionStorage.cur_theme || 'default';
    $scope.authcode = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmcm9kb29kIiwianRpIjoiMDIxYzQ4MWEtNTUxMC00MzlkLTk1YjgtZWY5OTY3MmY1ZmFhIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjIzMzQxMjMzNjAsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAyMDk3NjB9.Wh-E2OVg6nwsicj9yQdx92js6rPg6pzkZkmwk69FHmc';


    $scope.OpenCreateFeedback = function () {
        AJS.dialog2("#new-Feedback-dialog").show();
    }
    // 1) Get User profile
    function getprofiledata(email) {
        $http({
            method: 'GET',
            url: 'https://userservice' + $v6urls.veery + 'ExternalUser/ByContact/email/' + $rootScope.SessionDetails.emails[0],
            headers: {
                'Content-Type': 'application/json',
                'authorization': $scope.authcode
            }
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data.IsSuccess == true) {
                if (response.data.Result.length == 0) {
                    createProfile();
                } else {
                    $scope.userStatus = response.data.Result;
                    $scope.gettasklist();
                    creatEngagement();
                }
            } else {
                $scope.userStatus = true;
                createProfile();
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });
    };
    getprofiledata($rootScope.SessionDetails.emails[0]);

    // 2) Crate Profile
    function createProfile() {
        $scope.phoneNo = Math.floor(Math.random() * 10000000000);
        var profileObj = {
            "title": "unknown",
            "name": $rootScope.SessionDetails.name,
            "avatar": "unknown",
            "birthday": "",
            "gender": "unknown",
            "firstname": $rootScope.SessionDetails.name,
            "lastname": "unknown",
            "locale": "si",
            "ssn": $rootScope.SessionDetails.name,
            "address": {
                "zipcode": "",
                "number": "",
                "street": "",
                "city": "",
                "province": "",
                "country": ""
            },
            "phone": $scope.phoneNo,
            "email": $rootScope.SessionDetails.emails[0],
            "tags": ["VIP"]
        };
        $http({
            method: 'POST',
            url: 'https://userservice' + $v6urls.veery + 'ExternalUser',
            headers: {
                'Content-Type': 'application/json',
                'authorization': $scope.authcode
            },
            data: profileObj
        }).then(function successCallback(response) {
            if (!response.data.IsSuccess == false) {
                $scope.userStatus = response.data.Result;
                getprofiledata($rootScope.SessionDetails.emails[0]);
            } else {
                console.log(response.data);
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });
    };

    // 3)get task list by using user ID
    $scope.gettasklist = function () {
        $http({
            method: 'GET',
            url: 'https://liteticket' + $v6urls.veery + 'Tickets/Requester/' + $scope.userStatus[0]._id + '/0/2',
            headers: {
                'Content-Type': 'application/json',
                'authorization': $scope.authcode
            }
        }).then(function successCallback(response) {
            if (response.data.IsSuccess == true) {
                if (response.data.Result.length != 0) {
                    console.log(response.data);
                    $scope.tasklist = response.data.Result;
                }
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });
    };

    // 4) create Engagement using user ID
    function creatEngagement() {
        $scope.SessionID = dataHandler.createuuid();
        var engagement = {
            '_id': $scope.SessionID,    //Session id
            'engagement_id': $scope.SessionID,   //Session id
            'channel': 'web-widget',  //web-widget
            'channel_from': 'smoothflow',
            'channel_to': 'veery',
            'direction': 'inbound',
        };

        $http({
            method: 'POST',
            url: 'https://interactions' + $v6urls.veery + '/Engagement/' + $scope.userStatus[0]._id + '/EngagementSession',
            headers: {
                'Content-Type': 'application/json',
                'authorization': $scope.authcode
            },
            data: engagement
        }).then(function successCallback(response) {
            if (!response.data.IsSuccess == false) {
                if (!angular.isUndefined(response.data.Result) || response.data.Result != null) {
                    $scope.engagement = response.data.Result;
                }
            } else {
                console.log(response.data);
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });
    };

    // 5) Create Ticket
    $scope.createtTicket = function () {
        var ticketObj = {
            "channel": "api",
            "description": $scope.ticket.description,
            "engagement_session": $scope.engagement._id,
            "requester": $scope.userStatus[0]._id,
            "selectedTags": [],
            "subject": $scope.ticket.taskcode,
            "tags": ["SmoothFlow", "V6"],
            "type": $scope.ticket.typeaa
        };
        $http({
            method: 'POST',
            url: 'https://liteticket' + $v6urls.veery + 'Ticket',
            headers: {
                'Content-Type': 'application/json',
                'authorization': $scope.authcode
            },
            data: ticketObj
        }).then(function successCallback(response) {
            if (!response.data.IsSuccess == false) {
                $scope.showToast(response.data.CustomMessage);
                $scope.ticket = [];
                $scope.gettasklist();
            } else {
                $scope.showToast(response.data.CustomMessage);
                $scope.ticket = [];
                console.log(response.data);
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });
    };
    //  6) Add comments
    $scope.creatComments = function (ticketid) {
        var comment = {
            'body': $scope.ticket.comment,
            'body_type': 'text',
            'type': 'smoothflow',
            'public': 'public',
            'author_external': $scope.userStatus[0]._id,
            'attachments': [],
            'channel': 'web-widget',
            'channel_from': 'smoothflow',
            'engagement_session': $scope.engagement._id,
            'meta_data': ''
        };

        $http({
            method: 'PUT',
            url: 'https://liteticket' + $v6urls.veery + 'Ticket/' + ticketid + '/Comment',
            headers: {
                'Content-Type': 'application/json',
                'authorization': $scope.authcode
            },
            data: comment
        }).then(function successCallback(response) {
            if (!response.data.IsSuccess == false) {
                if (!angular.isUndefined(response.data.Result) || response.data.Result != null) {
                    $scope.ticket.comment = "";
                }
            } else {
                console.log(response.data);
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });

    };

    $scope.CreateNewTicket = function () {
        $scope.IsNew=true;
     };

}])