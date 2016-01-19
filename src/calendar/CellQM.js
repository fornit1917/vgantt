function CellQM(scale, dt) {
	this.scale = scale;
	this.dt    = dt;
	
	
	
	this.getWDay = function() {
		return 1.5 + this.scale*5;
	}
	
	this.getDaysInSub = function(i) {
		var m = Math.floor(this.dt.getMonth() / 3) * 3 + i;
		return this._daysInMonth(this.dt.getFullYear(), m);
	}

	this.getCountSub = function() {
		return 3;
	}

	this.getTitle = function() {
		return 'Q' + (Math.floor(this.dt.getMonth() / 3) + 1) + ' ' +this.dt.getFullYear();
	}

	this.getSubTitle = function(i) {
		i = (i + 3 * (Math.floor(this.dt.getMonth() / 3 ))) % 12;
		return MONTHS[i] + '';
	}

	this.toNext = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth() + 3, this.dt.getDate() );
	}

	this.toPrev = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth() - 3, this.dt.getDate() );
	}	
	
	this.getStartDate = function() {
		return new Date(this.dt.getFullYear(), 
			3 * (Math.floor(this.dt.getMonth() / 3)), 1);
	}
	
	this.getEndDate = function() {
		var m = 3 * (Math.floor(this.dt.getMonth() / 3 ) ) + 2;
		var d = this._daysInMonth(this.dt.getFullYear(), m);
		
		return new Date(this.dt.getFullYear(), m, d);
	}
}

CellQM.prototype = CellProto;