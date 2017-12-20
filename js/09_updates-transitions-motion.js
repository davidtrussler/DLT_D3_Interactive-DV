var Data = function() {
	this.numValues = 15;
	this.maxValue = 100;
	this.width = 600;
	this.height = 250;
	this.padding = 20;
};

Data.prototype.drawBarchart = function() {
	var _this = this;
	var dataset = this._getDataset();

	var xScale = d3.scaleBand()
		.domain(d3.range(dataset.length))
		.rangeRound([this.padding, this.width - this.padding])
		.paddingInner(0.05);

	var yScale = d3.scaleLinear()
		.domain([0, this.maxValue])
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
			var dataset = _this._getDataset();
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

Data.prototype._getDataset = function() {
	var dataset = [];

	for (var i = 0, max = this.numValues; i < this.numValues; i++) {
		dataset.push(Math.floor(Math.random() * this.maxValue));
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
