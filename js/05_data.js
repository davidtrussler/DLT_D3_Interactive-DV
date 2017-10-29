var Data = function() {
	this.dataset = [5, 10, 15, 20, 25]; 	
}; 

Data.prototype.init = function() {
	d3.select('body').selectAll('p')
		.data(this.dataset)
		.enter()
		.append('p')
		.text(
			function(d) {
				return d; 
			}
		)
		.style('color', function(d) {
			if (d > 15) {
				return 'red'; 
			} else {
				return 'blue'; 
			}
		}); 
}
