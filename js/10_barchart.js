var Barchart = function() {};

Barchart.prototype.draw = function() {
	var _this = this;

	this.duration = 500;
	this.ease = d3.easeLinear;
	this.dataset = this._getDataset('initial');
	this.key = function(d) {
		return d.key;
	}

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
		.data(this.dataset, this.key)
		.enter()
		.append('rect')
		.attr('x', function(d, i) {
			return _this.xScale(i);
		})
		.attr('width', _this.xScale.bandwidth)
		.attr('y', function(d) {
			return yScale(d.value);
		})
		.attr('height', function(d) {
			return _this.height - yScale(d.value) - _this.padding;
		})
		.attr('class', 'bar')
		.attr('fill', _this.colour)
		.on('mouseover', function() {
			d3.select(this)
				.transition('hover')
				.duration(_this.duration / 4)
				.ease(_this.ease)
				.attr('fill', _this.colour_hover);
		})
		.on('mouseout', function() {
			d3.select(this)
				.transition('hover')
				.duration(_this.duration)
				.attr('fill', _this.colour);
		});

	svg.selectAll('text')
		.data(this.dataset, this.key)
		.enter()
		.append('text')
		.text(function(d) {
			return d.value;
		})
		.attr('class', 'label')
		.attr('text-anchor', 'middle')
		.attr('x', function(d, i) {
			return _this.xScale(i) + (_this.xScale.bandwidth() / 2);
		})
		.attr('y', function(d) {
			return _this._setPosition(yScale, d.value);
		})
		.attr('class', function(d) {
			return _this._setClass(d);
		});

	d3.select('#sort')
		.on('click', function() {
			_this._sortBars(svg);
		});
}

Barchart.prototype._sortBars = function(svg) {
	var _this = this;

	svg.selectAll('rect')
		.sort(function(a, b) {
			return d3.ascending(a.value, b.value);
		})
		.transition('sort')
		.duration(_this.duration)
		.ease(_this.ease)
		.attr('x', function(d, i) {
			return _this.xScale(i);
		});

	svg.selectAll('text')
		.sort(function(a, b) {
			return d3.ascending(a.value, b.value);
		})
		.transition('sort')
		.duration(_this.duration)
		.ease(_this.ease)
		.attr('x', function(d, i) {
			return _this.xScale(i) + (_this.xScale.bandwidth() / 2);
		});
}

Barchart.prototype._getDataset = function(step) {
	if (step === 'initial') {
		var dataset = [];

		for (var i = 0, max = this.numValues; i < this.numValues; i++) {
			var obj = {key: i, value: Math.floor(Math.random() * this.maxYValue)};

			dataset.push(obj);
		}
	} else if (step === 'increment') {
		var dataset = this.dataset;
		var obj = {key: dataset[dataset.length - 1].key + 1, value: Math.floor(Math.random() * this.maxYValue)};

		dataset.push(obj);
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
	if (d.value < 8) {
		return 'label low';
	} else {
		return 'label';
	}
}
