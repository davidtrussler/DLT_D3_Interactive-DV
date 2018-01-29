var Barchart = function() {};

Barchart.prototype.draw = function() {
	var _this = this;

	this.duration = 500;
	this.ease = d3.easeLinear;
	this.dataset = this._getDataset('initial');

	this.xScale = d3.scaleBand()
		.domain(d3.range(this.dataset.length))
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
		.data(this.dataset)
		.enter()
		.append('rect')
		.attr('x', function(d, i) {
			return _this.xScale(i);
		})
		.attr('width', _this.xScale.bandwidth)
		.attr('y', function(d) {
			return yScale(d);
		})
		.attr('height', function(d) {
			return _this.height - yScale(d) - _this.padding;
		})
		.attr('class', 'bar');

	svg.selectAll('text')
		.data(this.dataset)
		.enter()
		.append('text')
		.text(function(d) {
			return d;
		})
		.attr('class', 'label')
		.attr('text-anchor', 'middle')
		.attr('x', function(d, i) {
			return _this.xScale(i) + (_this.xScale.bandwidth() / 2);
		})
		.attr('y', function(d) {
			return _this._setPosition(yScale, d);
		})
		.attr('class', function(d) {
			return _this._setClass(d);
		})

	d3.select('#add')
		.on('click', function() {
			d3.event.preventDefault();

			_this.dataset = _this._getDataset('increment');

			var numValues = _this.dataset.length;

			// Update xScale
			_this.xScale.domain(d3.range(_this.dataset.length));

			var bars = svg.selectAll('rect')
				.data(_this.dataset);

			bars.enter()
				.append('rect')
				.attr('x', _this.width)
				.attr('width', _this.xScale.bandwidth())
				.attr('y', function(d) {
					return yScale(d);
				})
				.attr('height', function(d) {
					return _this.height - yScale(d) - _this.padding;
				})
				.merge(bars)
				.transition()
				.duration(_this.duration)
				.ease(_this.ease)
				.attr('x', function(d, i) {
					return _this.xScale(i);
				})
				.attr('width', _this.xScale.bandwidth())
				.attr('class', 'bar');

			var labels = svg.selectAll('text')
				.data(_this.dataset);

			labels.enter()
				.append('text')
				.text(function(d) {
					return d;
				})
				.attr('text-anchor', 'middle')
				.attr('x', _this.width + (_this.xScale.bandwidth() / 2))
				.attr('y', function(d) {
					return _this._setPosition(yScale, d);
				})
				.merge(labels)
				.transition()
				.duration(_this.duration)
				.ease(_this.ease)
				.attr('x', function(d, i) {
					return _this.xScale(i) + (_this.xScale.bandwidth() / 2);
				})
				.attr('class', function(d) {
					return _this._setClass(d);
				});
		});

	d3.select('#remove')
		.on('click', function() {
			d3.event.preventDefault();

			// Remove one value from dataset
			_this.dataset.pop();

			// Update xScale domain
			_this.xScale.domain(d3.range(_this.dataset.length));

			// Select …
			var bars = svg.selectAll('rect')
				.data(_this.dataset);
			var labels = svg.selectAll('text')
				.data(_this.dataset);

			// Bars enter …
			bars.enter()
				.merge(bars)
				.transition()
				.duration(_this.duration)
				.ease(_this.ease)
				.attr('x', function(d, i) {
					return _this.xScale(i);
				})
				.attr('width', _this.xScale.bandwidth());

			// Bars exit …
			bars.exit()
				.transition()
				.duration(_this.duration)
				.ease(_this.ease)
				.attr("x", _this.width)
				.remove();

			// Labels enter …
			labels.enter()
				.append('text')
				.merge(labels)
				.transition()
				.duration(_this.duration)
				.ease(_this.ease)
				.attr('x', function(d, i) {
					return _this.xScale(i) + (_this.xScale.bandwidth() / 2);
				})

			// Bars exit …
			labels.exit()
				.transition()
				.duration(_this.duration)
				.ease(_this.ease)
				.attr("x", _this.width + (_this.xScale.bandwidth() / 2))
				.remove();
		});
}

Barchart.prototype._getDataset = function(step) {
	if (step === 'initial') {
		var dataset = [];

		for (var i = 0, max = this.numValues; i < this.numValues; i++) {
			dataset.push(Math.floor(Math.random() * this.maxYValue));
		}
	} else if (step === 'increment') {
		var dataset = this.dataset;

		dataset.push(Math.floor(Math.random() * this.maxYValue));
	}

	return dataset;
}

Barchart.prototype._setPosition = function(yScale, d) {
	if (d < 8) {
		return pos = yScale(d) - 4;
	} else {
		return pos = yScale(d) + 13;
	}
}

Barchart.prototype._setClass = function(d) {
	if (d < 8) {
		return 'label low';
	} else {
		return 'label';
	}
}
