function Project(obj, ctx, mapper) {
	
	this.tasks = [];
	
	for (var i=0; i<obj.tasks.length; ++i) {
		this.tasks.push( new Task(obj.tasks[i]) );
	}
	
	this.name  = obj.name;
	this.id    = obj.id;
	
	this.top  = 0;
	
	this._dt1 = null;
	this._dt2 = null;
}

Project.prototype.getHeight = function() {
	return g_Config.TASK_ALL_HEIGHT * this.tasks.length;
}

//TODO: реализовать
Project.prototype.getFirst = function(ctop) {
	return 0;
}

Project.prototype.getDt1 = function() {
	
	if (this._dt1 === null) {
		
		var dt;
		this._dt1 = this.tasks[0].getDt1();
		for (var i=1; i<this.tasks.length; i++) {
			
			dt = this.tasks[i].getDt1();
			if (dt < this._dt1) {
				this._dt1 = dt;
			}
		}
	}
	return this._dt1;
}

Project.prototype.getDt2 = function() {
	
	if (this._dt2 === null) {
		var dt;
		this._dt2 = this.tasks[0].getDt2();
		for (var i=1; i<this.tasks.length; i++) {
			
			dt = this.tasks[i].getDt2();
			if (dt > this._dt2) {
				this._dt2 = dt;
			}
		}		
	}
	return this._dt2;
}

Project.prototype.addTask = function(task) {
	
	this.tasks.push(task);
	
	var dt = task.getDt1();
	if (dt < this._dt1) {
		this._dt1 = dt;
	}
	
	dt = task.getDt2();
	if (dt > this._dt2) {
		this._dt2 = dt;
	}
	
}