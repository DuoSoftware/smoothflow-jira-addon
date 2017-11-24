app.controller('ScreenshotController', ['$scope', '$rootScope', '$http', '$auth', function ($scope, $rootScope, $http, $auth) {

    var self = this;
    self.imageApi;
    self.sendImage = sendImage;
    self.isUrlOpen = false;
    function sendImage() {
        if (self.imageApi) {
            self.imageApi.toPng(function (dataUrl) {
                console.log(dataUrl);
                alert('Please open console and print dataUrl then you can send dataUrl to your backend api do more feature like send mail.');
            });
        }
    }

}]);