var JSON = {};

JSON.rvalidchars    = /^[\],:{}\s]*$/;
JSON.rvalidescape   = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
JSON.rvalidtokens   = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
JSON.rvalidbraces   = /(?:^|:|,)(?:\s*\[)+/g;

JSON.parse = function(data) {
	
	if ( typeof data !== "string" || !data ) {
		return null;
	}	
	
	data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	
	if ( window.JSON && window.JSON.parse ) {
		return window.JSON.parse( data );
	}


	if ( JSON.rvalidchars.test( data.replace( JSON.rvalidescape, "@" )
			.replace( JSON.rvalidtokens, "]" )
			.replace( JSON.rvalidbraces, "")) ) {

		return ( new Function( "return " + data ) )();

	}
	
	return null;
}

window.myJSON = JSON;