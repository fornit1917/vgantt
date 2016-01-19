(function(){
var g_Config = {
	
	CELL_HEIGHT : 17,
	HEAD_HEIGHT : null,
	
	TASK_RECT_HEIGHT : 13,
	TASK_PADDING     : 10,
	TASK_ALL_HEIGHT  : 33,
	TASKS_TOP : null
};

g_Config.HEAD_HEIGHT = 2*g_Config.CELL_HEIGHT;
g_Config.TASKS_TOP = g_Config.HEAD_HEIGHT + 10;
/**
 * 
 */
function hlprUpdateObj(target, source) {
	
	for (var key in source) {
		
		if (typeof(source[key]) == 'object') {
			if (typeof(target[key]) != 'object') {
				target[key] = {};
			}
			hlprUpdateObj(target[key], source[key]);
			
		}
		else {
			target[key] = source[key];
		}
	}
}


function hlprCreateHandler(f, context) {
	
	return function(data){
		return f.call(context, data);
	}
}

function hlprAddCanvas(div, params) {
    
    var canv = document.createElement('canvas');
    
    canv.width  = params.width;
    canv.height = params.height;
    
    canv.style.left = params.left + 'px';
    canv.style.top  = params.top + 'px';
    
    canv.style.position  = 'absolute';
    
    if (params.z !== undefined) {
	canv.style['z-index'] = params.z;
    }
    
    div.appendChild(canv);
    return canv;
}

function hlprAbsOffset(elem) {
    // (1)
    var box = elem.getBoundingClientRect();
    
    // (2)
    var body = document.body;
    var docElem = document.documentElement;
    
    // (3)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    
    // (4)
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    
    // (5)
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    
    return {top: Math.round(top), left: Math.round(left)}
}

function hlprPointInRect(x, y, xr, yr, wr, hr) {
	return (x > xr) && (x < xr + wr) && (y > yr) && (y < yr + hr);
}


function grRectCircle(params) {
    //TODO: передалть в функцию, которая рисует прямоугольний с закругл оглами
    
    params.ctx.fillRect(params.x, params.y, params.w, params.h);
    params.ctx.strokeRect(params.x, params.y, params.w, params.h);
}


function grLine(ctx, x1, y1, x2, y2) {
	
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}

function grTextCentr(ctx, text, x, y, w) {
	var d = ctx.measureText(text);
	ctx.fillText(text, x + (w - d.width)/2, y, w);
}

function grArrow(ctx, x1, y1, x2, y2) {
	
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y1);
	ctx.lineTo(x2, y2);
	
	var hy;
	if (y1 < y2) {
		hy = y2 - 7;
	}
	else {
		hy = y2 + 7;
	}
	
	ctx.lineTo(x2 - 3, hy);
	ctx.moveTo(x2, y2);
	ctx.lineTo(x2 + 3, hy);
	
	ctx.stroke();
	ctx.closePath();
}

function grTriangle(ctx, x1, y1, x2, y2, x3, y3, fill)
{
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x1, y1);
	ctx.stroke();
	if (fill) {
		ctx.fill();
	}
	ctx.closePath();
}
//TODO: приоритеты
function Events() {
	
	console.log('create events-container');
	this.es = {};
}

Events.prototype.on = function(event, data) {
	
	event = ('' + event).toLowerCase();
	var listeners = this.es[event];
	var eventData;
	
	if (listeners) {
	    
		var n = this.es[event].length;
		for (var i=0; i<n; i++) {
			
			eventData = {eventName: event};
			hlprUpdateObj(eventData, data);
			
			listeners[i].f.call(listeners[i].c, eventData);
		}
	}
}

Events.prototype.bind = function(event, callback, context) {
	
	if (! context)
		context = window;
	
	
	if (typeof(callback) == 'function') {
		
		event = ('' + event).toLowerCase().split(/\s+/);
		var n = event.length;
		for (var i=0; i<n; i++) {
			
			if (! this.es[event[i]]){
				this.es[event[i]] = [];
			}
			
			this.es[ event[i] ].push({f:callback, c:context});		
		}
	}	
}

Events.prototype.unbind = function(event, callback) {
	
	event = ('' + event).toLowerCase().split(/\s+/);
	var n = event.length;
	var L;
	
	for (var i=0; i<n; i++) {
			
		L = this.es[event[i]];
		if (L) {
			var m = L.length; 
			for (var j=0; j<m; j++) {
				
				if (L[j].c == callback) {
					L.splice(j, 1);
					break;
				}
			}
		}
	}
}
var Ajax = {};

Ajax.request = function(options) {
	
	options.type  = options.type || 'GET';
	options.async = options.async !== undefined ? options.async : true;
	
	var params = null;
	if (options.data) {
		
		params = '';
		for (var key in options.data) {
			params += '&' + key+'=' + options.data[key];
		}
		
		params = params.substr(1);
	}
	
	
	var xmlHttp = Ajax._getXmlHttpRequest();
	
	if (options.type == 'GET') {
		options.url = options.url + '?' + params;
	}
	
	xmlHttp.open(options.type, options.url, options.async);
	
	if (options.async) {
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					if (options.success) {
						options.success.call(null, xmlHttp.responseText);
					}
				}
				else {
					if (options.error) {
						options.error.call(null, xmlHttp.status)
					}
				}
			}
		}
	}
	
	
	if (options.type == 'GET')
		xmlHttp.send(null);
	else
		xmlHttp.send(params);
	
	return xmlHttp;
}

Ajax._getXmlHttpRequest = function() {
	
	var xmlHttp;
	try {
		xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e) {
		try {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (E) {
			xmlHttp = false;
		}		
	}
	
	if (!xmlHttp && typeof XMLHttpRequest!='undefined') {
		xmlHttp = new XMLHttpRequest();
	}
	
	return xmlHttp;
}

window.Ajax = Ajax;
var JSON = {};

JSON.rvalidchars    = /^[\],:{}\s]*$/;
JSON.rvalidescape   = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
JSON.rvalidtokens   = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
JSON.rvalidbraces   = /(?:^|:|,)(?:\s*\[)+/g;

JSON.parse = function(data) {
	
	if ( typeof data !== "string" || !data ) {
		return null;
	}	
	
	data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	
	if ( window.JSON && window.JSON.parse ) {
		return window.JSON.parse( data );
	}


	if ( JSON.rvalidchars.test( data.replace( JSON.rvalidescape, "@" )
			.replace( JSON.rvalidtokens, "]" )
			.replace( JSON.rvalidbraces, "")) ) {

		return ( new Function( "return " + data ) )();

	}
	
	return null;
}

window.myJSON = JSON;
var Search = {
	
	binSearch : function (x, arr, comparator) {
		var first = 0;
		var last  = arr.length;
		var mid, c;
		
		if (last == 0) {
			return Search._createResult(-1, 0);
		}
		
		if (typeof comparator == 'undefined') {
			comparator = function(a, b){
				if (a<b) return 1;
				if (a>b) return -1;
				return 0;
			}
		}
		
		c = comparator.call(window, x, arr[first]);
		if (c > 0) {
			return Search._createResult(-1, 0);
		}
		else if (c == 0) {
			return Search._createResult(first, first);
		}
		
		c = comparator.call(window, x, arr[last-1]);
		if (c < 0) {
			return Search._createResult(-1, last);
		}
		else if (c == 0) {
			return Search._createResult(last-1, last-1);
		}
		
		while (first < last) {
			mid = Math.floor((first + last) / 2);
			c = comparator.call(window, x, arr[mid]);
			
			if ( c>= 0) {
				last = mid;
			}
			else {
				first = mid+1;
			}	
		}
		
		if (0 == comparator.call(window, x, arr[last])) {
			return Search._createResult(last, last);
		}
		else {
			return Search._createResult(-1, last);
		}
	},
	
	_createResult : function (index, insertIndex) {
		return {
			'index':index,
			'insertIndex':insertIndex
		}
	}
}

window.Search = Search;
var MONTHS = ['Jan', 'Feb', 'Mart', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var DAYS   = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

CellProto = {
	dt   : null,
	scale: null
};

CellProto.getDate = function() {
	return new Date( this.dt.getFullYear(), this.dt.getMonth(), this.dt.getDate() );
}

CellProto.setDate = function(dt) {
	this.dt = new Date( dt.getFullYear(), dt.getMonth(), dt.getDate() );
}

CellProto.setScale = function(scale) {
	this.wsub = null;
	this.w    = null;
	this.scale = scale;
}

CellProto.getWidth = function() {
	   
   //return this.getWSub() * this.getCountSub();
   var n = this.getCountSub();
   var sum = 0;
   
   for (var i=0; i<n; i++) {
	   
	   sum += this.getWSub(i);
   }
   
   return sum;
}

CellProto.getWSub = function(i) {
	var c = this.getDaysInSub(i);
	var w = this.getWDay();
	return c * w;
}

CellProto._daysInMonth = function(y, m) {
	return 32 - new Date( y, m, 32 ).getDate(); 
}

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

function Task(data) {
	
	this.dt1   = data.dt1;
	this.dt2   = data.dt2;
	this.title = data.title;
	
	this.x = null;
	this.y = null;
	
	this.prev = null;
	this.next = null;
}

Task.prototype = function getInfo() {
	return {
		dt1:  this.dt1,
		dt2:  this.dt2,
		name: this.name
	}
}

Task.prototype.getDt1 = function() {
	
	if (typeof this.dt1 == 'string') {
		this.dt1 = new Date(this.dt1);
		this.dt1.setHours(0, 0, 0, 0);
	}
	return this.dt1;
}

Task.prototype.getDt2 = function() {
	
	if (typeof this.dt2 == 'string') {
		this.dt2 = new Date(this.dt2);
		this.dt2.setHours(23, 59, 59, 999);
	}
	return this.dt2;
}

function Project(obj, ctx, mapper) {
	
	this.tasks = [];
	
	for (var i=0; i<obj.tasks.length; ++i) {
		this.tasks.push( new Task(obj.tasks[i]) );
	}
	
	this.name  = obj.name;
	this.id    = obj.id;
	
	this.top  = 0;
}

Project.prototype.getHeight = function() {
	return g_Config.TASK_ALL_HEIGHT * this.tasks.length;
}

Project.prototype.getFirst = function(ctop) {
	return 0;
}
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
function Tasks(id, options, evts, mapper) {
	
	this.evts   = evts;
	
	this.evts.bind('onScrolling', this.onScrolling, this);
	
	this.tc = new TasksCanvas(id, {}, evts, mapper);
	this.projects = null;
	
	this.ctop = 0;
	this.maxCtop = 0;

}


Tasks.prototype.onScrolling = function(data) {
	
	if (Math.abs(data.ver) > 2) {
		
		this.tc.deleteAllTasks();
		this.ctop -= data.ver;
		this.draw();		
	}
	else if (Math.abs(data.hor) > 0) {
		this.tc.redraw();
	}
}


//TODO: функции загрузки должны принимать коллбэк
Tasks.prototype.loadFromServer = function(url, dt1, dt2, projects) {
	
	url = 'test_data.json';
	var f = hlprCreateHandler(function(data){this.loadFromJSON(data);}, this);
	
	//TODO: добавить прелоадер
	Ajax.request({
		url:url,
		data:{dt1: dt1, dt2: dt2, projects: projects},
		success: f
	});
	
}

Tasks.prototype.loadFromJSON = function(json) {
	
	var obj = JSON.parse(json);
	if (! obj) {
		//TODO: генерация ошибки
	}
	
	var pr, top=0; 
	this.prjs = [];
	for (var i=0; i<obj.length; i++) {
		
		pr = new Project(obj[i], this.ctx, this.mapper);
		pr.top = top;
		top += pr.getHeight();
		
		this.prjs.push(pr);
	}
	
	this.maxCtop = top + this.prjs[obj.length-1].getHeight() - (this.tc.H - g_Config.HEAD_HEIGHT);
	
	this.tc.offset = 0;
	this.draw();

}

Tasks.prototype.draw = function() {


	if (this.ctop < 0) {
		this.ctop = 0;
	}
	else if (this.ctop > this.maxCtop) {
		this.ctop = this.maxCtop;
	}
	
	console.log('ctop ' + this.ctop);
	
	var projNum = this._getFirstProj(this.ctop);
	var proj = this.prjs[projNum];
	
	this.tc.offset = proj.top - this.ctop;
	
	console.log('prnum ' + projNum);
	
	var flag = true;
	
	for (var i = projNum; i < this.prjs.length; i++) {
		proj    = this.prjs[i];
		
		//TODO: добавить номер первого таска
		for (var j=0; j<proj.tasks.length; j++) {
			if (! this.tc.addTask(proj.tasks[j])) {
				
				flag = false;
				break;
			}			
		}
		
		if (! flag) {
			break;
		}	
	}
}



Tasks.prototype._getFirstProj = function(ctop) {

	var searchRes = Search.binSearch({top:ctop}, this.prjs, this._comparator);
	if (searchRes.index >= 0) {
		return searchRes.index;
	}
	else {
		return searchRes.insertIndex-1;
	}
	
		
}

Tasks.prototype._comparator = function(proj1, proj2) {
	if (proj1.top < proj2.top)
		return 1;
	
	if (proj1.top > proj2.top)
		return -1;
	
	return 0;
}
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
})();