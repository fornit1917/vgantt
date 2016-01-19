var Ajax = {};

Ajax.request = function(options) {
	
	options.type  = options.type || 'GET';
	options.async = options.async !== undefined ? options.async : true;
	
	var params = null;
	if (options.data) {
		
		params = '';
		for (var key in options.data) {
			params += '&' + key+'=' + options.data[key];
		}
		
		params = params.substr(1);
	}
	
	
	var xmlHttp = Ajax._getXmlHttpRequest();
	
	if (options.type == 'GET') {
		options.url = options.url + '?' + params;
	}
	
	xmlHttp.open(options.type, options.url, options.async);
	
	if (options.async) {
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					if (options.success) {
						options.success.call(null, xmlHttp.responseText);
					}
				}
				else {
					if (options.error) {
						options.error.call(null, xmlHttp.status)
					}
				}
			}
		}
	}
	
	
	if (options.type == 'GET')
		xmlHttp.send(null);
	else
		xmlHttp.send(params);
	
	return xmlHttp;
}

Ajax._getXmlHttpRequest = function() {
	
	var xmlHttp;
	try {
		xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e) {
		try {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (E) {
			xmlHttp = false;
		}		
	}
	
	if (!xmlHttp && typeof XMLHttpRequest!='undefined') {
		xmlHttp = new XMLHttpRequest();
	}
	
	return xmlHttp;
}

window.Ajax = Ajax;