var Layouts = function() {};

Layouts.prototype.drawPie = function() {
	var _this = this;
	var pie = d3.pie();
	var arc =	d3.arc()
		.innerRadius(this.innerRadius)
		.outerRadius(this.outerRadius);

	// Create SVG element
	var svg = d3.select('.svg-container')
		.append('svg')
		.attr('width', this.width)
		.attr('height', this.height);

	// Set up groups
	var arcs = svg.selectAll('g.arc')
		.data(pie(this.dataset))
		.enter()
		.append('g')
		.attr('class', 'arc')
		.attr('transform', 'translate(' + this.outerRadius + ', ' + this.outerRadius + ')');

	// Draw arc paths
	arcs.append('path')
		.attr('fill', function(d, i) {
			return _this.colour(i);
		})
		.attr('d', arc);

	// Add labels
	arcs.append('text')
		.attr('transform', function(d) {
			return 'translate(' + arc.centroid(d) + ')';
		})
		.attr('text-anchor', 'middle')
		.attr('class', 'label')
		.text(function(d) {
			return d.value;
		});
}
