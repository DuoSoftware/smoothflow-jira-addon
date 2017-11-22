/* use strict */
app.factory('dataHandler', function () {
    var authData = {};
    var securityToken = "";
    var GlobalNodes = [];
    var GlobalConnections = [];
    var GlobalIfConditions = [];
    var GlobalForloops = [];
    var GlobalSwitches = [];
    var GlobalCases = [];
    var currentState = "";
    var Arguments = [];
    var GlobalWhile = [];
    var GlobalViews = ['drawboard'];
    var SupportedDataTypes = ["string", "int", "float", "boolean", "array(string)", "arrayItem(string)", "array(int)", "arrayItem(int)", "array(float)", "arrayItem(float)", "array(boolean)", "arrayItem(boolean)"];
    var ControlswithState = ["2", "5", "8", "9", "10", "13"];
    function CheckIfAllReadyExists_node(schema_id) {
        var flag = false;
        for (var i = 0; i < GlobalNodes.length; i++) {
            if (GlobalNodes[i].schema_id == schema_id) {
                flag = true;
                GlobalNodes.splice(i, 1);
                break;
            }
        }
        return flag;
    }
    ; function CheckIfAllReadyExists_connection(connection) {
        //---------modify by lakmini 24/08/2017 -----------
        var flag = false;
        for (var i = 0; i < GlobalConnections.length; i++) {
            //---old code----------
            // if (GlobalConnections[i].sourceId == connection.sourceId && GlobalConnections[i].targetId == connection.targetId) {
            //     flag = true;
            //     GlobalConnections.splice(i, 1);
            // }
            //------------------------

            // //debugger;

            if (GlobalConnections[i].sourceId == connection.sourceId) {
                if (GlobalConnections[i].targetId == connection.targetId) {
                    flag = true;
                    GlobalConnections.splice(i, 1);
                } else {
                    flag = false;
                    GlobalConnections.splice(i, 1);
                }

            } else if (GlobalConnections[i].targetId == connection.targetId) {
                if (GlobalConnections[i].sourceId == connection.sourceId) {
                    flag = true;
                    GlobalConnections.splice(i, 1);
                } else {
                    flag = false;
                    GlobalConnections.splice(i, 1);
                }

            }

        }
        return flag;
    }
    ; function CheckIfAllReadyExists_argument(argument, category) {
        var flag = false;
        for (var i = 0; i < Arguments.length; i++) {
            if (Arguments[i].Key == argument) {
                flag = true;
                /*if(Arguments[i].Category != "Configuration" && Arguments[i].Category != "Header" ){
                    
                }*/
            }
        }
        return flag;
    }
    ; function CheckIfAllReadyExists_ifconnection(id) {
        var flag = false;
        for (var i = 0; i < GlobalIfConditions.length; i++) {
            if (GlobalIfConditions[i].id == id) {
                flag = true;
            }
        }
        return flag;
    }
    ; function CheckIfAllReadyExists_view(id) {
        var flag = false;
        for (var i = 0; i < GlobalViews.length; i++) {
            if (GlobalViews[i] == id) {
                flag = true;
            }
        }
        return flag;
    }
    ; function CheckIfAllReadyExists_foreach(id) {
        var flag = false;
        for (var i = 0; i < GlobalForloops.length; i++) {
            if (GlobalForloops[i].id == id) {
                flag = true;
            }
        }
        return flag;
    }
    function CheckIfAllReadyExists_switch(id) {
        var flag = false;
        for (var i = 0; i < GlobalSwitches.length; i++) {
            if (GlobalSwitches[i].id == id) {
                flag = true;
            }
        }
        return flag;
    }
    ; function CheckIfAllReadyExists_case(id) {
        var flag = false;
        for (var i = 0; i < GlobalCases.length; i++) {
            if (GlobalCases[i].id == id) {
                flag = true;
            }
        }
        return flag;
    }
    ; function CheckIfAllReadyExists_while(id) {
        var flag = false;
        for (var i = 0; i < GlobalWhile.length; i++) {
            if (GlobalWhile[i].id == id) {
                flag = true;
            }
        }
        return flag;
    }
    ; function RemoveGlobalNode(schema_id) {
        for (var i = 0; i < GlobalNodes.length; i++) {
            if (GlobalNodes[i].schema_id == schema_id) {
                GlobalNodes.splice(i, 1);
                break;
            }
        }
    }
    ; function RemoveGlobalConnection(id) {
        for (var i = 0; i < GlobalConnections.length; i++) {
            if (GlobalConnections[i].id == id) {
                GlobalConnections.splice(i, 1);
            }
        }
    }
    ; function RemoveGlobalIfConnection(id) {
        for (var i = 0; i < GlobalIfConditions.length; i++) {
            if (GlobalIfConditions[i].id == id) {
                GlobalIfConditions.splice(i, 1);
            }
        }
    }
    ; function RemoveGlobalView(id) {
        for (var i = 0; i < GlobalViews.length; i++) {
            if (GlobalViews[i] == id) {
                GlobalViews.splice(i, 1);
            }
        }
    }
    ; function CheckIfAllReadyExists_state(URL, states) {
        var flag = false;
        for (var i = 0; i < states.length; i++) {
            if (states[i].name == URL) {
                flag = true;
            }
        }
        return flag;
    }
    ; function sortArgumentTypes() {
        for (x = 0; x < Arguments.length; x++) {
            var flag = checkType(Arguments[x].Value);
            console.log(Arguments[x].Value, x, flag);
            if (flag.type == 'dynamic') {
                Arguments[x].Type = 'dynamic';
            } else if (flag.type == 'hardcoded') {
                Arguments[x].Type = 'hardcoded';
            } else if (flag.type == 'custom') {
                Arguments[x].Type = 'custom';
                Arguments[x].ValueList = flag.variables;
            }
            ; if (flag.datatype != "") {
                Arguments[x].ConvertTo = flag.datatype;
            }
            ; Arguments[x].IsValid = flag.valid;
        }
        ; return Arguments;
    }
    ; function sortArgumentTypes(argumentlist) {
        for (x = 0; x < argumentlist.length; x++) {
            var flag = checkType(argumentlist[x].Value);
            console.log(argumentlist[x].Value, x, flag);
            if (flag.type == 'dynamic') {
                argumentlist[x].Type = 'dynamic';
            } else if (flag.type == 'hardcoded') {
                argumentlist[x].Type = 'hardcoded';
            } else if (flag.type == 'custom') {
                argumentlist[x].Type = 'custom';
                argumentlist[x].ValueList = flag.variables;
            }
            ; if (flag.datatype != "") {
                argumentlist[x].ConvertTo = flag.datatype;
            }
            ; argumentlist[x].IsValid = flag.valid;
        }
        ; return argumentlist;
    }
    ; function sortVariableTypes() {
        for (y = 0; y < GlobalNodes.length; y++) {
            for (z = 0; z < GlobalNodes[y].Variables.length; z++) {
                var val = GlobalNodes[y].Variables[z].Value;
                var verification = checkType(val);
                GlobalNodes[y].Variables[z].ValueType = verification.valuetype;
                if (verification.type == 'dynamic') {
                    GlobalNodes[y].Variables[z].Type = 'dynamic';
                    if (verification.datatype != "") {
                        // if the control is a If condition, the dynamic value's data type will automatically change the field datatype
                        if (GlobalNodes[y].library_id == '2') {
                            GlobalNodes[y].Variables[z].DataType = verification.datatype;
                        }
                        // automatically complete datatype if a dynamic value is given
                        if (GlobalNodes[y].library_id == '4') {
                            GlobalNodes[y].Variables[z].DataType = verification.datatype;
                        }
                    }
                } else if (verification.type == 'hardcoded') {
                    GlobalNodes[y].Variables[z].Type = 'hardcoded';
                    if (GlobalNodes[y].Variables[z].DataType != "string") {
                        GlobalNodes[y].Variables[z].ConvertTo = GlobalNodes[y].Variables[z].DataType;
                    } else {
                        GlobalNodes[y].Variables[z].ConvertTo = "";
                    }
                } else if (verification.type == 'custom') {
                    GlobalNodes[y].Variables[z].Type = 'custom';
                    GlobalNodes[y].Variables[z].ValueList = verification.variables;
                }
                ; if (verification.datatype != "") {
                    GlobalNodes[y].Variables[z].ConvertTo = verification.datatype;
                }
                ; GlobalNodes[y].Variables[z].IsValid = verification.valid;
            }
            ;
        }
        ; return GlobalNodes;
    }
    ; function checkType(value) {
        //debugging purpose
        if (value == "Your current account balance is + @VAccOutstand") {
            console.log("debug point");
        }
        var argObj = Arguments;
        var type = "hardcoded";
        var dataType = "";
        var valueType = "";
        var valid = true;
        var dataConvertion = "";
        var ValidConvertionType = "";
        var variableCount = 0;
        var variableList = [];
        // first break the value into two by the . and if a section is available after . it should be validated
        if (value != undefined && value != "") {
            // check if the value has a plus. which means its a custom event.
            values = value.split(/(?=[+])/gi);
            /*values = value.split("*");*/
            values.forEach(function (value) {
                value = value.trim();
                value = value.split("\"").join("")
                // removes all the "s in the string. otherwise it will give errors when printing values on the GoCode
                //valueList = value.split(".");
                var splitpattern = /.\([a-z]+\)/g;
                if (splitpattern.test(value)) valueList = value.split("."); else valueList = [value];
                var printValue = "";
                // check if it is covered with brackets.. 
                if (value != "") {
                    for (c = 0; c < valueList.length; c++) {
                        printValue = valueList[c];
                        for (i = 0; i < argObj.length; i++) {
                            var Keyname = argObj[i].Key;
                            var pattern = new RegExp("@" + Keyname);
                            var res = pattern.test(printValue);
                            if (Keyname != "") {
                                if (res) {
                                    type = "dynamic";
                                    dataType = argObj[i].DataType;
                                    valueType = argObj[i].DataType;
                                    break;
                                } else {
                                    type = "hardcoded";
                                }
                                ; if (valueList[c] == "") {
                                    // if the valueList length is 1 then it should a dynamic value because an empty value cannot be divided by any value
                                    if (valueList.length == 1) {
                                        type = "dynamic";
                                        break;
                                    }
                                }
                                ; if (valueList[c] == undefined) {
                                    type = "dynamic";
                                    break;
                                }
                                ;
                            }
                        }
                        ; if (type == "dynamic") {
                            if (valueList[c] != "") {
                                // check if the following value is not null
                                if (valueList[c + 1] != null) {
                                    for (i = 0; i < SupportedDataTypes.length; i++) {
                                        var ConvertionType = "(" + SupportedDataTypes[i] + ")";
                                        if (valueList[c + 1].toLowerCase().indexOf(ConvertionType) > -1) {
                                            dataType = SupportedDataTypes[i];
                                            ValidConvertionType = ConvertionType;
                                            break;
                                        }
                                        ; if (valueList[c + 1] == "") {
                                            dataType = "";
                                            break;
                                        }
                                        ; if (valueList[c + 1] == undefined) {
                                            dataType = "";
                                            break;
                                        }
                                        ;
                                    }
                                    ; if (dataType == "") {
                                        valid = false;
                                    }
                                }
                            }
                            //skip the next iteration by adding one.
                            c++;
                        }
                        if (values.length > 1) {
                            if (valueType == "") {
                                valueType = "string";
                            }
                            variableList.push({
                                value: printValue.trim(),
                                type: type,
                                datatype: valueType,
                                valid: valid,
                            });
                            type = "custom";
                            dataType = "";
                            valueType = "";
                        }
                    }
                    ;
                }
                // end of forloop
                // add a new value to the variable list if the type is custom
                /*if (values.length > 1) {
                    if (dataType == "") {
                        dataType = "string";
                    }
                    variableList.push({
                        value: printValue,
                        type: type,
                        datatype: dataType,
                        valid: valid,
                    });
                    type = "custom";
                    dataType = "";
                }*/
            });
        } else {
            type = "dynamic";
            dataType = "";
        }
        return {
            type: type,
            datatype: dataType,
            valid: valid,
            variables: variableList,
            valuetype: valueType
        };
    }
    ;/*function checkConvertion(value) {
        var dataType = "";
        var dataConvertion = "";
        for (i = 0; i < SupportedDataTypes.length; i++) {
            var type = ".(" +SupportedDataTypes[i]+")";

            if (value.toLowerCase().indexOf(type) > -1) {
                dataType = SupportedDataTypes[i];
            };
            if (value == "") {
                dataType = ""
            };
            if (value == undefined) {
                dataType = ""
            };
        };

        return dataType;
    };*/
    function getArgumentKeys(data, type) {
        var keyarray = [];
        data.forEach(function (variable) {
            if (variable.Key != "" && (variable.Category != 'Configuration' && variable.Category != 'Header')) {
                if (type != null || type != undefined) {
                    if (type == variable.Category) {
                        keyarray.push(variable.Key);
                    }
                } else {
                    keyarray.push(variable.Key);
                }
            }
        });
        return keyarray;
    }
    function reformatArguments(data) {
        var arguments = data;
        for (i = 0; i < arguments.length; i++) {
            if (arguments[i].Group == undefined) {
                arguments[i].Group = 'default';
            }
            ; if (arguments[i].Priority == undefined) {
                arguments[i].Priority = 'NotMandatory';
            }
            ; if (arguments[i].DataType == undefined) {
                arguments[i].DataType = 'string';
            }
            if (arguments[i].DataType == "String") {
                arguments[i].DataType = 'string';
            }
            ; if (arguments[i].ConvertTo == undefined) {
                arguments[i].ConvertTo = '';
            }
            ; if (arguments[i].ConvertTo == "String") {
                arguments[i].ConvertTo = '';
            }
            ; if (arguments[i].IsValid == undefined) {
                arguments[i].IsValid = true;
            }
            ; if (arguments[i].Value == undefined) {
                arguments[i].Value = "";
            }
            ; if (arguments[i].Category == undefined) {
                arguments[i].Category = "";
            }
            ; if (arguments[i].Type == undefined) {
                arguments[i].Type = "dynamic";
            }
            ; if (arguments[i].ValueType == undefined) {
                arguments[i].ValueType = "";
            }
            ; if (arguments[i].control == undefined) {
                arguments[i].control = "Textbox";
            }
            ; if (arguments[i].advance == undefined) {
                arguments[i].advance = false;
            }
            ; if (arguments[i].DisplayName == undefined) {
                arguments[i].DisplayName = arguments[i].Key;
            }
        }
        ;//console.log(arguments);
        return arguments;
    }
    ; function validateNumber(data) {
        var flag = false;
        if (isNaN(data)) {
            flag = false;
        } else {
            flag = true;
        }
        ; return flag;
    }
    ; function validateDynamic(data) {
        console.log(data);
        var flag = false;
        var checkItem = data.Value.trim();
        var checkItem2 = data.Value.trim();
        var pattern = /(@|(\.\(.*\)))/ig;
        checkItem = checkItem.replace(pattern, "");
        for (i = 0; i < Arguments.length; i++) {
            if (checkItem == Arguments[i].Key) {
                if (Arguments[i].Key != "") {
                    // if convertion available                           
                    var pattern2 = /((\.\(.*\)))/ig;
                    var conversionAvailable = pattern2.test(checkItem2);
                    if (conversionAvailable) {
                        var convs = checkItem2.split(".");
                        var conversionValue = convs[1];
                        conversionValue = conversionValue.replace("(", "");
                        conversionValue = conversionValue.replace(")", "");
                        var a = SupportedDataTypes.indexOf(conversionValue);
                        if (a > -1) {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    }
                    else {
                        if (data.DataType == Arguments[i].DataType) {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    }

                }
            } else if (data.Value == "") {
                flag = true;
            }
            ;
        }
        ; return flag;
    }
    ; function validateArgument(data) {
        var flag = false;
        var checkItem = data.Value.trim();
        var pattern = /(@|(\.\(.*\)))/ig;
        checkItem = checkItem.replace(pattern, "");
        for (i = 0; i < Arguments.length; i++) {
            if (checkItem == Arguments[i].Key) {
                flag = true;
                break;
            } else {
                flag = false;
            }
            ;
        }
        ; return flag;
    }
    ; function validateIfCondition(data) {
        console.log(data);
        var flag = false;
        var msg = "";
        if (data[0].DataType == data[2].DataType) {
            flag = true;
            msg = 'no problem';
        } else {
            flag = false;
            msg = 'valueOne & valueTwo must have the same data type';
        }
        ; if (data[1].Type == 'hardcoded') {
            if (data[1].Value == '<' || data[1].Value == '>' || data[1].Value == '<=' || data[1].Value == '>=') {
                if (data[0].DataType == 'string' || data[2].DataType == 'string') {
                    flag = false;
                    msg = 'valueOne & valueTwo must be int or float';
                }
                ;
            }
            ;
        } else {
            for (j = 0; j < Arguments.length; j++) {
                if (Arguments[j].Key == data[1].Value)
                    if (Arguments[j].Value == '<' || Arguments[j].Value == '>' || Arguments[j].Value == '<=' || Arguments[j].Value == '>=') {
                        if (data[0].DataType == 'string' || data[2].DataType == 'string') {
                            flag = false;
                            msg = 'valueOne & valueTwo must be int or float';
                        }
                        ;
                    }
                ;
            }
            ;
        }
        ; var obj = {
            flag: flag,
            msg: msg
        };
        return obj;
    }
    ; function validateHibernateNodes() {
        var final = [];
        console.log(GlobalNodes);
        for (a = 0; a < GlobalNodes.length; a++) {
            if (GlobalNodes[a].library_id == 3) {
                if (GlobalNodes[a].Variables[0].Value == "") {
                    var result = GlobalNodes[a].Variables[0].Key + " value cannot be null";
                    final.push(result);
                }
                ;
            }
            ;
        }
        ; return final;
    }
    ;
    function removeIfInparentViewNode(selectNode) {
        if (selectNode.Name == 'If') {
            debugger;
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].parentView == selectNode.OtherData.TrueStateUUID) {
                    console.log(GlobalNodes[i].Name);
                    GlobalNodes.splice(i, 1);
                    removeIfInparentViewNode(GlobalNodes[i]);
                } else if (GlobalNodes[i].parentView == selectNode.OtherData.FalseStateUUID) {
                    console.log(GlobalNodes[i].Name);
                    GlobalNodes.splice(i, 1);
                    removeIfInparentViewNode(GlobalNodes[i]);
                }
            }

        }
    };




    function checkHibernateAvailability() {
        var flag = false;
        for (j = 0; j < GlobalNodes.length; j++) {
            if (GlobalNodes[j].library_id == "3") {
                flag = true;
            }
            ;
        }
        ; return flag;
    }
    ; function checkAvailability(key, array) {
        var result = true;
        for (d = 0; d < array.length; d++) {
            if (key == array[d].Key) {
                result = false;
            }
            ;
        }
        ; return result;
    }
    ; function addMandatoryInarguments() {
        var obj = [{
            Category: "InArgument",
            DataType: "string",
            Group: "default",
            Key: "InSessionID",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        }];
        /** , {
            Category: "InArgument",
            DataType: "string",
            Group: "default",
            Key: "InSecurityToken",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        }, {
            Category: "InArgument",
            DataType: "string",
            Group: "default",
            Key: "InLog",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        }, {
            Category: "InArgument",
            DataType: "string",
            Group: "default",
            Key: "InNamespace",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        } */
        // var flag = checkHibernateAvailability();
        //console.log(flag);
        // if (flag) {
        for (b = 0; b < obj.length; b++) {
            if (checkAvailability(obj[b].Key, Arguments)) {
                Arguments.push(obj[b]);
            }
            ;
        }
        ;//};
        console.log(Arguments);
    }
    ; function removeHibernateAttributes(key) {
        //var tempArray = Arguments.length;
        for (h = 0; h < Arguments.length; h++) {
            console.log(h, Arguments[h].Key);
            if (Arguments[h].Key == key) {
                Arguments.splice(h, 1);
            }
            ;
        }
        ; console.log(Arguments);
    }
    ; function RemoveModulesInState(stateName) {
        // collect all the modules in a state
        var toberemovedNodes = [];
        for (var i = 0; i < GlobalNodes.length; i++) {
            if (GlobalNodes[i].parentView == stateName) {
                toberemovedNodes.push(GlobalNodes[i]);
            }
        }
        // collect all connectors in a state
        var toberemovedConnections = [];
        for (var i = 0; i < GlobalConnections.length; i++) {
            if (GlobalConnections[i].parentView == stateName) {
                toberemovedConnections.push(GlobalConnections[i]);
            }
        }
        toberemovedNodes.forEach(function (module) {
            removeDataFromSchema(module);
        });
        toberemovedConnections.forEach(function (connection) {
            RemoveGlobalConnection(connection.id);
        });
    }
    ; function removeDataFromSchema(module) {
        console.log("Remove state " + module.schema_id + " in array of length " + GlobalNodes.length);
        for (var i = 0; i < GlobalNodes.length; i++) {
            if (GlobalNodes[i].schema_id == module.schema_id) {
                GlobalNodes.splice(i, 1);
                break;
            }
        }
        // if control
        if (module.library_id == "2") {
            for (var i = 0; i < GlobalIfConditions.length; i++) {
                if (GlobalIfConditions[i].id == module.schema_id) {
                    GlobalIfConditions.splice(i, 1);
                    break;
                }
            }


            RemoveGlobalView(module.OtherData.FalseStateUUID);
            RemoveGlobalView(module.OtherData.TrueStateUUID);
            RemoveModulesInState(module.OtherData.FalseStateUUID);
            RemoveModulesInState(module.OtherData.TrueStateUUID);
            // removeIfInparentViewNode(module);
        }
        //foreach loop control
        if (module.library_id == "5") {
            for (var i = 0; i < GlobalForloops.length; i++) {
                if (GlobalForloops[i].id == module.schema_id) {
                    GlobalForloops.splice(i, 1);
                    break;
                }
            }
            RemoveGlobalView(module.OtherData.ForeachUUID);
            RemoveModulesInState(module.OtherData.ForeachUUID);
        }
        //Switch control
        if (module.library_id == "8") {
            for (var i = 0; i < GlobalSwitches.length; i++) {
                if (GlobalSwitches[i].id == module.schema_id) {
                    GlobalSwitches.splice(i, 1);
                    break;
                }
            }
            RemoveGlobalView(module.OtherData.SwitchUUID);
            RemoveModulesInState(module.OtherData.SwitchUUID);
        }
        //switch case control
        if (module.library_id == "9") {
            for (var i = 0; i < GlobalCases.length; i++) {
                if (GlobalCases[i].id == module.schema_id) {
                    GlobalCases.splice(i, 1);
                    break;
                }
            }
            RemoveGlobalView(module.OtherData.CaseUUID);
            RemoveModulesInState(module.OtherData.CaseUUID);
        }
        //switch Default control case
        if (module.library_id == "10") {
            for (var i = 0; i < GlobalCases.length; i++) {
                if (GlobalCases[i].id == module.schema_id) {
                    GlobalCases.splice(i, 1);
                    break;
                }
            }
            RemoveGlobalView(module.OtherData.DefaultUUID);
            RemoveModulesInState(module.OtherData.DefaultUUID);
        }
        // while control
        if (module.library_id == "13") {
            for (var i = 0; i < GlobalWhile.length; i++) {
                if (GlobalWhile[i].id == module.schema_id) {
                    GlobalWhile.splice(i, 1);
                    break;
                }
            }
            RemoveGlobalView(module.OtherData.WhileUUID);
            RemoveModulesInState(module.OtherData.WhileUUID);
        }
        console.log(GlobalNodes.length);
        if (GlobalNodes.length == 0) {
            removeHibernateAttributes("InNamespace");
            removeHibernateAttributes("InSecurityToken");
            removeHibernateAttributes("InLog");
            removeHibernateAttributes("InSessionID");
            //addMandatoryInarguments();
            //addMandatoryInarguments();
            //console.log(Arguments);
        }
        ; console.log("Remove state at position " + i);
    }
    ; return {
        setAuthData: function (data) {
            authData = data;
        },
        setSecurityToken: function (token) {
            securityToken = token;
        },
        getAuthData: function (data) {
            return authData;
        },
        getSecurityToken: function (token) {
            return securityToken;
        },
        createuuid: function () {
            var uuid = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
            var hostname = window.location.hostname;
            var code = window.btoa(hostname + "-" + uuid)
            code = code.replace(/=/g, '');
            return code;
        },
        checkFormat: function (data) {
            return reformatArguments(data);
            ;
        },
        loadDefaultArguments: function () {
            addMandatoryInarguments();
        },
        sortArguments: function (argumentlist) {
            return sortArgumentTypes(argumentlist);
        },
        setArguments: function (data) {
            Arguments = data || [];
        },
        getSupportedDataTypes: function () {
            return SupportedDataTypes;
        },
        retrieveArguments: function () {
            return reformatArguments(Arguments);
        },
        retrieveArgumentsKeys: function () {
            return getArgumentKeys(Arguments);
        },
        retrieveInArgumentsKeys: function () {
            return getArgumentKeys(Arguments, "InArgument");
        },
        AddArguments: function (obj) {
            console.log(obj);
            var flag = CheckIfAllReadyExists_argument(obj.Key, obj.Category);
            if (flag == false) {
                Arguments.push(obj);
                //sessionStorage.setItem("arguments", JSON.stringify(Arguments));
            }
            ; return flag;
        },
        updateArguments: function (obj) {
            var flag = CheckIfAllReadyExists_argument(obj.Key, obj.Category);
            if (flag == false) {
                Arguments.push(obj);
                //sessionStorage.setItem("arguments", JSON.stringify(Arguments));
                for (i = 0; i < Arguments.length; i++) {
                    if (Arguments[i].Key == null) {
                        Arguments.splice(i, 1);
                    }
                    ;
                }
                ;
            }
            ;
        },
        removeArguments: function () {
            Arguments = [];
        },
        removeArgument: function (key) {
            for (i = 0; i < Arguments.length; i++) {
                if (Arguments[i].Key == key) {
                    Arguments.splice(i, 1);
                    console.log(key);
                }
                ;
            }
            ;
        },
        setCurrentState: function (text) {
            currentState = text;
        },
        getCurrentState: function () {
            return currentState;
        },
        getSaveJson: function () {
            var flowChart = {};
            flowChart.nodes = sortVariableTypes();
            flowChart.connections = GlobalConnections;
            flowChart.ifconditions = GlobalIfConditions;
            flowChart.forloops = GlobalForloops;
            flowChart.switchs = GlobalSwitches;
            flowChart.cases = GlobalCases;
            flowChart.arguments = sortArgumentTypes(Arguments);
            flowChart.views = GlobalViews;
            flowChart.whileloops = GlobalWhile;
            return flowChart;
        },
        setFlowObject: function (savedata) {
            // add the nodes, connections and if conditions to the factory global variable. if already exists the schema_id remove it and add it again.
            $.each(savedata.nodes, function (idx, node) {
                if (CheckIfAllReadyExists_node(node.schema_id)) {
                    //RemoveGlobalNode(node.schema_idh);
                    GlobalNodes.push(node);
                } else {
                    GlobalNodes.push(node);
                }
            });
            $.each(savedata.connections, function (idx, con) {
                if (CheckIfAllReadyExists_connection(con)) {
                    //RemoveGlobalConnection(con.id);
                    GlobalConnections.push(con);
                } else {
                    GlobalConnections.push(con);
                }
            });
        },
        addtoNodes: function (data) {
            if (!CheckIfAllReadyExists_node(data.id)) {
                GlobalNodes.push(data);
            } else {
                GlobalNodes.push(data);
            }
            //            if (data.library_id == 3) {
            addMandatoryInarguments();
            //            };
        },
        addtoConnections: function (data) {
            if (!CheckIfAllReadyExists_connection(data)) {
                GlobalConnections.push(data);
            } else {
                GlobalConnections.push(data);
            }
        },
        removeConnection: function (data) {
            for (var i = 0; i < GlobalConnections.length; i++) {
                if (GlobalConnections[i].sourceId == data.sourceId && GlobalConnections[i].targetId == data.targetId) {
                    GlobalConnections.splice(i, 1);
                    break;
                }
            }
        },
        addToViews: function (data) {
            var flag = CheckIfAllReadyExists_view(data);
            if (flag == false) {
                GlobalViews.push(data);
            }
            ;
        },
        removeFromViews: function (data) {
            RemoveGlobalView(data);
        },
        getViews: function () {
            return GlobalViews;
        },
        addtoIfConnections: function (data) {
            if (CheckIfAllReadyExists_ifconnection(data.id)) {
                RemoveGlobalIfConnection(data.id);
                GlobalIfConditions.push(data);
            } else {
                GlobalIfConditions.push(data);
            }
        },
        addtoForloop: function (data) {
            var flag = CheckIfAllReadyExists_foreach(data.id);
            if (flag == false) {
                GlobalForloops.push(data);
            }
            ;
        },
        addtoSwitch: function (data) {
            var flag = CheckIfAllReadyExists_switch(data.id);
            if (flag == false) {
                GlobalSwitches.push(data);
            }
            ;
        },
        addtoCases: function (data) {
            var flag = CheckIfAllReadyExists_case(data.id);
            if (flag == false) {
                GlobalCases.push(data);
            }
            ;
        },
        addtoWhile: function (data) {
            var flag = CheckIfAllReadyExists_while(data.id);
            if (flag == false) {
                GlobalWhile.push(data);
            }
            ;
        },
        resetAddonDesign: function () {
            GlobalNodes = [];
            GlobalConnections = [];
            GlobalIfConditions = [];
            GlobalForloops = [];
            GlobalSwitches = [];
            GlobalCases = [];
            GlobalWhile = [];
            GlobalViews = ['drawboard'];
        },
        resetFactory: function () {
            GlobalNodes = [];
            GlobalConnections = [];
            GlobalIfConditions = [];
            GlobalForloops = [];
            GlobalSwitches = [];
            GlobalCases = [];
            Arguments = [];
            GlobalWhile = [];
            GlobalViews = ['drawboard'];
        },
        removeFromSchema: function (module) {
            removeDataFromSchema(module);
        },
        updateCollectionData: function (data) {
            var module;
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].schema_id == data.schema_id) {
                    module = GlobalNodes[i];
                    break;
                }
            }
            for (var property in data.data) {
                if (data.data.hasOwnProperty(property)) {
                    for (var i = 0; i < module.Variables.length; i++) {
                        if (module.Variables[i].Key == property) {
                            module.Variables[i].Value = data.data[property];
                        }
                    }
                }
            }
        },
        getNodesForState: function (parentView) {
            var returnNodes = [];
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].parentView == parentView) {
                    returnNodes.push(GlobalNodes[i]);
                }
            }
            return returnNodes;
        },
        getConnectionsForState: function (parentView) {
            var returnConnections = [];
            for (var i = 0; i < GlobalConnections.length; i++) {
                if (GlobalConnections[i].parentView == parentView) {
                    returnConnections.push(GlobalConnections[i]);
                }
            }
            return returnConnections;
        },
        getModuleByID: function (id) {
            var returnObj;
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].schema_id == id) {
                    returnObj = GlobalNodes[i];
                    break;
                }
            }
            return returnObj;
        },
        getEndpointsForItem: function (id, type, location) {
            var returnObj;
            var module;
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].schema_id == id) {
                    module = GlobalNodes[i];
                    break;
                }
            }
            switch (location) {
                case "default":
                    if (type == "source") {
                        for (var i = 0; i < module.SourceEndpoints.length; i++) {
                            returnObj = module.SourceEndpoints[i].id;
                        }
                    }
                    if (type == "target") {
                        for (var j = 0; j < module.TargetEndpoints.length; j++) {
                            returnObj = module.TargetEndpoints[j].id
                        }
                    }
                    break;
                case "left":
                    if (type == "source") {
                        for (var i = 0; i < module.SourceEndpoints.length; i++) {
                            var sourceend = module.SourceEndpoints[i];
                            if (sourceend.location == "LeftMiddle") {
                                returnObj = module.SourceEndpoints[i].id;
                            }
                        }
                    }
                    break;
                case "right":
                    if (type == "source") {
                        for (var i = 0; i < module.SourceEndpoints.length; i++) {
                            var sourceend = module.SourceEndpoints[i];
                            if (sourceend.location == "RightMiddle") {
                                returnObj = module.SourceEndpoints[i].id;
                            }
                        }
                    }
                    break;
            }
            console.log("Get connections for '" + id + "' has completed.");
            return returnObj;
        },
        validateWorkflow: function () {
            reformatArguments(Arguments);
            Arguments = sortArgumentTypes(Arguments);
            var flag = true;
            var errors = [];
            // validating arguments
            for (a = 0; a < Arguments.length; a++) {
                if (Arguments[a].DataType.toLowerCase() == 'int' || Arguments[a].DataType.toLowerCase() == 'float') {
                    if (Arguments[a].Type == 'hardcoded') {
                        flag = validateNumber(Arguments[a].Value);
                        if (flag == false) {
                            var obj = {
                                title: "Datatype Error",
                                description: Arguments[a].Key + '- given value doesn\'t match with the Data type int',
                                schema_id: ""
                            }
                            errors.push(obj);
                        }
                        ;
                    } else {
                        console.log(Arguments[a], a);
                        flag = validateDynamic(Arguments[a]);
                        if (flag == false) {
                            var obj = {
                                title: "",
                                description: Arguments[a].Key + ' - given variable\'s data type doesn\'t match with the Argument\'s Data type',
                                schema_id: ""
                            }
                            errors.push(obj);
                        }
                        ;
                    }
                    ;
                }
                ; if (Arguments[a].IsValid == false) {
                    var obj = {
                        title: "Datatype Error",
                        description: Arguments[a].Key + ' - given variable\'s data type convertion is not valid',
                        schema_id: ""
                    }
                    errors.push(obj);
                }
                ; if (Arguments[a].ConvertTo.toLowerCase() != "") {
                    if (Arguments[a].DataType.toLowerCase() != Arguments[a].ConvertTo.toLowerCase()) {
                        var obj = {
                            title: "Datatype Error",
                            description: Arguments[a].Key + ' - given data type is not compatibale',
                            schema_id: ""
                        }
                        errors.push(obj);
                    }
                }
            }
            ;// validating global node's variables
            GlobalNodes = sortVariableTypes();
            for (b = 0; b < GlobalNodes.length; b++) {
                GlobalNodes[b].Variables = reformatArguments(GlobalNodes[b].Variables);
                for (j = 0; j < GlobalNodes[b].Variables.length; j++) {
                    if (GlobalNodes[b].Variables[j].DataType == 'int' || GlobalNodes[b].Variables[j].DataType == 'float') {
                        if (GlobalNodes[b].Variables[j].Type == 'hardcoded') {
                            flag = validateNumber(GlobalNodes[b].Variables[j].Value);
                            if (flag == false) {
                                var obj = {
                                    title: "Datatype Conversion Error",
                                    description: GlobalNodes[b].Variables[j].Key + ' data type doesn\'t match with the Value\'s data type',
                                    schema_id: GlobalNodes[b].schema_id
                                }
                                errors.push(obj);
                            }
                            ;
                        } else if (GlobalNodes[b].Variables[j].Type == 'dynamic') {
                            var ob = GlobalNodes[b].Variables[j];
                            flag = validateDynamic(ob);
                            if (flag == false) {
                                var obj = {
                                    title: "Datatype Conversion Error",
                                    description: GlobalNodes[b].Variables[j].Value + ' given Argument\'s data type doesn\'t match with the Variable\'s Data type',
                                    schema_id: GlobalNodes[b].schema_id
                                }
                                errors.push(obj);
                            }
                            ;
                        }
                        ;
                    }
                    ;// if the variable is dynamic, check if it already a valid argument
                    if (GlobalNodes[b].Variables[j].Type == 'dynamic') {
                        var ob = GlobalNodes[b].Variables[j];
                        if (ob.Value != "") {
                            flag = validateArgument(ob);
                            if (flag == false) {
                                var obj = {
                                    title: "Non-existing Argument",
                                    description: GlobalNodes[b].Variables[j].Value + ' in ' + GlobalNodes[b].Variables[j].Key + ' of ' + GlobalNodes[b].DisplayName + ' is not an valid argument.',
                                    schema_id: GlobalNodes[b].schema_id
                                }
                                errors.push(obj);
                            }
                        }
                    }
                    ; if (GlobalNodes[b].Variables[j].IsValid == false) {
                        var obj = {
                            title: "Datatype Conversion Error",
                            description: GlobalNodes[b].Variables[j].Key + ' of ' + GlobalNodes[b].DisplayName + ' control given variable data type convertion is invalid',
                            schema_id: GlobalNodes[b].schema_id
                        }
                        errors.push(obj);
                    }
                    ; if (GlobalNodes[b].Variables[j].ConvertTo.toLowerCase() != "") {
                        if (GlobalNodes[b].Variables[j].DataType.toLowerCase() != GlobalNodes[b].Variables[j].ConvertTo.toLowerCase()) {
                            if (GlobalNodes[b].Variables[j].Type != "custom") {
                                var obj = {
                                    title: "Datatype Conversion Error",
                                    description: GlobalNodes[b].Variables[j].Key + ' - given data type is not compatibale',
                                    schema_id: GlobalNodes[b].schema_id
                                }
                                errors.push(obj);
                            }
                        }
                    }
                }
                ;
            }
            ; for (c = 0; c < GlobalNodes.length; c++) {
                // validating IF control
                if (GlobalNodes[c].library_id == '2') {
                    var result = validateIfCondition(GlobalNodes[c].Variables);
                    if (result.flag == false) {
                        var obj = {
                            title: "If Condition Error",
                            description: result.msg,
                            schema_id: GlobalNodes[c].schema_id
                        }
                        errors.push(obj);
                    }
                    ;
                }
                ;// validating termination control
                if (GlobalNodes[c].library_id == '12') {
                    var status = GlobalNodes[c].Variables[1].Value;
                    GlobalNodes[c].Variables[1].Value = status.toLowerCase();
                }
                ;
            }
            ; for (d = 0; d < GlobalNodes.length; d++) {
                for (e = 0; e < GlobalNodes[d].Variables.length; e++) {
                    if (GlobalNodes[d].Variables[e].Priority == 'Mandatory') {
                        if (GlobalNodes[d].Variables[e].Value == '') {
                            var obj = {
                                title: "Argument Error",
                                description: GlobalNodes[d].Variables[e].Key + ' value cannot be null, It\'s a Mandatory variable!',
                                schema_id: GlobalNodes[d].schema_id
                            }
                            errors.push(obj);
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ; var hibernateResult = validateHibernateNodes();
            addMandatoryInarguments();
            if (hibernateResult) {
                for (f = 0; f < hibernateResult.length; f++) {
                    errors.push(hibernateResult[f]);
                }
                ;
            }
            return errors;
        },
        addState: function (URL, state) {
            var states = state.get();
            if (!CheckIfAllReadyExists_state(URL, states)) {
                app.stateProvider.state(URL, {
                    url: "/" + URL
                });
            }
        }
    }
});
