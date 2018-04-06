var Layouts = function() {};

Layouts.prototype.drawStackBars = function() {
	var _this = this;
	var width = 600;
	var height = 300;
	var stack = d3.stack()
		.keys(['apples', 'oranges', 'grapes'])
		.order(d3.stackOrderDescending);
	var series = stack(this.dataset);

	// Create SVG element
	var svg = d3.select('.svg-container')
		.append('svg')
		.attr('width', width)
		.attr('height', height);

	// Set up groups
	var groups = svg.selectAll('g')
		.data(series)
		.enter()
		.append('g')
		.style('fill', function(d, i) {
			return _this.colour(i);
		});

	// Set up scales
	var xScale = d3.scaleBand()
		.domain(d3.range(this.dataset.length))
		.range([0, width])
		.paddingInner(0.05);

	var yScale = d3.scaleLinear()
		.domain([0,
			d3.max(this.dataset, function(d) {
				return d.apples + d.oranges + d.grapes;
			})
		])
		.range([height, 0]);

	// Draw rects
	var rects = groups.selectAll('rect')
		.data(function(d) {
			return d;
		})
		.enter()
		.append('rect')
		.attr('x', function(d, i) {
			return xScale(i);
		})
		.attr('y', function(d) {
			return yScale(d[1]);
		})
		.attr('height', function(d) {
			return yScale(d[0]) - yScale(d[1]);
		})
		.attr('width', xScale.bandwidth());
}

Layouts.prototype.drawPie = function(fruit) {
	var _this = this;
	var width = 300;
	var height = 300;
  var outerRadius = width / 2;
  var innerRadius = width / 3;
	var pie = d3.pie();
	var arc =	d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

	this.data = [];

	this.dataset.forEach(function(datum) {
		_this.data.push(datum[fruit]);
	});

	// Create SVG element
	var svg = d3.select('.svg-container')
		.append('svg')
		.attr('width', width)
		.attr('height', height);

	// Set up groups
	var arcs = svg.selectAll('g.arc')
		.data(pie(this.data))
		.enter()
		.append('g')
		.attr('class', 'arc')
		.attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')');

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
