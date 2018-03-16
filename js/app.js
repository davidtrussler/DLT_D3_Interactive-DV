window.addEventListener('DOMContentLoaded', init);

function init() {
  var dataset = [5, 10, 20, 45, 6, 25],
      width = 300,
      height = 300;

  var layouts = new Layouts();

  layouts.dataset = dataset
  layouts.width = width;
  layouts.height = height;
  layouts.outerRadius = width / 2;
  layouts.innerRadius = width / 3;
  layouts.colour = d3.scaleOrdinal(d3.schemeCategory10);

  layouts.drawPie();
}
