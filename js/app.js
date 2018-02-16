window.addEventListener('DOMContentLoaded', init);

function init() {
  var numValues = 15;
  var maxXValue = 500;
  var maxYValue = 100;
  var width = 600;
  var height = 250;
  var padding = 20;
  var colour = 'teal';
  var colour_hover = 'orange';

	var barchart = new Barchart();

  barchart.numValues = numValues;
  barchart.maxXValue = maxXValue;
  barchart.maxYValue = maxYValue;
  barchart.width = width;
  barchart.height = height;
  barchart.padding = padding;
  barchart.colour = colour;
  barchart.colour_hover = colour_hover;

  barchart.draw();
}
