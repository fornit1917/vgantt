function CellMW(scale, dt) {
	this.scale = scale;
	this.dt    = dt;
	
	
	this.getWDay = function() {
		return (25 + this.scale*30) / 7;
	}
	
	this.getDaysInSub = function(i) {
		if (i<4) {
			return 6;
		}
		else {
			return this._daysInMonth(this.dt.getFullYear(), this.dt.getMonth()) - 24;
		}
	}

	this.getCountSub = function() {
		return 5;
	}

	this.getTitle = function() {
		return MONTHS[this.dt.getMonth()] + ' ' + this.dt.getFullYear();
	}

	this.getSubTitle = function(i) {
		return (i*6 + 1) + '';
	}

	this.toNext = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth() + 1, this.dt.getDate() );
	}

	this.toPrev = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth() - 1, this.dt.getDate() );
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

CellMW.prototype = CellProto;