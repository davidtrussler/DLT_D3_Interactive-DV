window.addEventListener('DOMContentLoaded', init);

function init() {
  var width = 660;
  var height = 310;
  var padding = 30;
	var paths = new Paths();
  var dataUrl = 'src/mauna_loa_co2_monthly_averages.csv';

  paths.width = width;
  paths.height = height;
  paths.padding = padding;
  paths.drawLine(dataUrl);
}
