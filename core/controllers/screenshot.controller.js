app.controller('ScreenshotController', ['$scope', '$rootScope', '$http', '$auth', '$uploader', '$storage', function ($scope, $rootScope, $http, $auth, uploader, storage) {

    $scope.imageApi;
    $scope.isUrlOpen = false;
    $scope.sendImage = function () {
        if ($scope.imageApi) {
            $scope.imageApi.toPng(function (dataUrl) {
                //var aa = Math.random()
                var randomnumber = Math.floor(Math.random() * 21);
                console.log(dataUrl);
                $scope.name = "Screenshot" + randomnumber + ".png";
                uploader.V1uploadMedia(window.location.hostname, dataUrl, $scope.name);


            });
        }
    }

    $scope.displayHideScreenshot = function () {
        $scope.isUrlOpen = !$scope.isUrlOpen;
        // if($scope.isUrlOpen){
        //     //document.getElementById("screenFilter").style.zIndex = "2000000002";
        // }else{
        //     document.getElementById("screenFilter").style.zIndex = "-1";
        // }
    }

    // $rootScope.$on('uploader_success', function (event, data) {
    //     debugger;
    //     console.log('uploader_success recived:', data);
    //     $rootScope.imageUrl = storage.getMediaUrl(window.location.hostname, $scope.name);
    //     console.log('Image Url', $rootScope.imageUrl);        //set image name

    //     $rootScope.changeLocation('feedback');
    // });

    // $rootScope.$on('uploader_fail', function (event, data) {
    //     debugger;
    //     console.log('uploader_fail recived:', data);

    // });

}]);