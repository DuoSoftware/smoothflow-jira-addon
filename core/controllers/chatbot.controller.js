app.controller('ChatbotController', ['$scope', '$http', '$v6urls', '$rootScope', 'dataHandler', '$uploader', '$storage', '$timeout', function ($scope, $http, $v6urls, $rootScope, dataHandler, uploader, storage, $timeout) {
    function setSectionHeight() {
        mainContent = document.getElementById('content');
        if (mainContent != null && mainContent != undefined) {
            if ($rootScope.listState == 'home') {
                mainContent.setAttribute("style", "overflow-y:scroll;height:" + (window.innerHeight - 50) + "px");
            } else {
                mainContent.removeAttribute("style");
            }
        }
    }
    $(document).ready(function () {
        $timeout(function () {
            setSectionHeight();
        }, 2000);
    });

    console.log("The Chatbot controller started up.");
}])