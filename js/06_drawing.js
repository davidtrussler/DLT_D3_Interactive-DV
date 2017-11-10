var Data = function() {
	this.dataset = [5, 4, 12, 10, 13, 6, 15, 18, 4, 20, 12, 22, 25, 21, 12];
	this.width = 500;
	this.height = 100;
	this.barPadding = 1;
};

Data.prototype.init = function() {
	var _this = this;

	var svg = d3.select('body')
		.append('svg')
		.attr('width', this.width)
		.attr('height', this.height);

	var rects = svg.selectAll('rect')
		.data(this.dataset)
		.enter()
		.append('rect');

	rects
		.attr('class', 'bar')
		.attr('x', function(d, i) {
			return i * (_this.width / _this.dataset.length);
		})
		.attr('y', function(d) {
			return _this.height - (d * 4);
		})
		.attr('width', function(d, i) {
			return _this.width / _this.dataset.length - _this.barPadding;
		})
		.attr('height', function(d) {
			return d * 4;
		});
}
