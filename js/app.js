window.addEventListener('DOMContentLoaded', init);

function init() {
  var width = 600;
  var height = 250;
	var paths = new Paths();
  var dataUrl = 'src/mauna_loa_co2_monthly_averages.csv';

  paths.width = width;
  paths.height = height;
  paths.drawLine(dataUrl);
}
