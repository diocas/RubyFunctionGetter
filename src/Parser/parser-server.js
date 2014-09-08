
CodeParser.SERVICE_URL = "http://localhost:4567/";

function CodeParser(codeGiven)
{
	var code = codeGiven;
	var serverId;
	var lastCodeToReturn;
	
	$.ajax({
		type: "POST",
		url: CodeParser.SERVICE_URL,
		data: {
			code : this.code
		},
		async : false
	}).done(function( data ) {
			console.log(data);
			serverId = data;
	});
	
	this.getFunction = function (methodToReturn)
	{
		if (serverId == "") 
			return "Code parsing error!";
		
		$.ajax({
			type: "GET",
			url: CodeParser.SERVICE_URL + 'code/',
			data: {
			idCode : serverId,
			method : methodToReturn
			},
			async : false
		}).done(function( data ) {
				lastCodeToReturn = data;
		}).fail(function() {
		    alert( "error" );
		  });
		
		if(lastCodeToReturn == "")
			return "Method not found!";
			
		return lastCodeToReturn;
	};
}