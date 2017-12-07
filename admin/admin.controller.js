adminapp.controller('adminController', ['$scope', '$rootScope', '$http', '$helpers', '$v6urls', '$timeout', function ($scope, $rootScope, $http, $helpers, $v6urls, $timeout) {

    console.log("Hello Admin");
    AJS.$('.button-spinner').spin();

    $scope.pagestatus = "loading";

    $rootScope.SessionDetails = {};

    $rootScope.isNullOrEmptyOrUndefined = function (value) {
        return !value;
    }

    $scope.generatePassword = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    $rootScope.ShowBusyContainer = function (message) {
        document.getElementById("loading").style.display = "block";
        document.getElementById("loading").style.animation = "loadingappear 0.2s forwards";
        var element = document.getElementById("busycontent");
        element.innerHTML = "<h3>" + message + "</h3>";
    }
    $rootScope.HideBusyContainer = function () {
        document.getElementById("loading").style.animation = "loadingdisappear 0.2s backwards";
        $timeout(function () {
            document.getElementById("loading").style.display = "none";
        }, 1000);
    }


    $scope.loadJiraUser = function (profile) {
        // load default settings if the developer is testing on jira 
        $rootScope.SessionDetails = {};
        $rootScope.SessionDetails.name = profile.displayName;
        $rootScope.SessionDetails.emails = [profile.emailAddress];
        $rootScope.SessionDetails.email = profile.emailAddress;
        $rootScope.SessionDetails.Domain = profile.domain;
        $rootScope.SessionDetails.Avatar = profile.avatar;
        $rootScope.SessionDetails.country = profile.timeZone;
        $rootScope.SessionDetails.password = $scope.generatePassword();
        $scope.SessionDetails = $rootScope.SessionDetails;
    };

    $rootScope.DisplayMessage = function (message, type, body) {
        // type of flags this could handle
        /*
            success, info, warning, error
        */
        var closeType = "";
        switch (type) {
            case "success":
                closeType = "auto";
                break;
            case "error":
                closeType = "manual";
                break;
            case "info":
                closeType = "manual";
                break;
            case "warning":
                closeType = "manual";
                break;
            default:
                closeType = "auto";
                break;
        }
        // the body should recieve html
        if (body == "" || body == undefined) {
            body == "";
        }
        var myFlag = AJS.flag({
            type: type,
            title: message,
            close: closeType,
            body: body
        });
    }

    $scope.copytoClipboard = function (password) {
        var copyTextarea = document.querySelector('.passwordcopy');
        copyTextarea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    }

    $scope.createUser = function () {
        var URL = $v6urls.smoothflowIP + "/auth/users";
        var payload = {
            "Email": $scope.SessionDetails.email,
            "Name": $scope.SessionDetails.name,
            "Country": $scope.SessionDetails.country,
            "Password": $scope.SessionDetails.password,
            "TenantID": $scope.SessionDetails.Domain + "jira",
            "TenantType": "JIRA"
        }
        $http.post(URL, payload, {
            headers: {
                'securityToken': 'ignore'
            }
        }).then(function OnSuccess(response) {
            if (response.data.Status == true) {
                //var obj = JSON.parse(response.data.Message);
                $scope.pagestatus = "alreadyinuse";
                $rootScope.DisplayMessage("Your have been connected to Smoothflow.io", "success");
            } else {
                $rootScope.DisplayMessage("An Account for these details are already in use on Smoothflow.io", "error");
            }
        }, function OnError(onError) {
            if (onError) {
                $rootScope.DisplayMessage("Error when creating user profile.", "error");
            }
        });
    }

    $scope.checkIfUserAlreadyExists = function () {
        // var URL = $v6urls.smoothflowIP + "/auth/users/"+$scope.SessionDetails.email;
        debugger
        var domain = "";
        if($rootScope.isNullOrEmptyOrUndefined($scope.CurrentUserProfile)){
            domain = $rootScope.SessionDetails.Domain;
        }
        var URL = $v6urls.smoothflowIP + "/auth/tenants/" + domain;
        $http.get(URL, {
            headers: {
                'securityToken': 'ignore'
            }
        }).then(function OnSuccess(response) {
            if (response.data.Status) {
                $scope.pagestatus = "alreadyinuse";
            } else {
                $scope.pagestatus = "newuser";
            }
            $rootScope.HideBusyContainer();
        }, function OnError(onError) {
            if (onError) {
                $rootScope.DisplayMessage("Error when retriving user profile.", "error");
                $rootScope.HideBusyContainer();
                $scope.pagestatus = "newuser";
            }
        });
    };

    $scope.getCurrentUserProfile = function () {
        var URL = $v6urls.jiraAPI + "/broker";
        var payload = {
            "baseUrl": $rootScope.baseUrl,
            "userKey": $rootScope.CurrentUser.key,
            "method": "GET",
            "requestPath": "/rest/api/2/myself"
        }
        $http.post(URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function OnSuccess(response) {
            if (response.data.response == "success") {
                $scope.CurrentUserProfile = response.data.jiraResponse;
                var tenant = $rootScope.baseUrl.replace(/(?:https:\/\/)/g, '');
                tenant = tenant.replace(/(?:\.atlassian\.net)/g, '');
                $scope.CurrentUserProfile.domain = tenant + "jira";
                $scope.CurrentUserProfile.avatar = $scope.CurrentUserProfile.avatarUrls["48x48"];
                console.log($scope.CurrentUserProfile);
                $scope.loadJiraUser($scope.CurrentUserProfile);
                $scope.checkIfUserAlreadyExists();
            } else {
                $rootScope.DisplayMessage("Error when retriving user profile.", "error");
            }
        }, function OnError(response) {
            if (onError) {
                $rootScope.DisplayMessage("Error when retriving user profile.", "error");
            }
        });
    }

    var getUrlParam = function (param) {
        var codedParam = (new RegExp(param + '=([^&]*)')).exec(window.location.search)[1];
        return decodeURIComponent(codedParam);
    };

    $scope.getCurrentUser = function () {
        try {
            if (!$rootScope.isNullOrEmptyOrUndefined(AP)) {
                AP.getUser(function (user) {
                    $rootScope.CurrentUser = user;
                    $scope.getCurrentUserProfile();
                });
            } else {
                var temUser = {
                    displayName: "Mr loba",
                    emailAddress: "shehan@duosoftware.com",
                    domain: "duosoftwarejira",
                    avatar: "https://www.gravatar.com/avatar/7272996f825bd268885d6b20484d325c",
                    timeZone: "Sri Lanka"
                }
                $rootScope.CurrentUser = {};
                $rootScope.CurrentUser.key = "shehan";
                $scope.loadJiraUser(temUser);
                $scope.checkIfUserAlreadyExists();
            }
        }
        catch (err) {
            var temUser = {
                displayName: "Mr loba",
                emailAddress: "shehan@duosoftware.com",
                domain: "duosoftwarejira",
                avatar: "https://www.gravatar.com/avatar/7272996f825bd268885d6b20484d325c",
                timeZone: "Sri Lanka"
            }
            $rootScope.CurrentUser = {};
            $rootScope.CurrentUser.key = "shehan";
            $scope.loadJiraUser(temUser);
            $scope.checkIfUserAlreadyExists();
        }
    }

    angular.element(document).ready(function () {
        $rootScope.baseUrl = getUrlParam('xdm_e') + getUrlParam('cp');
        $scope.getCurrentUser();
    });

}]);