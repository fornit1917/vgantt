function CellYQ(scale, dt) {
	
	this.scale = scale;
	this.dt    = dt;
	
	this.getWDay = function() {
		return 0.3 + this.scale*2.3;
	}
	
	this.getDaysInSub = function(i) {
		
		i = parseInt(i, 10);
		var result = 0;
		
		switch (i) {
			case 0:
				if (this.dt.getFullYear() % 4 == 0) {
					result = 91;
				}
				else {
					result = 90;
				}
				break;
				
			case 1:
				result = 91;
				break;
				
			case 2:
			case 3:
				result = 92;
				break;
		}
		
		return result;
	}
			
	this.getCountSub = function() {
		return 4;
	}

	this.getTitle = function() {
		return this.dt.getFullYear();
	}

	this.getSubTitle = function(i) {
		return 'Q' + (i+1);
	}

	this.toNext = function() {
		this.dt = new Date( this.dt.getFullYear() + 1, 
			this.dt.getMonth(), this.dt.getDate() );
	}

	this.toPrev = function() {
		this.dt = new Date( this.dt.getFullYear() - 1, 
			this.dt.getMonth(), this.dt.getDate() );
	}
	
	this.getStartDate = function() {
		return new Date(this.dt.getFullYear(), 0, 1);
	}
	
	this.getEndDate = function() {
		return new Date(this.dt.getFullYear(), 11, 31);
	}
}

CellYQ.prototype = CellProto;