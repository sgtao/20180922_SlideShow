var hx8D = function(){
  var HX8D = function(){
  	var prefix = location.href;
  	prefix = prefix.substring(prefix.lastIndexOf("/") + 1, prefix.indexOf("?"));
  	this.prefix = prefix;
  };

  HX8D.prototype = {
  	clear : function(){
  	  let elements = document.getElementsByTagName("input");
  	  for(let i=0; i<elements.length; i++){
    		let type = elements[i].type;
        let key = this.prefix + elements[i].id;
    		if(type == "checkbox"){
          elements[i].checked = false;
          localStorage[key] = elements[i].checked;
        }
	    }
  	},
  	save : function(){
	    localStorage.clear();

	    let elements = document.getElementsByTagName("input");
	    for(let i=0; i<elements.length; i++){
    		let type = elements[i].type;
    		let key = this.prefix + elements[i].id;
    		if(type == "checkbox"){
          localStorage[key] = elements[i].checked;
    		}
	    }
  	},
  	load : function(){
	    let elements = document.getElementsByTagName("input");
	    for(let i=0; i<elements.length; i++){
    		let type = elements[i].type;
    		let key = this.prefix + elements[i].id;
    		if(type == "checkbox"){
		      elements[i].checked = localStorage[key] == "true" ? true : false;
    		}
	    }
  	},
  };

  return new HX8D();
}();

// Action at loading page.
function onReady() {
  $("#msg").text("Loading....");
  hx8D.load();
  $("#msg").text("Loaded.");
}
$(document).ready(onReady);

// Action of onClick checkbox
function onClickBox() {
  hx8D.save();
  $("#msg").text("Checkbox is checked. ");
}
$('input[type=checkbox]').click(onClickBox);

// Action of clear register
$('#clearall').click(function(){
  if(confirm("Do you want to clear all register?")){
    hx8D.clear();
    $("#msg").text("All checkbox cleared.");
  }else{
    $("#msg").text("Clear canceled.");
    return false;
  }
});
