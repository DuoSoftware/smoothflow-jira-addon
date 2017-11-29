app.controller('HelpController', ['$scope', '$http', '$v6urls', '$rootScope', 'dataHandler', function ($scope, $http, $v6urls, $rootScope, dataHandler) {

    //Use for authorization
    $scope.IsNew = false;
    $scope.theme = sessionStorage.cur_theme || 'default';
    $scope.authcode = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbG91ZC1jaGFyZ2UiLCJqdGkiOiIwMjFjNDgxYS01NTEwLTQzOWQtOTViOC1lZjk5NjcyZjVmYWEiLCJzdWIiOiI1NmE5ZTc1OWZiMDcxOTA3YTAwMDAwMDEyNWQ5ZTgwYjVjN2M0Zjk4NDY2ZjkyMTE3OTZlYmY0MyIsImV4cCI6MjMzNDEyMzM2MCwidGVuYW50IjoxLCJjb21wYW55Ijo0OSwic2NvcGUiOlt7InJlc291cmNlIjoibXlOYXZpZ2F0aW9uIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJteVVzZXJQcm9maWxlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImRhc2hib2FyZGV2ZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImRhc2hib2FyZGdyYXBoIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImFyZHNyZXNvdXJjZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJwcm9kdWN0aXZpdHkiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiZm9ybXMiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoic2lwdXNlciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJmaWxlc2VydmljZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJjb250YWN0IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6Im5vdGljZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJub3RpZmljYXRpb24iLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyUHJvZmlsZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyR3JvdXAiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoicXVhbGl0eWFzc3VyYW5jZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJldmVudHMiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiaW50ZWdyYXRpb24iLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiZXh0ZXJuYWxVc2VyIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImVuZ2FnZW1lbnQiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiaW5ib3giLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidGlja2V0IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InRhZyIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ0aW1lciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ0aWNrZXR2aWV3IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InRpY2tldHR5cGVzIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InRpY2tldHN0YXR1c2Zsb3ciLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidG9kbyIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJyZW1pbmQiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoicmVxdWVzdG1ldGEiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidGVtcGxhdGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoic3lzbW9uaXRvcmluZyIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJEaXNwYXRjaCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJleHRlbnNpb24iLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiYnJlYWt0eXBlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImFnZW50RGlhbGVyIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImRpYWxlciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19XSwiaWF0IjoxNDcwMjA5NzYwfQ.rxQAjCOApOJ8e6yAnJNoVvx0B4YCB8fhspbYbGDL58w';

    $scope.Tasktypes = ['Complain', 'Bug', 'Improvement', 'Suggestion'];
// $scope.tasklist=[{"_id":"59e0a7af897b910001df8bd3","ticket_matrix":{"created_at":"2017-10-13T11:46:55.276Z","last_updated":"2017-10-13T11:46:55.276Z","last_status_changed":"2017-10-13T11:46:55.276Z","waited_time":0,"worked_time":0,"resolution_time":0,"sla_violated":false,"reopens":0,"replies":0,"assignees":0,"groups":0,"_id":"59e0a7af897b910001df8bd4"},"requester":{"_id":"599172301f052c0001d3a27c","name":"lakmi","avatar":"unknown","phone":"4547057501","email":"lakmini@duosoftware.com"},"tid":8,"active":true,"is_sub_ticket":false,"type":"Bug","subject":"test","reference":"null-8","description":"test","submitter":{"_id":"58a6f851dd3da800010496d8","name":"frodood"},"company":-1,"tenant":-1,"engagement_session":"bGFrbWkuZGV2LnNtb290aGZsb3cuaW8tMWFkMjNl","channel":"api","__v":0,"slot_attachment":[],"events":[{"_id":"59e0a7af897b910001df8bd2","body":{"message":"frodood Created Ticket","time":"2017-10-13T11:46:55.261Z"},"create_at":"2017-10-13T11:46:55.261Z","author":"frodood","type":"status"}],"comments":[],"custom_fields":[],"isolated_tags":["SmoothFlow","V6"],"tags":["SmoothFlow","V6"],"merged_tickets":[],"related_tickets":[],"sub_tickets":[],"attachments":[],"watchers":["58a6f851dd3da800010496d8"],"collaborators":[],"status":"new","priority":"normal","updated_at":"2017-10-13T11:46:55.276Z","created_at":"2017-10-13T11:46:55.276Z"},{"_id":"59b29684918b2e000194c213","ticket_matrix":{"created_at":"2017-09-08T13:09:24.765Z","last_updated":"2017-09-08T13:09:24.765Z","last_status_changed":"2017-09-08T13:09:24.765Z","waited_time":0,"worked_time":0,"resolution_time":0,"sla_violated":false,"reopens":0,"replies":0,"assignees":0,"groups":0,"_id":"59b29684918b2e000194c214"},"requester":{"_id":"599172301f052c0001d3a27c","name":"lakmi","avatar":"unknown","phone":"4547057501","email":"lakmini@duosoftware.com"},"tid":7,"active":true,"is_sub_ticket":false,"type":"Improvement","subject":"Task 01","reference":"null-7","description":"Test","submitter":{"_id":"58a6f851dd3da800010496d8","name":"frodood"},"company":-1,"tenant":-1,"engagement_session":"bGFrbWkuZGV2LnNtb290aGZsb3cuaW8tODU4YjEw","channel":"api","__v":0,"slot_attachment":[],"events":[{"_id":"59b29684918b2e000194c212","body":{"message":"frodood Created Ticket","time":"2017-09-08T13:09:24.761Z"},"create_at":"2017-09-08T13:09:24.762Z","author":"frodood","type":"status"}],"comments":[],"custom_fields":[],"isolated_tags":["SmoothFlow","V6"],"tags":["SmoothFlow","V6"],"merged_tickets":[],"related_tickets":[],"sub_tickets":[],"attachments":[],"watchers":["58a6f851dd3da800010496d8"],"collaborators":[],"status":"new","priority":"normal","updated_at":"2017-09-08T13:09:24.765Z","created_at":"2017-09-08T13:09:24.765Z"},{"_id":"59a6b427918b2e000194c04e","ticket_matrix":{"created_at":"2017-08-30T12:48:39.607Z","last_updated":"2017-08-30T12:49:20.529Z","last_status_changed":"2017-08-30T12:48:39.607Z","waited_time":0,"worked_time":0,"resolution_time":0,"sla_violated":false,"reopens":0,"replies":0,"assignees":0,"groups":0,"external_replies":1,"last_commented":"2017-08-30T12:49:20.529Z","_id":"59a6b427918b2e000194c04f"},"requester":{"_id":"599172301f052c0001d3a27c","name":"lakmi","avatar":"unknown","phone":"4547057501","email":"lakmini@duosoftware.com"},"tid":6,"active":true,"is_sub_ticket":false,"type":"Improvement","subject":"Test_100","reference":"null-6","description":"test","submitter":{"_id":"58a6f851dd3da800010496d8","name":"frodood"},"company":-1,"tenant":-1,"engagement_session":"bGFrbWkuZGV2LnNtb290aGZsb3cuaW8tY2QxYTVj","channel":"api","__v":1,"slot_attachment":[],"events":[{"_id":"59a6b427918b2e000194c04d","body":{"message":"frodood Created Ticket","time":"2017-08-30T12:48:39.606Z"},"create_at":"2017-08-30T12:48:39.606Z","author":"frodood","type":"status"},{"_id":"59a6b450918b2e000194c05c","body":{"message":"frodood Make Comment 59a6b450918b2e000194c05b","time":"2017-08-30T12:49:20.529Z"},"create_at":"2017-08-30T12:49:20.529Z","author":"frodood","type":"status"}],"comments":["59a6b450918b2e000194c05b"],"custom_fields":[],"isolated_tags":["SmoothFlow","V6"],"tags":["SmoothFlow","V6"],"merged_tickets":[],"related_tickets":[],"sub_tickets":[],"attachments":[],"watchers":["58a6f851dd3da800010496d8"],"collaborators":[],"status":"new","priority":"normal","updated_at":"2017-08-30T12:49:20.529Z","created_at":"2017-08-30T12:48:39.607Z"},{"_id":"59a69e51918b2e000194c02f","ticket_matrix":{"created_at":"2017-08-30T11:15:29.644Z","last_updated":"2017-08-30T11:15:29.644Z","last_status_changed":"2017-08-30T11:15:29.644Z","waited_time":0,"worked_time":0,"resolution_time":0,"sla_violated":false,"reopens":0,"replies":0,"assignees":0,"groups":0,"_id":"59a69e51918b2e000194c030"},"requester":{"_id":"599172301f052c0001d3a27c","name":"lakmi","avatar":"unknown","phone":"4547057501","email":"lakmini@duosoftware.com"},"tid":5,"active":true,"is_sub_ticket":false,"type":"Improvement","subject":"task 06","reference":"null-5","description":"test","submitter":{"_id":"58a6f851dd3da800010496d8","name":"frodood"},"company":-1,"tenant":-1,"engagement_session":"bGFrbWkuZGV2LnNtb290aGZsb3cuaW8tNjJlZDUx","channel":"api","__v":0,"slot_attachment":[],"events":[{"_id":"59a69e51918b2e000194c02e","body":{"message":"frodood Created Ticket","time":"2017-08-30T11:15:29.643Z"},"create_at":"2017-08-30T11:15:29.643Z","author":"frodood","type":"status"}],"comments":[],"custom_fields":[],"isolated_tags":["SmoothFlow","V6"],"tags":["SmoothFlow","V6"],"merged_tickets":[],"related_tickets":[],"sub_tickets":[],"attachments":[],"watchers":["58a6f851dd3da800010496d8"],"collaborators":[],"status":"new","priority":"normal","updated_at":"2017-08-30T11:15:29.644Z","created_at":"2017-08-30T11:15:29.644Z"}];
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
        debugger;
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
               
                $scope.ticket = [];
                $scope.gettasklist();
            } else {
               
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

    $scope.CreateNewTicket = function (IsNew) {
        if (IsNew) { $scope.IsNew = false; } else { $scope.IsNew = true; }

    };
    $scope.scrollTo = function (id) {
        $location.hash(id);
        $scope.tab = id;
    };
}])