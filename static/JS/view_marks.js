var type_a;
//var t_id = "PCS181";
var t_id = document.getElementById("t_id").innerHTML;
console.log(t_id);
var cid;
var pol;
//onchange 

function chooseCourse(){
	var e = document.getElementById("cat");
	cid = e.options[e.selectedIndex].value;
	getTypes(cid);
  getPol();
  console.log(pol)
  getMarks();
    //document.getElementById("getStud").onclick = function() {getStudents(cid)};


}

function chooseType(){
	var e = document.getElementById("type");
	type_a = e.options[e.selectedIndex].value;
  var h2 = document.getElementById("changeType");
  h2.innerHTML = type_a;
  getPol();
  console.log(pol);
  getMarks();
}

//helpers

function setCourse(data, cname){
    var o = document.createElement("option");
    o.text = data+" - "+cname;
    o.value = data;
    document.getElementById("cat").add(o);
}


function setType(data){
    var o = document.createElement("option");
    o.text = data;
    o.value = data;
    document.getElementById("type").add(o);

}

//get requests

function getTypes(cid){
  $.ajax({
        url: "http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/types",
        method:"GET",
        async:false,
        success: function(resp){
//$.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/types",function(resp){
		console.log(resp);
    if(resp == "None"){
                console.log("he");
                var g = document.getElementById("stud");
          g.innerHTML = "<td colspan=2>No data available in table</td>";
            var list = document.getElementById("type");
            while (list.hasChildNodes()) {
                list.removeChild(list.firstChild);
            }
            return;
            }
    var response = JSON.parse(resp);
		var list = document.getElementById("type");
   		while (list.hasChildNodes()) {
      		list.removeChild(list.firstChild);
   		}
        for (var i=0;i<response.types.length;i++){
        		setType(response.types[i]);
        		//alert(response.types[i]);
        	}
        var e = document.getElementById("type");
		type_a = e.options[e.selectedIndex].value;
    }
    });
	
}


$.ajax({
        url: "http://pes.eastus.cloudapp.azure.com:8000/sem/courses?t_id="+t_id,
        method:"GET",
        async:false,
        success: function(response){
//$.get("http://pes.eastus.cloudapp.azure.com:8000/sem/courses?t_id="+t_id,function(response){
            for (var i=0;i<response.courses.length;i++){
        		setCourse(response.courses[i].c_id, response.courses[i].c_name);
        	}
        	var e = document.getElementById("cat");
			cid = e.options[e.selectedIndex].value;
        	getTypes(cid);
			//document.getElementById("sub").onclick = function() {getMarks()};
        getPol();
        getMarks();
     }   	
    });


function setMarks(usn,name, marks){
    var o = document.createElement("tr");
    var h1 = document.createElement("th");
   	h1.innerHTML = "<em>"+usn+"</em>";
    h1.class = "body-item mbr-fonts-style display-7";
   	var h2 = document.createElement("th");
   	h2.innerHTML = "<em>"+marks+"</em>";
    h2.class = "body-item mbr-fonts-style display-7";   
    var h3 = document.createElement("th");
    h3.innerHTML = "<em>"+name+"</em>";
    h3.class = "body-item mbr-fonts-style display-7";   	
    o.appendChild(h1);
    o.appendChild(h3);
   	o.appendChild(h2);
    document.getElementById("stud").appendChild(o);
}
function jsonConcat(o1, o2) {
 for (var key in o2) {
        o1[key] = o2[key];
    
 }
 return o1;
}

function getPol(){
    var cid = document.getElementById("cat").value;
    console.log(cid);
    $.ajax({
      url: "http://pes.eastus.cloudapp.azure.com:5000/PES1/course/"+cid+"/types",
      method: 'GET',
      async: false,
      success: function(resp){
//$.get("http://pes.eastus.cloudapp.azure.com:5000/PES1/course/"+cid+"/types",function(resp){
        console.log(resp);
        if (resp == "None"){

            console.log("hehe");
          var g = document.getElementById("stud");
          g.innerHTML = "<td colspan=2>No data available in table</td>";
            pol = ""
            //var c = document.getElementById("stud");

            return;
        }
        var response = JSON.parse(resp);
        console.log(response);
        var inter = response["internals"];
        var exter = response["externals"];
        var output = {};
        output = jsonConcat(output, inter);
        output = jsonConcat(output, exter);
        //console.log(output);
        pol = output;
        console.log(pol);
      },
      error : function(xhr){
            console.log("hehe");
          var g = document.getElementById("stud");
          g.innerHTML = "<td colspan=2>No data available in table</td>";
        }
    });
    
}
function getMarks(){
  $.ajax({
        url: "http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/type/"+type_a+"?t_id="+t_id,
        method:"GET",
        async:false,
        success: function(resp){
//$.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/type/"+type_a+"?t_id="+t_id,function(resp){
		var list = document.getElementById("stud");
   		while (list.hasChildNodes()) {
      		list.removeChild(list.firstChild);
   		}
   		var o = document.createElement("tr");
   		var h1 = document.createElement("th");
   		//h1.innerHTML = "USN";
   		var h2 = document.getElementById("changeType");
   		if (pol == ""){

            console.log("hehe1");
          var g = document.getElementById("stud");
          g.innerHTML = "<td colspan=2>No data available in table</td>";
            return;
        }
      h2.innerHTML = type_a;
   		//o.appendChild(h1);
   		//o.appendChild(h2);
   		//list.appendChild(o);
      var mx = pol[type_a];
      console.log(pol);
		var marksArr = (resp["u"]);
		if(marksArr.length == 0){
      var o = document.getElementById("stud");
      var tr = document.createElement("tr");
      tr.id = "def";
      var td = document.createElement("td");
      td.innerHTML = "No data available in table";
      td.colspan = 3;
      /*var td1 = document.createElement("td");
      //td1.style.textAlign = "right";
      td1.innerHTML = "No data available in table*/
      tr.appendChild(td);
      //tr.appendChild(td1);
      o.appendChild(tr);
			//alert("Not yet entered")
		}
    
		for (var i=0;i<marksArr.length;i++){
            var mar1 = marksArr[i][type_a]+" / "+(mx);
            console.log(mar1);
        		console.log(marksArr[i][type_a]);
            console.log(mx);
            setMarks(marksArr[i]["USN"],marksArr[i]["name"], mar1);
        		//alert(response.types[i]);
        	}

    }

    });
}
