var Data = function() {
	this.dataset = [20, 16, 48, 40, 52, 24, 60, 72, 16, 80, 48, 88, 95, 84, 48];
	this.width = 600;
	this.height = 250;
	this.padding = 20;
};

Data.prototype.drawBarchart = function() {
	var _this = this;

	var xScale = d3.scaleBand()
		.domain(d3.range(this.dataset.length))
		.rangeRound([this.padding, this.width - this.padding])
		.paddingInner(0.05);

	var yScale = d3.scaleLinear()
		.domain([
			0,
			d3.max(this.dataset, function(d) {
				return d;
			})
		])
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
		.data(this.dataset)
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
			return yScale(d) + 13;
		});

	d3.select('#update')
		.on('click', function() {
			var duration = 500;
			var ease = d3.easeLinear;
			var newDataset = [];
			var numValues = _this.dataset.length;
			var delay = function(d, i) {
				return i * 20;
			};

			d3.event.preventDefault();

			for (var i = 0, max = numValues; i < numValues; i++) {
				newDataset.push(Math.floor(Math.random() * 100));
			}

			svg.selectAll('rect')
				.data(newDataset)
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
				.data(newDataset)
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
					if (d < 8) {
						return yScale(d) - 4;
					} else {
						return yScale(d) + 13;
					}
				})
				.attr('class', function(d) {
					if (d < 8) {
						return 'label low';
					} else {
						return 'label';
					}
				})
		});
}
