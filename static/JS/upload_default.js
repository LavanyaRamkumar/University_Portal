//drop down to choose the course
//sem/courses?t_id={t_id}



var t_id = document.getElementById("t_id").innerHTML;
console.log(t_id);

$.get("http://pes.eastus.cloudapp.azure.com:8000/sem/courses?t_id="+t_id,function(response){
            for (var i=0;i<response.courses.length;i++){
        		setCourse(response.courses[i].c_id, response.courses[i].c_name);
        	}
        	var e = document.getElementById("cat");
			var cid = e.options[e.selectedIndex].value;
        	
        	//document.getElementById("sub").onclick = function() {upload(cid)};
    });

function setCourse(data, cname){
    var o = document.createElement("option");
    o.text = data+" - "+cname;
    o.value = data;
    document.getElementById("cat").add(o);
}



function chooseCourse(){
	var e = document.getElementById("cat");
	var cid = e.options[e.selectedIndex].value;
	//document.getElementById("sub").onclick = function() {upload(cid)};

}

function upload(cid){
  var f = document.getElementById("fileToUpload");
  //console.log(f.);
  /*$.ajax({
        type: 'POST',
    // make sure you respect the same origin policy with this url:
    // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://pes.eastus.cloudapp.azure.com:5000/upload.html?c_id="+cid ,
        crossDomain : true,
        data : f.value,
        success: function(resp){
            console.log("success");
        }
    });*/
}


