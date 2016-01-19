var VGantt = function(id, options, data) {
	
	this.id = id;
	this.options = options;
	this.data = data;
	
	this.evts = new Events();
	
	//TODO: рефакторинг: передавать в конструкторы не айдишник, а див	
	//TODO: разобраться с опциями
	this.cal     = new Calendar(id, options, this.evts);
	this.tasks   = new Tasks(id, {}, this.evts, this.cal.getMapper());
	this.scaling = new Scaling(id, {}, this.evts);
	

}


VGantt.prototype.draw = function() {
	this.cal.draw( this.options.scale );
	this.scaling.draw();
	
	this.tasks.loadFromServer();
	
}

VGantt.prototype.load = function() {
	
}

VGantt.prototype.save = function() {
	
}

window.VGantt = VGantt;