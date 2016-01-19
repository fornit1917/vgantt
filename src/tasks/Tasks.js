function Tasks(id, options, evts, mapper) {
	
	this.evts   = evts;
	
	this.evts.bind('onScrolling', this.onScrolling, this);
	
	this.tc = new TasksCanvas(id, {}, evts, mapper);
	this.projects = null;
	
	this.ctop = 0;
	this.maxCtop = 0;

}


Tasks.prototype.onScrolling = function(data) {
	
	if (Math.abs(data.ver) > 2) {
		
		this.tc.deleteAllTasks();
		this.ctop -= data.ver;
		this.draw();		
	}
	else if (Math.abs(data.hor) > 0) {
		this.tc.redraw();
	}
}


//TODO: функции загрузки должны принимать коллбэк
Tasks.prototype.loadFromServer = function(url, dt1, dt2, projects) {
	
	url = 'test_data.json';
	var f = hlprCreateHandler(function(data){this.loadFromJSON(data);}, this);
	
	//TODO: добавить прелоадер
	Ajax.request({
		url:url,
		data:{dt1: dt1, dt2: dt2, projects: projects},
		success: f
	});
	
}

Tasks.prototype.loadFromJSON = function(json) {
	
	var obj = JSON.parse(json);
	if (! obj) {
		//TODO: генерация ошибки
	}
	
	var pr, top=0; 
	this.prjs = [];
	for (var i=0; i<obj.length; i++) {
		
		pr = new Project(obj[i], this.ctx, this.mapper);
		pr.top = top;
		top += pr.getHeight();
		
		this.prjs.push(pr);
	}
	
	this.maxCtop = top + this.prjs[obj.length-1].getHeight() - (this.tc.H - g_Config.HEAD_HEIGHT);
	
	this.tc.offset = 0;
	this.draw();

}

Tasks.prototype.draw = function() {


	if (this.ctop < 0) {
		this.ctop = 0;
	}
	else if (this.ctop > this.maxCtop) {
		this.ctop = this.maxCtop;
	}
	
	console.log('ctop ' + this.ctop);
	
	var projNum = this._getFirstProj(this.ctop);
	var proj = this.prjs[projNum];
	
	this.tc.offset = proj.top - this.ctop;
	
	console.log('prnum ' + projNum);
	
	var flag = true;
	
	for (var i = projNum; i < this.prjs.length; i++) {
		proj    = this.prjs[i];
		
		//TODO: добавить номер первого таска
		for (var j=0; j<proj.tasks.length; j++) {
			if (! this.tc.addTask(proj.tasks[j])) {
				
				flag = false;
				break;
			}			
		}
		
		if (! flag) {
			break;
		}	
	}
}



Tasks.prototype._getFirstProj = function(ctop) {

	var searchRes = Search.binSearch({top:ctop}, this.prjs, this._comparator);
	if (searchRes.index >= 0) {
		return searchRes.index;
	}
	else {
		return searchRes.insertIndex-1;
	}
	
		
}

Tasks.prototype._comparator = function(proj1, proj2) {
	if (proj1.top < proj2.top)
		return 1;
	
	if (proj1.top > proj2.top)
		return -1;
	
	return 0;
}