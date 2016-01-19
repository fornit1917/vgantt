//TODO: приоритеты
function Events() {
	
	console.log('create events-container');
	this.es = {};
}

Events.prototype.on = function(event, data) {
	
	event = ('' + event).toLowerCase();
	var listeners = this.es[event];
	var eventData;
	
	if (listeners) {
	    
		var n = this.es[event].length;
		for (var i=0; i<n; i++) {
			
			eventData = {eventName: event};
			hlprUpdateObj(eventData, data);
			
			listeners[i].f.call(listeners[i].c, eventData);
		}
	}
}

Events.prototype.bind = function(event, callback, context) {
	
	if (! context)
		context = window;
	
	
	if (typeof(callback) == 'function') {
		
		event = ('' + event).toLowerCase().split(/\s+/);
		var n = event.length;
		for (var i=0; i<n; i++) {
			
			if (! this.es[event[i]]){
				this.es[event[i]] = [];
			}
			
			this.es[ event[i] ].push({f:callback, c:context});		
		}
	}	
}

Events.prototype.unbind = function(event, callback) {
	
	event = ('' + event).toLowerCase().split(/\s+/);
	var n = event.length;
	var L;
	
	for (var i=0; i<n; i++) {
			
		L = this.es[event[i]];
		if (L) {
			var m = L.length; 
			for (var j=0; j<m; j++) {
				
				if (L[j].c == callback) {
					L.splice(j, 1);
					break;
				}
			}
		}
	}
}