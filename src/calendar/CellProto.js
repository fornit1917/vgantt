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
