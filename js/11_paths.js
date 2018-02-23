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
		var formatTime = d3.timeFormat("%Y");

		var xScale = d3.scaleTime()
			.domain([
				d3.min(dataset, function(d) {
					return d.date;
				}),
				d3.max(dataset, function(d) {
					return d.date;
				})
			])
			.range([_this.padding, _this.width - _this.padding]);

		var yScale = d3.scaleLinear()
			.domain([
				0,
				d3.max(dataset, function(d) {
					return d.average;
				})
			])
			.range([_this.height - _this.padding, _this.padding]);

		var line = d3.line()
			.defined(function(d) {
				return d.average >= 0;
			})
			.x(function(d) {
				return xScale(d.date);
			})
			.y(function(d) {
				return yScale(d.average);
			});

		var xAxis = d3.axisBottom()
			.scale(xScale)
			.ticks(10)
			.tickFormat(formatTime);

		var yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(10);

		var svg = d3.select('.svg-container')
			.append('svg')
			.attr('width', _this.width)
			.attr('height', _this.height);

		svg.append('path')
			.datum(dataset)
			.attr('class', 'line')
			.attr('d', line);

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0, ' + (_this.height - _this.padding) + ')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(' + _this.padding + ', 0)')
			.call(yAxis);
	});
};
