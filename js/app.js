window.addEventListener('DOMContentLoaded', init);

function init() {
  var dataset = [
    {apples: 5, oranges: 10, grapes: 22},
    {apples: 10, oranges: 12, grapes: 28},
    {apples: 20, oranges: 19, grapes: 32},
    {apples: 45, oranges: 23, grapes: 35},
    {apples: 6, oranges: 17, grapes: 43},
    {apples: 25, oranges: 13, grapes: 37}
  ];

  var layouts = new Layouts();

  layouts.dataset = dataset
  layouts.colour = d3.scaleOrdinal(d3.schemeCategory10);

  layouts.drawPie('apples');
  layouts.drawStackBars();
}
