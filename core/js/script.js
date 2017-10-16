var workflowHeight=null;
var propertiesElem=null;

$(document).ready(function () {
    workflowHeight = document.getElementById('workflow-ui');
    if(workflowHeight != undefined)workflowHeight = workflowHeight.offsetHeight;
    propertiesElem = document.getElementById('property-wrap');

    if(propertiesElem != undefined)propertiesElem.setAttribute("style","height:"+workflowHeight+"px;overflow-y:scroll;overflow-x:hidden");
});