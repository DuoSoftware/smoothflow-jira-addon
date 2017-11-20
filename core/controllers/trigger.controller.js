app.controller('TriggerController', ['$scope', '$rootScope', '$http', '$auth', 'TriggerDatafactory', '$timeout', function ($scope, $rootScope, $http, $auth, TriggerDatafactory, $timeout) {


    // var self = this;
    // self._Triggers = TriggerDatafactory.alltigger;

    // console.log(self._Triggers);


    $scope.triggersOptions = [
        { Type: 'Issue', Name: 'Issue Created', code: 'issue_created', check: false },
        { Type: 'Issue', Name: 'Issue Update', code: 'issue_updated', check: false },
        { Type: 'Issue', Name: 'Issue Delete', code: 'issue_deleted', check: false },
        { Type: 'Issue', Name: 'Issue Working Change', code: 'worklog_updated', check: false },       
        { Type: 'Comment', Name: 'Comment Created', code: 'comment_created', check: false },
        { Type: 'Comment', Name: 'Comment Update', code: 'comment_updated', check: false },
        { Type: 'Comment', Name: 'Comment Delete', code: 'comment_deleted', check: false },
        { Type: 'Attachment', Name: 'Attachment Created', code: 'attachment_created', check: false },
        { Type: 'Attachment', Name: 'Attachment Delete', code: 'attachment_deleted', check: false },
        { Type: 'Issue link', Name: 'Issue link Created', code: 'issuelink_created', check: false },
        { Type: 'Issue link', Name: 'Issue link Delete', code: 'issuelink_deleted', check: false },
        { Type: 'Worklog', Name: 'Worklog Created', code: 'worklog_created', check: false },
        { Type: 'Worklog', Name: 'Worklog Update', code: 'worklog_updated', check: false },
        { Type: 'Worklog', Name: 'Worklog Delete', code: 'worklog_deleted', check: false },
        { Type: 'Jira', Name: 'Jira Voting', code: 'option_voting_changed', check: false },
        { Type: 'Jira', Name: 'Jira Watching', code: 'option_watching_changed', check: false },
        { Type: 'Jira', Name: 'Jira Unassigned Issues', code: 'option_unassigned_issues_changed', check: false },
        { Type: 'Jira', Name: 'Jira Subtasks', code: 'option_subtasks_changed', check: false },
        { Type: 'Jira', Name: 'Jira Attachments', code: 'option_attachments_changed', check: false },
        { Type: 'Jira', Name: 'Jira Issue link', code: 'option_issuelinks_changed', check: false },
        { Type: 'Jira', Name: 'Jira Time Tracking Provider', code: 'option_timetracking_changed', check: false },     
        { Type: 'Board', Name: 'Board Created', code: 'board_created', check: false },
        { Type: 'Board', Name: 'Board Update', code: 'board_updated', check: false },
        { Type: 'Board', Name: 'Board Delete', code: 'board_deleted', check: false },
        { Type: 'Board', Name: 'Board Configuration Changed', code: 'board_configuration_changed', check: false },
        { Type: 'Sprint', Name: 'Sprint Created', code: 'sprint_created', check: false },
        { Type: 'Sprint', Name: 'Sprint Update', code: 'sprint_updated', check: false },
        { Type: 'Sprint', Name: 'Sprint Delete', code: 'sprint_deleted', check: false },
        { Type: 'Sprint', Name: 'Sprint Started', code: 'sprint_started', check: false },
        { Type: 'Sprint', Name: 'Sprint Closed', code: 'sprint_closed', check: false },
        { Type: 'Project', Name: 'Project Created', code: 'project_created', check: false },
        { Type: 'Project', Name: 'Project Update', code: 'project_updated', check: false },
        { Type: 'Project', Name: 'Project Delete', code: 'project_deleted', check: false },
        { Type: 'Version', Name: 'Version Released', code: 'version_released', check: false },
        { Type: 'Version', Name: 'Version Unreleased', code: 'version_unreleased', check: false },
        { Type: 'Version', Name: 'Version Created', code: 'version_created', check: false },
        { Type: 'Version', Name: 'Version Update', code: 'version_updated', check: false },
        { Type: 'Version', Name: 'Version Delete', code: 'version_deleted', check: false },
        { Type: 'Version', Name: 'Version Merged', code: 'version_deleted', check: false },
        { Type: 'Version', Name: 'Version Moved', code: 'version_moved', check: false },
        { Type: 'User', Name: 'User Created', code: 'user_created', check: false },
        { Type: 'User', Name: 'User Update', code: 'user_updated', check: false },
        { Type: 'User', Name: 'User Delete', code: 'user_deleted', check: false }
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
		for(var p=0; p < $scope.projectsWithTriggers.length;p++){
			if($scope.projectsWithTriggers[p].project.key == project.project.key){
				$scope.projectsWithTriggers[p].splice(j, 1);
			}
		}
		TriggerDatafactory.DeleteProject(project.project);
		// $scope.getProjectsWithTriggers();
	}
}]);