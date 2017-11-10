var Data = function() {
	this.dataset = [5, 10, 15, 20, 25];
};

Data.prototype.init = function() {
	d3.select('body').selectAll('div')
		.data(this.dataset)
		.enter()
		.append('div')
		.attr('class', 'bar')
		.style('height', function(d) {
			var barHeight = d * 5;
			return barHeight + 'px';
		});
}
