var Data = function() {
	this.dataset = [
		[15, 20], [350, 16], [240, 48], [456, 40], [79, 52], [230, 24], [310, 60], [45, 72], [420, 16], [380, 80], [145, 48], [74, 88], [430, 95], [235, 84], [345, 48]
	];
	this.width = 540;
	this.height = 140;
	this.padding = 20;
};

Data.prototype.drawScales = function() {
	var xScale = d3.scaleLinear()
		.domain([
			0,
			d3.max(this.dataset, function(d) {
				return d[0];
			})
		])
		.range([this.padding, this.width - this.padding]);

	var yScale = d3.scaleLinear()
		.domain([
			0,
			d3.max(this.dataset, function(d) {
				return d[1];
			})
		])
		.range([this.height - this.padding, this.padding]);

	var aScale = d3.scaleSqrt()
		.domain([
			0,
			d3.max(this.dataset, function(d) {
				return d[1];
			})
		])
		.range([0, 6]);

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
			return xScale(d[0]);
		})
		.attr('cy', function(d) {
			return yScale(d[1]);
		})
		.attr('r', function(d) {
			return aScale(d[1]);
		});

	labels
		.text(function(d) {
			return d[0] + ', ' + d[1];
		})
		.attr('class', 'label')
		.attr('text-anchor', 'middle')
		.attr('x', function(d) {
			return xScale(d[0]);
		})
		.attr('y', function(d) {
			return yScale(d[1] + 8);
		});
}
