/**
 SMOOTHFLOW LIST SORT UI COMPONENT (sf-listsort)

 This component will sort out an array of content with the aid of $filter service.

 INPUT   :
 - List to be sorted, an array
 - Property, Which is the placeholder for list item that needs to be sorted

 OUTPUT   :
 - Corresponding list will be sorted in forward and backward manner.
 */

angular
	.module('sfJira')
	.directive('sfSort', ['$filter', sfSortDirective]);

function sfSortDirective($filter) {
	return {
		restrict: 'AE',
		scope   : {
			headerList: '=',
			itemList  : '=',
			propName  : '='
		},
		template: '<div class="sf-listsort-wrap"><button class="sort_btn md-icon-button"><span ng-if="idel || reverse" class="aui-icon aui-icon-small aui-iconfont-arrow-up" ng-class="'
		+
		"{'inset':!idel"
		+
		'}"></span><span ng-if="idel || !reverse" class="aui-icon aui-icon-small aui-iconfont-arrow-down" ng-class="'
		+
		"{'inset':!idel"
		+
		'}"></span></button></div>',
		compile : function (tElement) {
			return function postLink(scope, elem, iElement) {
				scope.reverse = false;
				scope.idel = true;
				if(scope.reverse)scope.propName = null;
				elem.bind('click', function() {
					scope.itemList = $filter('orderBy')(scope.itemList, scope.propName, scope.reverse);
					scope.reverse = !scope.reverse;
					scope.idel = false;
					scope.$apply();
				});
			};
		}
	};
}