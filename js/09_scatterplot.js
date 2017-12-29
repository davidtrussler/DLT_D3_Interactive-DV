var Scatterplot = function() {};

Scatterplot.prototype.draw = function() {
	var _this = this;
	var dataset = this._getDataset();

	var xScale = d3.scaleLinear()
		.domain([0, this.maxXValue])
		.range([this.padding, this.width - this.padding]);

	var yScale = d3.scaleLinear()
		.domain([0, this.maxYValue])
		.range([this.height - this.padding, this.padding]);

	var aScale = d3.scaleSqrt()
		.domain([0, this.maxYValue])
		.range([0, 6]);

	var svg = d3.select('body')
		.append('svg')
		.attr('class', 'scatterplot')
		.attr('width', this.width)
		.attr('height', this.height);

	var circles = svg.selectAll('circle')
		.data(dataset)
		.enter()
		.append('circle');

	var xAxis = d3.axisBottom()
		.scale(xScale)
		.tickValues([0, 100, 200, 300, 400]);

	var yAxis = d3.axisLeft()
		.scale(yScale)
		.tickValues([0, 40, 80]);

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

	svg.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(0, ' + (this.height - this.padding) + ')')
		.call(xAxis);

	svg.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(' + (this.padding) + ')')
		.call(yAxis);

	d3.select('#update')
		.on('click', function() {
			var duration = 500;
			var ease = d3.easeLinear;
			var dataset = _this._getDataset();
			var numValues = dataset.length;

			d3.event.preventDefault();

			svg.selectAll('circle')
				.data(dataset)
				.transition()
				.duration(duration)
				.ease(ease)
				.attr('cx', function(d) {
					return xScale(d[0]);
				})
				.attr('cy', function(d) {
					return yScale(d[1]);
				})
				.attr('r', function(d) {
					return aScale(d[1]);
				});
		});
}

Scatterplot.prototype._getDataset = function() {
	var dataset = [];

	for (var i = 0, max = this.numValues; i < this.numValues; i++) {
		var values = [];

		values[0] = Math.floor(Math.random() * this.maxXValue);
		values[1] = Math.floor(Math.random() * this.maxYValue);

		dataset.push(values);
	}

	return dataset;
}

Scatterplot.prototype._setPosition = function(yScale, d) {
	if (d < 8) {
		return pos = yScale(d) - 4;
	} else {
		return pos = yScale(d) + 13;
	}
}

Scatterplot.prototype._setClass = function(d) {
	if (d < 8) {
		return 'label low';
	} else {
		return 'label';
	}
}
