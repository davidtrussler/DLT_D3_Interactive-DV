var Geomapping = function() {};

Geomapping.prototype.drawMap = function() {
	var width = 600,
			height = 300,
			panHeight = 30,
			panAmount = 50;

	// Define a projection
	var projection = d3.geoAlbersUsa()
		.translate([width / 2, height / 2])
		.scale([2000]);

	// Define path generator
	var path = d3.geoPath()
		.projection(projection);

	// Create SVG element
	var svg = d3.select('.svg-container')
		.append('svg')
		.attr('width', width)
		.attr('height', height);

	// Set up colour scale
	var colourScale = d3.scaleQuantize()
		.range([
			'rgb(237, 248, 233)',
			'rgb(186, 228, 179)',
			'rgb(116, 196, 118)',
			'rgb(49, 163, 84)',
			'rgb(0, 109, 44)'
		]);

	// Set up population scale
	var populationScale = d3.scaleLinear()
		.range([25, 400]);

	// Number formatting for population values
	var formatAsThousands = d3.format(",");

	// Set up panning controls
	var createPanControls = function() {
		var directions = [
			{
				name: 'north',
				x_bg: 0,
				y_bg: 0,
				width: width,
				height: panHeight,
				x_arr: width / 2,
				y_arr: panHeight * (2/3),
				text: '&uarr;'
			},
			{
				name: 'south',
				x_bg: 0,
				y_bg: height - panHeight,
				width: width,
				height: panHeight,
				x_arr: width / 2,
				y_arr: height - (panHeight * (1/3)),
				text: '&darr;'
			},
			{
				name: 'west',
				x_bg: 0,
				y_bg: panHeight,
				width: panHeight,
				height: height - (panHeight * 2),
				x_arr: panHeight * (1/3),
				y_arr: height / 2,
				text: '&larr;'
			},
			{
				name: 'east',
				x_bg: width - panHeight,
				y_bg: panHeight,
				width: panHeight,
				height: height - (panHeight * 2),
				x_arr: width - (panHeight * (2/3)),
				y_arr: height / 2,
				text: '&rarr;'
			}
		];

		directions.forEach(function(direction) {
			var control = svg.append('g')
				.attr('class', 'pan_control')
				.attr('id', direction.name);

			control.append('rect')
				.attr('class', 'pan_control__bg')
				.attr('x', direction.x_bg)
				.attr('y', direction.y_bg)
				.attr('width', direction.width)
				.attr('height', direction.height);

			control.append('text')
				.attr('class', 'pan_control__arrow')
				.attr('x', direction.x_arr)
				.attr('y', direction.y_arr)
				.html(direction.text);
		});
	}

	// Load production data and set the colour domain values
	d3.csv('src/us-ag-productivity.csv', function(data) {
		colourScale.domain([
			d3.min(data, function(d) {
				return d.value;
			}),
			d3.max(data, function(d) {
				return d.value;
			})
		]);

		// Load GeoJSON data
		d3.json('src/us-states.json', function(json) {
			// Merge agricultural data with states
			for (var i = 0; i < data.length; i++) {
				var dataState = data[i].state;
				var dataValue = parseFloat(data[i].value);

				for (var j = 0; j < json.features.length; j++) {
					var jsonState = json.features[j].properties.name;

					if (jsonState === dataState) {
						json.features[j].properties.value = dataValue;
						break;
					}
				}
			}

			svg.selectAll('path')
				.data(json.features)
				.enter()
				.append('path')
				.attr('d', path)
				.style('fill', function(d) {
					var value = d.properties.value || null;

					if (value) {
						return colourScale(value);
					} else {
						return '#ccc';
					}
				});

			// Load and display cities data
			d3.csv('src/us-cities.csv', function(data) {
				populationScale.domain([
						d3.min(data, function(d) {
							return parseInt(d.population);
						}),
						d3.max(data, function(d) {
							return parseInt(d.population);
						})
					]);

				svg.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.attr('cx', function(d) {
						return projection([d.lon, d.lat])[0];
					})
					.attr('cy', function(d) {
						return projection([d.lon, d.lat])[1];
					})
					.attr('r', function(d) {
						return Math.sqrt(populationScale(d.population));
					})
					.attr('class', 'place')
					.append('title')
					.text(function(d) {
						return d.place + ', population: ' + formatAsThousands(d.population);
					});

				// Load and set up pan controls
				createPanControls();

				d3.selectAll('.pan_control')
					.on('click', function() {
						var offset = projection.translate(),
								direction = d3.select(this).attr('id');

						switch (direction) {
							case 'north':
								offset[1] += panAmount;
								break;
							case 'south':
								offset[1] -= panAmount;
								break;
							case 'west':
								offset[0] += panAmount;
								break;
							case 'east':
								offset[0] -= panAmount;
								break;
						}

						projection.translate(offset);

						svg.selectAll('path')
							.transition()
							.attr('d', path);

						svg.selectAll('circle')
							.transition()
							.attr('cx', function(d) {
								return projection([d.lon, d.lat])[0];
							})
							.attr('cy', function(d) {
								return projection([d.lon, d.lat])[1];
							});
					});
			});
		});
	});

// 	var _this = this;

// 	// Initialise a Force Layout
// 	var force = d3.forceSimulation(this.dataset.nodes)
// 		.force('charge', d3.forceManyBody())
// 		.force('link', d3.forceLink(this.dataset.edges))
// 		.force('centre', d3.forceCenter().x(width/2).y(height/2));

// 	// Create visual elements: edges
// 	var edges = svg.selectAll('line')
// 		.data(this.dataset.edges)
// 		.enter()
// 		.append('line')
// 		.style('stroke', '#ccc')
// 		.style('stroke-width', 1);

// 	// Create visual elements: nodes
// 	var nodes = svg.selectAll('circle')
// 		.data(this.dataset.nodes)
// 		.enter()
// 		.append('circle')
// 		.attr('r', 10)
// 		.style('fill', function(d, i) {
// 			return _this.colourScale(i);
// 		})
// 		.call(d3.drag()
// 			.on('start', dragStarted)
// 			.on('drag', dragging)
// 			.on('end', dragEnded));

// 	// Define drag event methods
// 	function dragStarted(d) {
// 		if (!d3.event.active) {
// 			force.alphaTarget(0.3).restart();
// 			d.fx = d.x;
// 			d.fy = d.y;
// 		}
// 	}

// 	function dragging(d) {
// 		d.fx = d3.event.x;
// 		d.fy = d3.event.y;
// 	}

// 	function dragEnded(d) {
// 		if (!d3.event.active) {
// 			force.alphaTarget(0);
// 		}

// 		d.fx = null;
// 		d.fy = null;
// 	}

// 	// Create visual elements: tooltip
// 	nodes.append('title')
// 		.text(function(d) {
// 			return d.name;
// 		});

// 	// Called on simulation tick
// 	force.on('tick', function() {
// 		edges
// 			.attr('x1', function(d) {
// 				return d.source.x;
// 			})
// 			.attr('y1', function(d) {
// 				return d.source.y;
// 			})
// 			.attr('x2', function(d) {
// 				return d.target.x;
// 			})
// 			.attr('y2', function(d) {
// 				return d.target.y;
// 			});
// 		nodes
// 			.attr('cx', function(d) {
// 				return d.x;
// 			})
// 			.attr('cy', function(d) {
// 				return d.y;
// 			});
// 	});
// }

// Layouts.prototype.drawStackBars = function() {
// 	var _this = this;
// 	var width = 600;
// 	var height = 300;
// 	var stack = d3.stack()
// 		.keys(['apples', 'oranges', 'grapes'])
// 		.order(d3.stackOrderDescending);
// 	var series = stack(this.dataset);

// 	// Create SVG element
// 	var svg = d3.select('.svg-container')
// 		.append('svg')
// 		.attr('width', width)
// 		.attr('height', height);

// 	// Set up groups
// 	var groups = svg.selectAll('g')
// 		.data(series)
// 		.enter()
// 		.append('g')
// 		.style('fill', function(d, i) {
// 			return _this.colour(i);
// 		});

// 	// Set up scales
// 	var xScale = d3.scaleBand()
// 		.domain(d3.range(this.dataset.length))
// 		.range([0, width])
// 		.paddingInner(0.05);

// 	var yScale = d3.scaleLinear()
// 		.domain([0,
// 			d3.max(this.dataset, function(d) {
// 				return d.apples + d.oranges + d.grapes;
// 			})
// 		])
// 		.range([height, 0]);

// 	// Draw rects
// 	var rects = groups.selectAll('rect')
// 		.data(function(d) {
// 			return d;
// 		})
// 		.enter()
// 		.append('rect')
// 		.attr('x', function(d, i) {
// 			return xScale(i);
// 		})
// 		.attr('y', function(d) {
// 			return yScale(d[1]);
// 		})
// 		.attr('height', function(d) {
// 			return yScale(d[0]) - yScale(d[1]);
// 		})
// 		.attr('width', xScale.bandwidth());
// }

// Layouts.prototype.drawPie = function(fruit) {
// 	var _this = this;
// 	var width = 300;
// 	var height = 300;
//   var outerRadius = width / 2;
//   var innerRadius = width / 3;
// 	var pie = d3.pie();
// 	var arc =	d3.arc()
// 		.innerRadius(innerRadius)
// 		.outerRadius(outerRadius);

// 	this.data = [];

// 	this.dataset.forEach(function(datum) {
// 		_this.data.push(datum[fruit]);
// 	});

// 	// Create SVG element
// 	var svg = d3.select('.svg-container')
// 		.append('svg')
// 		.attr('width', width)
// 		.attr('height', height);

// 	// Set up groups
// 	var arcs = svg.selectAll('g.arc')
// 		.data(pie(this.data))
// 		.enter()
// 		.append('g')
// 		.attr('class', 'arc')
// 		.attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')');

// 	// Draw arc paths
// 	arcs.append('path')
// 		.attr('fill', function(d, i) {
// 			return _this.colour(i);
// 		})
// 		.attr('d', arc);

// 	// Add labels
// 	arcs.append('text')
// 		.attr('transform', function(d) {
// 			return 'translate(' + arc.centroid(d) + ')';
// 		})
// 		.attr('text-anchor', 'middle')
// 		.attr('class', 'label')
// 		.text(function(d) {
// 			return d.value;
// 		});
}
