
    //console.log( "ready!" );

var type_a;

//var USN = "01FB16D888";

var USN = document.getElementById("USN1").innerHTML;
console.log(USN);
var cid;
var sem = 1;
var coursesA = {};
degArr = [];
var sems;
getCourses();


$.get("http://pes.eastus.cloudapp.azure.com:8000/students/"+USN,function(response){
  
  console.log(response);
  sems = response["cur_sem"];
  console.log(sems);
  
  //s=document.getElementById("sem");
  for (var i=1;i<=sems;i++){
    setSem(i);
  }
  
});

function chooseSem(){
  var e = document.getElementById("sem");
  sem = e.options[e.selectedIndex].value;
  getCourses();
}




function setSem(data){
    console.log(data);
    var o = document.createElement("option");
    o.text = data;
    o.value = data;
    document.getElementById("sem").add(o);
}

function getCourses(){
  //alert(sem);
$.get("http://pes.eastus.cloudapp.azure.com:8000/sem/"+sem+"/courses?USN="+USN,function(response){
            var coursesArr = response.courses;
            console.log(coursesArr);
            for (var i=0;i<coursesArr.length;i++){
              console.log(coursesArr[i].c_id);
              coursesA[coursesArr[i].c_id ] =  coursesArr[i].credits;
        		//setCourse(response.courses[i].c_id);
        	}
          console.log(coursesA);
        	
			    //document.getElementById("sub").onclick = function() {getMarks()};
          getMarks();
        	
    });
}

function setMarks(usn, marks){
    var o = document.createElement("tr");
    var h1 = document.createElement("th");
   	h1.innerHTML = "<em>"+usn+"</em>";
   	var h2 = document.createElement("th");
   	h2.innerHTML = "<em>"+marks+"</em>";
   	o.appendChild(h1);
   	o.appendChild(h2);
    document.getElementById("stud").appendChild(o);
}

function getMarks(){
  var list = document.getElementById("stud");
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
  
  $.ajax({
        url: "http://pes.eastus.cloudapp.azure.com:5000/PES/sem/"+sem+"/course/ESA?USN="+USN,
        method:"GET",
        async:false,
        success: function(resp){
 
            console.log(resp);
            if(resp == "None"){
                var g = document.getElementById("stud");
                g.innerHTML = "<td colspan=2><center>No data available in table</center></td>"
            }
            else{
              gradeArr = resp["res"];

              for(i=0;i<gradeArr.length;i++){
                let ar1 = JSON.parse(JSON.stringify(gradeArr[i]));
                //var ar1 = gradeArr[i];
                delete ar1['c_name'];
                console.log(gradeArr[i]);
                for (j in ar1){
                  var topic = j+" - "+gradeArr[i]["c_name"];
                  console.log(topic);
                  setMarks(topic,gradeArr[i][j]);
                }
              }

              setMarks("<h3 id='i' style='color: #64b2cd;border-left: white solid 2px'>Total</h3>",resp["Total"]);
            }
        },
        error : function(xhr){
          var g = document.getElementById("stud");
          g.innerHTML = "<td colspan=2>No data available in table</td>";
        }
    });

}




/*function getMarks(){
      var list = document.getElementById("stud");
      while (list.hasChildNodes()) {
          list.removeChild(list.firstChild);
      }
      console.log(coursesArr);
  for (var i in coursesArr){
    cid = coursesArr[i];
    $.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/type/"+type_a+"?USN="+USN,function(resp){
		
   		var o = document.createElement("tr");
   		var h1 = document.createElement("th");
   		h1.innerHTML = "Course";
   		var h2 = document.createElement("th");
   		h2.innerHTML = type_a;
   		o.appendChild(h1);
   		o.appendChild(h2);
   		list.appendChild(o);
		  var marksArr = resp;
		  for (var i in marksArr){
        		setMarks(i, marksArr[i]);
        		//alert(response.types[i]);
      }

    });
  }
}*/