function CellMD(scale, dt) {
	this.scale = scale;
	this.dt    = dt;	
	
	
	this.getWDay = function() {
		return 10 + this.scale*30;
	}
	
	this.getDaysInSub = function(i) {
		return 1;
	}

	this.getCountSub = function() {
		return 32 - new Date( this.dt.getFullYear(), this.dt.getMonth(), 32 ).getDate(); 
	}


	this.getTitle = function() {
		return MONTHS[this.dt.getMonth()] + ' ' + this.dt.getFullYear();
	}

	this.getSubTitle = function(i) {
		return (i+1) + '';
	}

	this.toNext = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth() + 1, this.dt.getDate() );

		this.w = this.getCountSub() * this.wsub;
	}

	this.toPrev = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth() - 1, this.dt.getDate() );

		this.w = this.getCountSub() * this.wsub;
	}
	
	this.getStartDate = function() {
		return new Date(this.dt.getFullYear(), this.dt.getMonth(), 1);
	}
	
	this.getEndDate = function() {
		
		var y = this.dt.getFullYear();
		var m = this.dt.getMonth();
		return new Date(y, m, this._daysInMonth(y, m));
	}
	
}

CellMD.prototype = CellProto;