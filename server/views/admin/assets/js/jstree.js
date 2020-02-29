$(document).ready(async function() {
  if (!$("#menuTree").length) {
    return;
  }

  $.jstree.defaults.core.data;
  $.jstree.defaults.core.check_callback = true;

  // let data = [{"id":"6e0ylrz3jei","text":"Hello world","icon":true,"li_attr":{"id":"6e0ylrz3jei"},"a_attr":{"href":"#","id":"6e0ylrz3jei_anchor"},"state":{"loaded":true,"opened":false,"selected":false,"disabled":false},"data":{},"parent":"#"},{"id":"hhcfvv536od","text":"Hello world","icon":true,"li_attr":{"id":"hhcfvv536od"},"a_attr":{"href":"#","id":"hhcfvv536od_anchor"},"state":{"loaded":true,"opened":true,"selected":false,"disabled":false},"data":{},"parent":"#"},{"id":"0obhtupblz0g","text":"Hello world","icon":true,"li_attr":{"id":"0obhtupblz0g"},"a_attr":{"href":"#","id":"0obhtupblz0g_anchor"},"state":{"loaded":true,"opened":false,"selected":false,"disabled":false},"data":{},"parent":"hhcfvv536od"},{"id":"4dv3m57umea","text":"Hello world","icon":true,"li_attr":{"id":"4dv3m57umea"},"a_attr":{"href":"#","id":"4dv3m57umea_anchor"},"state":{"loaded":true,"opened":true,"selected":false,"disabled":false},"data":{},"parent":"#"},{"id":"5fuafoc66db","text":"Hello world","icon":true,"li_attr":{"id":"5fuafoc66db"},"a_attr":{"href":"#","id":"5fuafoc66db_anchor"},"state":{"loaded":true,"opened":false,"selected":false,"disabled":false},"data":{},"parent":"4dv3m57umea"},{"id":"ykmqwe7m2dp","text":"Hello world","icon":true,"li_attr":{"id":"ykmqwe7m2dp"},"a_attr":{"href":"#","id":"ykmqwe7m2dp_anchor"},"state":{"loaded":true,"opened":false,"selected":true,"disabled":false},"data":{},"parent":"4dv3m57umea"}];
  $("#menuTree").jstree({
    core: {
      data: menuData
    },

    dnd: {
      drop_finish: function() {
        alert("DROP");
      },

      drag_check: function(data) {
        if (data.r.attr("id") == "phtml_1") {
          return false;
        }

        return {
          after: false,
          before: false,
          inside: true
        };
      },
      drag_finish: function(data) {
        alert("DRAG OK");
      }
    },
    plugins: ["dnd"]
  });

  $("#menuTree").on("changed.jstree", async function(e, data) {
    if(!data.selected) {return;}

    let content = {};
    if (data && data.node && data.node.data) {
      content = {data: data.node.data}
    }else{
      return;
    }

    // debugger;

    let form = await formService.getForm(
      "menu",
      content,
      "addModuleToColumn(submission)"
    );

    // debugger;

    $("#menuTreeForm").html(form);

    formInit();
    // var v = $("#menuTree")
    //   .jstree(true)
    //   .get_json("#", { flat: true });
    // var mytext = JSON.stringify(v);
    // console.log(mytext);
  });

  $("#addNode").on("click", function() {
    let randomId = Math.random()
      .toString(36)
      .slice(2);
    var parent = "#";
    var node = { id: randomId, text: "Hello world" };
    let newId = $("#menuTree").jstree("create_node", parent, node, "last");
    console.log(newId);
  });

  $("#save").on("click", function() {

      updateTreeData();

  });



});

function updateTreeData(formData){

  var selectedNode = $("#menuTree").jstree("get_selected",true);

  var links = $("#menuTree")
    .jstree(true)
    .get_json("#", { flat: true });

  // debugger;

  // let obj = objArray.find(obj => obj.id == 3);
  links.find(obj => obj.id == selectedNode[0].id).data = formData.data;
  $('#menuTree').jstree('rename_node', selectedNode[0], formData.data.title);
  selectedNode[0].text = formData.data.title;

  var menu = { data: { title: "Main 1", contentType: "menu", links: links } };

  let id = $("#id").val();
  if (id) {
    menu.data.id = id;
  }
  submitContent(menu);
}

function formChanged(formData){
  console.log('jstree formData',formData);
  updateTreeData(formData);
}