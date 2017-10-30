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
	'$location', mainController])
    .directive('textcomplete', ['Textcomplete', function (Textcomplete) {
        return {
            restrict: 'EA',
            scope: {
                args: '=',
                message: '='
            },
            template: '<textarea class="form-control" type="text" ng-click="hello()" ng-model=\'message\'></textarea>',
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
	.filter('bytes', function() {
		return function(bytes, precision) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
		}
	});

function mainController($scope, $rootScope, $state, $timeout, $http, dataHandler, $auth, $objectstore, $filter, TriggerDatafactory, $v6urls, $helpers, $location) {

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
    /*** JIRA component extraction - END*/

    $scope.toggleCompGroup = function (group) {
        $scope.activeCompGroup = group;
        $scope.isGroupOpen = !$scope.isGroupOpen;
    };
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
    $scope.listState = "";
    $scope.variableEditOn = null;
    $scope.allVariables = [];
	$scope.callFromSwitch = false;

    $scope.structuredComps = [{
        'Name': 'Actions',
        'components': []
    }, {
        'Name': 'Conditions',
        'components': []
    }];

    var collapsiblePanels = [];
    var compSearch = [];
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
					var outers = angular.element(block).find('.outer');
					angular.forEach(outers, function (outer) {
						angular.forEach(outer.children, function (child) {
							if (child.className.split(' ')[0] == 'workflow-block') {
								angular.element(block).find('>.workflow-add-node-sub').css('display', 'none');
							} else {
								angular.element(block).find('>.workflow-add-node-sub').css('display', 'block');
							}
						});
						var outerParent = outer.parentElement.className.split(' ')[2];
						if(outerParent == 'component-true' || outerParent == 'component-false' || outerParent == 'component-case' || outerParent == 'component-default' || outerParent == 'component-fallthrough'){
							var elem = angular.element(outer);
							var _elem = elem.find('.workflow-block').first();
							if(_elem != undefined) {
								if(!_elem.has('.sub-cond-connector').length){
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

		if(workflowComponentss != undefined){
			workflowComponentss.css('margin-right',$scope.propertyPanelWidthGLOBAL+'px');
		}
		if (workflowUI != undefined){
			workflowUI.setAttribute("style", "height:" + workflowHeight + "px");
		}
		if (shadowedGroupItems != undefined){
			shadowedGroupItemsHeight = workflowHeight - 120;
			angular.forEach(shadowedGroupItems, function (item) {
				item.setAttribute("style", "height:" + shadowedGroupItemsHeight + "px");
			});
		}
		if (selectItemBody != undefined){
			var selectItemBodyHeight = shadowedGroupItemsHeight - 84;
			angular.forEach(selectItemBody, function (item) {
				item.setAttribute("style", "height:" + selectItemBodyHeight + "px;overflow-y:scroll");
			});
		}

        if (propertiesElem != undefined && workflowHeight != undefined)
            propertiesElem.setAttribute("style", "height:" + workflowHeight + "px;overflow-y:scroll;overflow-x:hidden");
        if (workflowElem != undefined && workflowHeight != null)
            workflowElem.setAttribute("style", "height:" + workflowHeight +"px;max-width:" + workflowWidth + "px;overflow-y:scroll;overflow-x:scroll");
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

        $scope.GeneratedURL = [{
            URL: "https://" + name + ".plus.smoothflow.io/" + name + "/smoothflow/Invoke",
            METHOD: "POST"
        }, {
            URL: "https://" + name + ".plus.smoothflow.io/" + name + "/smoothflow/Hello",
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

    $scope.callurl = function (url, body) {
        var req = {
            method: url.METHOD,
            url: url.URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: { body }
        }
        $http(req).then(function (data) {
            $scope.Iscall = true;
            $scope.statuscode = data.status;
            $scope.responseMsg = JSON.stringify(data.data);
            $scope.getDockerDetails();
            $timeout($scope.GaugeChart(), 10000);

            // $scope.setDockerInformation($scope.selectedRule.name);

        }, function (data) {
            $scope.Iscall = true;
            $scope.statuscode = data.status;
            $scope.responseMsg = JSON.stringify(data.data);

        });
    }

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

    $scope.openSelectedRule = function (selectedRule, entry) {
        $timeout(function () {
            //debugger
            $rootScope.ShowBusyContainer("Loading rule details...");
            $scope.currentRuleID = selectedRule.id;
            $scope.selectedRule = selectedRule;
            var flowVersion = $scope.getVersionForWF($scope.currentRuleID);
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
                    }

                }).V1getByKey(flowVersion[0]);
            } else {
                //debugger
                $scope.openRuleLatestData($scope.selectedRule.workflow);
                TriggerDatafactory.setworkflowId($scope.selectedRule.name);
                $rootScope.selectedRuleName = $scope.selectedRule.name;
                $scope.setDockerInformation($scope.selectedRule.name);
                $rootScope.HideBusyContainer();
            }

        }, 0).then(function () {
            //call trigger Service to set workflow ID
            // TriggerDataService.setWorkflowID($scope.currentRuleID);
            $scope.listState = 'rule.details';
            $state.go('rule.details');
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
        var client = $objectstore.getClient("occupiedPorts");
        client.onGetMany(function (data) {
            if (data) {
                $scope.portlist = data;
                $scope.setport();
            }
        });
        client.v1getByFiltering("*");
    };

    $scope.setport = function () {
        if (!$scope.checkport($scope.executable.port)) {
            $scope.executable.port = Math.floor(Math.random() * (65535 - 49152) + 49152);
            $scope.setport();
        }
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
            $rootScope.ShowBusyContainer("Building rule...");
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
                $rootScope.ShowBusyContainer("Publishing rule to a container...");
                if (response.data.Status) {
                    var obj = {};
                    obj.wfname = $scope.getWFName($scope.selectedRule.ruleName);
                    ; obj.port = $scope.executable.port.toString();
                    obj.RAM = "300";
                    obj.CPU = "10";
                    $scope.PublishToDocker(obj);
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

    $scope.changeLocation = function (location) {
        $scope.componentsMenuState = 'closed';
        $scope.listState = location;
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
            $scope.allcomponents = response.data.Controls;

            if ($scope.allcomponents.length != 0) {
                angular.forEach($scope.allcomponents, function (item) {
                    // if (item.ControlType == 'trigger') {
                    //     item.workflow = [];
                    //     $scope.structuredComps[0].components.push(item);
                    // }
                    if (item.ControlType == 'action') {
                        item.workflow = [];
                        $scope.structuredComps[0].components.push(item);
                    }
                    if (item.ControlType == 'condition') {
                        if (item.DisplayName.toLowerCase() == 'if') {
                            item.workflow = [{
                                DisplayName: 'True',
                                ControlType: 'condition',
                                workflow: []
                            }, {
                                DisplayName: 'False',
                                ControlType: 'condition',
                                workflow: []
                            }];
                        } else if (item.DisplayName.toLowerCase() == 'switch') {
                            item.workflow = [{
                                DisplayName: 'Case',
                                ControlType: 'condition',
                                workflow: []
                            }, {
                                DisplayName: 'Case',
                                ControlType: 'condition',
                                workflow: []
                            }];
                        }
                        $scope.structuredComps[1].components.push(item);
                    }
                });
            }
            // console.log($scope.structuredComps);
        }, function errorCallback(response) {
            console.log(response);
        });
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
        // $state.go('rule.new');
    };

    //Close rule dialog
	$scope.closeDialog = function (dialog) {
		AJS.dialog2('#'+dialog).hide();
	};

    //Clear rule
    $scope.clearRule = function () {
        $scope.newRule();
    };

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

    $scope.deleteContainer = function (WFDetails) {
        $http({
            method: 'GET',
            url: $v6urls.nginxserver + '/removedocker/' + $rootScope.SessionDetails.Domain + '/' + $scope.selectedRule.id,
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(function (data) {
                $rootScope.DisplayMessage("The container was removed successfully.", "success", "You may try again later.");
            }, function (data) {
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
                    $scope.changeLocation("home");
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

        // deleting triggers
        //TriggerDatafactory.DeleteTrigger();
    };

    $scope.removeRule = function () {
        $scope.disableDeleteButton = false;
        $scope.hasContainer = false;
        if ($scope.selectedRule.status == "Published") {
            $scope.hasContainer = true;
        }
        AJS.dialog2("#rule-delete-dialog").show();
        //delete tigger
        TriggerDatafactory.DeleteTriggers($scope.getWFName($scope.selectedRule.ruleName));

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
        $scope.args = dataHandler.retrieveArgumentsKeys();
        component.Variables = dataHandler.checkFormat(component.Variables);
        $scope.selectedModule = component;
		$timeout(function () {
			$scope.activeModule = component.$$hashKey;
		});
    };

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

    //Open template
    $scope.openTemplateFlow = function (templateType, e) {
        var templateToLoad = [];
        var dummyWF = [];
        // get the list of nodes to fill from the template
        angular.forEach($scope.templates, function (template) {
            if (template.Name == templateType) {
                templateToLoad = template.modules;
                angular.forEach(template.variables, function (variable) {
                    $scope.AddNewVariable(variable, e);
                });
            }
        });
        // copy each node with the corresoponding library_id and add its sample data into it
        for (inc = 0; inc < templateToLoad.length; inc++) {
            for (j = 0; j < $scope.allcomponents.length; j++) {
                if ($scope.allcomponents[j].library_id == templateToLoad[inc].id) {
                    var comp = angular.copy($scope.allcomponents[j]);
                    comp.schema_id = dataHandler.createuuid();
                    dummyWF.push($scope.fillPredefinedValues(comp, templateToLoad[inc].sampleData));
                    break;
                }
            }
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
        $scope.AddNewVariable(variable, event);
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
			AJS.dialog2("#new-variable-dialog").hide()
			angular.forEach($scope.allVariables, function (variable) {
				angular.forEach($scope.AdditionalVariable, function (add) {
					if(variable.Key == add.Key)
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
			if(_var.Key == variable.Key){
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

        if(component!=undefined && component.DisplayName == 'Case' && caseInjeciton ||
			component!=undefined && component.DisplayName == 'Default' && caseInjeciton ||
			component!=undefined && component.DisplayName == 'Fallthrough' && caseInjeciton ){
        	$scope.callFromSwitch = true;
		}else{
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
        $scope.componentsMenuState == 'open' ? componentsMenuElem.setAttribute('style', 'height:' + workflowHeight + 'px;width:365px;margin-right:'+$scope.propertyPanelWidthGLOBAL+'px') : componentsMenuElem.setAttribute('style', 'height:' + workflowHeight +'px;width:0px;margin-right:'+$scope.propertyPanelWidthGLOBAL+'px');
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
            $scope.saveRule();
            $scope.openTemplateFlow(component.Name, e);
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
		}else if($rootScope.candidateComponent.DisplayName == "Case" || $rootScope.candidateComponent.DisplayName == "Default" || $rootScope.candidateComponent.DisplayName == "Fallthrough"){
			if($rootScope.caseInjeciton){
				$rootScope.candidateWorkflow.splice($rootScope.candidateIndex + 1, 0, newcompo);
			}else{
				$rootScope.candidateComponent.workflow.push(newcompo);
			}
		}else {
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

    $scope.deleteNode = function (workflow, position) {
        workflow.splice(position, 1);
    }

    // Kasun_Wijeratne_2017_10_23
	// This code gets a set of workflow and expands or collapses the block with given index accordingly
    $scope.expandComponentBody = function (workflow, position) {
		workflow[position].bodyExpanded ? workflow[position].bodyExpanded = false : workflow[position].bodyExpanded = true;
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

    //call Workflow save method
    $scope.saveWorkFlow = function () {
        console.log("Begin Workflow save.");
        $scope.generateSaveWorkflowObject();
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

            // if the parent node is having any child nodes, that will be added to a temparary array
            if (nodemodule.workflow.length > 0) {
                var childnodes = [];
                angular.forEach(nodemodule.workflow, function (childnode) {
                    //debugger
                    delete childnode.parent;
                    if (childnode.workflow.length > 0) {
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
                        }
                        childnodes = [];
                    }
                });
            }

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

    $scope.generateSaveWorkflowObject = function () {
        $rootScope.ShowBusyContainer("Saving rule details...");

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
        $scope.sendProcessToObjectStore(saveObject, event, saveObjectParent);
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

	$scope.scheduleEditOn = false;
    $scope.editSchedule = function () {
		$scope.scheduleEditOn = !$scope.scheduleEditOn;
	}
    /////// end of scheduling functions

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
        });
        client.onError(function (data) {//$scope.showToast("Oppss. There was an error storing in objectstore.");
            $rootScope.DisplayMessage("There was an error when saving the rule.", "error", "You may try again.");
            $rootScope.HideBusyContainer();
            $scope.SaveFailed = true;
        });
        client.V1insert([saveObj], {
            KeyProperty: "ID"
        });
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
            console.log(e, a);
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
                    $scope.currentRules[i].status = "Published"
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
    };

    // retrive data from JIRA
    $scope.JiraSession = {};
    $scope.CurrentUserProfile = {};

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
            if (response.data.response == "success") {
                $scope.CurrentUserProfile = response.data.jiraResponse;
                var tenant = $rootScope.baseUrl.replace(/(?:https:\/\/)/g, '');
                tenant = tenant.replace(/(?:\.atlassian\.net)/g, '');
                $scope.CurrentUserProfile.domain = tenant + "jira";
                $rootScope.Domain = $scope.CurrentUserProfile.domain;
                console.log($scope.CurrentUserProfile);
                $scope.loadJiraUser($scope.CurrentUserProfile);
                $scope.getDockerDetails();
            } else {
                $rootScope.DisplayMessage("Error when retriving user profile.", "error");
            }
        }, function OnError(response) {
            if (onError) {
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
            domain: "duosoftwarejira"
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
}
