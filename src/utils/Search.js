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