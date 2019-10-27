var type_a;
var t_id = "PCS181";

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
  c.innerHTML = "<h4><em>"+cid+"</em></h4>"+ts.toDateString();
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
  b1 = document.createElement("button");
  b1.innerHTML = "<span style='color:white'> Approve</span>";;
  b1.id = "a";
  b1.value = cid;
  b1.style.backgroundColor = '#64b2cd';
  b2 = document.createElement("button");
  b2.innerHTML = "<span style='color:white'> Dismiss</span>";
  b2.id = "d";
  b2.value = cid;
  b2.style.backgroundColor = '#64b2cd';
  o.appendChild(b1);
  o.appendChild(b2);
  
  var br2 = document.createElement("br");
  o.appendChild(br2);
  var br3 = document.createElement("br");
  o.appendChild(br3);
  console.log("in call"+cid);
  var ap = document.getElementById("a");
  ap.onclick = function() {approve(ap.value)};
  b2.onclick = function() {de(b2.value)};
}

function approve(cid){
  console.log(cid);
  
    $.post("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/policy?t_id="+t_id,function(resp){
    
  });
    window.location = "http://pes.eastus.cloudapp.azure.com:5000/approve_policyh";
}

function de(cid){
  console.log(cid);
    $.ajax({
      url: "http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/policy?t_id="+t_id,
      method: 'DELETE',
      async: false,
      success: function(resp){
    //$.del("http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/policy?t_id="+t_id,function(resp){
      return resp;
    }
  });
    window.location = "http://pes.eastus.cloudapp.azure.com:5000/approve_policyh";
}

//$.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/policy?t_id="+t_id,function(resp){
var flag =0;
$.post("http://pes.eastus.cloudapp.azure.com:5000/PES/auto_approval",function(resp){
  //alert("auto approved");
  flag =1;
  console.log(flag);
  di();

});

function di(){
  console.log("in here");
    $.get("http://pes.eastus.cloudapp.azure.com:5000/PES/course/policy?t_id="+t_id,function(resp){
      console.log("yahoo"); 
      console.log(resp);
      var e = document.getElementById("def"); 
          /*if(e != NULL){
            
          }*/
          e.parentNode.removeChild(e);
      var flag = 0;
      for (i in resp){

        if(resp[i]["Approved"] == 0){
          flag = 1;
          disp(i,resp[i]);
        }
      }
      console.log(resp);

      if(flag == 0){
        var o = document.getElementById("stud");
        var tr = document.createElement("tr");
        tr.id = "def";
        var td = document.createElement("td");
        //tr.style.textAlign = "center";
        td.colspan = 2;
        td.innerHTML = "No data available in table";
        tr.appendChild(td);
        o.appendChild(tr);
        //`alert("Policy not yet set");
      }
      
      flag = 0;
    });
}
