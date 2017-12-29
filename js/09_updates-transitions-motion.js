var Data = function() {
	this.numValues = 15;
	this.maxXValue = 500;
	this.maxYValue = 100;
	this.width = 600;
	this.height = 250;
	this.padding = 20;
};

Data.prototype.drawBarchart = function() {
	var _this = this;
	var dataset = this._getDataset('barchart');

	var xScale = d3.scaleBand()
		.domain(d3.range(dataset.length))
		.rangeRound([this.padding, this.width - this.padding])
		.paddingInner(0.05);

	var yScale = d3.scaleLinear()
		.domain([0, this.maxYValue])
		.range([this.height - this.padding, this.padding]);

	var svg = d3.select('body')
		.append('svg')
		.attr('class', 'barchart')
		.attr('width', this.width)
		.attr('height', this.height);

	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', function(d, i) {
			return xScale(i);
		})
		.attr('width', xScale.bandwidth)
		.attr('y', function(d) {
			return yScale(d);
		})
		.attr('height', function(d) {
			return _this.height - yScale(d) - _this.padding;
		})
		.attr('class', 'bar');

	svg.selectAll('text')
		.data(dataset)
		.enter()
		.append('text')
		.text(function(d) {
			return d;
		})
		.attr('class', 'label')
		.attr('text-anchor', 'middle')
		.attr('x', function(d, i) {
			return xScale(i) + (xScale.bandwidth() / 2);
		})
		.attr('y', function(d) {
			return _this._setPosition(yScale, d);
		})
		.attr('class', function(d) {
			return _this._setClass(d);
		})

	d3.select('#update')
		.on('click', function() {
			var duration = 500;
			var ease = d3.easeLinear;
			var dataset = _this._getDataset('barchart');
			var numValues = dataset.length;
			var delay = function(d, i) {
				return i * 20;
			};

			d3.event.preventDefault();

			svg.selectAll('rect')
				.data(dataset)
				.transition()
				.delay(delay)
				.duration(duration)
				.ease(ease)
				.attr('y', function(d) {
					return yScale(d);
				})
				.attr('height', function(d) {
					return _this.height - yScale(d) - _this.padding;
				});

			svg.selectAll('text')
				.data(dataset)
				.transition()
				.delay(delay)
				.duration(duration)
				.ease(ease)
				.text(function(d) {
					return d;
				})
				.attr('x', function(d, i) {
					return xScale(i) + (xScale.bandwidth() / 2);
				})
				.attr('y', function(d) {
					return _this._setPosition(yScale, d);
				})
				.attr('class', function(d) {
					return _this._setClass(d);
				})
		});
}

Data.prototype.drawScatterplot = function() {
	var _this = this;
	var dataset = this._getDataset('scatterplot');

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
			var dataset = _this._getDataset('scatterplot');
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

Data.prototype._getDataset = function(type) {
	var dataset = [];

	if (type === 'barchart') {
		for (var i = 0, max = this.numValues; i < this.numValues; i++) {
			dataset.push(Math.floor(Math.random() * this.maxYValue));
		}
	} else if (type === 'scatterplot') {
		for (var i = 0, max = this.numValues; i < this.numValues; i++) {
			var values = [];

			values[0] = Math.floor(Math.random() * this.maxXValue);
			values[1] = Math.floor(Math.random() * this.maxYValue);

			dataset.push(values);
		}
	}

	return dataset;
}

Data.prototype._setPosition = function(yScale, d) {
	if (d < 8) {
		return pos = yScale(d) - 4;
	} else {
		return pos = yScale(d) + 13;
	}
}

Data.prototype._setClass = function(d) {
	if (d < 8) {
		return 'label low';
	} else {
		return 'label';
	}
}
