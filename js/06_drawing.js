var Data = function() {
	this.dataset = [
		[15, 20], [350, 16], [240, 48], [456, 40], [79, 52], [230, 24], [310, 60], [45, 72], [420, 16], [380, 80], [145, 48], [74, 88], [430, 95], [235, 84], [345, 48]
	];
	this.width = 500;
	this.height = 100;
	this.barPadding = 1;
};

Data.prototype.drawBarchart = function() {
	var _this = this;

	var svg = d3.select('body')
		.append('svg')
		.attr('class', 'barchart')
		.attr('width', this.width)
		.attr('height', this.height);

	var rects = svg.selectAll('rect')
		.data(this.dataset)
		.enter()
		.append('rect');

	var labels = svg.selectAll('text')
		.data(this.dataset)
		.enter()
		.append('text');

	rects
		.attr('class', 'bar')
		.attr('x', function(d, i) {
			return i * (_this.width / _this.dataset.length);
		})
		.attr('y', function(d) {
			return _this.height - d[1];
		})
		.attr('width', function(d, i) {
			return _this.width / _this.dataset.length - _this.barPadding;
		})
		.attr('height', function(d) {
			return d[1];
		});

	labels
		.text(function(d) {
			return d[1];
		})
		.attr('class', 'label')
		.attr('text-anchor', 'middle')
		.attr('x', function(d, i) {
			return i * (_this.width / _this.dataset.length) + (_this.width / _this.dataset.length - _this.barPadding) / 2;
		})
		.attr('y', function(d) {
			return _this.height - d[1] + 12;
		});
}

Data.prototype.drawScattershot = function() {
	var _this = this;

	var svg = d3.select('body')
		.append('svg')
		.attr('class', 'scattershot')
		.attr('width', this.width)
		.attr('height', this.height);

	var circles = svg.selectAll('circle')
		.data(this.dataset)
		.enter()
		.append('circle');

	var labels = svg.selectAll('text')
		.data(this.dataset)
		.enter()
		.append('text');

	circles
		.attr('class', 'circle')
		.attr('cx', function(d) {
			return d[0];
		})
		.attr('cy', function(d) {
			return d[1];
		})
		.attr('r', 5); 

	labels
		.text(function(d) {
			return d[0] + ', ' + d[1];
		})
		.attr('class', 'label')
		.attr('text-anchor', 'middle')
		.attr('x', function(d) {
			return d[0];
		})
		.attr('y', function(d) {
			return d[1] - 8;
		});
}
