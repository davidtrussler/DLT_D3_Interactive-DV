var Paths = function() {};

Paths.prototype._rowConverter = function(d) {
	return {
		date: new Date(+d.year, (+d.month - 1)),
		average: parseFloat(d.average)
	};
};

Paths.prototype.drawChart = function(dataUrl, format) {
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
				d3.min(dataset, function(d) {
					if (d.average >= 0) {
						return d.average - 10;
					}
				}),
				d3.max(dataset, function(d) {
					return d.average;
				})
			])
			.range([_this.height - _this.padding, _this.padding]);

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

		if (format === 'line') {
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

			svg.append('path')
				.datum(dataset)
				.attr('class', 'line')
				.attr('d', line);
		} else if (format === 'area') {
			var area = d3.area()
				.defined(function(d) {
					return d.average >= 0;
				})
				.x(function(d) {
					return xScale(d.date);
				})
				.y0(function(d) {
					return yScale.range()[0];
				})
				.y1(function(d) {
					return yScale(d.average);
				});

			var dangerArea = d3.area()
				.defined(function(d) {
					return d.average >= _this.dangerPoint;
				})
				.x(function(d) {
					return xScale(d.date);
				})
				.y0(function(d) {
					return yScale(_this.dangerPoint);
				})
				.y1(function(d) {
					return yScale(d.average);
				});

			svg.append('path')
				.datum(dataset)
				.attr('class', 'area')
				.attr('d', area);

			svg.append('path')
				.datum(dataset)
				.attr('class', 'area__danger')
				.attr('d', dangerArea);
		}

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0, ' + (_this.height - _this.padding) + ')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(' + _this.padding + ', 0)')
			.call(yAxis);

		svg.append('line')
			.attr('x1', _this.padding)
			.attr('x2', _this.width - _this.padding)
			.attr('y1', yScale(_this.dangerPoint))
			.attr('y2', yScale(_this.dangerPoint))
			.attr('class', 'line line__danger');

		svg.append('text')
			.text("safe limit")
			.attr('x', _this.padding + 5)
			.attr('y', yScale(_this.dangerPoint) - 5)
			.attr('class', 'text text__danger');
	});
};

