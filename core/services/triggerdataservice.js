app.factory('TriggerDatafactory', function ($objectstore, $filter, $v6urls, $http, $rootScope) {

    //variables
    var alltriggers = [];
    var allprojects = [];
    var selectedTriggersAndProjects = [];
    var WorkFlowId = "";
    var Selectedtri = [];

    this.setProjectList = function (projectList) {
        angular.forEach(projectList, function (project) {
            project.check = false;
        });
        allprojects = projectList;
    }

    this.getProjectList = function () {
        angular.forEach(allprojects, function (proj) {
            proj.check = false;
        });
        return allprojects;
    }

    this.getSelectedList = function () {
        return selectedTriggersAndProjects;
    }

    //get all this details
    this.GetAllTriggers = function (WorkFlowId) {
        $rootScope.ShowBusyContainer("Almost done...");
        WorkFlowId = WorkFlowId;

        alltriggers = [];
        var tempData = [];

        var client = $objectstore.getClient("jiraAddonTriggers");
        client.onGetMany(function (data) {
            debugger
            if (data.length == 0) {
                tempData = [
                    { 'code': 'issue_created', 'projects': [] },
                    { 'code': 'issue_updated', 'projects': [] },
                    { 'code': 'issue_deleted', 'projects': [] },
                    { 'code': 'issue_working_change', 'projects': [] },
                    { 'code': 'comment_created', 'projects': [] },
                    { 'code': 'comment_updated', 'projects': [] },
                    { 'code': 'comment_deleted', 'projects': [] },
                    { 'code': 'attachment_created', 'projects': [] },
                    { 'code': 'attachment_deleted', 'projects': [] },
                    { 'code': 'issuelink_created', 'projects': [] },
                    { 'code': 'issuelink_deleted', 'projects': [] },
                    { 'code': 'worklog_created', 'projects': [] },
                    { 'code': 'worklog_updated', 'projects': [] },
                    { 'code': 'worklog_deleted', 'projects': [] },
                    { 'code': 'jira_voting', 'projects': [] },
                    { 'code': 'jira_watching', 'projects': [] },
                    { 'code': 'jira_unassigned issues', 'projects': [] },
                    { 'code': 'jira_subtasks', 'projects': [] },
                    { 'code': 'jira_attachments', 'projects': [] },
                    { 'code': 'jira_issue_link', 'projects': [] },
                    { 'code': 'jira_time tracking_provider', 'projects': [] },
                    { 'code': 'option_voting_changed', 'projects': [] },
                    { 'code': 'option_watching_changed', 'projects': [] },
                    { 'code': 'option_unassigned_issues_changed', 'projects': [] },
                    { 'code': 'option_subtasks_changed', 'projects': [] },
                    { 'code': 'option_attachments_changed', 'projects': [] },
                    { 'code': 'option_issuelinks_changed', 'projects': [] },
                    { 'code': 'board_created', 'projects': [] },
                    { 'code': 'board_updated', 'projects': [] },
                    { 'code': 'board_deleted', 'projects': [] },
                    { 'code': 'board_configuration_changed', 'projects': [] },
                    { 'code': 'sprint_created', 'projects': [] },
                    { 'code': 'sprint_updated', 'projects': [] },
                    { 'code': 'sprint_deleted', 'projects': [] },
                    { 'code': 'sprint_started', 'projects': [] },
                    { 'code': 'sprint_closed', 'projects': [] },
                    { 'code': 'project_created', 'projects': [] },
                    { 'code': 'project_updated', 'projects': [] },
                    { 'code': 'project_deleted', 'projects': [] },
                    { 'code': 'version_released', 'projects': [] },
                    { 'code': 'version_unreleased', 'projects': [] },
                    { 'code': 'version_created', 'projects': [] },
                    { 'code': 'version_updated', 'projects': [] },
                    { 'code': 'version_deleted', 'projects': [] },
                    { 'code': 'version_merged', 'projects': [] },
                    { 'code': 'version_moved', 'projects': [] },
                    { 'code': 'user_created', 'projects': [] },
                    { 'code': 'user_updated', 'projects': [] },
                    { 'code': 'user_deleted', 'projects': [] }
                ]
            } else {
                tempData = data;
            }

            for (i = 0; i < tempData.length; i++) {
                alltriggers.push(tempData[i]);
            }
            selectedTriggersAndProjects = [];
            //debugger
            for (i = 0; i < alltriggers.length; i++) {
                if (alltriggers[i].projects.length > 0) {
                    //debugger
                    for (j = 0; j < alltriggers[i].projects.length; j++) {
                        var temptriggers = alltriggers[i].projects.filter(function (project) {
                            if (project.WFID.indexOf(WorkFlowId) >= 0) {
                                return true
                            }
                        });
                        //   debugger
                        angular.forEach(temptriggers, function (trig) {
                            //   debugger
                            trig.trigger = alltriggers[i].code;
                            selectedTriggersAndProjects.push(trig);
                        });
                    }
                }
            }
            // debugger
            //$rootScope.$broadcast('selectedTriggers', selectedTriggersAndProjects);
            $rootScope.HideBusyContainer();
        }).v1getByFiltering("*");

        //var url = $v6urls.globalOS + "/jiraAddonTriggers";
        //var url = globalOS + $rootScope.Domain + "/jiraAddonTriggers";
        // get all trigger details from the global location
        // $http({
        //     url: url,
        //     method: "GET",
        //     headers: {
        //         'securityToken': "ignore"
        //     }
        // }).
        //     then(function (data, status, headers, config) {
        //         if (data) {
        //             if (data.data.length == 0) {
        //                 tempData = [
        //                     { 'code': 'issue_created', 'projects': [] },
        //                     { 'code': 'issue_updated', 'projects': [] },
        //                     { 'code': 'issue_deleted', 'projects': [] },
        //                     { 'code': 'issue_working_change', 'projects': [] },
        //                     { 'code': 'comment_created', 'projects': [] },
        //                     { 'code': 'comment_updated', 'projects': [] },
        //                     { 'code': 'comment_deleted', 'projects': [] },
        //                     { 'code': 'attachment_created', 'projects': [] },
        //                     { 'code': 'attachment_deleted', 'projects': [] },
        //                     { 'code': 'issuelink_created', 'projects': [] },
        //                     { 'code': 'issuelink_deleted', 'projects': [] },
        //                     { 'code': 'worklog_created', 'projects': [] },
        //                     { 'code': 'worklog_updated', 'projects': [] },
        //                     { 'code': 'worklog_deleted', 'projects': [] },
        //                     { 'code': 'jira_voting', 'projects': [] },
        //                     { 'code': 'jira_watching', 'projects': [] },
        //                     { 'code': 'jira_unassigned issues', 'projects': [] },
        //                     { 'code': 'jira_subtasks', 'projects': [] },
        //                     { 'code': 'jira_attachments', 'projects': [] },
        //                     { 'code': 'jira_issue_link', 'projects': [] },
        //                     { 'code': 'jira_time tracking_provider', 'projects': [] },
        //                     { 'code': 'option_voting_changed', 'projects': [] },
        //                     { 'code': 'option_watching_changed', 'projects': [] },
        //                     { 'code': 'option_unassigned_issues_changed', 'projects': [] },
        //                     { 'code': 'option_subtasks_changed', 'projects': [] },
        //                     { 'code': 'option_attachments_changed', 'projects': [] },
        //                     { 'code': 'option_issuelinks_changed', 'projects': [] },
        //                     { 'code': 'board_created', 'projects': [] },
        //                     { 'code': 'board_updated', 'projects': [] },
        //                     { 'code': 'board_deleted', 'projects': [] },
        //                     { 'code': 'board_configuration_changed', 'projects': [] },
        //                     { 'code': 'sprint_created', 'projects': [] },
        //                     { 'code': 'sprint_updated', 'projects': [] },
        //                     { 'code': 'sprint_deleted', 'projects': [] },
        //                     { 'code': 'sprint_started', 'projects': [] },
        //                     { 'code': 'sprint_closed', 'projects': [] },
        //                     { 'code': 'project_created', 'projects': [] },
        //                     { 'code': 'project_updated', 'projects': [] },
        //                     { 'code': 'project_deleted', 'projects': [] },
        //                     { 'code': 'version_released', 'projects': [] },
        //                     { 'code': 'version_unreleased', 'projects': [] },
        //                     { 'code': 'version_created', 'projects': [] },
        //                     { 'code': 'version_updated', 'projects': [] },
        //                     { 'code': 'version_deleted', 'projects': [] },
        //                     { 'code': 'version_merged', 'projects': [] },
        //                     { 'code': 'version_moved', 'projects': [] },
        //                     { 'code': 'user_created', 'projects': [] },
        //                     { 'code': 'user_updated', 'projects': [] },
        //                     { 'code': 'user_deleted', 'projects': [] }
        //                 ]
        //             } else {
        //                 tempData = data.data;
        //             }

        //             for (i = 0; i < tempData.length; i++) {
        //                 alltriggers.push(tempData[i]);
        //             }
        //             selectedTriggersAndProjects = [];
        //             //debugger
        //             for (i = 0; i < alltriggers.length; i++) {
        //                 if (alltriggers[i].projects.length > 0) {
        //                     //debugger
        //                     for (j = 0; j < alltriggers[i].projects.length; j++) {
        //                         var temptriggers = alltriggers[i].projects.filter(function (project) {
        //                             if (project.WFID.indexOf(WorkFlowId) >= 0) {
        //                                 return true
        //                             }
        //                         });
        //                         //   debugger
        //                         angular.forEach(temptriggers, function (trig) {
        //                             //   debugger
        //                             trig.trigger = alltriggers[i].code;
        //                             selectedTriggersAndProjects.push(trig);
        //                         });
        //                     }
        //                 }
        //             }
        //             // debugger
        //             //$rootScope.$broadcast('selectedTriggers', selectedTriggersAndProjects);
        //             $rootScope.HideBusyContainer();
        //         }
        //     }, function (data, status, headers, config) {
        //         alert("Oppss. There was an error when retriving data.");
        //     });
    };

    this.setworkflowId = function (WorkFlowID) {
        // debugger
        WorkFlowId = WorkFlowID;
        this.GetAllTriggers(WorkFlowId);
    }

    // this.AddedTriggers = function (selectedTrigger) {
    //     // get checked projects
    //     var selectedprojects = allprojects.filter(function (project) {
    //         return (project.check == true);
    //     });
    //     if (selectedprojects != 0) {
    //         // add current rule for the trigger object 
    //         for (i = 0; i < alltriggers.length; i++) {
    //             if (selectedTrigger.code == alltriggers[i].code) {
    //                 // debugger
    //                 for (j = 0; j < selectedprojects.length; j++) {
    //                     // debugger
    //                     var proj = alltriggers[i].projects.filter(function (pro) {
    //                         return (pro.key == selectedprojects[j].key);
    //                     });
    //                     if (proj.length > 0) {
    //                         // add to the project if its already there
    //                         if (selectedTrigger.check) {
    //                             if (proj[0].WFID.length >= 1) {
    //                                 proj[0].WFID.push(WorkFlowId);
    //                             } else {
    //                                 var index = alltriggers[i].projects.indexOf(proj[0]);
    //                                 alltriggers[i].projects.splice(index, 1);
    //                             }
    //                         } else {
    //                             if (proj[0].WFID.length > 1) {
    //                                 var index = proj[0].WFID.indexOf(WorkFlowId)
    //                                 proj[0].WFID.splice(index, 1);
    //                             } else if (proj[0].WFID.length == 1) {
    //                                 var index = alltriggers[i].projects.indexOf(proj[0]);
    //                                 alltriggers[i].projects.splice(index, 1);
    //                             }
    //                         }
    //                     } else {
    //                         // else add new project and rule name to it.
    //                         if (selectedTrigger.check) {
    //                             var record = {
    //                                 "key": selectedprojects[j].key,
    //                                 "WFID": [WorkFlowId]
    //                             }
    //                             alltriggers[i].projects.push(record);
    //                         }
    //                     }
    //                 }
    //                 break;
    //             }
    //         }
    //     } else {
    //         selectedTrigger.check = false;
    //         alert("Please select a project to continue.");
    //     }
    // };

    // this.AddedProject = function (selectedProject, selectedtriggers) {
    //     if (selectedtriggers.length != 0) {
    //         // add current rule for the trigger object 
    //         var selectedprojects = allprojects.filter(function (project) {
    //             return (project.check == true);
    //         });
    //         if (selectedprojects != 0) {
    //             // add current rule for the trigger object 
    //             for (i = 0; i < selectedtriggers.length; i++) {
    //                 //debugger
    //                 for (j = 0; j < alltriggers.length; j++) {
    //                     if (selectedtriggers[i].code == alltriggers[j].code) {
    //                         //debugger
    //                         var proj = alltriggers[j].projects.filter(function (proj) {
    //                             return (proj.key == selectedProject.key);
    //                         });
    //                         if (proj.length > 0) {
    //                             // debugger
    //                             if (selectedProject.check) {

    //                             } else {
    //                                 if (proj[0].WFID.length > 1) {
    //                                     var index = proj[0].WFID.indexOf(WorkFlowId);
    //                                     proj[0].WFID.splice(index, 1);
    //                                 } else if (proj[0].WFID.length == 1) {
    //                                     var index = alltriggers[j].projects.indexOf(proj[0]);
    //                                     alltriggers[j].projects.splice(index, 1);
    //                                 }
    //                             }
    //                         } else {
    //                             // else add new project and rule name to it.
    //                             var record = {
    //                                 "key": selectedProject.key,
    //                                 "WFID": [WorkFlowId]
    //                             }
    //                             alltriggers[j].projects.push(record);
    //                         }
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    //tigger save
    this.SaveTriggers = function (WorkFlowID) {
        debugger
        var saveJson = alltriggers;
        var payload = { "Objects": saveJson, "Parameters": { "KeyProperty": "code" } };

        var client = $objectstore.getClient("jiraAddonTriggers");
        client.onComplete(function (data) {
            $rootScope.DisplayMessage("Trigger details updated successfully.", "success");
            $rootScope.HideBusyContainer();
        });
        client.onError(function (data) {
            $rootScope.DisplayMessage("Error occured when saving trigger details.", "error", "Please contact an administrator.");
            $rootScope.HideBusyContainer();
        });
        client.V1insert(saveJson, {
            KeyProperty: "code"
        });

        // var load = JSON.stringify(payload);
        // var payload = JSON.parse(load);
        // var url = globalOS + $rootScope.Domain + "/jiraAddonTriggers";
        // console.log(load);
        // console.log(url);
        // $http.post(url, payload, {
        //     headers: {
        //         'Content-Type': "json/application",
        //         'securityToken': "ignore"
        //     }
        // })
        //     .then(function (data, status, headers, config) {
        //         $rootScope.DisplayMessage("Rule saved successfully.", "success", "You can access saved rules under 'My Rules' page.");
        //         $rootScope.HideBusyContainer();
        //     }, function (data, status, headers, config) {
        //         $rootScope.DisplayMessage("Error occured when saving rule.", "error", "You can access saved rules under 'My Rules' page.");
        //         $rootScope.HideBusyContainer();
        //     });

    }
    //trigger Delete
    this.DeleteTriggers = function (WorkFlowID) {
        alltriggers.forEach(function (element) {
            for (j = 0; j < element.projects.length; j++) {
                for (i = 0; i < element.projects[j].WFID.length; i++) {
                    if (WorkFlowID == element.projects[j].WFID[i]) {
                        // debugger;
                        element.projects[j].WFID.splice(i, 1);
                    }
                }
            }

        }, this);
        this.SaveTriggers(WorkFlowID);
    };
    this.DeleteProject = function (Project) {
        alltriggers.forEach(function (element) {
            for (j = 0; j < element.projects.length; j++) {
                if (Project.key == element.projects[j].key)
                    element.projects.splice(j, 1);
            }

        }, this);
        this.SaveTriggers(Project);
    };
    this.GetProjectTrigger = function (Project) {
        Selectedtri = [];
        for (var index = 0; index < alltriggers.length; index++) {
            alltriggers[index].projects.forEach(function (element) {
                if (element.key == Project.key) {
                    element.WFID.forEach(function (Workflow) {
                        console.log(Workflow);
                        if (Workflow != null)
                            Workflow = Workflow.replace(/[_-]/g, "");
                        console.log(Workflow);
                        if (Workflow == WorkFlowId) {
                            Selectedtri.push(alltriggers[index]);
                        }
                    }, this);
                }
            }, this);
        }
        return Selectedtri;
    }
    this.addProjectwithTrigger = function (project, selectedtriggers) {
        if (selectedtriggers != undefined) {
            var code = alltriggers.findIndex(alltriggers => alltriggers.code === selectedtriggers.code);
            if (alltriggers[code].projects.length > 0) {
                var ee = alltriggers[code].projects;
                var projs = ee.findIndex(ee => ee.key === project.key);
                if (projs != -1) {
                    alltriggers[code].projects[projs].WFID.push(WorkFlowId);
                }
            } else {
                var record = {
                    "key": project.key,
                    "WFID": [WorkFlowId]
                }
                alltriggers[code].projects.push(record);
            }
        }
    };
    this.removetrigger = function (project, trigger) {
        var code = alltriggers.findIndex(alltriggers => alltriggers.code === trigger.code);
        if (alltriggers[code].projects.length > 0) {
            var ee = alltriggers[code].projects;
            var projs = ee.findIndex(ee => ee.key === project.key);
            if (projs != -1) {
                var tt = alltriggers[code].projects[projs];
                for (var index = 0; index < tt.WFID.length; index++) {
                    if (tt.WFID[index] == WorkFlowId) {
                        alltriggers[code].projects[projs].WFID.splice(index, 1);
                    }
                }
            }
        }

    }
    return this;
});