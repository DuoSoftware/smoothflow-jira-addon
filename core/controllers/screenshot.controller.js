app.controller('ScreenshotController', ['$scope', '$rootScope', '$http', '$auth', function ($scope, $rootScope, $http, $auth) {

    $scope.imageApi;
    $scope.isUrlOpen = false;
    $scope.sendImage = function() {
        if ($scope.imageApi) {
            $scope.imageApi.toPng(function (dataUrl) {
                console.log(dataUrl);
                alert('Please open console and print dataUrl then you can send dataUrl to your backend api do more feature like send mail.');
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