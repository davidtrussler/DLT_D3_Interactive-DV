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

	/* Add drag behaviour --
	** replaced by zooming
	var dragging = function(d) {
		var offset = projection.translate();

		offset[0] += d3.event.dx;
		offset[1] += d3.event.dy;

		projection.translate(offset);

		svg.selectAll('path')
			.attr('d', path);

		svg.selectAll('circle')
			.attr('cx', function(d) {
				return projection([d.lon, d.lat])[0];
			})
			.attr('cy', function(d) {
				return projection([d.lon, d.lat])[1];
			});
	}
	*/

	// var drag = d3.drag()
	// 	.on('drag', dragging);

	// var map = svg.append('g')
	// 	.call(drag);

	// Add drag and zoom behaviour
	var zooming = function(d) {
		var offset = [d3.event.transform.x, d3.event.transform.y];
		var newScale = d3.event.transform.k * 2000;

		projection
			.translate(offset)
			.scale(newScale);

		svg.selectAll('path')
			.attr('d', path);

		svg.selectAll('circle')
			.attr('cx', function(d) {
				return projection([d.lon, d.lat])[0];
			})
			.attr('cy', function(d) {
				return projection([d.lon, d.lat])[1];
			});
	}

	var zoom = d3.zoom()
		.on('zoom', zooming);

	var centre = projection([-110.0, 42.0]);

	var map = svg.append('g')
		.call(zoom)
		.call(zoom.transform, d3.zoomIdentity
			.translate(width/2, height/2)
			.scale(0.25)
			.translate(-centre[0], -centre[1]));

	map.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', width)
		.attr('height', height)
		.attr('opacity', 0);

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

	// Set up zooming controls
	var createZoomControls = function() {
		var i = 0;
		var directions = [
			{
				name: 'out',
				text: '&ndash;'
			},
			{
				name: 'in',
				text: '+'
			}
		];

		directions.forEach(function(direction) {
			var controlSize = 30;
			var controlOffset = 70;
			var controlMargin = 10;
			var control = svg.append('g')
				.attr('class', 'zoom_control')
				.attr('id', direction.name)
				.attr('transform', 'translate(' + (width - controlOffset - controlSize*i - controlMargin*i) + ',' + (height - controlOffset) + ')');

			control.append('rect')
				.attr('class', 'zoom_control__bg')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', controlSize)
				.attr('height', controlSize);

			control.append('text')
				.attr('class', 'zoom_control__text')
				.attr('x', controlSize/2 - 4)
				.attr('y', controlSize/2 + 4)
				.html(direction.text);

			i++;
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

			map.selectAll('path')
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

				map.selectAll('circle')
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
						var x = 0,
								y = 0,
								direction = d3.select(this).attr('id');

						switch (direction) {
							case 'north':
								y += panAmount;
								break;
							case 'south':
								y -= panAmount;
								break;
							case 'west':
								x += panAmount;
								break;
							case 'east':
								x -= panAmount;
								break;
						}

						//This triggers a zoom event, translating by x, y
						map.transition()
							.call(zoom.translateBy, x, y);
					});

				// Load and set up pan controls
				createZoomControls();

				d3.selectAll('.zoom_control')
					.on('click', function() {
						var scaleFactor,
								direction = d3.select(this).attr('id');

						switch (direction) {
							case 'in':
								scaleFactor = 1.5;
								break;
							case 'out':
								scaleFactor = 0.75;
								break;
							default:
								break;
						}

						//This triggers a zoom event, translating by scaleFactor
						map.transition()
							.call(zoom.scaleBy, scaleFactor);
					});
			});
		});
	});
}
