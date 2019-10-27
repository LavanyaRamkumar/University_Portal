document.getElementById("sub").onclick = function() {set()};
function set(){
	var opt = document.getElementById("cat").value;
	console.log(opt)
	$.ajax({
	    		type: 'POST',
	    // make sure you respect the same origin policy with this url:
	    // http://en.wikipedia.org/wiki/Same_origin_policy
	    		url: "http://pes.eastus.cloudapp.azure.com:5000/PES/grading/"+opt,
	    		
	    		dataType : "text",
	    		crossDomain : true,
	    		data : "",
	    		success: function(){
	        		console.log("set");
	        		var sta = document.getElementById("status").innerHTML = "Set to "+opt+"!";
	    		}
			});
}

$.get("http://pes.eastus.cloudapp.azure.com:5000/PES/grading",function(resp){
        console.log(resp);
        var e = document.getElementById("cur").innerHTML =  "current Scheme: "+resp ;
    });
