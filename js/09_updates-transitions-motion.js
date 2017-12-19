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

	var rects = svg.selectAll('rect')
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

	var labels = svg.selectAll('text')
		.data(this.dataset)
		.enter()
		.append('text');

	labels
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
		})

	d3.select('#update')
		.on('click', function() {
			d3.event.preventDefault();
			console.log('update!');
		});
}
