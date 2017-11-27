app.controller('ScreenshotController', ['$scope', '$rootScope', '$http', '$auth', function ($scope, $rootScope, $http, $auth) {

    $scope.imageApi;
    $scope.isUrlOpen = false;
    $scope.sendImage = function() {
        if ($scope.imageApi) {
            $scope.imageApi.toPng(function (dataUrl) {
                console.log(dataUrl);
                $rootScope.changeLocation('feedback');
            });
        }
    }

    $scope.displayHideScreenshot = function(){
        $scope.isUrlOpen = !$scope.isUrlOpen;
        // if($scope.isUrlOpen){
        //     //document.getElementById("screenFilter").style.zIndex = "2000000002";
        // }else{
        //     document.getElementById("screenFilter").style.zIndex = "-1";
        // }
    }

}]);