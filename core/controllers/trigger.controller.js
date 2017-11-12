app.controller('TriggerController', ['$scope', '$rootScope', '$http', '$auth', 'TriggerDatafactory', '$timeout', function ($scope, $rootScope, $http, $auth, TriggerDatafactory, $timeout) {


    // var self = this;
    // self._Triggers = TriggerDatafactory.alltigger;

    // console.log(self._Triggers);


    $scope.triggersOptions = [
        { Type: 'Issue', Name: 'Issue Created', code: 'issue_created', check: false },
        { Type: 'Issue', Name: 'Issue Update', code: 'issue_update', check: false },
        { Type: 'Issue', Name: 'Issue Delete', code: 'issue_delete', check: false },
        { Type: 'Issue', Name: 'Issue Working Change', code: 'issue_working_change', check: false },
        { Type: 'Comment', Name: 'Comment Created', code: 'comment_created', check: false },
        { Type: 'Comment', Name: 'Comment Update', code: 'comment_update', check: false },
        { Type: 'Comment', Name: 'Comment Delete', code: 'comment_delete', check: false },
        { Type: 'Attachment', Name: 'Attachment Created', code: 'attachment_created', check: false },
        { Type: 'Attachment', Name: 'Attachment Delete', code: 'attachment_delete', check: false },
        { Type: 'Issue link', Name: 'Issue link Created', code: 'issue link_created', check: false },
        { Type: 'Issue link', Name: 'Issue link Delete', code: 'issue link_delete', check: false },
        { Type: 'Worklog', Name: 'Worklog Created', code: 'worklog_created', check: false },
        { Type: 'Worklog', Name: 'Worklog Update', code: 'worklog_update', check: false },
        { Type: 'Worklog', Name: 'Worklog Delete', code: 'worklog_delete', check: false },
        { Type: 'Jira', Name: 'Jira Voting', code: 'jira_voting', check: false },
        { Type: 'Jira', Name: 'Jira Watching', code: 'jira_watching', check: false },
        { Type: 'Jira', Name: 'Jira Unassigned Issues', code: 'jira_unassigned_issues', check: false },
        { Type: 'Jira', Name: 'Jira Subtasks', code: 'jira_subtasks', check: false },
        { Type: 'Jira', Name: 'Jira Attachments', code: 'jira_attachments', check: false },
        { Type: 'Jira', Name: 'Jira Issue link', code: 'jira_issue_link', check: false },
        { Type: 'Jira', Name: 'Jira Time Tracking Provider', code: 'jira_time tracking_provider', check: false },
        { Type: 'Board', Name: 'Board Created', code: 'board_created', check: false },
        { Type: 'Board', Name: 'Board Update', code: 'board_update', check: false },
        { Type: 'Board', Name: 'Board Delete', code: 'board_delete', check: false },
        { Type: 'Board', Name: 'Board Configuration Changed', code: 'board_configuration_changed', check: false },
        { Type: 'Sprint', Name: 'Sprint Created', code: 'sprint_created', check: false },
        { Type: 'Sprint', Name: 'Sprint Update', code: 'sprint_update', check: false },
        { Type: 'Sprint', Name: 'Sprint Delete', code: 'sprint_delete', check: false },
        { Type: 'Sprint', Name: 'Sprint Started', code: 'sprint_started', check: false },
        { Type: 'Sprint', Name: 'Sprint Closed', code: 'sprint_closed', check: false },
        { Type: 'Project', Name: 'Project Created', code: 'project_created', check: false },
        { Type: 'Project', Name: 'Project Update', code: 'project_update', check: false },
        { Type: 'Project', Name: 'Project Delete', code: 'project_delete', check: false },
        { Type: 'Version', Name: 'Version Released', code: 'version_released', check: false },
        { Type: 'Version', Name: 'Version Unreleased', code: 'version_unreleased', check: false },
        { Type: 'Version', Name: 'Version Created', code: 'version_created', check: false },
        { Type: 'Version', Name: 'Version Update', code: 'version_update', check: false },
        { Type: 'Version', Name: 'Version Delete', code: 'version_delete', check: false },
        { Type: 'Version', Name: 'Version Merged', code: 'version_merged', check: false },
        { Type: 'Version', Name: 'Version Moved', code: 'version_moved', check: false },
        { Type: 'User', Name: 'User Created', code: 'user_created', check: false },
        { Type: 'User', Name: 'User Update', code: 'user_update', check: false },
        { Type: 'User', Name: 'User Delete', code: 'user_delete', check: false }
    ];

    $scope.projectList = TriggerDatafactory.getProjectList();

    $scope.allCheckT = false;
    $scope.selectAlltriggers = function (event) {

        $scope.triggersOptions.forEach(function (element) {

            if (event.currentTarget.checked) {
                element.check = true;
            } else {
                element.check = false;
            }

        }, this);
        $scope.allCheckT = !$scope.allCheckT;
        $scope.addedToSelect('All the Triggers', $scope.allCheckT);
    };
    $scope.allCheckP = false;
    $scope.selectAllprojects = function () {
        $scope.projectList.forEach(function (element) {

            if (event.currentTarget.checked) {
                element.check = true;
            } else {
                element.check = false;
            }

        }, this);
        $scope.allCheckP = !$scope.allCheckP;
        $scope.addedToSelect('All the projects', $scope.allCheckP);
    };
    $scope.SetTriggerOptions = function () {

        $scope.Trigger = TriggerDatafactory.selected;

        if (!angular.isUndefined($scope.Trigger)) {
            for (i = 0; i < $scope.triggersOptions.length; i++) {
                $scope.Trigger.forEach(function (element) {
                    if ($scope.triggersOptions[i].code == element.code) {
                        $scope.triggersOptions[i].check = true;
                    }
                }, this);
            }
            $scope.triggersOption = $scope.triggersOptions;
        } else {
            $scope.triggersOption = $scope.triggersOptions;
        }
    };
    $scope.addedTrigger = function (trigger) {
        if (trigger.check) {
            TriggerDatafactory.addProjectwithTrigger($scope.selectedProj, trigger);
        } else {
            TriggerDatafactory.removetrigger($scope.selectedProj, trigger);
        }

        $scope.addedToSelect(trigger.Name, trigger.check);
    };

    $scope.addedProject = function (project) {
        debugger;
        $scope.selectedProj = project;
        $scope.addedToSelect(project.key + ' - ' + project.name, project.check);
    };

    var items = TriggerDatafactory.getSelectedList();
    angular.forEach(items, function (item) {
        // set project status
        var project = $scope.projectList.filter(function (project) {
            return (project.key == item.key)
        });
        if (project.length > 0) {
            project[0].check = true;
        }

        // set trigger status
        var trigger = $scope.triggersOptions.filter(function (trigger) {
            return (trigger.code == item.trigger)
        });
        if (trigger.length > 0) {
            trigger[0].check = true;
        }
    });


    //Trigger selecting notification handler
    $scope.itemSelected = false;
    $scope.selectedItemType = "";
    $scope.addedToSelect = function (item, state) {
        $scope.selectedItemType = item;
        // $timeout(function () {
        // 	state ? $scope.selectedItemState = ' selected!' : ' removed!';
        // });
        if (state) {
            $scope.selectedItemState = ' selected!';
        } else {
            $scope.selectedItemState = ' removed!';
        }
        angular.element('.selector-notif').animate({
            opacity: 1,
            right: 50
        }, function () {
            $timeout(function () {
                // $scope.itemSelected = false;
                angular.element('.selector-notif').animate({
                    opacity: 0,
                    right: 0
                });
            }, 1500);
        });
    }
    $scope.toggleTriggersPanel = function (state, project) {
        $scope.showTriggesrPanel = state;
        $scope.selectedProj = project;
    };
    $scope.SetProjectTrigger = function (project, event) {
        // if (event.currentTarget.checked) {
        var ttr = TriggerDatafactory.GetProjectTrigger(project);
        if (ttr.length > 0) {
            for (i = 0; i < $scope.triggersOptions.length; i++) {
                $scope.triggersOptions[i].check = false;
            }

            for (var index = 0; index < ttr.length; index++) {
                var code = $scope.triggersOptions.findIndex(triggersOptions => triggersOptions.code === ttr[index].code);
                //var element = array[index];
                if (code != -1) {
                    $scope.triggersOptions[code].check = true;
                }
            }

            // for (var index = 0; index < ttr.length; index++) {
            //     //var element = array[index];
            //     for (i = 0; i < $scope.triggersOptions.length; i++) {
            //         if ($scope.triggersOptions[i].code == ttr[index].code) {
            //             $scope.triggersOptions[i].check = true;
            //         } else {
            //             $scope.triggersOptions[i].check = false;
            //         }
            //     }
            // }
        } else {
            for (i = 0; i < $scope.triggersOptions.length; i++) {
                $scope.triggersOptions[i].check = false;
            }
        }

        $scope.triggersOption = $scope.triggersOptions;
    }
    //Trigger selecting notification handler - END

	// This function takes all the Triggers which are entitled with selected Projects.
	// Returns an array with Project+Triggers elements
	$scope.projectsWithTriggers = [];
	$scope.getProjectsWithTriggers = function () {
		$scope.projectsWithTriggers = [];
		angular.forEach($scope.projectList, function (project) {
			if(project.check){
				var projectTriggers = TriggerDatafactory.GetProjectTrigger(project);
				if(projectTriggers.length > 0){
					$scope.projectsWithTriggers.push({
						project: project,
						triggers: projectTriggers
					});
				}else{
					$scope.projectsWithTriggers.push({
						project: project,
						triggers: ['No triggers have been added to this project yet']
					});
				}
			}
		});
	};
	$scope.getProjectsWithTriggers();

	$scope.saveProjectTrigger = function () {
		TriggerDatafactory.SaveTriggers($scope.triggersOption);
	}

	// This function will remove a selected project from Automation
	$scope.removeSelectedProject = function (project) {
		TriggerDatafactory.DeleteProject(project);
		$scope.getProjectsWithTriggers();
	}
}]);