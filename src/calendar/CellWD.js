function CellWD(scale, dt) {
	this.scale = scale;
	this.dt    = dt;	
	
	
	this.getWDay = function() {
		return 15 + this.scale*20;
	}
	
	this.getDaysInSub = function(i) {
		return 1;
	}

	this.getCountSub = function() {
		return 7;
	}

	this.getTitle = function() {
		
		var d  = 1 - this.dt.getDay();
		var dt;
		if (d != 0) {
			dt = new Date( this.dt.getFullYear(), 
				this.dt.getMonth(), this.dt.getDate() + d );
		}
		else {
			dt = this.dt;
		}
		
		return dt.getDate() + ' ' + MONTHS[dt.getMonth()] + ' ' + dt.getFullYear();
	}

	this.getSubTitle = function(i) {
		return DAYS[i];
	}

	this.toNext = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth(), this.dt.getDate() + 7 );
	}

	this.toPrev = function() {
		this.dt = new Date( this.dt.getFullYear(), 
			this.dt.getMonth(), this.dt.getDate() - 7 );
	}			
	
	this.getStartDate = function() {
		return this.getDate();
	}
	
	this.getEndDate = function() {
		return new Date(this.dt.getFullYear(), this.dt.getMonth(), this.dt.getDate()+6);
	}
	
}

CellWD.prototype = CellProto;