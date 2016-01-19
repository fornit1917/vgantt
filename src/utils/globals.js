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