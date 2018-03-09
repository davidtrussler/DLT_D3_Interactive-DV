window.addEventListener('DOMContentLoaded', init);

function init() {
  var width = 660;
  var height = 310;
  var padding = 30;
	var paths = new Paths();
  var dataUrl = 'src/mauna_loa_co2_monthly_averages.csv';
  var dangerPoint = 350;

  paths.width = width;
  paths.height = height;
  paths.padding = padding;
  paths.dangerPoint = dangerPoint;
  paths.drawChart(dataUrl, 'line');
  paths.drawChart(dataUrl, 'area');
}
