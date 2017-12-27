/**
 SMOOTHFLOW ARRAY DROPDOWN UI COMPONENT (sf-array-dd)

 This component will take an array of strings and convert it into a dropdown control.

 */

angular
	.module('sfJira')
	.directive('sfArrayDd', ['$filter', sfArrayDropdown]);

function sfArrayDropdown($filter) {
	return {
		restrict: 'AE',
		scope   : {
			arraylist    : '=',
			selecteditem : '='
		},
		template: '<div><select ng-model="selecteditem"><option value="i" ng-repeat="i in arraylist">{{i}}</option></select></div>',
		compile : function (tElement) {
			return function postLink(scope, elem, iElement) {

				elem.bind('click', function() {
					scope.$apply();
				});

			};
		}
	};
}