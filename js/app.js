window.addEventListener('DOMContentLoaded', init);

function init() {
  var numValues = 15;
  var maxXValue = 500;
  var maxYValue = 100;
  var width = 600;
  var height = 250;
  var padding = 20;

	var barchart = new Barchart();

  barchart.numValues = numValues;
  barchart.maxXValue = maxXValue;
  barchart.maxYValue = maxYValue;
  barchart.width = width;
  barchart.height = height;
  barchart.padding = padding;

  var scatterplot = new Scatterplot();

  scatterplot.numValues = numValues;
  scatterplot.maxXValue = maxXValue;
  scatterplot.maxYValue = maxYValue;
  scatterplot.width = width;
  scatterplot.height = height;
  scatterplot.padding = padding;

  barchart.draw();
  scatterplot.draw();
}
