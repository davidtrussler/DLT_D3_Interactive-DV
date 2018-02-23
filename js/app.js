window.addEventListener('DOMContentLoaded', init);

function init() {
  var dataUrl = 'src/mauna_loa_co2_monthly_averages.csv';
	var paths = new Paths();

  paths.loadData(dataUrl);

  console.log(paths);
}
