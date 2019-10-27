//drop down to choose the course
//sem/courses?t_id={t_id}


var type_a;
var t_id = document.getElementById("t_id").innerHTML;
console.log(t_id);
//var t_id = "PCS181";
var pol;

function getTypes(cid){
    console.log("inTypes");
    console.log(cid);
    var typ;
    $.ajax({
        url: "http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/types",
        method:"GET",
        async:false,
        success: function(resp){
            console.log("in REQ");
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
            console.log(resp);

            var response = JSON.parse(resp);
            var list = document.getElementById("type");
            while (list.hasChildNodes()) {
                list.removeChild(list.firstChild);
            }
            for (var i=0;i<response.types.length;i++){
                    console.log("yeelo");
                    setType(response.types[i]);
                    //alert(response.types[i]);
                }
            var e = document.getElementById("type");
            type_a = e.options[e.selectedIndex].value;
            console.log(type_a);
            typ = type_a;
        },
        error : function(xhr){
            console.log("hehe");
          var g = document.getElementById("stud");
          g.innerHTML = "<td colspan=2>No data available in table</td>";
        }
            //return (type_a);
        });

}

$.ajax({
        url: "http://pes.eastus.cloudapp.azure.com:8000/sem/courses?t_id="+t_id,
        method:"GET",
        async:false,
        success: function(response){
//$.get("http://pes.eastus.cloudapp.azure.com:8000/sem/courses?t_id="+t_id,function(response){
            for (var i=0;i<response.courses.length;i++){
        		setCourse(response.courses[i].c_id, response.courses[i].c_name );
        	}
        	var e = document.getElementById("cat");
			var cid = e.options[e.selectedIndex].value;
        	console.log("hello");
            getTypes(cid);
            console.log(type_a);
            getPol(cid);
            console.log(pol);
        	//document.getElementById("getStud").onclick = function() {getStudents(cid)};
            getStudents();
        }
    });

function setCourse(data, cname){
    var o = document.createElement("option");
    o.text = data+" - "+cname;
    o.value = data;
    document.getElementById("cat").add(o);
    //getStudents();
}



function setType(data){
    var o = document.createElement("option");
    o.text = data;
    o.value = data;
    document.getElementById("type").add(o);
    //getStudents();
}

/*function validate() {
    alert("called");
}*/

/*function validate(v) {
  var x, text;
  //alert("fvfd");

  // Get the value of the input field with id="numb"
  x = document.getElementById("password").value;
  //x = parseInt(x);
  alert(v); 

  // If x is Not a Number or less than one or greater than 10
  if (isNaN(x) || x < 1 || x > 10) {
    text = "Input not valid";
  } else {
    text = "Input OK";
  }
  document.getElementById("demo").innerHTML = text;
}*/


var nu = 0;

function validatePassword(){
    var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");
    console.log(password.value );
    console.log(confirm_password.value );
    var c = document.getElementById("resp");
  if(password.value != confirm_password.value) {

    
    c.innerHTML = "Marks Don't Match";
        //confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    c.innerHTML = "Match";
    //confirm_password.setCustomValidity('');
  }
}


function setStud(data,name,mx){
    nu = nu + 1;
    var r = document.createElement("tr");
    var o = document.createElement("td");
    o.innerHTML = "<em>"+data+"</em>";
    o.class = "body-item mbr-fonts-style display-7";
    var d1 = document.createElement("td");
    var v = document.createElement("td");
    var d3 = document.createElement("td");
    var resp = document.createElement("div");
    resp.id = "resp";
    d3.appendChild(resp);

    d1.class = "body-item mbr-fonts-style display-7";
    v.class = "body-item mbr-fonts-style display-7";
    d1.innerHTML = "<em>"+name+"</em>";
    var c1 = document.createElement("input");
    c1.type = "text";
    c1.placeholder = " Confirm Marks";

    //c1.id = "confirm_password";
    //c1.id = "veri";
    var id1 = "confirm_password"+nu.toString(10);
    c1.id = String(id1);
    
    //c1.onchange = "validatePassword()";
    c1.onkeyup = "validatePassword()";
    v.appendChild(c1);
    var d = document.createElement("td");
    d.class = "body-item mbr-fonts-style display-7";
    var c = document.createElement("input");
    c.type = "password";
    c.placeholder = " Marks";
    var id4 = "password"+nu.toString(10);
    c.id = String(id4);
    c.text = data;
    var val = c.value;
    //var id = "numb"+nu.toString(10);
    //c.id = String(id);
    console.log(c.id);
    console.log(c1.id);
    //var but = document.createElement("td");

    //var st = "#"+id;
    //console.log(st);
    /*$("select#test").change({msg: "ok"},  function(event) {
    myHandler(event.data.msg);
});*/
    
        /*$(st).change(function(event) {
            alert("boom");
            //console.log(val);
            
        });*/

    
    
    //console.log(id);
    //val = c.value;
    //c.setAttribute("onchange", "validate(val)");

    //c.onchange = "validate()"; //not geting called
    console.log("here");
    mx = mx.toString(10);
    //c.max = mx;
    console.log(mx);
    var p = document.createElement("p");
    p.id = "demo";
    p.style.display = "inline";
    p.innerHTML = "&nbspmax:"+mx;   //actual validation is not done
    d.appendChild(c);
    d.appendChild(p);
    var s = document.getElementById("stud");
    console.log(s);
    r.appendChild(o);
    
    r.appendChild(d1);
    r.appendChild(d);
    r.appendChild(v);
    r.appendChild(d3);
    s.appendChild(r);
    document.getElementById(c.id).onkeyup = function(event) {val = c.value;console.log(val);
        if (isNaN(val) || parseFloat(val) > mx || parseFloat(val)<-1) {
            text = "&nbspInput not valid";
        } 
        else {
            text = "&nbspInput OK";
        }
  p.innerHTML = text;
};

/*c1.onchange = function(event) {
    
    console.log(c.value );
    console.log(c1.value );
    //var h = document.getElementById("resp");
  if(c.value != c1.value) {

    
    resp.innerHTML = "Passwords Don't Match";
        //confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    resp.innerHTML = "Match";
    //confirm_password.setCustomValidity('');
  }




    };

    */

c1.onkeyup = function(event) {
    console.log(c.value );
    console.log(c1.value );
    //var h = document.getElementById("resp");
  if(c.value != c1.value) {

    
    resp.innerHTML = "Marks Don't Match";
        //confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    resp.innerHTML = "Match";
    //confirm_password.setCustomValidity('');
  }




    };

}
    



function getStudents(){
    var cid = document.getElementById("cat").value;
    console.log(cid);
$.get("http://pes.eastus.cloudapp.azure.com:8000/students?c_id="+cid+"&t_id="+t_id,function(response){
		var list = document.getElementById("stud");
   		while (list.hasChildNodes()) {
      		list.removeChild(list.firstChild);
   		}
        var h2 = document.getElementById("changeType");
        if (pol == ""){

            console.log("hehe");
          var g = document.getElementById("stud");
          g.innerHTML = "<td colspan=2>No data available in table</td>";
            return;
        }
        h2.innerHTML = type_a;
        console.log(pol);
        
        var mx = pol[type_a];
		    n = response.students.length;
        for (var i=0;i<n;i++){
        		setStud(response.students[i].USN, response.students[i].s_name, mx);
        		//alert(response.students[i].USN);
        	}
        console.log("instudents"+cid);
        document.getElementById("sub").onclick = function() {myFunction(cid)};
        
    });
}



function jsonConcat(o1, o2) {
 for (var key in o2) {
        o1[key] = o2[key];
    
 }
 return o1;
}

function getPol(cid){
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

function chooseCourse(){
	var e = document.getElementById("cat");
	var cid = e.options[e.selectedIndex].value;
	getTypes(cid);
    getPol(cid);
    //document.getElementById("getStud").onclick = function() {getStudents(cid)};
    clearStatus();
    getStudents();

}
function clearStatus(){
    var a = document.getElementById("status");
    a.innerHTML = "";
}

function chooseType(){
	var e = document.getElementById("type");
	type_a = e.options[e.selectedIndex].value;
    var h2 = document.getElementById("changeType");
    h2.innerHTML = type_a;
    var cid = document.getElementById("cat").value;
    getPol(cid);
    clearStatus();
    getStudents();
}

function myFunction(cid) {
  var foo = document.getElementById("stud");
  var flag = 0;
  var a1 = foo.children;
  for (let i = 0; i < a1.length; i++) {
    var sta1 = a1[i].children[4].children[0].innerHTML;
    var mxCheck = a1[i].children[2].children[1].innerHTML;
    console.log(sta1);
    console.log(mxCheck);
    if(sta1.trim() != "Match" || mxCheck.trim() != "&nbsp;Input OK"){
        flag = 1;
    }

}
    if(flag == 1){
        var sta2 = document.getElementById("status");
        sta2.innerHTML = "<h4>Check fields!</h4>";
        sta2.style.color = "#b30900";
        sta2.style.fontStyle = "italic";
        sta2.style.fontSize = "5px";
        return;
    }



  		var inar = [];
        var arr = foo.children;
		for (let i = 0; i < arr.length; i++) {
			string = (arr[i].children[0].children[0].innerHTML);
  			console.log(string);
  			var a = arr[i].children[2].children[0].value;
  			console.log(a);

        var name = arr[i].children[1].children[0].innerHTML;
        console.log(arr[i].children[1].children[0].innerHTML);
        var ver = arr[i].children[3].children[0].checked;
        console.log(ver);
            var a = parseFloat(a);
  			jso = {"USN" : string, "name" : name, "marks" : a, "veri" : ver};
  			inar.push(jso);
  			console.log(jso);
		}
		jsn = {"u" : inar};
		console.log(jsn);
		console.log(cid);
		console.log(type_a);
		$.ajax({
    		type: 'POST',
    // make sure you respect the same origin policy with this url:
    // http://en.wikipedia.org/wiki/Same_origin_policy
    		url: "http://pes.eastus.cloudapp.azure.com:5000/PES/course/"+cid+"/type/"+type_a+"?t_id="+t_id ,
    		async:false,
    		dataType : "json",
    		contentType: "application/json; charset=utf-8",
    		crossDomain : true,
    		data : JSON.stringify(jsn),
    		success: function(){
        		//alert('wow');
                var sta = document.getElementById("status");
                sta.innerHTML = "<h4>Upload success!</h4>";
                sta.style.color = "#00b300";
                sta.style.fontStyle = "italic";
                sta.style.fontSize = "5px";
    		}
		});
}