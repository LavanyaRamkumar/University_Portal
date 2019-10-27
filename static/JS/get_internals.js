
    //console.log( "ready!" );

var type_a;

//var USN = "01FB16D888";

var USN = document.getElementById("USN1").innerHTML;
console.log(USN);
var cid;
var sem = 1;
coursesArr = [];
degArr = [];
var sems;
var pol;
getCourses();

$.get("http://pes.eastus.cloudapp.azure.com:8000/students/"+USN,function(response){
  

  sems = response["cur_sem"];

  
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

function getCourses(){
//alert(sem);
$.get("http://pes.eastus.cloudapp.azure.com:8000/sem/"+sem+"/courses?USN="+USN,function(response){
            //coursesArr = response.courses;
            //console.log(coursesArr);
            for (var i=0;i<response.courses.length;i++){
              coursesArr.push(response.courses[i].c_id);
            //setCourse(response.courses[i].c_id);
             }
          //getPol
          //document.getElementById("sub").onclick = function() {getMarks()};
         getMarks();
          
    });
}

function setSem(data){
    console.log(data);
    var o = document.createElement("option");
    o.text = data;
    o.value = data;
    document.getElementById("sem").add(o);
}

/*function setMarks(usn, marks){
    var o = document.createElement("tr");
    var h1 = document.createElement("th");
    h1.innerHTML = usn;
    var h2 = document.createElement("th");
    h2.innerHTML = marks;
    o.appendChild(h1);
    o.appendChild(h2);
    document.getElementById("stud").appendChild(o);
}

function getMarks(){
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
      var h2 = document.createElement("th")
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
/*display(r,type){

}
function getM(cid,type){
  var response;
  $.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/type/"+type+"?USN="+USN,function(resp){
    response = resp;
  });
  return response;
}
*/

function getSem(){
  $.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/types",function(resp){
    var response = JSON.parse(resp);
    var types =response["types"];
    console.log(types); 
    for(var i in types){
      r = getM(cid,types[i]);
      display(r, types[i]);
    }
  });
  
}

function redir(uid,i){
  console.log(uid);
  window.location = "http://pes.eastus.cloudapp.azure.com:5000/PES/sem/course/"+uid+"/type/"+i;
}

function fu(){
  console.log("haha");
}

function jsonConcat(o1, o2) {
 for (var key in o2) {
        o1[key] = o2[key];
    
 }
 return o1;
}

function getPol(cid){
    //var cid = document.getElementById("cat").value;
    console.log(cid);
    $.ajax({
      url: "http://pes.eastus.cloudapp.azure.com:5000/PES1/course/"+cid+"/types",
      method: 'GET',
      async: false,
      success: function(resp){
//$.get("http://pes.eastus.cloudapp.azure.com:5000/PES1/course/"+cid+"/types",function(resp){
        console.log(resp);
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
      }
    });
    
}

function display(cid,cMarks,mx){
  var row = document.createElement("tr");
  var c = document.createElement("th");
  c.innerHTML = "<span style='color:white'><em>"+cid+"</em></span>";
  c.colSpan = 3;
  c.style="background-color: #64b2cd";
  //c.class = "body-item mbr-fonts-style display-7";
  //c.style="width:100%";
  /*c1 = document.createElement("th");
  c1.innerHTML = "fev";
  c2 = document.createElement("th");
  c2.innerHTML = "fev";
  
  row.appendChild(c1);
  row.appendChild(c2);*/
  
 

  row.appendChild(c);
  var o = document.getElementById("stud");
  o.appendChild(row);
  for (i in cMarks){
    r = document.createElement("tr");
    d1 = document.createElement("td");
    d1.innerHTML = i+": ";
    d2 = document.createElement("td");
  
    d2.innerHTML = cMarks[i]+" / "+pol[i];
    im = document.createElement("img");
    im.src = "/bar";
    im.width = "30";
    im.height = "30";
    uid = cid.split(" ");
    //im.onclick = 'javascript: redir(uid[0],i)';
    //im.style="margin-left: 30px";
    // console.log(uid[0]);
    // var kmf=c.innerHTML.split(" ")[0].split(">")[1];
    // var klf=d1.innerHTML;
    im.setAttribute("onclick",'javascript: redir('+'"'+uid[0]+'"'+','+'"'+i+'"'+')');
    b = document.createElement("button");
    b.type = "submit";
    b.appendChild(im);
    d3 = document.createElement("td");
    
    d3.appendChild(im);
    r.appendChild(d1);
    r.appendChild(d2);
    r.appendChild(d3);
    o.appendChild(r);
    // console.log(d1.innerHTML+" d1");
    // console.log(d2.innerHTML+" d2");
    console.log(c.innerHTML.split(" ")[0].split(">")[1]+" c");
  }

}


function getMarks(){
  $.get("http://pes.eastus.cloudapp.azure.com:5000/PES/sem/"+sem+"/course/type?USN="+USN,function(resp){
    courses = resp["u"];
    console.log(courses);
    if(courses){
      var o = document.getElementById("stud");
      var child = o.lastElementChild;  
        while (child) { 
            o.removeChild(child); 
            child = o.lastElementChild; 
        } 
    }
    for (i in courses){
      //console.log(i);
      d = courses[i];
      c_id = d["c_id"];
      delete d["c_id"];
      c_name = d["c_name"];
      delete d["c_name"];
      var c_name;
      /*sleep(10000);
      $.get("http://pes.eastus.cloudapp.azure.com:8000/courses/"+c_id,function(resp1){
        c_name=resp1;
        console.log(resp1);
        console.log(c_name);
      });
      */

        console.log(c_id);
        //console.log(resp1);
      
      //c_name = d["c_name"];
      console.log(c_name);
      
      console.log(d);
      getPol(c_id);
      console.log(pol);
      c_id+=" - "+c_name;
      display(c_id,d);
      

    }
    //console.log(courses);
    /*for(var i=0;i<coursesArr.length;i++){
      c_id = coursesArr[i];
      //console.log(c_id);
      for(j in courses){
        //console.log(courses[j]);
        //console.log(courses[j]["c_id"]);
        //console.log("");
        if(courses[j]["c_id"] == c_id){
          modj = courses[j];
          delete modj["c_id"];
          delete modj["teacher"];
          if(modj["ESA"]){
            delete modj["ESA"];
          }
          console.log(modj);
          display(c_id,modj);
        }
      }
    }*/

  });


}