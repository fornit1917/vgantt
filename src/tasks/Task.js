
function Task(data) {
	
	this.dt1   = data.dt1;
	this.dt2   = data.dt2;
	this.title = data.title;
	
	this.x = null;
	this.y = null;
	
	this.prev = null;
	this.next = null;
}

Task.prototype = function getInfo() {
	return {
		dt1:  this.dt1,
		dt2:  this.dt2,
		name: this.name
	}
}

Task.prototype.getDt1 = function() {
	
	if (typeof this.dt1 == 'string') {
		this.dt1 = new Date(this.dt1);
		this.dt1.setHours(0, 0, 0, 0);
	}
	return this.dt1;
}

Task.prototype.getDt2 = function() {
	
	if (typeof this.dt2 == 'string') {
		this.dt2 = new Date(this.dt2);
		this.dt2.setHours(23, 59, 59, 999);
	}
	return this.dt2;
}
