var type_a;





function display(cid,cMarks){
  var row = document.createElement("tr");

  var o = document.getElementById("stud");
  var c = document.createElement("td");
  c.innerHTML = "<h4><em>"+cid+"</em></h4>";
  c.colSpan = 2;
  c.class = "body-item mbr-fonts-style display-7";
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

function disp(cid, info){
	var row = document.createElement("tr");

  var o = document.getElementById("stud");
  var c = document.createElement("td");
  var ts = currentDate = new Date(info["timestamp"]);
  c.innerHTML = ts.toDateString();
  c.colSpan = 2;
  c.class = "body-item mbr-fonts-style display-7";
  //c.style="width:800px;margin:0 auto";
  c.style.backgroundColor = '#ededed';
  row.appendChild(c);
  o.appendChild(row);

  /*var br1 = document.createElement("br");
  o.appendChild(br1);*/
  itypes = info["internals"];
  display("internals", itypes); 
  etypes = info["externals"];
  display("externals", etypes);
  
  //console.log("in call"+cid);
  

}




  $.get("http://pes.eastus.cloudapp.azure.com:5000/PES/getDefault",function(resp){
    console.log(resp);

    if(resp != "{}"){
      //console.log()
      var o = document.getElementById("stud");
      var child = o.lastElementChild;  
        while (child) { 
            o.removeChild(child); 
            child = o.lastElementChild; 
        }
    var j = JSON.parse(resp);
     var count = Object.keys(resp).length;
     console.log(count);
    for (var i in j){

      console.log(i);
        disp(i,j[i]);
      }
    }
    else{
      console.log("hehe");
      var g = document.getElementById("stud");
      g.innerHTML = "<td colspan=2>No data available in table</td>";
    }
    
    
  });
