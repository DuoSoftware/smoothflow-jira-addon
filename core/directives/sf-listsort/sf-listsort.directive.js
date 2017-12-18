angular
	.module('sfJira')
	.directive('sfSort', ['$filter', sfSortDirective]);

function sfSortDirective($filter) {
	return {
		restrict: 'E',
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