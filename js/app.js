window.addEventListener('DOMContentLoaded', init);

function init() {
  var dataset_pie_stack = [
    {apples: 5, oranges: 10, grapes: 22},
    {apples: 10, oranges: 12, grapes: 28},
    {apples: 20, oranges: 19, grapes: 32},
    {apples: 45, oranges: 23, grapes: 35},
    {apples: 6, oranges: 17, grapes: 43},
    {apples: 25, oranges: 13, grapes: 37}
  ];

  var dataset_force = {
    nodes: [
      {name: 'Adam'},
      {name: 'Bob'},
      {name: 'Carrie'},
      {name: 'Donovan'},
      {name: 'Edward'},
      {name: 'Felicity'},
      {name: 'George'},
      {name: 'Hannah'},
      {name: 'Iris'},
      {name: 'Jerry'}
    ],
    edges: [
      {source: 0, target: 1},
      {source: 0, target: 2},
      {source: 0, target: 3},
      {source: 0, target: 4},
      {source: 1, target: 5},
      {source: 2, target: 5},
      {source: 2, target: 5},
      {source: 3, target: 4},
      {source: 5, target: 8},
      {source: 5, target: 9},
      {source: 6, target: 7},
      {source: 7, target: 8},
      {source: 8, target: 9}
    ]
  }

  // var layouts = new Layouts();
  // layouts.dataset = dataset_pie_stack;
  // layouts.dataset = dataset_force;
  // layouts.colour = d3.scaleOrdinal(d3.schemeCategory10);
  // layouts.drawPie('apples');
  // layouts.drawStackBars();
  // layouts.drawForce();

  var geomapping = new Geomapping();
  geomapping.drawMap();
}
