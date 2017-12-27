/**
 SMOOTHFLOW DROPDOWN FROM API UI COMPONENT (sf-api-ddlist)

 This component will list down content that comes from an external API response.

 INPUT   :
 	- API, The API which returns the response. The response should be an array.
 	- Reference variable, Which models main scope data
 OUTPUT  :
 	- Dropdown list UI with API data

 */

angular
	.module('sfJira')
	.directive('sfApiDd', [sfAPIDropdown]);

function sfAPIDropdown() {
	return {
		restrict: 'EA',
		replace	: true,
		template:
			'<div>' +
			'<div style="padding: 5px;width: 100%;border-bottom: solid 1px #000;cursor: pointer" ng-click="executeApi()">{{sfDdSelected != null ? sfDdSelected : '+'"-Select-"'+'}}<span style="float: right;font-size: 12px">▼</span> </div>' +
			'<div ng-if="showItemsMenu" style="position:relative;width: 100%;height: 100px;overflow-x: hidden;overflow-y: scroll;-webkit-box-shadow: 0 2px 5px #ccc;-moz-box-shadow: 0 2px 5px #ccc;box-shadow: 0 2px 5px #ccc;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px">' +
				'<div ng-show="loading" class="button-spinner" style="position: absolute;width: 0px;height: 0px;z-index: 2000000000;right: 0px;left: 0px;top: 0;bottom: 0;margin: auto"></div><script>AJS.$(".button-spinner").spin()</script>' +
				'<div ng-repeat="item in res" ng-click="sfSelectThisItem(item)" style="width: 100%;padding: 5px;cursor: pointer">{{item}}</div>' +
			'</div>' +
			'</div>',
		scope	: 	{
			funcstring	: '=',
			sfDdSelected: '=',
			res			: '='
		},
		link	: 	function(scope, elem, attrs) {
			scope.showItemsMenu = false;
			scope.gotData = false;
			scope.sfSelectThisItem = function (item) {
				scope.showItemsMenu = false;
				scope.sfDdSelected = item;
			};
			scope.executeApi = function() {
				scope.showItemsMenu = true;
				scope.loading = true;
				if(!scope.gotData){
					scope.$parent.$eval(scope.funcstring);
				}
				scope.$watch(function () {
					if (scope.res != undefined) {
						scope.loading = false;
						if(scope.res.length > 0){
							scope.gotData = true;
						}
					}
				});
			};
		}
	};



	// return {
	// 	restrict: 'EA',
	// 	scope   : true,
	// 	template: '<div><p ng-if="loading == '
	// 	+
	// 	'true'
	// 	+
	// 	'">Loading..</p><b>Result:</b>{{res}}</div>',
	// 	compile : function (tElement) {
	// 		return function postLink(scope, elem, attr) {
	// 			scope.loading = attr.apiready;
	// 			console.log("API DIRECTIVE: "+scope.loading);
	// 			scope.$eval(attr.funcstring);
	// 			scope.$watch(function(){
	// 				scope.res = attr.res;
	// 			});
	// 		};
	// 	}
	// };
}