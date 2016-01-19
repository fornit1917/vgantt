function Scaling(id, options, evts) {
    
    this.evts = evts;
    
    this.options = {
		'top'        : 45,
		'clBack'     : 'rgba(208, 208, 208, 0.3)',
		'clBackOver' : 'rgba(208, 208, 208, 0.6)',
		'clLine'     : 'rgba(81, 81, 81, 0.3)',
		'clLineOver' : 'rgba(81, 81, 81, 0.6)',
		'clInd'      : 'rgba(81, 81, 81, 0.3)',
		'clIndOver'  : 'rgba(81, 81, 81, 0.6)',
	
		'startScale' : 0.6,
		'W'          : 190,
		'H'          : 30
	
    };
    
    
    hlprUpdateObj(this.options, options);
    
    this.scale = this.options.startScale;

    var div = document.getElementById(id);
    var wdiv = parseInt(div.style.width);
    var hdiv = parseInt(div.style.height);
    
    this.W = this.options.W;
    this.H = this.options.H;
    this.X = wdiv - this.W - this.W*0.1;
    this.Y = this.H*0.1 + this.options.top,
    
    //TODO: добавить еще параметров
    
    this.LW = Math.round(0.8 * this.W);
    this.LH = Math.round(0.2 * this.H);
    this.LX = Math.round((this.W - this.LW) / 2);
    this.LY = Math.round( (this.H - this.LH) / 2 )
    
    this.IW = Math.round(0.03 * this.W);
    this.IH = Math.round(0.7 * this.H);
    
    this.K = 1 / (this.LW - this.IW);
    
    this.ix = this._scaleToPx(this.scale);
    this.IY = Math.round( (this.H - this.IH) / 2 );
    
    var canv = hlprAddCanvas(div, {
		'width'  : this.W,
		'height' : this.H,
		'left'   : this.X,
		'top'    : this.Y,
		'z'      : 3
    });
    
    //координаты относительно ОКНА
    var abs = hlprAbsOffset(canv);
    this.AX = abs.left;
    this.AY = abs.top;
    
    canv.onmouseover = hlprCreateHandler(this.onMouseOver, this);
    canv.onmouseout  = hlprCreateHandler(this.onMouseOut, this); 
    canv.onmousedown = hlprCreateHandler(this.onMouseDown, this);     
    canv.onmouseup   = hlprCreateHandler(this.onMouseUp, this);     
    canv.onmousemove = hlprCreateHandler(this.onMouseMove, this);     
    
    this.ctx   = canv.getContext('2d');
    this.canv  = canv;
}


Scaling.prototype.onMouseOver = function(data) {
    
    this.draw(true)
}

Scaling.prototype.onMouseOut = function() {
    
    this.draw();
    this.moving = false;
}

Scaling.prototype.onMouseDown = function(data) {
    
    var x = data.pageX - this.AX;
    var y = data.pageY - this.AY;
    
    if (this._pInInd(x, y)) {
		this.moving = true;
    }
    else if (this._pInLine(x, y)) {
	
	//TODO: "оптимизация" вычеслений
		if (x > this.LX + this.LW - this.IW)
			x = this.LX + this.LW - this.IW;
	
		this._indMove(x);
    }
    
	
}

Scaling.prototype.onMouseMove = function(data) {
    
    var x = data.pageX - this.AX;
    var y = data.pageY - this.AY;
    
    if ( this._pInLine(x, y) || this._pInInd(x, y)) {
		this.canv.style.cursor = 'pointer';
    }
    else {
		this.canv.style.cursor = 'default';
    }
    
    if (this.moving ) {
	
		if (x >= this.LX  && x <= (this.LX + this.LW - this.IW)) {
			this._indMove(x);
		}
    }
    
}

Scaling.prototype.onMouseUp = function(data) {
    this.moving = false;
}

Scaling.prototype.draw = function(over) {
 
    var clBack, clLine, clInd;
    var opt = this.options;
    if (over) {
		clBack = opt.clBackOver;
		clLine = opt.clLineOver;
		clInd  = opt.clIndOver;
    }
    else {
		clBack = opt.clBack;
		clLine = opt.clLine;
		clInd  = opt.clInd;
    }
 
    this.ctx.clearRect(0, 0, this.W, this.H);
    
    this.ctx.fillStyle = clBack;
    grRectCircle({
		w: this.W,
		h: this.H,
		x: 0, y:0,
		ctx: this.ctx
    });
    
    this.ctx.fillStyle = clLine;
    grRectCircle({
		w: this.LW,
		h: this.LH,
		x: this.LX, 
		y: this.LY,
		ctx: this.ctx
    });
    
    this.ctx.fillStyle = clInd;
    grRectCircle({
		w: this.IW,
		h: this.IH,
		x: this.ix, 
		y: this.IY,
		ctx: this.ctx
    });
}


Scaling.prototype._pxToScale = function(px) {
    return (px-this.LX) * this.K;
}

Scaling.prototype._scaleToPx = function(scale) {
    return Math.round( scale / this.K ) + this.LX;
}

//принадлежность точки фигурам - в отдельные хелперы
Scaling.prototype._pInInd = function(x, y) {
    
	return hlprPointInRect(x, y, this.ix, this.IY, this.IW, this.IH);
}

Scaling.prototype._pInLine = function(x, y) {
	
	return hlprPointInRect(x, y, this.LX, this.LY, this.LW, this.LH);
}

Scaling.prototype._indMove = function(x) {
    
    this.ix	   = x;
    this.scale = this._pxToScale(this.ix);
    
    this.draw(true);
    
    this.evts.on('onScaling', {'scale':this.scale});
}