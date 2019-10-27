var type_a;
var t_id = document.getElementById("t_id").innerHTML;
console.log(t_id);
//var t_id = "PCS181";
var cid;


function chooseCourse(){
  var e = document.getElementById("cat");
  cid = e.options[e.selectedIndex].value;
    //document.getElementById("getStud").onclick = function() {getStudents(cid)};
    getMarks();
}

function setCourse(data, cname){
    var o = document.createElement("option");
    o.text = data+" - "+cname;
    o.value = data;
    document.getElementById("cat").add(o);
}

$.get("http://pes.eastus.cloudapp.azure.com:8000/sem/courses?t_id="+t_id,function(response){
            for (var i=0;i<response.courses.length;i++){
            setCourse(response.courses[i].c_id, response.courses[i].c_name);
          }
          var e = document.getElementById("cat");
      cid = e.options[e.selectedIndex].value;
      //document.getElementById("sub").onclick = function() {getMarks()};
      getMarks();
          
    });

function display(cid,cMarks){
  var row = document.createElement("tr");

  var o = document.getElementById("stud");
  var c = document.createElement("td");
  c.innerHTML = "<span style='color:white'> <h4><em>"+cid+"</em></h4></span>";
  c.colSpan = 2;
  c.class = "body-item mbr-fonts-style display-7";
  c.style="background-color: #64b2cd";

  //c.style="width:100%";
  row.appendChild(c);
  o.appendChild(row);
  for (i in cMarks){
    r = document.createElement("tr");
    d1 = document.createElement("td");
    d1.innerHTML = i+": ";
    d2 = document.createElement("td");
    d2.innerHTML = cMarks[i];
    r.appendChild(d1);
    r.appendChild(d2);
    o.appendChild(r);
  }

}

function getMarks(){
  var e = document.getElementById("def");
  if(e){
  var child = e.lastElementChild;  
        while (child) { 
            e.removeChild(child); 
            child = e.lastElementChild; 
        }
  }

  $.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/policy?t_id="+t_id,function(resp){
    
    info = resp[cid];
    console.log(info);
    var o = document.getElementById("stud");
      var child = o.lastElementChild;  
        while (child) { 
            o.removeChild(child); 
            child = o.lastElementChild; 
        } 
        if (info == undefined){
      console.log("here");
      var o = document.getElementById("stud");
      var tr = document.createElement("tr");
      tr.id = "def";
      var td = document.createElement("td");
      //tr.style.textAlign = "center";
      td.colspan = 2;
      td.innerHTML = "No data available in table";
      tr.appendChild(td);
      o.appendChild(tr);
      //alert("Policy not yet set");
    }
    else{
      if(info["Approved"] == 1){
        
        itypes = info["internals"];
        display("internals", itypes); 
        etypes = info["externals"];
        display("externals", etypes); 
        }
      else{
        console.log("here");
        var o = document.getElementById("stud");
        var tr = document.createElement("tr");
        tr.id = "def";
        var td = document.createElement("td");
        //tr.style.textAlign = "center";
        td.colspan = 2;
        td.innerHTML = "No data available in table";
        tr.appendChild(td);
        o.appendChild(tr);
        alert("Policy not yet set");
      }
  }

    
  });
}