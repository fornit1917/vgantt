function Calendar(id, options, evts) {
	
	//Create the Canvas
	var div = document.getElementById(id);
	
	this.W = parseInt( div.style.width );
	this.H = parseInt( div.style.height );
	this.oldX = null;
	this.x    = null;
	this.cell = null;
	
	this.startDt = null;
	this.endDt   = null;
	
	this.cellFactory = new CellFactory();
	
	div.innerHTML = '';
	var dateCanv = hlprAddCanvas(div, {
	    width: this.W,
	    height: this.H,
	    left: 0,
	    top: 0,
	    z: 0
	});
	
	evts.bind('onScrolling', this.onScrolling, this);
	evts.bind('onScaling', this.onScaling, this);
	this.evts = evts;
	
	
	this.ctx = dateCanv.getContext('2d');
	this.ctx.textBaseline = 'top';
	
	this.canv = dateCanv;
	this.div  = div;
	
	//Default options
	this.options = {
		clBack    : '#FFFFFF',
		clHBack   : '#F6F6F6',
		clWeekend : '#F3F3F3',
		clBBorder : '#DDDDDD',
		clHBorder : '#D0D0D0',
		clText    : '#515151',
		
		cellHeight: 17,
		
		scale     : 0.6
	};
	
	hlprUpdateObj(this.options, options);	
	
	
}


/***** Events handlers *****/

Calendar.prototype.onScrolling = function(data) {
		
	var d = data.hor;
	var x = this.x + d;
	
	var cell = this.cell;
	var w = cell.getWidth();
	var centr = this.W / 2;
	
	if (x+w < centr) {
		
		while ( x+cell.getWidth() < centr ) {
			x += cell.getWidth();
			cell.toNext();
		}		
	}
	else if (x > centr) {
		
		while ( x > centr ) {
			cell.toPrev();
			x -= cell.getWidth();
		}		
	}

	
	this.x = x;
	this.cell = cell;
	
	this._drawCells();
	//this.evts.on('onCalendarRedraw', {});
}

Calendar.prototype.onScaling = function(data) {
    
    var dt = this.cell ? this.cell.getDate() : new Date();
    this.draw(data.scale, dt);
	this.evts.on('onCalendarScaling', {});
}


/***** "Public" methods *****/

Calendar.prototype.draw = function(scale, dt) {
	
	if (dt === undefined)
		dt = new Date();
	
	this.cell = this.cellFactory.getCell(scale, dt);
	
	this.x = (this.W - this.cell.getWidth()) / 2;
	this._drawCells();	
}

Calendar.prototype.getMapper = function() {
	
	return {
		pxToDate : hlprCreateHandler(this._pxToDate, this),
		dateToPx : hlprCreateHandler(this._dateToPx, this)
	}
}

/***** "Private" methods *****/

Calendar.prototype._drawCells = function() {
	
	var ctx = this.ctx;
	ctx.fillStyle = this.options.clBack;
	ctx.fillRect(0, 0, this.W, this.H);
	
	ctx.fillStyle = this.options.clHBack;
	ctx.fillRect(0, 0, this.W, 2*this.options.cellHeight);
	
	var cell = this.cell;
	var x = this.x;
	var dt = cell.getDate();
	var xp = x;
	
	//вправо
	while (xp < this.W) {
		
		this._drawCell(cell, xp);
		xp += cell.getWidth();
		cell.toNext();
	}
	
	cell.toPrev();
	this.endDt = cell.getEndDate();
	
	//влево
	cell.setDate(dt);
	
	xp = x;
	while (xp > 0) {
		
		cell.toPrev();
		xp -= cell.getWidth();
		this._drawCell(cell, xp);
	}
	
	this.startDt = cell.getStartDate();
	
	cell.setDate(dt);
	this.cell = cell;
	
}

Calendar.prototype._drawCell = function(cell, x) {
	
	var ctx = this.ctx;
	var opt = this.options;
	var w    = cell.getWidth();
	var wsub;
	
	ctx.strokeStyle = opt.clHBorder;
	ctx.strokeRect(x, 0, w, opt.cellHeight);
	
	var i, n = cell.getCountSub();
	
	
	ctx.fillStyle   = opt.clText;		
	grTextCentr(ctx, cell.getTitle(), x, 3, w)
	
	
	ctx.strokeStyle = opt.clBBorder;
	grLine(ctx, x + w, 2*opt.cellHeight, x + w, this.H)
	
	for (i=0; i<n; i++) {
		
		wsub = cell.getWSub(i);
		ctx.strokeRect(x, opt.cellHeight, wsub, opt.cellHeight);
		grTextCentr(ctx, cell.getSubTitle(i), x, opt.cellHeight+4, wsub)
		x += wsub;
	}
}

//TODO: сохранять стартовую дату опорной ячейки один раз при перерисовке
//TODO: перемножить числа

Calendar.prototype._pxToDate = function(px) {
	
	//TODO: переписать и перепроверить, чтобы точно работала
	var d = Math.floor((px - this.x) / this.cell.getWDay());
	var dt = this.cell.getStartDate();
	var result = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + d);
	return result;
}

Calendar.prototype._dateToPx = function(dt) {
	
	
	var sd = this.cell.getStartDate();
	var d = dt - sd;
	d = d / (1000 * 3600 * 24);
	
	//TODO: проверить
	var r = Math.ceil(d);
	if ( r - d > 0.01 ) {
		r = Math.floor(d);
	}

	return this.x +  r * this.cell.getWDay();
}