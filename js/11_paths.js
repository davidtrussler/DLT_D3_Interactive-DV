var Paths = function() {};

Paths.prototype._rowConverter = function(d) {
	return {
		date: new Date(+d.year, (+d.month - 1)),
		average: parseFloat(d.average)
	};
};

Paths.prototype.loadData = function(dataUrl) {
	d3.csv(dataUrl, this._rowConverter, function(data) {
		var dataset = data;

		console.table(dataset, ['date', 'average']);
	});
};
