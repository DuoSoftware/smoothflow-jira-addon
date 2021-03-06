app.controller('MainController', [
    '$scope',
    '$rootScope',
    '$state',
    '$timeout',
    '$http',
    'dataHandler',
    '$auth',
    '$objectstore',
    '$filter',
    'TriggerDatafactory',
    '$v6urls',
    '$helpers',
    '$location',
    '$window',
    'ngIntroService', mainController])
    .directive('textcomplete', ['Textcomplete', function (Textcomplete) {
        return {
            restrict: 'EA',
            scope: {
                args: '=',
                message: '=',
                placeholders: '='
            },
            template: '<textarea class="form-control" type="text" ng-click="hello()" placeholder={{placeholders}} ng-model=\'message\'></textarea>',
            link: function (scope, iElement, iAttrs) {
                var mentions = scope.args;
                var ta = iElement.find('textarea');
                var textcomplete = new Textcomplete(ta, [{
                    match: /(^|\s)@(\w*)$/,
                    search: function (term, callback) {
                        callback($.map(mentions, function (mention) {
                            return mention.toString().toLowerCase().indexOf(term.toString().toLowerCase()) === 0 ? mention : null;
                        }));
                    },
                    index: 2,
                    replace: function (mention) {
                        return '$1@' + mention + ' ';
                    }
                }]);
                $(textcomplete).on({
                    'textComplete:select': function (e, value) {
                        scope.$apply(function () {
                            scope.message = value
                        })
                    },
                    'textComplete:show': function (e) {
                        $(this).data('autocompleting', true);
                    },
                    'textComplete:hide': function (e) {
                        $(this).data('autocompleting', false);
                    }
                });
            }
        }
    }
    ])
    .directive('dropdown', function () {
        // console.log(value);
        return {
            restrict: 'EA',
            scope: {
                args: '=',
                message: '=',
                all: '='
            },

            template: '<select style="width:100%" placeholder="Select" ng-model="message" style="font-size:smaller;margin-top:0px;"><option ng-repeat="type in all"    value="{{type.value}}" ng-click="switchValue(type)">{{type.key}}</option>   </select>',
            link: function (scope, iElement, iAttrs) {
                var mentions = scope.args;

                console.log(scope.message);
                scope.switchValue = function (item) {
                    debugger;
                    console.log(item);
                }
            }

        }
    })
    .filter('filterComp', function () {
        return function (arr, compName) {
            if (!compName) {
                return arr;
            }
            var result = [];
            compName = compName.toLowerCase();
            angular.forEach(arr, function (comp) {
                if (comp.DisplayName.toLowerCase().indexOf(compName) !== -1) {
                    result.push(comp);
                }
            });
            return result;
        }
            ;
    })
    .filter('bytes', function () {
        return function (bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
    });

function mainController($scope, $rootScope, $state, $timeout, $http, dataHandler, $auth, $objectstore, $filter, TriggerDatafactory, $v6urls, $helpers, $location, $window, ngIntroService) {

    // if there is no selected rule it will navigate it to the home screen
    if ($scope.currentRuleID == undefined) {
        window.location.href = '#/home';
    }
    $scope.SaveFailed = false;
    $scope.fixedrate = "fixedrate";

    // Kasun_Wijeratne_27_JUNE_2017
    /*** JIRA component extraction*/
    AJS.$(".category-icon").tooltip();
    AJS.$('.button-spinner').spin();
    AJS.tablessortable.setTableSortable(AJS.$("#currentRulesSortable"));
    AJS.$(".template").tooltip();
    /*** JIRA component extraction - END*/

    $scope.toggleCompGroup = function (group) {
        $scope.activeCompGroup = group;
        $scope.isGroupOpen = !$scope.isGroupOpen;
    };
    $scope.toggleInnerCompGroup = function (group) {
        $scope.activeInnerCompGroup = group;
        $scope.isInnerGroupOpen = !$scope.isInnerGroupOpen;
    };

    //Kasun_Wijeratne_12_DEC_2017
    $scope.toggleAllComps = function (text) {
        if (text.length > 0) {
            $scope.expandAll = true;
        } else {
            $scope.expandAll = false;
        }
    };
    //Kasun_Wijeratne_12_DEC_2017 - END

    $scope.tab = false;
    $scope.scrollTo = function (id) {
        $location.hash(id);
        $scope.tab = id;
    };

    // Kasun_Wijeratne_27_JUNE_2017

    $rootScope.ShowBusyContainer = function (message) {
        document.getElementById("loading").style.display = "block";
        document.getElementById("loading").style.animation = "loadingappear 0.2s forwards";
        var element = document.getElementById("busycontent");
        element.innerHTML = "<h2>" + message + "</h2>";
    }
    $rootScope.HideBusyContainer = function () {
        document.getElementById("loading").style.animation = "loadingdisappear 0.2s backwards";
        $timeout(function () {
            document.getElementById("loading").style.display = "none";
        }, 1000);
    }
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

    var vm = this;
    // properties

    $rootScope.isNullOrEmptyOrUndefined = function (value) {
        return !value;
    };

    $scope.currentRules = [];
    // $scope.currentRules = [{
    //     id: 'rule01',
    //     ruleName: 'Print Message Flow',
    //     name: 'lakminiduosoftwarecom_print_message_flow',
    //     description: "This is a rule to print a message on the log.",
    //     createdDate: new Date().toString(),
    //     createdBy: 'Admin',
    //     status: 'Unpublished',
    //     switchState: 'on',
    //     workflow: [{
    //         "library_id": "0",
    //         "schema_id": 1,
    //         "parentView": "",
    //         "Name": "Start",
    //         "Icon": "ion-play",
    //         "Description": "this is a test description",
    //         "ControlEditDisabled": true,
    //         "Variables": [],
    //         "SourceEndpoints": [{
    //             "id": 0,
    //             "location": "BottomCenter"
    //         }],
    //         "TargetEndpoints": [],
    //         "Type": "start",
    //         "Category": "Flow Controls",
    //         "X": 0,
    //         "Y": 0,
    //         "OtherData": {},
    //         "Annotation": "",
    //         "DisplayName": "Start",
    //         "class": "Tools",
    //         "Categoryicon": "ion-ios-gear",
    //         "classicon": "ion-ios-gear",
    //         "ControlType": "action",
    //         "$$hashKey": "object:348",
    //         "workflow": []
    //     }, {
    //         "library_id": "4",
    //         "schema_id": 2,
    //         "parentView": "",
    //         "Name": "Message",
    //         "Icon": "ion-chatbox-working",
    //         "Description": "Message control can be used to print any sort of information on the workflow log. You can print argument values by starting with at.",
    //         "ControlEditDisabled": true,
    //         "Variables": [{
    //             "Key": "MessageBody",
    //             "Value": "",
    //             "Type": "Textbox",
    //             "Category": "",
    //             "DataType": "string",
    //             "Group": "Default",
    //             "Priority": "Mandatory"
    //         }],
    //         "SourceEndpoints": [{
    //             "id": 0,
    //             "location": "BottomCenter"
    //         }],
    //         "TargetEndpoints": [{
    //             "id": 0,
    //             "location": "TopCenter"
    //         }],
    //         "Type": "defaultitem",
    //         "Category": "Flow Controls",
    //         "X": 0,
    //         "Y": 0,
    //         "OtherData": {},
    //         "Annotation": "",
    //         "DisplayName": "Message",
    //         "class": "Tools",
    //         "Categoryicon": "ion-ios-gear",
    //         "classicon": "ion-ios-gear",
    //         "ControlType": "action",
    //         "$$hashKey": "object:350",
    //         "workflow": []
    //     }, {
    //         "library_id": "1",
    //         "schema_id": 3,
    //         "parentView": "",
    //         "Name": "Stop",
    //         "Icon": "ion-stop",
    //         "Description": "this is a test description",
    //         "ControlEditDisabled": true,
    //         "Variables": [],
    //         "SourceEndpoints": [],
    //         "TargetEndpoints": [{
    //             "id": 0,
    //             "location": "TopCenter"
    //         }],
    //         "Type": "stop",
    //         "Category": "Flow Controls",
    //         "X": 0,
    //         "Y": 0,
    //         "OtherData": {},
    //         "Annotation": "",
    //         "DisplayName": "Stop",
    //         "class": "Tools",
    //         "Categoryicon": "ion-ios-gear",
    //         "classicon": "ion-ios-gear",
    //         "ControlType": "action",
    //         "$$hashKey": "object:352",
    //         "workflow": []
    //     }],
    //     Variables: [{
    //         Key: 'Test',
    //         Value: 'Test',
    //         Category: 'Custom',
    //         DataType: 'string'
    //     }]
    // }, {
    //     id: 'condition_1',
    //     ruleName: 'Test condition',
    //     name: 'lakminiduosoftwarecom_test_condition',
    //     description: "Rule to test conditional components",
    //     createdDate: new Date().toString(),
    //     createdBy: 'Admin',
    //     status: 'Published',
    //     switchState: 'on',
    //     workflow: [{
    //         "library_id": "0",
    //         "schema_id": 1,
    //         "parentView": "",
    //         "Name": "Start",
    //         "Icon": "ion-play",
    //         "Description": "this is a test description",
    //         "ControlEditDisabled": true,
    //         "Variables": [],
    //         "SourceEndpoints": [{
    //             "id": 0,
    //             "location": "BottomCenter"
    //         }],
    //         "TargetEndpoints": [],
    //         "Type": "start",
    //         "Category": "Flow Controls",
    //         "X": 0,
    //         "Y": 0,
    //         "OtherData": {},
    //         "Annotation": "",
    //         "DisplayName": "Switch",
    //         "class": "Tools",
    //         "Categoryicon": "ion-ios-gear",
    //         "classicon": "ion-ios-gear",
    //         "ControlType": "condition",
    //         "$$hashKey": "object:348",
    //         "cases": [{
    //             "library_id": "0",
    //             "schema_id": 1,
    //             "parentView": "",
    //             "Name": "Case",
    //             "Icon": "ion-play",
    //             "Description": "this is a test description",
    //             "ControlEditDisabled": true,
    //             "Variables": [],
    //             "SourceEndpoints": [{
    //                 "id": 0,
    //                 "location": "BottomCenter"
    //             }],
    //             "TargetEndpoints": [],
    //             "Type": "start",
    //             "Category": "Flow Controls",
    //             "X": 0,
    //             "Y": 0,
    //             "OtherData": {},
    //             "Annotation": "",
    //             "DisplayName": "Case 1",
    //             "class": "Tools",
    //             "Categoryicon": "ion-ios-gear",
    //             "classicon": "ion-ios-gear",
    //             "ControlType": "action",
    //             "$$hashKey": "object:348"
    //         }, {
    //             "library_id": "0",
    //             "schema_id": 1,
    //             "parentView": "",
    //             "Name": "Case",
    //             "Icon": "ion-play",
    //             "Description": "this is a test description",
    //             "ControlEditDisabled": true,
    //             "Variables": [],
    //             "SourceEndpoints": [{
    //                 "id": 0,
    //                 "location": "BottomCenter"
    //             }],
    //             "TargetEndpoints": [],
    //             "Type": "start",
    //             "Category": "Flow Controls",
    //             "X": 0,
    //             "Y": 0,
    //             "OtherData": {},
    //             "Annotation": "",
    //             "DisplayName": "Case 2",
    //             "class": "Tools",
    //             "Categoryicon": "ion-ios-gear",
    //             "classicon": "ion-ios-gear",
    //             "ControlType": "action",
    //             "$$hashKey": "object:348"
    //         }]
    //     }, {
    //         "library_id": "4",
    //         "schema_id": 2,
    //         "parentView": "",
    //         "Name": "Message",
    //         "Icon": "ion-chatbox-working",
    //         "Description": "Message control can be used to print any sort of information on the workflow log. You can print argument values by starting with at.",
    //         "ControlEditDisabled": true,
    //         "Variables": [{
    //             "Key": "MessageBody",
    //             "Value": "",
    //             "Type": "Textbox",
    //             "Category": "",
    //             "DataType": "string",
    //             "Group": "Default",
    //             "Priority": "Mandatory"
    //         }],
    //         "SourceEndpoints": [{
    //             "id": 0,
    //             "location": "BottomCenter"
    //         }],
    //         "TargetEndpoints": [{
    //             "id": 0,
    //             "location": "TopCenter"
    //         }],
    //         "Type": "defaultitem",
    //         "Category": "Flow Controls",
    //         "X": 0,
    //         "Y": 0,
    //         "OtherData": {},
    //         "Annotation": "",
    //         "DisplayName": "Message",
    //         "class": "Tools",
    //         "Categoryicon": "ion-ios-gear",
    //         "classicon": "ion-ios-gear",
    //         "ControlType": "action",
    //         "$$hashKey": "object:350"
    //     }, {
    //         "library_id": "1",
    //         "schema_id": 3,
    //         "parentView": "",
    //         "Name": "Stop",
    //         "Icon": "ion-stop",
    //         "Description": "this is a test description",
    //         "ControlEditDisabled": true,
    //         "Variables": [],
    //         "SourceEndpoints": [],
    //         "TargetEndpoints": [{
    //             "id": 0,
    //             "location": "TopCenter"
    //         }],
    //         "Type": "stop",
    //         "Category": "Flow Controls",
    //         "X": 0,
    //         "Y": 0,
    //         "OtherData": {},
    //         "Annotation": "",
    //         "DisplayName": "Stop",
    //         "class": "Tools",
    //         "Categoryicon": "ion-ios-gear",
    //         "classicon": "ion-ios-gear",
    //         "ControlType": "action",
    //         "$$hashKey": "object:352"
    //     }],
    //     Variables: []
    // }];

    $rootScope.changeTab = function (tab) {
        $rootScope.view_tab = tab;
    }

    $scope.selectedRule = {};
    $scope.selectedRule.workflow = {};
    $scope.ruleEdit = false;
    $scope.componentsMenuState = 'closed';
    $scope.compMenuState = "left";
    $scope.isNewRuleFormValid = false;
    $scope.pendingComponentType = "";
    $scope.currentRuleID = "";
    $scope.Variable = {};
    $rootScope.listState = "home";
    $scope.variableEditOn = null;
    $scope.allVariables = [];
    $scope.successNotifications = [];
    $scope.errorNotifications = [];
    $scope.callFromSwitch = false;

    $scope.structuredComps = [{
        'Name': 'Actions',
        'components': [],
        'classes': {}
    }, {
        'Name': 'Conditions',
        'components': [],
        'classes': {}
    }];

    var collapsiblePanels = [];
    var compSearch = [];
    var mainContent = null;
    var workflowHeight = null;
    var workflowWidth = null;
    var workflowUI = null;
    var propertiesElem = null;
    var workflowElem = null;
    var componentBlock = null;
    var directCondConnectors = null;
    var workflowBlocks = null;
    var shadowedGroupItems = null;
    var selectItemBody = null;
    var shadowedGroupItemsHeight = null;
    var workflowComponentss = null;
    var outerBlocks = null;

    /////////////////////////////// METHODS ////////////////////////////////////////////////////////////////////////

    // Watchers
    $scope.$watch(function () {
        componentBlock = document.getElementsByClassName('condition-block');
        directCondConnectors = document.getElementsByClassName("sub-cond-connector");
        workflowBlocks = document.getElementsByClassName("workflow-block");
        outerBlocks = document.getElementsByClassName("outer");

        if (componentBlock.length != 0) {
            angular.forEach(componentBlock, function (elem) {
                angular.forEach(elem.childNodes, function (child) {
                    if (child.className != undefined) {
                        if (child.className == 'workflow-add-node-sub') {
                            var separated = child;
                            separated.setAttribute('style', 'margin-top:10px');
                            elem.append(separated);
                        }
                        // else if (child.parentElement.previousElementSibling != null) {
                        //     if (child.className == 'sub-cond-connector switch' || child.className == 'sub-cond-connector if' || child.className == 'sub-cond-connector case' || child.className == 'sub-cond-connector default' || child.className == 'sub-cond-connector fallthrough') {
                        //         child.remove();
                        //     }
                        // }
                    }
                });
            });
        }

        if (workflowBlocks.length != 0) {
            angular.forEach(workflowBlocks, function (block) {
                var blockNextSiblingClass = block.nextElementSibling != null ? block.nextElementSibling.className.split(' ')[0] : null;
                if (blockNextSiblingClass == 'workflow-block' && blockNextSiblingClass != 'condition-block') {
                    angular.element(block).find('.body').css('border-left', 'solid 1px #bbb');
                }
                var componentClass = block.className.split(' ')[2];
                if (componentClass == 'component-true' || componentClass == 'component-false' || componentClass == 'component-case' || componentClass == 'component-default' || componentClass == 'component-fallthrough') {

                    //Kasun_Wijeratne_11_DEC_2017
                    var o = angular.element(block).find('>.outer');
                    if (o.children().length > 0) {
                        if (componentClass == 'component-case' || componentClass == 'component-default' || componentClass == 'component-fallthrough') {
                            angular.element(block).find('>.workflow-add-node-sub:last-child').css('display', 'none');
                            angular.element(block).find('>.offset').css('display', 'none');
                        } else {
                            angular.element(block).find('>.workflow-add-node-sub').css('display', 'none');
                        }
                    } else {
                        angular.element(block).find('>.workflow-add-node-sub').css('display', 'block');
                    }
                    //Kasun_Wijeratne_11_DEC_2017 - END

                    var outers = angular.element(block).find('.outer');
                    angular.forEach(outers, function (outer) {
                        //angular.forEach(outer.children, function (child) {
                        // if (child.className.split(' ')[0] == 'workflow-block') {
                        // 	var o = angular.element(child).find('>.outer');
                        // 	if(o.children().length > 0){
                        // 	angular.element(block).find('>.workflow-add-node-sub').css('display', 'none');
                        // }
                        // } else {
                        //     angular.element(block).find('>.workflow-add-node-sub').css('display', 'block');
                        // }
                        //});
                        var outerParent = outer.parentElement.className.split(' ')[2];
                        if (outerParent == 'component-true' || outerParent == 'component-false' || outerParent == 'component-case' || outerParent == 'component-default' || outerParent == 'component-fallthrough') {
                            var elem = angular.element(outer);
                            var _elem = elem.find('.workflow-block').first();
                            if (_elem != undefined) {
                                if (!_elem.has('.sub-cond-connector').length) {
                                    _elem.prepend('<label class="sub-cond-connector"></label>');
                                }
                            }
                        }
                    });
                }
            });
        }

        /////// 10_24_2017_Separate_Loop_Outer_WORKING
        // if(outerBlocks.length != 0){
        // angular.forEach(outerBlocks, function (outer) {
        // 		if(outer.parentElement.className.split(' ')[2] == 'component-true' || outer.parentElement.className.split(' ')[2] == 'component-false'){
        // 			var elem = angular.element(outer);
        // 			var _elem = elem.find('.workflow-block').first();
        // 			if(_elem != undefined) {
        // 				if(!_elem.has('.sub-cond-connector').length){
        // 					_elem.prepend('<label class="sub-cond-connector"></label>');
        // 				}
        // 			}
        // 		}
        // 	});
        // }
        //10_24_2017_Separate_Loop_Outer_WORKING - END ///////

        /////// 10_22_2017_Temp_Comment
        // if (workflowBlocks.length != 0) {
        // angular.forEach(workflowBlocks, function (block) {
        // 	if (block.previousElementSibling != null && block.previousElementSibling.className.split(' ')[0] == 'workflow-block' && block.className.split(' ')[1] != 'condition-block') {
        // 		var item = angular.element(block).find('.sub-cond-connector')[0];
        // 		if (item != undefined)
        // 			item.remove();
        // 	}
        // 	if (block.nextElementSibling != null && block.nextElementSibling.className.split(' ')[0] == 'workflow-block' && block.nextElementSibling.className.split(' ')[2] != 'condition-block') {
        // 		angular.element(block).find('.body').css('border-left', 'solid 1px #bbb');
        // 	}
        // 	if (block.className.split(' ')[2] == 'component-true' || block.className.split(' ')[2] == 'component-false' || block.className.split(' ')[2] == 'component-case') {
        // 		var outers = angular.element(block).find('.outer');
        // 		angular.forEach(outers, function (outer) {
        // 			angular.forEach(outer.children, function (child) {
        // 				if (child.className.split(' ')[0] == 'workflow-block') {
        // 					angular.element(block).find('>.workflow-add-node-sub').css('display', 'none');
        // 				} else {
        // 					angular.element(block).find('>.workflow-add-node-sub').css('display', 'block');
        // 				}
        // 			});
        // 		});
        // 	}
        // });
        // }
        // 10_22_2017_Temp_Comment///////

    });
    $scope.$watch(function () {
        workflowHeight = (window.innerHeight) - 111;
        workflowUI = document.getElementById('workflow-ui');
        propertiesElem = document.getElementById('property-wrap');
        workflowElem = document.getElementById('workflow-wrap');
        shadowedGroupItems = document.getElementsByClassName('shadowed-item');
        selectItemBody = document.getElementsByClassName('select-item-body');
        workflowComponentss = $('#workflow-components');
        $scope.propertyPanelWidthGLOBAL = $('.properties-pane').width();
        workflowWidth = window.innerWidth - $scope.propertyPanelWidthGLOBAL;

        if (workflowComponentss != undefined) {
            workflowComponentss.css('margin-right', $scope.propertyPanelWidthGLOBAL + 'px');
        }
        if (workflowUI != undefined) {
            workflowUI.setAttribute("style", "height:" + workflowHeight + "px");
        }
        if (shadowedGroupItems != undefined) {
            shadowedGroupItemsHeight = workflowHeight - 120;
            angular.forEach(shadowedGroupItems, function (item) {
                item.setAttribute("style", "height:" + shadowedGroupItemsHeight + "px");
            });
        }
        if (selectItemBody != undefined) {
            var selectItemBodyHeight = shadowedGroupItemsHeight - 84;
            angular.forEach(selectItemBody, function (item) {
                item.setAttribute("style", "height:" + selectItemBodyHeight + "px;overflow-y:scroll");
            });
        }

        if (propertiesElem != undefined && workflowHeight != undefined)
            propertiesElem.setAttribute("style", "height:" + workflowHeight + "px;overflow-y:scroll;overflow-x:hidden");
        if (workflowElem != undefined && workflowHeight != null)
            workflowElem.setAttribute("style", "height:" + workflowHeight + "px;max-width:" + workflowWidth + "px;overflow-y:scroll;overflow-x:scroll");
    });

    angular.element($window).bind('resize', function () {
        if (workflowComponentss != undefined) {
            workflowComponentss.css('margin-right', $('.properties-pane').width() + 'px');
        }
        if (workflowElem != undefined && workflowHeight != null)
            workflowElem.setAttribute("style", "height:" + workflowHeight + "px;max-width:" + workflowWidth + "px;overflow-y:scroll;overflow-x:scroll");
    });

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

    $scope.setInitialCollapse = function (index) {
        angular.forEach(compSearch, function (comp) {
            comp.setAttribute("style", "display:none");
        });
        $scope.ico = true;
        $scope.currentOpenMenu = index;
        collapsiblePanels = document.getElementsByClassName('comp-panel-collapse');
        compSearch = document.getElementsByClassName('comp-search');
        collapsiblePanels[index].setAttribute("style", "display:block;height:" + (workflowHeight - 126) + "px!important;overflow-y:scroll;overflow-x:hidden");
        compSearch[index].setAttribute("style", "display:block");
        for (i = 0; i < collapsiblePanels.length; i++) {
            if (i != index) {
                collapsiblePanels[i].setAttribute("style", "display:none");
            }
        }

        $timeout(function () {
            index == 0 ? $rootScope.initialGuideProvider(null, '#comp-panel-actions', 'Click on any groups to open or collapse a panel and click on a component to add') : $rootScope.initialGuideProvider(null, '#comp-panel-conditions', 'Click on any groups to open or collapse a panel and click on a component to add');
        }, 500);
    };

    $scope.getRuleDetails = function () {

        $scope.processlist = [];
        var client = $objectstore.getClient("process_flows_versions");
        client.onGetMany(function (data) {
            if (data) {
                //console.log(data);
                $scope.currentRules = [];
                $scope.processlist = data;

                angular.forEach($scope.processlist, function (rule) {
                    var obj = {
                        id: rule.ID,
                        name: rule.Name,
                        ruleName: rule.DisplayName,
                        description: rule.Description,
                        createdDate: rule.DateTime,
                        createdBy: rule.AuthorDetails.Name.replace("+", " "),
                        avatar: rule.AuthorDetails.Avatar,
                        status: '...',
                        executions: 0,
                        switchState: 'on',
                        workflow: [],
                        Variables: []
                    }
                    $scope.currentRules.push(obj);
                });
                //debugger
                $scope.getCurrentUser();
            }
        });
        client.onError(function (data) {
            $rootScope.DisplayMessage("No rules found.", "error", "You do not have any saved rules stored to be loaded.");
            $rootScope.HideBusyContainer();
        });
        client.v1getByFiltering("*");

    };

    $scope.$on('uiStateChanged', function (event, data) {
        alert("Statue changed");
    });
    /** get API key */
    $scope.GetAPIKey = function () {
        $http({
            method: "GET",
            url: "https://nginxproxymaker.plus.smoothflow.io/getKeyFile/" + $scope.SessionDetails.Domain + "/ignore"
        }).then(function Success(response) {

            if (response.data.success == true) {
                $rootScope.APIKey = response.data.apikey;
            }
        }, function Error(response) {
        });
    }

    $scope.setDockerInformation = function (name) {
        var selected = $scope.NGINXData.filter(function (container) {
            return (container.zone == name);
        });
        if (selected.length > 0) {
            $scope.DockerDetails = selected[0];
            $scope.DockerDetails.d1xx = $scope.DockerDetails.values.responses['1xx'];
            $scope.DockerDetails.d2xx = $scope.DockerDetails.values.responses['2xx'];
            $scope.DockerDetails.d3xx = $scope.DockerDetails.values.responses['3xx'];
            $scope.DockerDetails.d4xx = $scope.DockerDetails.values.responses['4xx'];
            $scope.DockerDetails.d5xx = $scope.DockerDetails.values.responses['5xx'];
            $scope.DockerDetails.total = $scope.DockerDetails.values.responses['total'];
        }

        $scope.GeneratedURL = null;
        $scope.containerBaseURL = "https://" + name + ".plus.smoothflow.io/" + name + "/smoothflow";
        $scope.GeneratedURL = [{
            // URL: "/Invoke?apikey=" + $rootScope.APIKey,
            URL: "/Invoke?apikey",
            URLFULL: $scope.containerBaseURL + "/Invoke?apikey",
            METHOD: "POST"
        }, {
            // URL: "/Hello?apikey=" + $rootScope.APIKey,
            URL: "/Hello?apikey",
            URLFULL: $scope.containerBaseURL + "/Hello?apikey",
            METHOD: "GET"
        }];

    }

    $scope.CallInvoke = function () {
        var optionalJSON = {};
        var inarguments = dataHandler.retrieveInArgumentsKeys();

        angular.forEach(inarguments, function (argument) {
            optionalJSON[argument] = "";
        });

        console.log(JSON.stringify(optionalJSON));
        $scope.optionalJSON = JSON.stringify(optionalJSON, undefined, 4)
        // $scope.optionalJSON = JSON.stringify(optionalJSON);
    };

    $scope.apiKey = null;
    $scope.candidateURL = null;
    $scope.candidateBody = null;
    $scope.responseMsg = "";

    $scope.apiUrlDialog = function (url, body) {
        $scope.candidateURL = url;
        $scope.candidateBody = body;
        AJS.dialog2("#api-key-dialog").show();
    };

    $scope.callurl = function (key) {
        $scope.pendingResponse = true;
        AJS.dialog2("#api-key-dialog").hide();
        var req = {
            method: $scope.candidateURL.METHOD,
            url: $scope.containerBaseURL + $scope.candidateURL.URL + "=" + key,
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.candidateBody
        }
        $http(req).then(function (data) {
            $scope.Iscall = true;
            $scope.pendingResponse = false;
            $scope.statuscode = data.status;
            $scope.responseMsg = JSON.stringify(data.data, null, "\t");
            $scope.getDockerDetails();
            $timeout($scope.GaugeChart(), 10000);

            // $scope.setDockerInformation($scope.selectedRule.name);

        }, function (data) {
            $scope.Iscall = true;
            $scope.pendingResponse = false;
            $scope.statuscode = data.status;
            $scope.responseMsg = JSON.stringify(data.data, null, "\t");

        });
    };

    /** Google Chart */
    //Line Chart
    $scope.RealTimeLineChart = function () {

        var requestData = [];

        google.charts.load("current", { packages: ["corechart", "line"] });
        google.charts.setOnLoadCallback(drawBasic);

        function drawBasic() {

            var data = new google.visualization.DataTable();
            data.addColumn("number", "X");
            data.addColumn("number", "Request");
            data.addColumn("number", "Reject");

            data.addRows([
                [1, 37.8, 80.8],
                [2, 30.9, 69.5],
                [3, 25.4, 57],
                [4, 11.7, 18.8],
                [5, 11.9, 17.6],
                [6, 8.8, 13.6],
                [7, 7.6, 12.3],
                [8, 12.3, 29.2],
                [9, 16.9, 42.9],
                [10, 12.8, 30.9],
                [11, 5.3, 7.9],
                [12, 6.6, 8.4],
                [13, 4.8, 6.3],
                [14, 4.2, 6.2]
            ]);

            var options = {
                hAxis: {
                    title: "Time"
                },
                vAxis: {
                    title: "Request"
                }
            }

            var chart = new google.visualization.LineChart(document.getElementById("chart_div1"));
            chart.draw(data, options);
        }
    };
    // Bar Chart
    $scope.BarChart = function () { };
    // Gauge Chart
    $scope.GaugeChart = function () {

        $scope.redColor = 100000 - 1000;
        $scope.yellow = 100000 - 2000;

        google.charts.load('current', { 'packages': ['gauge'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                ['Processed', $scope.DockerDetails.values.requests],
                ['Rejected', $scope.DockerDetails.values.discarded],

            ]);

            var options = {
                width: 800, height: 200,
                redFrom: 100000 - 10000, redTo: 100000,
                yellowFrom: 100000 - 20000, yellowTo: 100000 - 10000,
                minorTicks: 5,
                max: 100000
            };

            var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

            chart.draw(data, options);

        }
    };
    /** Google Chart - End */

    $scope.SupportedDataTypes = dataHandler.getSupportedDataTypes();

    $scope.openSelectedRule = function (selectedRule, entry) {
        $timeout(function () {
            //debugger
            $scope.selectedModule = [];
            $rootScope.ShowBusyContainer("Loading rule details...");
            $scope.currentRuleID = selectedRule.id;
            $scope.selectedRule = selectedRule;
            var flowVersion = $scope.getVersionForWF($scope.currentRuleID);
            $scope.getSchedule(selectedRule.name);
            if ($scope.selectedRule.workflow.length == 0) {
                var client = $objectstore.getClient("process_flows");
                client.onGetOne(function (data) {
                    $rootScope.ShowBusyContainer("Almost done...");
                    if (data.length !== 0) {
                        // structure data back to JIRA addon format
                        var converted;
                        try {
                            converted = JSON.parse(data.JSONData);
                        } catch (e) {
                            converted = data.JSONData;
                        }
                        dataHandler.setFlowObject(converted);
                        dataHandler.setArguments(data.JSONData.arguments);
                        TriggerDatafactory.setworkflowId(data.Name);
                        $rootScope.selectedRuleName = data.Name;
                        var nodes = dataHandler.getNodesForState("drawboard");
                        var connections = dataHandler.getConnectionsForState("drawboard");
                        $scope.setDockerInformation(data.Name);
                        $scope.openRuleLatestData(nodes);


                        if ($scope.selectedRule.status == "Published") {
                            $scope.getScheduleDetails();
                        }
                    } else {
                        $rootScope.HideBusyContainer();
                        $rootScope.DisplayMessage("Unable to load workflow", "error");
                        $timeout(function () {
                            $rootScope.initialGuideProvider(null, '#auto-details-controls', 'You can make changed to your automation here. You can Edit details or Delete this automation');
                        }, 2000);
                    }

                }).V1getByKey(flowVersion[0]);
            } else {
                //debugger
                $scope.openRuleLatestData($scope.selectedRule.workflow);
                TriggerDatafactory.setworkflowId($scope.selectedRule.name);
                $rootScope.selectedRuleName = $scope.selectedRule.name;
                $scope.setDockerInformation($scope.selectedRule.name);
                $rootScope.HideBusyContainer();
                $timeout(function () {
                    $rootScope.initialGuideProvider(null, '#auto-details-controls', 'You can make changed to your automation here. You can Edit details or Delete this automation');
                }, 2000);
            }

        }, 0).then(function () {
            //call trigger Service to set workflow ID
            // TriggerDataService.setWorkflowID($scope.currentRuleID);
            $rootScope.listState = 'rule.details';
            $state.go('rule.details');
            setSectionHeight();
        });
    };

    $scope.openRuleLatestData = function (nodes) {
        $scope.selectedRule.workflow = nodes;
        //Restructured workflow functions
        $scope.component = {
            workflow: $scope.selectedRule.workflow
        };
        $scope.getAllArguments();
        //call trigger Service to set workflow ID
        //debugger;
    };

    /*/////////////////////////////////////////////////////////////////////////////////////////////*/
    ///// Publishing mechanism
    $scope.executable = {};
    $scope.executable.port = Math.floor(Math.random() * (65535 - 49152) + 49152);
    $scope.getports = function () {
        $http({
            url: $v6urls.globalOS + "/occupiedPorts?take=70000",
            method: "GET",
            headers: {
                'securityToken': "ignore"
            }
        }).
            then(function (data, status, headers, config) {
                if (data) {
                    $scope.portlist = data;
                    $scope.setport();
                }
            }, function (data, status, headers, config) {
                $rootScope.DisplayMessage("Error when retriving port information", "error", "Please contact an administrator.");
            });

        // var client = $objectstore.getClient("occupiedPorts");
        // client.onGetMany(function (data) {
        //     if (data) {
        //         $scope.portlist = data;
        //         $scope.setport();
        //     }
        // });
        // client.v1getByFiltering("*");
    };

    $scope.setport = function () {
        if (!$scope.checkport($scope.executable.port)) {
            $scope.executable.port = Math.floor(Math.random() * (65535 - 49152) + 49152);
            $scope.setport();
        }
    };

    //Delate Prot
    $scope.DeletePort = function (workflowId) {
        $http({
            url: $v6urls.globalOS + "/occupiedPorts",
            method: "DELETE",
            headers: {
                'securityToken': "ignore"
            },
            data: workflowId
        }).
            then(function (data, status, headers, config) {
                if (data) {
                    //  $scope.portlist = data;
                    console.log(data);

                }
            }, function (data, status, headers, config) {
                $rootScope.DisplayMessage("Error when deleting port information", "error", "Please contact an administrator.");
            });
    };
    $scope.checkport = function (port) {
        for (x = 0; x < $scope.portlist.length; x++) {
            if ($scope.portlist[x].port == port) {
                return false;
            }
        }
        return true;
    };

    $scope.getports();

    $scope.saveports = function (portObj) {
        debugger
        var port = { "Object": portObj, "Parameters": { "KeyProperty": "id" } }
        $http({
            url: $v6urls.globalOS + "/occupiedPorts",
            method: "POST",
            headers: {
                'securityToken': "ignore"
            },
            data: port
        }).then(function (data, status, headers, config) {
            $rootScope.DisplayMessage("Port details saved successfully.", "success");
            $scope.getports();
        }, function (data, status, headers, config) {
            $rootScope.DisplayMessage("Error when saving port information", "error", "Please contact an administrator.");
        });
    };

    $scope.stripConvertionDetails = function (flowData) {
        angular.forEach(flowData.arguments, function (argument) {
            if (argument.Value != undefined) {
                valueList = argument.Value.split(".");
                for (c = 0; c < valueList.length; c++) {
                    if (c == 0) {
                        //argument.Value = valueList[c];
                        argument.Value = argument.Value;
                    }
                }
            }
            ;
        });
        angular.forEach(flowData.nodes, function (node) {
            angular.forEach(node.Variables, function (variable) {
                if (variable.Value != undefined) {
                    if (variable.Type == "dynamic") {
                        valueList = variable.Value.split(".");
                        // the checking value and the one next to it should pass convertion types. 
                        for (c = 0; c < valueList.length; c++) {
                            if (c == 0) {
                                var argKey = valueList[c];
                                var argKey = argKey.replace("@", "");
                                variable.Value = argKey.trim();
                            }
                        }
                    }
                    if (variable.Type == "custom") {
                        // the checking value and the one next to it should pass convertion types. 
                        for (c = 0; c < variable.ValueList.length; c++) {
                            var val = variable.ValueList[c].value;
                            var val = val.replace("@", "");
                            variable.ValueList[c].value = val.trim();
                            if (variable.ValueList[c].type != "dynamic") {
                                if (c == 0) {
                                    variable.ValueList[c].value += "\xa0";
                                }
                                if (c > 0 && c < variable.ValueList.length) {
                                    variable.ValueList[c].value = "\xa0" + variable.ValueList[c].value + "\xa0";
                                }
                            }
                        }
                    }
                }
                ;
            });
        });
        return flowData;
    };

    $scope.errorList = [];
    $scope.validateBeforeSave = function () {
        $scope.errorList = [];
        var result = true;
        // reset the datahander data to re generate it again except the variable / argument data
        dataHandler.resetAddonDesign();
        // strating workflow data convertion
        $scope.setupNodes();
        $scope.setupConnections();
        var errors = dataHandler.validateWorkflow();
        if (errors.length > 0) {
            result = false;
            AJS.dialog2("#validation-errors").show();
            $scope.errorList = errors;
        } else {
            AJS.dialog2("#validation-errors").hide();
        }
        return result;
    };

    $scope.closeValidationPage = function () {
        AJS.dialog2("#validation-errors").hide();
    };

    $scope.publishWorkflow = function () {
        if ($scope.validateBeforeSave()) {
            // generate new port for the rule which is not currently in use.
            $scope.setport();
            $rootScope.ShowBusyContainer("Building your automation rule...");
            // building the workflow into an executable

            var flowChartJson = dataHandler.getSaveJson();
            flowChartJson.Port = $scope.executable.port.toString();
            flowChartJson.OSCode = "linux";
            flowChartJson.SysArch = "amd64";
            newJSON = $scope.stripConvertionDetails(angular.copy(flowChartJson));
            var authorDetails = {
                "Name": $scope.SessionDetails.name,
                "Email": $scope.SessionDetails.emails[0],
                "Domain": $scope.SessionDetails.Domain
            }
            var saveObject = {
                "ID": dataHandler.createuuid(),
                "WFID": $scope.selectedRule.id,
                "Name": $scope.getWFName($scope.selectedRule.ruleName),
                "DisplayName": $scope.selectedRule.ruleName,
                "comment": "",
                "Description": "",
                "version": "",
                "DateTime": new Date(),
                "UserName": $scope.SessionDetails.emails[0],
                "JSONData": newJSON,
                "AuthorDetails": authorDetails,
                "Port": flowChartJson.Port,
                "OSCode": flowChartJson.OSCode,
                "SysArch": flowChartJson.SysArch
            };

            var sessionId = dataHandler.createuuid();
            var flowname = saveObject.Name;
            flowname = flowname.replace(' ', '');
            var URL = $v6urls.processManager + "/processengine/DownloadExecutable/";
            var actualURL = URL + flowname + "/" + sessionId;

            $http.post(actualURL, saveObject.JSONData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'SecurityToken': $helpers.getCookie("securityToken")
                }
            }).then(function OnSuccess(response) {
                $rootScope.ShowBusyContainer("Publishing automation to a container...");
                if (response.data.Status) {
                    $scope.setScheduleforWorkflow($scope.currentScheduleRule);
                    var obj = {};
                    obj.wfname = $scope.getWFName($scope.selectedRule.ruleName);
                    obj.port = $scope.executable.port.toString();
                    obj.RAM = "300";
                    obj.CPU = "10";
                    $scope.PublishToDocker(obj);
                    // save port information only if the build is successfull.
                    var portObj = {
                        id: $scope.getWFName($scope.selectedRule.ruleName),
                        port: $scope.executable.port
                    }
                    $scope.saveports(portObj);
                } else {
                    $rootScope.DisplayMessage("Error when building the rule.", "error", "Please contact an administrator.");
                    $rootScope.HideBusyContainer();
                }
            }, function OnError(response) {
                if (response) {
                    $rootScope.DisplayMessage("Error when publishing rule to a container.", "error", "The process did not happen properly. Please contact an adminitrator.");
                    $rootScope.HideBusyContainer();
                }
            });
        }
    };

    $scope.setCurrentRuleStatus = function (status) {
        $scope.selectedRule.status = status;
    }

    $scope.PublishToDocker = function (publishObj) {
        var sessionId = dataHandler.createuuid();
        var JsonBody = {
            "SessionID": sessionId,
            "WFName": publishObj.wfname,
            "Port": publishObj.port,
            "RAM": publishObj.RAM,
            "CPU": publishObj.CPU
        };
        var URL = $v6urls.processManager + "/processengine/PublishToDocker/";

        $http.post(URL, JsonBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'SecurityToken': "ignore",
                'Tenant': $scope.SessionDetails.Domain
            }
        }).then(function OnSuccess(response) {
            if (response.data.Status) {
                $rootScope.DisplayMessage("Published to a container successfully.", "success");
                $scope.GetAPIKey();
                $scope.setCurrentRuleStatus("Published");
                $rootScope.changeLocation("rule.container");
                $timeout(function () {
                    $scope.getDockerDetails();
                    $scope.setDockerInformation($scope.getWFName($scope.selectedRule.ruleName));
                });
            } else {
                $rootScope.DisplayMessage("Error occured when publishing the rule to a container.", "error");
            }
            $rootScope.HideBusyContainer();
        }, function OnError(response) {
            if (response) {
                $rootScope.DisplayMessage("Error occured when publishing the rule to a container.", "error");
                $rootScope.HideBusyContainer();
            }
        });
    };
    ///// Publishing mechanism - END
    /*/////////////////////////////////////////////////////////////////////////////////////////////*/

    $scope.getVersionForWF = function (ID) {
        var obj = {};
        angular.forEach($scope.processlist, function (flow) {
            if (flow.ID == ID) {
                obj = flow.version;
            }
        });
        return obj;
    };

    $scope.checkScheduleStatus = function () {
        var toggle = document.getElementById('scheduleActive');
        var toggle2 = document.getElementById('scheduleAvailable');
        if (toggle != null) {
            if ($scope.scheduleActive) {
                toggle.checked = true;
            } else {
                toggle.disabled = true;
            }
        }
        if (toggle2 != null) {
            if ($scope.scheduleAvailable) {
                toggle2.checked = true;
            } else {
                toggle2.disabled = true;
            }
        }
    };

    $rootScope.changeLocation = function (location) {
        $scope.componentsMenuState = 'closed';
        $rootScope.listState = location;
        // update WF before leaving to another state
        $scope.updateWorkflowBeforeStateChange(location);
        $state.go(location);
        console.log("Navigating to State:", $state);

        if (location == "rule.container") {
            $timeout(function () {
                $scope.CallInvoke();
                $scope.RealTimeLineChart();
                $scope.GaugeChart();
            });
        } else if (location == "rule.schedule") {
            $timeout(function () {
                $scope.checkScheduleStatus();
            });
        }
        setSectionHeight();
    };

    $scope.updateWorkflowBeforeStateChange = function (location) {
        var index = 0;
        angular.forEach($scope.currentRules, function (rule) {
            //debugger
            if (rule.id == $scope.currentRuleID) {
                if (location == "home") {
                    //debugger
                    $scope.component = {};
                    dataHandler.resetFactory();
                }
                $scope.currentRules[index] = $scope.selectedRule;
            }
            index++;
        });
    };

    //Initialization
    $scope.getControlData = function () {
        $http({
            method: 'GET',
            url: 'json/controldata.json',
            dataType: "json",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
                "Content-Type": "text/json"
            }
        }).then(function successCallback(response) {
            console.log("");
            console.log("Control JSON Received : ");
            console.log(response);
            // addnewitemstoJson(response.data.Controls);
            $scope.allcomponents = response.data.Controls;

            if ($scope.allcomponents.length != 0) {
                angular.forEach($scope.allcomponents, function (item) {
                    // if (item.ControlType == 'trigger') {
                    //     item.workflow = [];
                    //     $scope.structuredComps[0].components.push(item);
                    // }
                    // item.outerExpanded = true;
                    if (item.ControlType == 'action') {
                        item.workflow = [];
                        $scope.structuredComps[0].components.push(item);
                    }
                    if (item.ControlType == 'condition') {
                        if (item.DisplayName.toLowerCase() == 'if') {
                            item.workflow = [{
                                DisplayName: 'True',
                                ControlType: 'condition',
                                workflow: [],
                                webicon: "true.png"
                            }, {
                                DisplayName: 'False',
                                ControlType: 'condition',
                                workflow: [],
                                webicon: "false.png"
                            }];
                        } else if (item.DisplayName.toLowerCase() == 'switch') {
                            item.workflow = [{
                                DisplayName: 'Case',
                                ControlType: 'condition',
                                workflow: [],
                                Variables: [
                                    {
                                        "Category": "InArgument",
                                        "DataType": "string",
                                        "Group": "Default",
                                        "Key": "CaseValue",
                                        "Priority": "Mandatory",
                                        "Type": "dynamic",
                                        "Value": "",
                                        "advance": false,
                                        "control": "Textbox",
                                        "placeholder": "@CaseValue"
                                    }
                                ],
                                webicon: "hierarchy-structure.png"

                            }, {
                                DisplayName: 'Case',
                                ControlType: 'condition',
                                workflow: [],
                                Variables: [
                                    {
                                        "Category": "InArgument",
                                        "DataType": "string",
                                        "Group": "Default",
                                        "Key": "CaseValue",
                                        "Priority": "Mandatory",
                                        "Type": "dynamic",
                                        "Value": "",
                                        "advance": false,
                                        "control": "Textbox",
                                        "placeholder": "@CaseValue"
                                    }
                                ],
                                webicon: "hierarchy-structure.png"
                            }, {
                                DisplayName: 'Default',
                                ControlType: 'condition',
                                workflow: [],
                                webicon: "hierarchy-structure.png"
                            }];
                        }
                        $scope.structuredComps[1].components.push(item);
                    }
                });

                angular.forEach($scope.structuredComps, function (comp) {
                    var temp = $filter('groupBy')(comp.components, 'class');
                    comp.classes = $.map(temp, function (value, index) {
                        return { 'title': index, 'data': value };
                    });
                    delete comp.components;
                    angular.forEach(comp.classes, function (_comp) {
                        _comp.categories = {};
                        var temp2 = $filter('groupBy')(_comp.data, 'Category');
                        _comp.categories = $.map(temp2, function (value, index) {
                            return { 'title': index, 'data': value };
                        });
                        delete _comp.data;
                    });
                });
                // debugger;
            }
            console.log($scope.structuredComps);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    //add new element in JSON
    function addnewitemstoJson(controlJSON) {
        controlJSON.forEach(function (element) {
            element.help = "";
            element.url = [{ "name": "", "url": "" }];

            if (element.Variables.length > 0) {
                element.Variables.forEach(function (elements) {
                    elements.placeholder = "@" + elements.Key;
                }, this);
            }

        }, this);

        console.log(JSON.stringify(controlJSON))

        debugger;
    };
    $scope.getControlData();

    $scope.getTemplateData = function () {
        $http({
            method: 'GET',
            url: 'json/templatedata.json',
            dataType: "json",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
                "Content-Type": "text/json"
            }
        }).then(function successCallback(response) {
            console.log("");
            console.log("Control JSON Received : ");
            console.log(response);
            $scope.templates = response.data.Templates;

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.getTemplateData();

    // New rule
    $scope.newRule = function (template, isFromTemp) {
        $rootScope.isFromTemplate = isFromTemp;
        $rootScope.selectedTemplate = template;
        $scope.isNewRuleFormValid = false;
        $scope.selectedRule = {};
        $scope.selectedRule.id = dataHandler.createuuid();
        $scope.selectedRule.createdDate = new Date().toString();
        $scope.selectedRule.createdBy = $scope.SessionDetails.name;
        $scope.selectedRule.avatar = $scope.SessionDetails.avatar;
        $scope.selectedRule.switchState = "on";
        $scope.selectedRule.status = "Unsaved";
        $scope.selectedRule.workflow = [];
        $scope.selectedRule.Variables = [];
        AJS.dialog2("#new-rule-dialog").show();
        $rootScope.initialGuideProvider(null, '.sf-intro-name', 'Name your Automation here. This name will be the identifier of your automation hereon');
        // $state.go('rule.new');
    };

    //Close rule dialog
    $scope.closeDialog = function (dialog) {
        AJS.dialog2('#' + dialog).hide();
    };

    //Clear rule
    $scope.clearRule = function () {
        $scope.newRule();
    };

    $scope.exitNewVariable = function(e){
        $scope.Variable = {};
        e.preventDefault();
        AJS.dialog2("#rule-delete-dialog").hide();
    }

    $scope.backRule = function () {
        $scope.isNewRuleFormValid = false;
    };

    //Save rule
    $scope.saveRule = function () {
        $scope.currentRuleID = $scope.selectedRule.id;
        $scope.currentRules.push(angular.copy($scope.selectedRule));
    };

    $scope.closeRemoveDialog = function (e) {
        e.preventDefault();
        AJS.dialog2("#rule-delete-dialog").hide();
    };
    $scope.closeExportDialog = function (e) {
        e.preventDefault();
        AJS.dialog2("#rule-export-dialog").hide();
    };

    $scope.removeFromNGINX = function (name, username) {
        var obj = {
            "process": name,
            "securityToken": "ignore",
            "userName": username
        }
        var URL = $v6urls.nginxserver + "/removefromnginxplus/"
        $http.post(URL, obj, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (data) {
            debugger
            $rootScope.DisplayMessage("The container was removed successfully.", "success", "You may try again later.");
        }, function (data) {
            debugger
            $rootScope.DisplayMessage("There was an error when removing the container.", "error", "You may try again later.");
        });
    }

    $scope.deleteContainer = function () {
        $http({
            method: 'GET',
            url: $v6urls.nginxserver + '/removedocker/' + $rootScope.SessionDetails.Domain + '/' + $scope.selectedRule.id,
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(function (data) {
                debugger
                $scope.removeFromNGINX($scope.getWFName($scope.selectedRule.ruleName), $scope.SessionDetails.Domain);
            }, function (data) {
                debugger
                $rootScope.DisplayMessage("There was an error when removing the container.", "error", "You may try again later.");
            })

    };

    $scope.deleteVersionsFromObjectStore = function (e) {
        var client = $objectstore.getClient("process_flows_versions");
        client.onComplete(function (data) {
            var index = 0;
            angular.forEach($scope.currentRules, function (rule) {
                if (rule.id == $scope.currentRuleID) {
                    $scope.currentRules.splice(index, 1);
                    $rootScope.changeLocation("home");
                    dataHandler.resetFactory();
                }
                index++;
            });
            $scope.closeRemoveDialog(e);
        });
        client.onError(function (data) {
            $scope.closeRemoveDialog();
            $rootScope.DisplayMessage("There was an error when removing rule details.", "error", "You may try again later.");
        });
        var WFObj = {
            "ID": $scope.selectedRule.id
        };
        client.V1deleteSingle(WFObj, "ID");
    };

    $scope.deleteRuleAndDependencies = function (e) {
        $scope.disableDeleteButton = true;
        console.log("You are about to remove the selected rule");

        // before adding rating engine
        var client = $objectstore.getClient("process_flows");
        client.onComplete(function (data) {
            $scope.deleteVersionsFromObjectStore(e);
        });
        client.onError(function (data) {
            $scope.deleteVersionsFromObjectStore(e);
        });
        var objectList = [{
            "ID": $scope.selectedRule.id
        }];
        client.V1deleteMultiple(objectList, "ID");

        // deleting docker
        if ($scope.hasContainer) {
            $scope.deleteContainer();
        }

        //delete tigger
        TriggerDatafactory.DeleteTriggers($scope.getWFName($scope.selectedRule.ruleName));
        $scope.DeletePort($scope.selectedRule.name);
    };

    $scope.removeRule = function () {
        $scope.disableDeleteButton = false;
        $scope.hasContainer = false;
        if ($scope.selectedRule.status == "Published") {
            $scope.hasContainer = true;
        }
        AJS.dialog2("#rule-delete-dialog").show();
    };

    //Edit rule
    $scope.editRule = function () {

       
        $timeout(function () {
        
            $scope.ruleEdit = !$scope.ruleEdit;
        });
    };

    //Cancel rule
    $scope.cancelRuleEdit = function () {
        $timeout(function () {
            $scope.ruleEdit = false;
        });
    };

    //New template
    $scope.newTemplate = function () {
        var newArray = [];
        angular.forEach($scope.templates, function (item) {
            if (item.ControlType == "template") {
                newArray.push(item);
            }
        });
        $scope.componentsToDisplay = newArray;
        $scope.isNewRuleFormValid = true;
    };

    //Open a specific component menu in components
    $scope.openSelectedComponentMenu = function (index) {
        $scope.toggleComponentsMenu();
    };

    //Open component info
    $scope.openComponentInfo = function (component) {
        $scope.tab = false;
        $scope.args = dataHandler.retrieveArgumentsKeys();
        component.Variables = dataHandler.checkFormat(component.Variables);
        $scope.selectedModule = component;
        checkArguments(component.Variables)
        $timeout(function () {
            $scope.activeModule = component.$$hashKey;
        });
    };
    function checkArguments(Variableslist) {
        Variableslist.forEach(function (element) {
            if (element.Key == "InSessionID") {
                // set value @InSessionID
                element.Value = "@InSessionID"
            }
        }, this);
        $scope.allVariables.forEach(function (element) {
            if (element.Key == "InSessionID") {
                // set value @InSessionID
                element.Value = "@InSessionID"
            }
        }, this);

    }
    //New component
    $scope.newComponent = function (index) {
        $scope.componentLevel = 0;

        // check whether it contents triggers, actions or Conditions
        var triggers = 0
            , actions = 0
            , conditions = 0;
        angular.forEach($scope.allcomponents, function (item) {
            if (item.ControlType == "condition") {
                conditions++;
            }
            if (item.ControlType == "action") {
                actions++;
            }
            if (item.ControlType == "trigger") {
                triggers++;
            }
        });
        var comps = [];
        if (conditions > 0) {
            comps.push({
                Name: 'Conditions',
                DisplayName: 'Conditions',
                ControlType: 'condition',
                Description: 'When should the things happen?'
            });
        }
        if (actions > 0) {
            comps.push({
                Name: 'Actions',
                DisplayName: 'Actions',
                ControlType: 'action',
                Description: 'What should be accomplished?'
            });
        }
        if (triggers > 0) {
            comps.push({
                Name: 'Triggers',
                DisplayName: 'Triggers',
                ControlType: 'trigger',
                Description: 'How do you want to trigger the rule?'
            });
        }
        $scope.componentsToDisplay = comps;
        $state.go('rule.workflow');
    };

    //Filter components
    $scope.sortType = 'name';
    // set the default sort type
    $scope.sortReverse = false;
    // set the default sort order
    $scope.searchFish = '';
    // set the default search/filter term

    $scope.getNodeforLibraryID = function (library_id) {
        var returnObj = {};
        for (j = 0; j < $scope.allcomponents.length; j++) {
            if ($scope.allcomponents[j].library_id == library_id) {
                returnObj = angular.copy($scope.allcomponents[j]);
                break;
            }
        }
        return returnObj;
    }

    $scope.getNodeWithData = function (node) {
        var comp = $scope.getNodeforLibraryID(node.id);
        comp.schema_id = dataHandler.createuuid();
        comp = $scope.fillPredefinedValues(comp, node.sampleData)
        comp.workflow = [];

        // the node has a child
        if (!$rootScope.isNullOrEmptyOrUndefined(node.childNodes)) {
            angular.forEach(node.childNodes, function (variable) {
                ///debugger
                var filledObj = $scope.getNodeWithData(variable);
                comp.workflow.push(filledObj);
            });
        }
        return comp;
    }

    //Open template
    $scope.openTemplateFlow = function (template, e) {
        var templateToLoad = [];
        var dummyWF = [];

        // get the list of nodes to fill from the template
        templateToLoad = template.modules;
        angular.forEach(template.variables, function (variable) {
            $scope.AddNewVariable(variable, e);
        });

        // copy each node with the corresoponding library_id and add its sample data into it
        for (inc = 0; inc < templateToLoad.length; inc++) {
            var filledObj = $scope.getNodeWithData(templateToLoad[inc]);
            dummyWF.push(filledObj);
        }
        $scope.selectedRule.workflow = dummyWF;
        $scope.component = {
            workflow: $scope.selectedRule.workflow
        };
        //debugger
        TriggerDatafactory.setworkflowId($scope.getWFName($scope.selectedRule.ruleName));
        $state.go('rule.workflow');
    };

    $scope.fillPredefinedValues = function (item, values) {
        //debugger;
        if (values.length > 0) {
            for (i = 0; i < values.length; i++) {
                for (j = 0; j < item.Variables.length; j++) {
                    if (item.Variables[j].Key == values[i].Key) {
                        item.Variables[j].Value = values[i].Value;
                        break;
                    }
                }
            }
        }
        return item;
    };

    $scope.deleteComponentConfirmation = function (index, isSub) {
        if (!isSub)
            $scope.showDeleteConfirmation = index;
    };

    //Delete component
    $scope.deleteComponent = function (component) {
        var index = 0;
        angular.forEach($scope.selectedRule.workflow, function (module) {
            //debugger
            if (component.schema_id == module.schema_id) {
                $scope.selectedRule.workflow.splice(index, 1);
                $scope.showDeleteConfirmation = null;
            }
            index++;
        });
        $scope.selectedModule = {};
        // $state.go('rule.details');
    };

    $scope.cancelDelete = function (index) {
        $scope.showDeleteConfirmation = null;
    };

    $scope.AdditionalVariable = [
        { Key: 'jira_attachment_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_board_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_comment_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_issue_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_issue_key', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_mergedVersion_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_modifiedUser_key', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_modifiedUser_name', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_sprint_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_version_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_worklog_id', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType },
        { Key: 'jira_project_key', Value: $scope.Variable.Value, Category: "InArgument", Type: 'dynamic', Priority: 'NotMandatory', Group: 'default', DataType: $scope.Variable.DataType }
    ];

    $scope.addtoMainList = function (variable, event) {
        debugger
        $scope.AddNewVariable(variable, event);
        AJS.dialog2("#new-variable-dialog").hide()
    };

    //Add variables
    $scope.AddNewVariable = function (variable, e) {
        var data = {};
        if (variable == undefined) {
            data = {
                Key: $scope.Variable.Key,
                Value: $scope.Variable.Value,
                Category: $scope.Variable.Category,
                Type: 'dynamic',
                Priority: 'NotMandatory',
                Group: 'default',
                DataType: $scope.Variable.DataType
            };
        } else {
            data = variable;
        }

        var flag = dataHandler.AddArguments(data);
        if (flag == true) {
            $rootScope.DisplayMessage("Key already exists.", "info", "The key you are trying to add is already added to the rule.");
        }
        else {
            AJS.dialog2("#new-rule-dialog").hide()
            angular.forEach($scope.allVariables, function (variable) {
                angular.forEach($scope.AdditionalVariable, function (add) {
                    if (variable.Key == add.Key)
                        add.isSelected = true;

                });
            });
            $scope.getAllArguments();
        }
        $scope.Variable = {};
    }

    //Edit variables
    $scope.editVariable = function (variable, index) {
        $scope.variableEditOn = 'SelectedVarible' + index;
        $scope.selectedVaribleToEdit = variable;
    }

    //Save variables
    $scope.saveVariable = function (variable, index) {
        $scope.variableEditOn = null;
        $scope.allVariables[index] = $scope.selectedVaribleToEdit;
    }

    //Delete variables
    $scope.deleteVariable = function (variable, index) {
        angular.forEach($scope.AdditionalVariable, function (_var) {
            if (_var.Key == variable.Key) {
                _var.isSelected = false;
            }
        });
        $scope.showVariableConfirmation = true;
        $scope.variableEditOn = null;
        $scope.allVariables.splice(index, 1);
    };

    //Cancel variable
    $scope.cancelNewVariable = function () {
        $timeout(function () {
            $scope.Variable = {}
        });
    };

    $scope.getAllArguments = function () {
        // return dataHandler.retrieveArguments();
        $timeout(function () {
            $scope.allVariables = dataHandler.retrieveArguments();
        }, 0);
    }

    $scope.toggleComponentsMenu = function (workflow, index, triggeredByComponent, category, component, caseInjeciton) {
        // if (category == 'trigger') {
        //     $scope.setInitialCollapse(0);
        // }
        if (category == 'action') {
            $scope.setInitialCollapse(0);
        } else if (category == 'condition') {
            $scope.setInitialCollapse(1);
        }

        if (component != undefined && component.DisplayName == 'Case' && caseInjeciton ||
            component != undefined && component.DisplayName == 'Default' && caseInjeciton ||
            component != undefined && component.DisplayName == 'Fallthrough' && caseInjeciton) {
            $scope.callFromSwitch = true;
        } else {
            $scope.callFromSwitch = false;
        }

        // $rootScope.comToBePushedIndex = parentIndex;
        $rootScope.candidateWorkflow = workflow;
        $rootScope.candidateIndex = index;
        $rootScope.caseInjeciton = caseInjeciton;
        if (component != null)
            $rootScope.candidateComponent = component;
        $scope.pendingComponentType = category;
        $scope.componentsMenuState == 'open' && !triggeredByComponent ? $scope.componentsMenuState = 'closed' : $scope.componentsMenuState = 'open';
        var componentsMenuElem = document.getElementById('workflow-components');
        $scope.componentsMenuState == 'open' ? componentsMenuElem.setAttribute('style', 'height:' + workflowHeight + 'px;width:365px;margin-right:' + $scope.propertyPanelWidthGLOBAL + 'px') : componentsMenuElem.setAttribute('style', 'height:' + workflowHeight + 'px;width:0px;margin-right:' + $scope.propertyPanelWidthGLOBAL + 'px');
        // $scope.componentsMenuState == 'open' ? $scope.compMenuState = "right" : $scope.compMenuState = "left";
    }

    $scope.openComponent = function (component, e) {
        if (component.Name == "Triggers" || component.Name == "Actions" || component.Name == "Conditions") {
            // filter the compontns here and enter it to the array
            var newArray = [];
            angular.forEach($scope.allcomponents, function (item) {
                if (item.ControlType == component.ControlType) {
                    newArray.push(item);
                }
            });
            $scope.componentsToDisplay = newArray;
        } else if (component.ControlType == "template") {
            //debugger
            $scope.saveRule();
            $scope.openTemplateFlow(component, e);
            $scope.isNewRuleFormValid = false;
        }
        // var backdrop = document.getElementsByClassName('modal-backdrop')[0];
        // if (backdrop != undefined) {
        //     backdrop.remove();
        //     document.getElementById('newRule').modal('hide');
        // }
        // e.preventDefault();
        AJS.dialog2("#new-rule-dialog").hide();
        //$state.go('rule.new');
    };

    $scope.newComponentInjection = function (component) {
        var newcompo = angular.copy(component);
        newcompo.bodyExpanded = true;

        if ($rootScope.candidateComponent.DisplayName == "True" || $rootScope.candidateComponent.DisplayName == "False") {
            $rootScope.candidateComponent.workflow.push(newcompo);
        } else if ($rootScope.candidateComponent.DisplayName == "Case" || $rootScope.candidateComponent.DisplayName == "Default" || $rootScope.candidateComponent.DisplayName == "Fallthrough") {
            if ($rootScope.caseInjeciton) {
                $rootScope.candidateWorkflow.splice($rootScope.candidateIndex + 1, 0, newcompo);
            } else {
                $rootScope.candidateComponent.workflow.push(newcompo);
            }
        } else {
            $rootScope.candidateWorkflow.splice($rootScope.candidateIndex + 1, 0, newcompo);
        }
        $timeout(function () {
            $scope.activeModule = component.$$hashKey;
        });
        // if($scope.pendingComponentType == 'condition'){
        // 	$rootScope.candidateComponent.workflow.push(newcompo);
        // }else{
        // }
        $scope.callFromSwitch = false;
        $scope.toggleComponentsMenu(0);
        $scope.openComponentInfo(newcompo);
    };

    $scope.addNode = function (component) {
        component.workflow.push({
            "library_id": "1",
            "schema_id": 3,
            "parentView": "",
            "Name": "Stop",
            "Icon": "ion-stop",
            "Description": "this is a test description",
            "ControlEditDisabled": true,
            "Variables": [],
            "SourceEndpoints": [],
            "TargetEndpoints": [{
                "id": 0,
                "location": "TopCenter"
            }],
            "Type": "stop",
            "Category": "Flow Controls",
            "X": 0,
            "Y": 0,
            "OtherData": {},
            "Annotation": "",
            "DisplayName": "Stop",
            "class": "Tools",
            "Categoryicon": "ion-ios-gear",
            "classicon": "ion-ios-gear",
            "ControlType": "action",
            "$$hashKey": "object:352",
            "workflow": []
        });
    }

    $scope.addNodeToLayer = function (workflow, position) {
        workflow.splice(position + 1, 0, {
            DisplayName: "Component",
            ControlType: "action",
            "workflow": []
        });
    }

    $scope.deleteNode = function (workflow, position, elem) {
        workflow.splice(position, 1);
        // if(workflow[0].parent.ControlType == 'condition'){
        // 	if(workflow[0].parent.DisplayName == 'True' || workflow[0].parent.DisplayName == 'False'){
        // 		var el = $(elem.target).parent().parent().parent().parent().parent();
        // 		el.append('<div class="workflow-add-node-sub"> <div class="header-bar"> <div class="component-capsule"> <span title="Add to '+workflow[0].parent.DisplayName+'}}" class="category-icon add-component-sub glyphicon glyphicon-plus"></span><span title="Condition" class="category-icon condition" ng-click="toggleComponentsMenu(workflow, $index, true, '+'condition'+',component, false)">C</span> <span title="Action" class="category-icon action" ng-click="toggleComponentsMenu(workflow, $index, true, '+'action'+',component, false)">A</span> </div> <script> AJS.$(".category-icon").tooltip(); AJS.$(".delete-comp").tooltip(); </script> <span>..</span> </div> </div>');
        // 		workflow.splice(position, 1);
        // 	}
        // }else{
        // 	workflow.splice(position, 1);
        // }
    }

    // Kasun_Wijeratne_2017_10_23
    // This code gets a set of workflow and expands or collapses the block with given index accordingly
    $scope.expandComponentBody = function (workflow, position) {
        if (workflow[position].DisplayName == 'True' || workflow[position].DisplayName == 'False' || workflow[position].DisplayName == 'Case') {
            workflow[position].outerExpanded ? workflow[position].outerExpanded = false : workflow[position].outerExpanded = true;
        } else {
            workflow[position].bodyExpanded ? workflow[position].bodyExpanded = false : workflow[position].bodyExpanded = true;
        }
    }
    // Kasun_Wijeratne_2017_10_23 - END

    $scope.addNodeToParent = function (component) {
        var parentSibling = {
            "library_id": "1",
            "schema_id": 3,
            "parentView": "",
            "Name": "Stop",
            "Icon": "ion-stop",
            "Description": "this is a test description",
            "ControlEditDisabled": true,
            "Variables": [],
            "SourceEndpoints": [],
            "TargetEndpoints": [{
                "id": 0,
                "location": "TopCenter"
            }],
            "Type": "stop",
            "Category": "Flow Controls",
            "X": 0,
            "Y": 0,
            "OtherData": {},
            "Annotation": "",
            "DisplayName": "Stop",
            "class": "Tools",
            "Categoryicon": "ion-ios-gear",
            "classicon": "ion-ios-gear",
            "ControlType": "action",
            "$$hashKey": "object:352",
            "workflow": []
        };

        if (component.workflow)
            component.workflow.push(parentSibling);
        else
            //root
            component.push(parentSibling);
    }

    $scope.buildWorkFlow = function () {
        console.log("Begin build workflow");
        $scope.generateSaveWorkflowObject("build");
    }

    //call Workflow save method
    $scope.saveWorkFlow = function () {
        console.log("Begin Workflow save.");
        $scope.generateSaveWorkflowObject("save");
        //debugger;
        TriggerDatafactory.SaveTriggers($scope.getWFName($scope.selectedRule.ruleName));
        //TriggerDatafactory.filtertiggerbyId($scope.currentRuleID);
    }

    $scope.getNewNodeByID = function (ID) {
        var returnObj = {};
        for (j = 0; j < $scope.allcomponents.length; j++) {
            if ($scope.allcomponents[j].library_id == ID) {
                returnObj = angular.copy($scope.allcomponents[j]);
                break;
            }
        }
        return returnObj;
    }

    $scope.getDummyNode = function (ID, state, axis_x, axis_y) {
        var node = $scope.getNewNodeByID(ID);
        node.schema_id = dataHandler.createuuid();
        node.X = axis_x;
        node.Y = axis_y;
        node.parentView = state;
        return node;
    }

    $scope.processNodeData = function (state, axis_x, axis_y, workflowNodes) {
        angular.forEach(workflowNodes, function (nodemodule) {
            //debugger
            nodemodule.schema_id = dataHandler.createuuid();
            nodemodule.X = axis_x;
            nodemodule.Y = axis_y;
            nodemodule.parentView = state;
            delete nodemodule.parent;

            if (nodemodule.SourceEndpoints.length > 0) {
                nodemodule.SourceEndpoints[0].id = dataHandler.createuuid();
            }
            if (nodemodule.TargetEndpoints.length > 0) {
                nodemodule.TargetEndpoints[0].id = dataHandler.createuuid();
            }

            // if the current node is an IF condition the following will work
            var truesideUUID, falsesideUUID = "";
            if (nodemodule.library_id == "2") {
                truesideUUID = dataHandler.createuuid();
                falsesideUUID = dataHandler.createuuid();
                nodemodule.OtherData.TrueStateUUID = truesideUUID;
                nodemodule.OtherData.FalseStateUUID = falsesideUUID;
                dataHandler.addToViews(truesideUUID);
                dataHandler.addToViews(falsesideUUID);
                var ifconnectionObj = {
                    id: nodemodule.schema_id,
                    "true": truesideUUID,
                    "false": falsesideUUID
                };
                dataHandler.addtoIfConnections(ifconnectionObj);
            }

            // if the current node is a Switch condition the following will work
            var SwitchUUID = "";
            if (nodemodule.library_id == "8") {
                SwitchUUID = dataHandler.createuuid();

                nodemodule.OtherData.SwitchUUID = SwitchUUID;
                dataHandler.addToViews(SwitchUUID);

                var switchObj = {
                    id: nodemodule.schema_id,
                    "switchState": SwitchUUID,
                };
                dataHandler.addtoSwitch(switchObj);

                // add start if there are child items for the switch statement
                if (nodemodule.workflow.length > 0) {
                    var switchChildNodes = [];
                    var startNode = $scope.getDummyNode("0", SwitchUUID, 400, 100);
                    switchChildNodes.push(startNode);

                    angular.forEach(nodemodule.workflow, function (node) {
                        node.schema_id = dataHandler.createuuid();
                        node.parentView = SwitchUUID;
                        delete node.parent;
                        switchChildNodes.push(node);
                    });
                    // adding stop node when the child nodes are ended
                    var stopNode = $scope.getDummyNode("1", SwitchUUID, 400, 100);
                    switchChildNodes.push(stopNode);

                    angular.forEach(switchChildNodes, function (node) {
                        dataHandler.addtoNodes(node);
                    });
                    switchChildNodes = [];
                }

            }

            // if the current node is a Switch Case the following will work
            //             var CaseUUID, DefaultUUID = "";
            //             if (nodemodule.library_id == "9" || nodemodule.library_id == "10") {
            //                 var uniqID = dataHandler.createuuid();;
            //                 if(nodemodule.library_id == "9"){
            //                     CaseUUID = uniqID;
            //                     nodemodule.OtherData.CaseUUID = CaseUUID;
            //                     dataHandler.addToViews(CaseUUID);
            //                     var caseObj = {
            //                         id: nodemodule.schema_id,
            //                         "caseState": CaseUUID,
            //                     };
            //                     dataHandler.addtoCases(caseObj);
            //                 }else if(nodemodule.library_id == "10"){
            //                     DefaultUUID = uniqID;
            //                     nodemodule.OtherData.DefaultUUID = DefaultUUID;
            //                     dataHandler.addToViews(DefaultUUID);
            //                     var defaultObj = {
            //                         id: nodemodule.schema_id,
            //                         "caseState": DefaultUUID,
            //                     };
            //                     dataHandler.addtoCases(defaultObj);
            //                 }
            //             }

            // if the parent node is having any child nodes, that will be added to a temparary array
            if (nodemodule.workflow.length > 0) {

                angular.forEach(nodemodule.workflow, function (childnode) {
                    //debugger
                    var childnodes = [];
                    delete childnode.parent;

                    if (childnode.DisplayName == "True") {
                        // adding start node before other nodes
                        var startNode = $scope.getDummyNode("0", truesideUUID, 400, 100);
                        childnodes.push(startNode);
                        // adding child nodes to the same array
                        angular.forEach(childnode.workflow, function (node) {
                            node.schema_id = dataHandler.createuuid();
                            node.parentView = truesideUUID;
                            delete node.parent;
                            childnodes.push(node);
                        });
                        // adding stop node when the child nodes are ended
                        var stopNode = $scope.getDummyNode("1", truesideUUID, 400, 100);
                        childnodes.push(stopNode);
                        //debugger
                        $scope.processNodeData(truesideUUID, 400, 200, childnodes);
                    } else if (childnode.DisplayName == "False") {
                        // adding start node before other nodes
                        var startNode = $scope.getDummyNode("0", truesideUUID, 400, 100);
                        childnodes.push(startNode);
                        // adding child nodes to the same array
                        angular.forEach(childnode.workflow, function (node) {
                            node.schema_id = dataHandler.createuuid();
                            node.parentView = falsesideUUID;
                            delete node.parent;
                            childnodes.push(node);
                        });
                        // adding stop node when the child nodes are ended
                        var stopNode = $scope.getDummyNode("1", truesideUUID, 400, 100);
                        childnodes.push(stopNode);
                        //debugger
                        $scope.processNodeData(falsesideUUID, 400, 100, childnodes);
                    } else if (childnode.library_id == "9" || childnode.library_id == "10") {

                        var CaseUUID = "";
                        var DefaultUUID = "";
                        var uniqID = dataHandler.createuuid();;
                        if (childnode.library_id == "9") {
                            CaseUUID = uniqID;
                            childnode.OtherData.CaseUUID = CaseUUID;
                            dataHandler.addToViews(CaseUUID);
                            var caseObj = {
                                id: nodemodule.schema_id,
                                "caseState": CaseUUID,
                            };
                            dataHandler.addtoCases(caseObj);
                        } else if (childnode.library_id == "10") {
                            DefaultUUID = uniqID;
                            childnode.OtherData.DefaultUUID = DefaultUUID;
                            dataHandler.addToViews(DefaultUUID);
                            var defaultObj = {
                                id: nodemodule.schema_id,
                                "caseState": DefaultUUID,
                            };
                            dataHandler.addtoCases(defaultObj);
                        }

                        // adding start node before other nodes
                        var startNode = $scope.getDummyNode("0", uniqID, 400, 100);
                        childnodes.push(startNode);
                        // adding child nodes to the same array
                        angular.forEach(childnode.workflow, function (node) {
                            node.schema_id = dataHandler.createuuid();
                            node.parentView = uniqID;
                            delete node.parent;
                            childnodes.push(node);
                        });
                        // adding stop node when the child nodes are ended
                        var stopNode = $scope.getDummyNode("1", uniqID, 400, 100);
                        childnodes.push(stopNode);
                        //debugger
                        $scope.processNodeData(uniqID, 400, 100, childnodes);
                    }
                    // empty childnodes array if not a switch statement
                    childnodes = [];
                    //                     if(nodemodule.library_id != "8"){
                    //                         childnodes = [];   
                    //                     }else {
                    //                         //switchChildNodes.push(childnode);
                    //                     }
                });
            }

            // add the stop for switch statement
            //             if (nodemodule.library_id == "8") {
            //                 // add start if there are child items for the switch statement
            //                 if(nodemodule.workflow.length > 0){
            //                     var stopNode = $scope.getDummyNode("1", SwitchUUID, 400, 100);
            //                     switchChildNodes.push(stopNode);

            //                     $scope.processNodeData(SwitchUUID, 400, 100, switchChildNodes);
            //                 }
            //             }

            //            switchChildNodes = [];

            // add the object to runtimedatastore
            //debugger
            dataHandler.addtoNodes(nodemodule);
            axis_y += 100;
        });
    };

    $scope.setupNodes = function () {
        var state = "drawboard";
        var axis_x = 400;
        var axis_y = 100;
        $scope.processNodeData(state, axis_x, axis_y, $scope.selectedRule.workflow);
    }

    $scope.setupConnections = function () {

        // get the list of views and create connections for them.
        var listOfViews = dataHandler.getViews();
        for (var i = 0; i < listOfViews.length; i++) {
            var stateNodes = dataHandler.getNodesForState(listOfViews[i]);
            var temp_connections = [];
            var index = 0;
            var sourceId, targetId, sourceUUID, targetUUID = "";

            // set connections for the set of nodes
            angular.forEach(stateNodes, function (module) {
                //debugger
                if (index == 0) {
                    if (!$rootScope.isNullOrEmptyOrUndefined(targetId)) {
                        sourceId = targetId;
                        targetId = module.schema_id;
                        temp_connections.push({
                            sourceId: sourceId,
                            targetId: targetId
                        });
                        sourceId = targetId;
                        index = 0;
                    } else {
                        sourceId = module.schema_id;
                    }
                    index++;
                } else if (index == 1) {
                    targetId = module.schema_id;
                    temp_connections.push({
                        sourceId: sourceId,
                        targetId: targetId
                    });
                    sourceId = "";
                    index = 0;
                }
            });
            angular.forEach(temp_connections, function (connection) {
                //debugger
                id = dataHandler.createuuid();
                sourceId = connection.sourceId;
                targetId = connection.targetId;
                sourceUUID = dataHandler.getEndpointsForItem(connection.sourceId, "source", "default");
                targetUUID = dataHandler.getEndpointsForItem(connection.targetId, "target", "default");
                var connObj = {
                    id: id,
                    sourceId: sourceId,
                    targetId: targetId,
                    sourceUUID: sourceUUID,
                    targetUUID: targetUUID,
                    parentView: listOfViews[i],
                };
                dataHandler.addtoConnections(connObj);
            });
        }
        console.log("Completed processing connections.");
    }

    $scope.buildFlow = function (saveObject, event) {
        /* stiipConvertion is done to remove .(string) like parts from the value fields of all variables since, if there is any convertions required it will be already available inside Convert field */
        var newJSON = $scope.stripConvertionDetails(angular.copy(saveObject.JSONData));
        // console.log("Publish Data:")
        // console.log(newJSON)
        var sessionId = dataHandler.createuuid();
        var flowChartJson = JSON.stringify(newJSON);

        var flowname = saveObject.Name;
        flowname = flowname.replace(' ', '');
        var URL = $v6urls.processManager + "/processengine/BuildFlow/";
        var actualURL = URL + flowname + "/" + sessionId;
        $http.post(actualURL, newJSON, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'SecurityToken': "ignore"
            }
        }).then(function (data, status, headers, config) {
            console.log(data);
            if (data.data.Status) {
                $rootScope.DisplayMessage("The rule was successfully build.", "success", "Please check your rule configurations.");
            } else {
                $rootScope.DisplayMessage("There was an error when building the rule.", "error", "Please check your rule configurations.");
            }
            $rootScope.HideBusyContainer();
        }, function (data, status, headers, config) {
            $rootScope.DisplayMessage("There was an error when trying to communicate to the server.", "error", "You may try again.");
            $rootScope.HideBusyContainer();
        });
    }

    $scope.generateSaveWorkflowObject = function (task) {
        if (task == "save") {
            $rootScope.ShowBusyContainer("Saving rule details...");
        } else if (task == "build") {
            $rootScope.ShowBusyContainer("Processing rule details...");
        }

        // reset the datahander data to re generate it again except the variable / argument data
        dataHandler.resetAddonDesign();
        // strating workflow data convertion
        $scope.setupNodes();
        $scope.setupConnections();

        // convertion to old format completed,
        // starting to create the workflow save object from data from the rule
        var flowChartJson = dataHandler.getSaveJson();
        var flowID, name, displayname, discription, version, createNewVersion, comment, tag;
        createNewVersion = false;
        tag = "Jira Addon Rule".split(" ");
        flowID = dataHandler.createuuid();
        name = $scope.getWFName($scope.selectedRule.ruleName);
        displayname = $scope.selectedRule.ruleName;
        discription = $scope.selectedRule.description;
        comment = "Init";
        version = "V1";

        var authorDetails = {
            "Name": $rootScope.SessionDetails.name,
            "Email": $rootScope.SessionDetails.emails[0],
            "Domain": "JIRA",
            "Avatar": $scope.SessionDetails.avatar
        }

        var saveObject = {
            "ID": flowID,
            "WFID": $scope.selectedRule.id,
            "Name": name,
            "DisplayName": displayname,
            "comment": comment,
            "Description": discription,
            "version": version,
            "DateTime": new Date(),
            "UserName": $scope.SessionDetails.emails[0],
            "JSONData": flowChartJson,
            "AuthorDetails": authorDetails
        }
        var saveObjectParent = {
            "ID": $scope.selectedRule.id,
            "Name": name,
            "DisplayName": displayname,
            "Description": discription,
            "version": [],
            "DateTime": new Date(),
            "UserName": $scope.SessionDetails.emails[0],
            "AuthorDetails": authorDetails,
            "Tags": tag
        }
        var version = [saveObject.ID];
        saveObjectParent.version = version;

        if (task == "save") {
            $scope.sendProcessToObjectStore(saveObject, event, saveObjectParent);
        } else if (task == "build") {
            $scope.buildFlow(saveObject, event);
        }

        console.log(saveObject);
        // JSON.stringify(data.JSONData)
    };

    $scope.getControlObjectFromLibrary = function (library_id) {
        var returnObj = {};
        for (var i = 0; i < $scope.allcomponents.length; i++) {
            if ($scope.allcomponents[i].library_id == library_id) {
                returnObj = angular.copy($scope.allcomponents[i]);
                break;
            }
        }
        return returnObj;
    };

    $scope.getWFName = function (flowname) {
        var conc_username = $rootScope.SessionDetails.Domain;
        var res = flowname.replace(/ /g, '');
        var sourceString = conc_username + res.toLowerCase();
        var outString = sourceString.replace(/[` ~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        return outString;
    }


    ////// workflow scheduling related functionalities
    $scope.cronOptions = {
        allowMultiple: true,
        quartz: true
    };

    $scope.myOutput = "";

    $scope.scheduleSelection = function (value) {
        if (value == "fixedrate") {
            $scope.cronExpression = "";
        } else if (value == "cronexpression") {
            $scope.fixedValue = "";
            $scope.fixedType = "";
        }
    }

    $scope.setScheduleforWorkflow = function (value) {
        $scope.savingSchedule = true;
        var URL = "https://" + $scope.selectedRule.name + ".plus.smoothflow.io/" + $scope.selectedRule.name + "/smoothflow/schedule/update/";

        var optionalJSON = {};
        var inarguments = dataHandler.retrieveInArgumentsKeys();
        angular.forEach(inarguments, function (argument) {
            optionalJSON[argument] = "";
        });

        var payload = {
            "FlowName": $scope.selectedRule.name,
            "Rules": [
                {
                    "OptionalHeaders": {},
                    "OptionalJson": {},
                    "Rate": value
                }
            ]
        }
        $http.post(URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function OnSuccess(response) {
            if (response.data.Status) {
                $rootScope.DisplayMessage("Schedule added!", "success", response.data.Message);
                $scope.scheduleActive = false;
                $scope.scheduleEditOn = false;
                $scope.savingSchedule = true;
            } else {
                $rootScope.DisplayMessage("Error occured!", "error", response.data.Message);
                //$scope.scheduleActive = false;
                $scope.savingSchedule = true;
            }
        }, function OnError(response) {
            if (response) {
                $rootScope.DisplayMessage("Error when retriving schedule information.", "error");
                $scope.savingSchedule = true;
            }
        });
    }

    $scope.scheduleActive = false;
    $scope.scheduleAvailable = false;
    $scope.getScheduleDetails = function () {
        $scope.scheduleActive = false;
        $scope.scheduleAvailable = false;
        var URL = "https://" + $scope.selectedRule.name + ".plus.smoothflow.io/" + $scope.selectedRule.name + "/smoothflow/schedule/status/";
        $http.get(URL, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function OnSuccess(response) {

            if (response.data.Status) {
                $scope.scheduleAvailable = true;
            } else {
                $scope.scheduleAvailable = false;
            }

            if (response.data.Config.Rules != null) {
                $scope.scheduleActive = true;
                if (response.data.Config.Rules.length == 1) {
                    $scope.currentScheduleRule = response.data.Config.Rules[0].Rate;
                    $scope.cronExpression = $scope.currentScheduleRule;
                }
            } else {
                $scope.scheduleActive = false;
            }
            $scope.selectedRule.schedule = response.data;
            $scope.checkScheduleStatus();
        }, function OnError(response) {
            if (response) {
                $rootScope.DisplayMessage("Error when retriving schedule information.", "error");
            }
        });
    }

    $scope.startSchedule = function () {
        var URL = "https://" + $scope.selectedRule.name + ".plus.smoothflow.io/" + $scope.selectedRule.name + "/smoothflow/schedule/start/";
        $http.get(URL, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function OnSuccess(response) {
            $scope.getScheduleDetails();
        }, function OnError(response) {
            if (response) {
                $rootScope.DisplayMessage("Error when retriving schedule information.", "error");
            }
        });
    }

    $scope.stopSchedule = function () {
        var URL = "https://" + $scope.selectedRule.name + ".plus.smoothflow.io/" + $scope.selectedRule.name + "/smoothflow/schedule/stop/";
        $http.get(URL, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function OnSuccess(response) {
            $scope.getScheduleDetails();
        }, function OnError(response) {
            if (response) {
                $rootScope.DisplayMessage("Error when retriving schedule information.", "error");
            }
        });
    }
    /** Save Schedule - Added By Lakmini 28th Dec 2017 */
    $scope.saveSchedule = function (Schedule) {
        var payload = {
            "FlowName": $scope.selectedRule.name,
            "Rules": [
                {
                    "OptionalHeaders": {},
                    "OptionalJson": {},
                    "Rate": Schedule
                }
            ]
        }
        var client = $objectstore.getClient("Schedule");
        client.onComplete(function (data) {
            $rootScope.DisplayMessage("Schedule details saved successfully.", "success");
            $rootScope.HideBusyContainer();
        });
        client.onError(function (data) {
            $rootScope.DisplayMessage("Error occured when saving schedule details.", "error", "Please contact an administrator.");
            $rootScope.HideBusyContainer();
        });
        client.V1insert(payload, {
            KeyProperty: "FlowName"
        });
    };
    //** End  Save Schedule*/
    /** Get Schedule */
    $scope.getSchedule = function (name) {
        var client = $objectstore.getClient("Schedule");
        client.onGetOne(function (data) {
            // $rootScope.ShowBusyContainer("Almost done...");
            if (data.length !== 0) {
                if (data.Rules[0].Rate != null) {
                    $scope.currentScheduleRule = data.Rules[0].Rate;
                    $scope.cronExpression = $scope.currentScheduleRule;
                }
                $scope.selectedRule.schedule = data;
            }


        }).V1getByKey(name);
    };
    $scope.scheduleEditOn = false;
    $scope.editSchedule = function () {
        $scope.scheduleEditOn = !$scope.scheduleEditOn;
    }
    /////// end of scheduling functions

    $scope.addNotificationMethod = function (flag, value) {
        if (flag == "success") {
            $scope.successNotifications.push(value);
            $scope.successemail = "";
        } else if ("failed") {
            $scope.errorNotifications.push(value);
            $scope.failedemail = "";
        }
    };

    $scope.deleteFromNotificationMethod = function (flag, emailAddress, index) {
        debugger
        if (flag == "success") {
            $scope.successNotifications.splice(index, 1);
        } else if ("failed") {
            $scope.errorNotifications.splice(index, 1);
        }
    };

    $scope.sendProcessToObjectStore = function (saveObj, event, saveObjectParent) {

        /*var data = {
            "Class": "process_flows",
            "KeyProperty": "ID",
            "Data": saveObj
        }
        var domain = $helpers.getHost();
        var url = '/payapi/ratingEngineAccess/saveworkflow/' + domain + '/tenant'
        $http({
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: data
        })
            .success(function (data) {
                var status = Boolean(data.success);
                if (status) {
                    //$scope.HideBusyContainer();
                    $scope.sendProcessVersionToObjectStore(saveObjectParent, event);
                    $scope.loadedProcessObj = saveObj;
                    $scope.workflowID = saveObj.ID;
                    $scope.workflowName = saveObj.DisplayName;
                    $scope.workflowVersion = saveObj.version;
     
                } else {
                    $scope.showToast("Oppss. There was an error saving.");
                    $scope.showAlert(event, data.message, "ERROR!");
                    $scope.HideBusyContainer();
                }
            })
            .error(function (data) {
                $scope.showToast("Oppss. There was an error saving.");
                $scope.showAlert(event, "Oppss. There was an error saving.", "ERROR!");
                $scope.HideBusyContainer();
            });*/

        // before adding new the ratingengine

        var client = $objectstore.getClient("process_flows");
        client.onComplete(function (data) {
            $scope.sendProcessVersionToObjectStore(saveObjectParent, event);
            $scope.SaveFailed = false;
        });
        client.onError(function (data) {
            console.log("Error on saving:", data);
            $rootScope.DisplayMessage("There was an error when saving the rule.", "error", "You may try again.");
            $rootScope.HideBusyContainer();
            $scope.SaveFailed = true;
        });
        client.V1insert([saveObj], {
            KeyProperty: "ID"
        });

    }

    $scope.sendProcessVersionToObjectStore = function (saveObj, event) {

        var client = $objectstore.getClient("process_flows_versions");
        client.onComplete(function (data) {
            $scope.SaveFailed = false;
            if ($scope.selectedRule.status == "Unsaved") {
                $scope.selectedRule.status = "Draft";
            }
            if ($scope.Iscopy) {
                $rootScope.HideBusyContainer();
                $rootScope.DisplayMessage("Rule successfully Copied.", "success");
                $scope.Iscopy = false;

            }
        });
        client.onError(function (data) {//$scope.showToast("Oppss. There was an error storing in objectstore.");
            if ($scope.Iscopy) {
                $rootScope.DisplayMessage("There was an error when copying the rule.", "error", "You may try again.");
                $scope.Iscopy = false;
            } else {
                $rootScope.DisplayMessage("There was an error when saving the rule.", "error", "You may try again.");
            }
            $rootScope.HideBusyContainer();

            $scope.SaveFailed = true;
        });
        client.V1insert([saveObj], {
            KeyProperty: "ID"
        });
    }

    $scope.uploadScreenshot = function () {
        alert("hola");
    }

    $scope.getDockerDetails = function () {
        $rootScope.ShowBusyContainer("Loading container details...");
        // getting published dockers dd
        var URL = $v6urls.nginxserver + "/activezones/" + $scope.SessionDetails.Domain + "/ignore"
        $http({
            url: URL,
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            //debugger

            console.log("NGINX Response Received.", response);
            $scope.NGINXData = response.data;
            $scope.processPublishedList();
            $scope.setDockerInformation($scope.selectedRule.name);
        }, function (e, a) {
            $rootScope.DisplayMessage("Error loading container details.", "error", "Please contact an administrator.");
            $rootScope.HideBusyContainer();
        });
    };

    $scope.processPublishedList = function () {
        $scope.TotalRequestsProcessed = 0;
        $scope.TotalBandwithReceived = 0;
        $scope.TotalBandwithSent = 0;
        $scope.TotalDiscarded = 0;
        $scope.CurrentProcessing = 0;

        for (var i = 0; i < $scope.currentRules.length; i++) {
            for (var j = 0; j < $scope.NGINXData.length; j++) {
                if ($scope.currentRules[i].name == $scope.NGINXData[j].zone) {
                    $scope.currentRules[i].status = "Published";
                    $scope.currentRules[i].executions += $scope.NGINXData[j].values.requests;
                    $scope.TotalRequestsProcessed += $scope.NGINXData[j].values.requests;
                    $scope.TotalBandwithReceived += $scope.NGINXData[j].values.received;
                    $scope.TotalBandwithSent += $scope.NGINXData[j].values.sent;
                    $scope.TotalDiscarded += $scope.NGINXData[j].values.discarded;
                    $scope.CurrentProcessing += $scope.NGINXData[j].values.processing;
                }
            }
        }
        for (var i = 0; i < $scope.currentRules.length; i++) {
            if ($scope.currentRules[i].status == "...") {
                $scope.currentRules[i].status = "Draft"
            }
        }
        $scope.TotalNumberOfContainers = $scope.NGINXData.length;

        $rootScope.HideBusyContainer();
        $rootScope.initialGuideProvider(null, '#dialog-show-button', "You can create a new automation here");

    }

    $scope.loadJiraUser = function (profile) {
        //debugger
        // load default settings if the developer is testing on jira 
        $rootScope.SessionDetails = {};
        $rootScope.SessionDetails.name = profile.displayName;
        // $rootScope.SessionDetails.SecurityToken = $helpers.getCookie("securityToken");
        // $rootScope.SessionDetails.SecurityToken = "ignore";
        $rootScope.SessionDetails.emails = [profile.emailAddress];
        $rootScope.SessionDetails.Domain = profile.domain;
        $rootScope.SessionDetails.avatar = profile.avatarUrls["24x24"];
        $scope.SessionDetails = $rootScope.SessionDetails;
        $scope.GetAPIKey();

    };


    // retrive data from JIRA
    $scope.JiraSession = {};
    $scope.CurrentUserProfile = {};
    /** Copy to Clipboard */
    $scope.copyToClipboard = function (row, index) {
        var copyElement = document.createElement("textarea");
        copyElement.style.position = 'fixed';
        copyElement.style.opacity = '0';
        copyElement.textContent = row.URLFULL;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyElement);
        copyElement.select();
        document.execCommand('copy');
        body.removeChild(copyElement);
        row.copied = true;
        var urlheaders = document.getElementsByClassName('url-header');
        $('<span class="dynamic-state-pill">Copied</span>').appendTo(urlheaders[index]);
        setTimeout(function () {
            $('.dynamic-state-pill').remove();
        }, 1000);
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
            debugger
            if (response.data.response == "success") {
                $scope.CurrentUserProfile = response.data.jiraResponse;
                var tenant = $rootScope.baseUrl.replace(/(?:https:\/\/)/g, '');
                tenant = tenant.replace(/(?:\.atlassian\.net)/g, '');
                $scope.CurrentUserProfile.domain = tenant + "jiradevsmoothflowio";
                $rootScope.Domain = $scope.CurrentUserProfile.domain;
                console.log($scope.CurrentUserProfile);
                $scope.loadJiraUser($scope.CurrentUserProfile);
                $scope.getDockerDetails();
            } else {
                $rootScope.DisplayMessage("Error when retriving user profile.", "error");
            }
        }, function OnError(response) {
            if (response) {
                $rootScope.DisplayMessage("Error when retriving user profile.", "error");
            }
        });
    }

    $scope.listProjects = function () {
        try {
            AP.request({
                url: '/rest/api/latest/project',
                type: 'GET',
                success: function (data) {
                    TriggerDatafactory.setProjectList(JSON.parse(data));
                },
                error: function (response) {
                    console.log(response);
                }
            });
        } catch (error) {
            TriggerDatafactory.setProjectList([{ "expand": "description,lead,issueTypes,url,projectKeys", "self": "https://duosoftware.atlassian.net/rest/api/2/project/14302", "id": "14302", "key": "SSD", "name": "SmoothFlow Service Desk", "avatarUrls": { "48x48": "https://duosoftware.atlassian.net/secure/projectavatar?pid=14302&avatarId=17804", "24x24": "https://duosoftware.atlassian.net/secure/projectavatar?size=small&pid=14302&avatarId=17804", "16x16": "https://duosoftware.atlassian.net/secure/projectavatar?size=xsmall&pid=14302&avatarId=17804", "32x32": "https://duosoftware.atlassian.net/secure/projectavatar?size=medium&pid=14302&avatarId=17804" }, "projectTypeKey": "service_desk" }, { "expand": "description,lead,issueTypes,url,projectKeys", "self": "https://duosoftware.atlassian.net/rest/api/2/project/13100", "id": "13100", "key": "DSF", "name": "SmoothFlow.io", "avatarUrls": { "48x48": "https://duosoftware.atlassian.net/secure/projectavatar?pid=13100&avatarId=17300", "24x24": "https://duosoftware.atlassian.net/secure/projectavatar?size=small&pid=13100&avatarId=17300", "16x16": "https://duosoftware.atlassian.net/secure/projectavatar?size=xsmall&pid=13100&avatarId=17300", "32x32": "https://duosoftware.atlassian.net/secure/projectavatar?size=medium&pid=13100&avatarId=17300" }, "projectTypeKey": "software" }]);
        }
    };

    var getUrlParam = function (param) {
        var codedParam = (new RegExp(param + '=([^&]*)')).exec(window.location.search)[1];
        return decodeURIComponent(codedParam);
    };

    $scope.setLocalUser = function () {
        var temUser = {
            displayName: "Mr Shehan",
            emailAddress: "shehan@duosoftware.com",
            domain: "duosoftwarejiradevsmoothflowio"
        }
        temUser.avatarUrls = {};
        temUser.avatarUrls["24x24"] = "https://avatar-cdn.atlassian.com/7272996f825bd268885d6b20484d325c?s=24&d=https%3A%2F%2Fduosoftware.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dsmall%26ownerId%3Dshehan%26avatarId%3D17100%26noRedirect%3Dtrue";
        $rootScope.CurrentUser = {};
        $rootScope.Domain = temUser.domain;
        $rootScope.CurrentUser.key = "shehan";
        $scope.loadJiraUser(temUser);
        $scope.getDockerDetails();
    }

    $scope.getCurrentUser = function () {
        try {
            if (!$rootScope.isNullOrEmptyOrUndefined(AP)) {
                AP.getUser(function (user) {
                    $rootScope.CurrentUser = user;
                    $scope.getCurrentUserProfile();
                });
            } else {
                $scope.setLocalUser();
            }
        }
        catch (err) {
            $scope.setLocalUser();
        }
    }

    $scope.refresh = function () {
        $rootScope.ShowBusyContainer("Refreshing...");
        $scope.getRuleDetails();
    }

    // this excecutes only when the document has been fully loaded and ready
    angular.element(document).ready(function () {
        $rootScope.baseUrl = getUrlParam('xdm_e') + getUrlParam('cp');
        $scope.getRuleDetails();
        $scope.listProjects();
    });

    $scope.selectedExpanded = false;
    $scope.expandSelected = function () {
        $scope.selectedExpanded = !$scope.selectedExpanded;
    }
    // Kasun_Wijeratne_12_NOV_2017
    $scope.headerListArray = [
        'Name',
        'Disc',
        'Updatedon',
        'Updatedby',
        'Executions',
        'Status'
    ]
    $scope.updateRuleAction = function (rule) {
        rule.action = !rule.action;
    }
    // Kasun_Wijeratne_12_NOV_2017 - END

    /** Initial guide **/
    $rootScope.initialGuideProvider = function (loc, elem, msg) {

        if (!$rootScope.isIntroHold) {
            ngIntroService.clear();

            var options = {
                steps: [
                    {
                        element: elem,
                        intro: msg
                    }
                ]
            };

            ngIntroService.setOptions(options);
            ngIntroService.start();

            $timeout(function () {
                $('.introjs-tooltipbuttons').append('<a class="introjs-button" role="button" tabindex="1" id="teminateIntro">Do not show again</a>')
            }, 100);
        }

        // $scope.IntroOptions = {
        // 	steps: [
        // 		{
        // 			element: '#dialog-show-button',
        // 			intro: "You can create a new automation here"
        // 		}
        // 	]
        // };
        // $scope.IntroNewName = {
        // 	steps: [
        // 		{
        // 			element: '.sf-intro-name',
        // 			intro: "Name your Automation here. This name will be the identifier of your automation hereon"
        // 		}
        // 	]
        // };
        // $rootScope.IntroEditProfile = {
        // 	steps: [
        // 		{
        // 			element: '.workflow-add-node-sub',
        // 			intro: "Hover over here and click on a (C)ondition or an (A)ction to add to your workflow"
        // 		}
        // 	]
        // }
        // $rootScope.IntroCompPanelA = {
        // 	steps: [
        // 		{
        // 			element: '#comp-panel-actions',
        // 			intro: "Click on any groups to open or collapse a panel and click on a component to add"
        // 		}
        // 	]
        // }
        // $rootScope.IntroCompPanelC = {
        // 	steps: [
        // 		{
        // 			element: '#comp-panel-conditions',
        // 			intro: "Click on any groups to open or collapse a panel and click on a component to add"
        // 		}
        // 	]
        // }
    }

    $rootScope.isIntroHold = false;
    // $rootScope.holdIntro = function () {
    // 	$rootScope.isIntroHold = true;
    // 	ngIntroService.clear();
    // }

    $(document).on('click', '#teminateIntro', function (e) {
        $rootScope.isIntroHold = true;
        ngIntroService.clear();
    });
    /** Initial guide **/


    /** Export and Import added by Lakmini */

    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function (e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }

    $scope.exportFile = function () {

        debugger;
        $scope.data = [];
        var flowChartJson = dataHandler.getSaveJson();

        var authorDetails = {
            "name": $scope.SessionDetails.name,
            "email": $scope.SessionDetails.emails[0],
            "domain": $scope.SessionDetails.Domain
        }
        var saveObject = {
            "id": dataHandler.createuuid(),
            "wfid": dataHandler.createuuid(),
            "name": "import" + $scope.getWFName($scope.selectedRule.ruleName),
            "displayname": "import_" + $scope.selectedRule.ruleName,
            "comment": "",
            "description": $scope.selectedRule.description,
            "version": "",
            "dateTime": new Date(),
            "useruame": $scope.SessionDetails.emails[0],
            "JSONData": flowChartJson,
            "authordetails": authorDetails,
            "workflow": $scope.selectedRule.workflow,
            "createdBy": $scope.selectedRule.createdBy,
            "createdDate": $scope.selectedRule.createdDate,
            "ruleName": "import_" + $scope.selectedRule.ruleName,
            "avatar": $scope.selectedRule.avatar,
            "status": "Draft"
        };
        AJS.dialog2("#rule-export-dialog").hide();
        $scope.data.push(saveObject);
        console.log($scope.data);
        $scope.data = Base64.encode(JSON.stringify($scope.data));

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + $scope.data);
        element.setAttribute('download', $scope.selectedRule.name + ".pd");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

    }
    $scope.confirmExport = function () {
        AJS.dialog2("#rule-export-dialog").show();
    }
    $scope.movetoImport = function () {
        AJS.dialog2("#rule-import-dialog").show();
    };
    $scope.closeImport = function () {
        AJS.dialog2("#rule-import-dialog").hide();
    };
    $scope.$on('importBroadcast', function (event, open) {
        $scope.selectedRule = open.data;
        $scope.openSelectedRule(open.data, event);
        $rootScope.changeLocation('rule.details');
        $scope.saveWorkFlow();
    });

    $scope.SetFile = function () {
        debugger;
        angular.element(document.querySelector('#importfile')).on('change', function () {
            AJS.dialog2("#rule-import-dialog").hide();
            $scope.pdFile = this.files[0];

            $scope.importFile($scope.pdFile);
        })
    }
    $scope.importFile = function (data) {
        debugger;
        var filename = data.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            data = e.target.result;
            data = data.replace("data:;base64,", "");
            data = data.replace("data:application/octet-stream;base64,", "");
            data = Base64.decode(data);
            data = Base64.decode(data);
            data = JSON.parse(data);

            var returnObj = {
                "data": data[0],
                "event": e,
                mode: 'import'
            }

            $rootScope.$broadcast('importBroadcast', returnObj);
        };
        reader.readAsDataURL(data);

    }
    /** End - Export and Import*/

    //Copy sample code in Hins panel for workflow Properties

    $scope.copySampleToClipboard = function (idPart1) {
        var id = idPart1;
        window.getSelection().empty();
        var copyField = document.getElementById(id);
        var range = document.createRange();
        range.selectNode(copyField);
        window.getSelection().addRange(range);
        document.execCommand('copy');
        $('#' + id).parent().siblings('.copy-sample-controls').append('<span class="dynamic-state-pill">Copied</span>');
    };

    //Copy sample code in Hins panel for workflow Properties - END

    // Dropdown from API test code
    $scope.testObj = {
        title: 'testAPIStringFunction'
    }
    $scope.selectedDDItem = null;

    $scope.testAPIStringFunction = function () {
        $timeout(function () {
            $scope.testStringArray = [
                'First string',
                'Second string',
                'Third string'
            ];
        }, 3000);
    }
    // Dropdown from API test code - END

    /** Rule - Copy added by lakmini 02-01-2018 */
    $scope.showCopyConfirm = function () {
        AJS.dialog2("#rule-Copy-dialog").show();
    }
    $scope.closeCopyConfirm = function () {
        AJS.dialog2("#rule-Copy-dialog").hide();
    }
    $scope.Iscopy = false;
    $scope.RuleCopy = function () {
        $scope.Iscopy = true;
        AJS.dialog2("#rule-Copy-dialog").hide();
        $rootScope.ShowBusyContainer("Copying Rule");
        debugger;
        var flowChartJson = dataHandler.getSaveJson();
        var flowID = dataHandler.createuuid();
        var tag = "Jira Addon Rule".split(" ");

        var authorDetails = {
            "Name": $rootScope.SessionDetails.name,
            "Email": $rootScope.SessionDetails.emails[0],
            "Domain": "JIRA",
            "Avatar": $scope.SessionDetails.avatar
        }
        var saveObject = {
            "ID": flowID,
            "WFID": flowID,
            "Name": "copy" + $scope.getWFName($scope.selectedRule.ruleName),
            "DisplayName": "copy_" + $scope.selectedRule.ruleName,
            "comment": "",
            "Description": $scope.selectedRule.discription,
            "version": "V1",
            "DateTime": new Date(),
            "UserName": $scope.SessionDetails.emails[0],
            "JSONData": flowChartJson,
            "AuthorDetails": authorDetails
        }
        var saveObjectParent = {
            "ID": flowID,
            "Name": "copy" + $scope.getWFName($scope.selectedRule.ruleName),
            "DisplayName": "copy_" + $scope.selectedRule.ruleName,
            "Description": $scope.selectedRule.discription,
            "version": [flowID],
            "DateTime": new Date(),
            "UserName": $scope.SessionDetails.emails[0],
            "AuthorDetails": authorDetails,
            "Tags": tag
        }
        $scope.sendProcessToObjectStore(saveObject, event, saveObjectParent);
        $rootScope.changeLocation('home');


    }
    /** Rule - Copy End */
    


}
