var SCHEME_YQ = 0; //год - квартал
var SCHEME_QM = 1; //квартал - месяц
var SCHEME_MW = 2; //месяц - неделя
var SCHEME_MD = 3; //месяц - день
var SCHEME_WD = 4; //неделя - день

function CellFactory() {
    
    this.cells = {};
}

CellFactory.prototype.getCell = function(scale, dt) {
    
    var scheme = this.getScheme(scale);
    if (this.cells[scheme] != undefined) {
	
	this.cells[scheme].setDate(dt);
		
		this.cells[scheme].setScale(scale);
		return this.cells[scheme];
    }
    
	switch (scheme) {
		
		case SCHEME_YQ:
			this.cells[scheme] = new CellYQ(scale, dt);
			break;
			
		case SCHEME_QM:
			this.cells[scheme] = new CellQM(scale, dt);
			break;
			
		case SCHEME_MW:
			this.cells[scheme] = new CellMW(scale, dt);
			break;
			
		case SCHEME_MD:
			this.cells[scheme] = new CellMD(scale, dt);
			break;
			
		case SCHEME_WD:
			this.cells[scheme] = new CellWD(scale, dt);
			break;
	}
	
    return this.cells[scheme];
}

CellFactory.prototype.getScheme = function(scale) {
    
	if ( (scale >= 0) && (scale <= 0.15) ) {
		return SCHEME_YQ;
    }	

    if ( (scale > 0.15) && (scale <= 0.3) ) {
		return SCHEME_QM;
    }

    if ( (scale > 0.3) && (scale <= 0.5) ) {
		return SCHEME_MW;
    }

    if ( (scale > 0.5) && (scale <= 0.75) ) {
		return SCHEME_MD;
    }

    if ( (scale > 0.75) && (scale <= 1) ) {
		return SCHEME_WD;
    }
}