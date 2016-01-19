function TasksCanvas(id, options, evts, mapper) {
	
	var div  = document.getElementById(id);
	this.div = div;
	
	this.W = parseInt( div.style.width );
	this.H = parseInt( div.style.height );	
	
	this.offset = 0;
	
	this.options = {
		clNormal        : '#9abbe8',
		clNormalBorder  : '#6c8bc1',
		clDelayed       : '#e89e9b',
		clDelayedBorder : '#c2716d',
		clTriangle      : '#666666'
	};
	
	hlprUpdateObj(this.options, options);
	
	this.evts = evts;
	this.mapper = mapper;
	
	this.canv = hlprAddCanvas(div, {
	    width: this.W,
	    height: this.H,
	    left: 0,
	    top: 0,
	    z: 1
	});
	
	this.ctx = this.canv.getContext('2d');
	this.ctx.textBaseline = 'top';
	
	this.canv.onmousedown = hlprCreateHandler(this.onMouseDown, this);
	this.canv.onmouseup   = hlprCreateHandler(this.onMouseUp, this);
	this.canv.onmousemove = hlprCreateHandler(this.onMouseMove, this);
	
	this.evts.bind('onCalendarScaling', this.redraw, this);
	
	this.clickX = null;
	this.clickY = null;
	
	this.tasks = [];
	
	this.MAX_COUNT = (this.H - g_Config.TASKS_TOP)
}

TasksCanvas.prototype.onMouseDown = function(data) {
	this.clickX = data.clientX;
	this.clickY = data.clientY;
	this.div.style.cursor = 'move';
}

TasksCanvas.prototype.onMouseUp = function(data) {
	this.clickX = null;
	this.clickY = null;
    this.div.style.cursor = 'default';
}

TasksCanvas.prototype.onMouseMove = function(data) {
	if (this.clickX !== null) {
		var hor = Math.round((data.clientX - this.clickX) / 1.5);
		var ver = Math.round((data.clientY - this.clickY) / 1.5);
		this.evts.on('onScrolling', {ver:ver, hor:hor});
		
		this.clickX = data.clientX;
		this.clickY = data.clientY;
	}
}

TasksCanvas.prototype.redraw = function(data) {
	
	this.ctx.clearRect(0, 0, this.W, this.H);
	for (var i=0; i<this.tasks.length; i++) {
		this._redrawTask(i);
	}
}

//TODO: реализовать
TasksCanvas.prototype.addProjectHead = function(project) {
	
}

TasksCanvas.prototype.addTask = function(task) {
	
	//TODO: переделать. Сделать более подробную декомпозицию
	task.y  = this.tasks.length * g_Config.TASK_ALL_HEIGHT + g_Config.TASKS_TOP;
	task.y += this.offset;
	if (task.y >= this.H) {
		return false;
	}
	
	this.tasks.push(task);
	this._redrawTask(this.tasks.length-1);
	return true;
}

TasksCanvas.prototype.deleteAllTasks = function() {
	this.tasks.splice(0, this.tasks.length);
	this.ctx.clearRect(0, 0, this.W, this.H);
}

TasksCanvas.prototype._redrawTask = function(i) {
	
	var task = this.tasks[i];
	if (! task) return;
	
	task.x   = this.mapper.dateToPx(task.getDt1());
	//task.y   = i * g_Config.TASK_ALL_HEIGHT + g_Config.TASKS_TOP;
	
	if (task.x >= this.W) {
		this._drawRightTriangle(task);
	}
	else {
		task.w   = this.mapper.dateToPx(task.getDt2()) - task.x;
		if (task.w + task.x <= 0) {
			this._drawLeftTriangle(task)
			
		}
		else {
	
			this.ctx.fillStyle   = this.options.clNormal;
			this.ctx.strokeStyle = this.options.clNormalBorder;
	
			this.ctx.fillRect(task.x, task.y, task.w, g_Config.TASK_RECT_HEIGHT);
			this.ctx.strokeRect(task.x, task.y, task.w, g_Config.TASK_RECT_HEIGHT);	
			
			
			this.ctx.fillStyle   = this.options.clNormalBorder;
			this.ctx.fillText(
				task.title, 
				Math.floor( task.x > -1 ? task.x+2 : 2 ), 
				Math.floor( task.y+g_Config.TASK_RECT_HEIGHT+3 )
			);
				
			if (task.y < g_Config.HEAD_HEIGHT) {
				this._clearHead();
			}				
		}
	}
}


TasksCanvas.prototype._drawLeftTriangle = function(task) {
	
	this.ctx.fillStyle   = this.options.clTriangle;
	this.ctx.strokeStyle = this.options.clTriangle;
	
	grTriangle(this.ctx, 9, task.y+2, 9, task.y+11, 2, task.y+6.5, true);
	
	this.ctx.fillText(
		task.title, 
		12, 
		task.y
	);	
	
	if (task.y+2 < g_Config.HEAD_HEIGHT) {
		this._clearHead();
	}
}

TasksCanvas.prototype._drawRightTriangle = function(task) {
	
	this.ctx.fillStyle   = this.options.clTriangle;
	this.ctx.strokeStyle = this.options.clTriangle;
	
	grTriangle(
		this.ctx, 
		this.W-9, 
		task.y + 2, 
		this.W - 9, 
		task.y + 11, 
		this.W - 2, 
		task.y + 6.5, true
	);
		
	this.ctx.fillText(
		task.title, 
		this.W - 12 - this.ctx.measureText(task.title).width, 
		task.y
	);			

	if (task.y+2 < g_Config.HEAD_HEIGHT) {
		this._clearHead();
	}	
}

TasksCanvas.prototype._clearHead = function() {
	this.ctx.clearRect(-1, -1, this.W+1, g_Config.HEAD_HEIGHT+1);
}