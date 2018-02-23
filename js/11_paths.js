var Paths = function() {};

Paths.prototype._rowConverter = function(d) {
	return {
		date: new Date(+d.year, (+d.month - 1)),
		average: parseFloat(d.average)
	};
};

Paths.prototype.drawLine = function(dataUrl) {
	d3.csv(dataUrl, this._rowConverter, function(data) {
		var dataset = data;

		var xScale = d3.scaleTime()
			.domain([
				d3.min(dataset, function(d) {
					return d.date;
				}),
				d3.max(dataset, function(d) {
					return d.date;
				})
			])
			.range([0, this.width]);

		var yScale = d3.scaleLinear()
			.domain([
				0,
				d3.max(dataset, function(d) {
					return d.average;
				})
			])
			.range([this.height, 0]);
	});
};
