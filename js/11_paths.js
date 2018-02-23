var Paths = function() {};

Paths.prototype._rowConverter = function(d) {
	return {
		date: new Date(+d.year, (+d.month - 1)),
		average: parseFloat(d.average)
	};
};

Paths.prototype.drawLine = function(dataUrl) {
	var _this = this;

	d3.csv(dataUrl, _this._rowConverter, function(data) {
		var dataset = data;

		var xScale = d3.scaleTime()
			.domain([
				d3.min(dataset, function(d) {
					return d.date;
				}),
				d3.max(dataset, function(d) {
					return d.date;
				})
			])
			.range([0, _this.width]);

		var yScale = d3.scaleLinear()
			.domain([
				0,
				d3.max(dataset, function(d) {
					return d.average;
				})
			])
			.range([_this.height, 0]);

		var line = d3.line()
			.x(function(d) {
				return xScale(d.date);
			})
			.y(function(d) {
				return yScale(d.average);
			});

		var svg = d3.select('.svg-container')
				.append('svg')
				.attr('width', _this.width)
				.attr('height', _this.height);

		svg.append('path')
			. datum(dataset)
			.attr('class', 'line')
			.attr('d', line);
	});
};
