var dataFrequency = [{
  "value": 68299,
  "date": "2016-11-08 12"
}, {
  "value": 91164,
  "date": "2016-11-08 13"
}, {
  "value": 112072,
  "date": "2016-11-08 14"
}, {
  "value": 119673,
  "date": "2016-11-08 15"
}, {
  "value": 154684,
  "date": "2016-11-08 16"
}, {
  "value": 172786,
  "date": "2016-11-08 18"
}, {
  "value": 172803,
  "date": "2016-11-08 19"
}, {
  "value": 172797,
  "date": "2016-11-08 20"
}, {
  "value": 172800,
  "date": "2016-11-08 21"
}, {
  "value": 172790,
  "date": "2016-11-08 22"
}, {
  "value": 172802,
  "date": "2016-11-08 23"
}, {
  "value": 96186,
  "date": "2016-11-08 24"
}];

var datosValue = dataFrequency.map(function(d) {
  return parseInt(d.value);
});

var dateFilter = d3.set(dataFrequency.map(function(d) {
  return d.date;
})).values();


var resizes = 0;

//datos tratados para obtener mayores y menores
//menor y mayor valor
var dataC = datosValue;
var max = d3.max(dataC);
var maxset = [max]
var maxmax = d3.max(maxset);
var min = d3.min(dataC);
var minset = [min]
var minmin = d3.min(minset);

//mayor y menor fecha
var maxDate = d3.max(dateFilter);
var maxsetDate = [maxDate];
var maxmaxDate = d3.max(maxsetDate);
var minDate = d3.min(dateFilter);
var minsetDate = [minDate];
var minminDate = d3.min(minsetDate);

//al cargar la pagina
d3.select(window).on("load", inicioCardinal());

function inicioCardinal() {
  var dataFrequency1 = dataFrequency;
  var parseDate = d3.time.format("%Y-%d-%m %H").parse;
  var spacer = -(maxmax - minmin) * 0.05; // para que el valor inferior no pegue con el eje x. Es un porcentaje de la altura total del rango.

  var padding = 60;
  var width = $("#frequency").width();
  var gheight = 300;

  var height = gheight + padding;

  var x = d3.time.scale()
    .domain([parseDate(minminDate), parseDate(maxmaxDate)])
    .range([padding, width - padding]);
  var y = d3.scale.linear()
    .domain([minmin + spacer, maxmax])
    .range([height - padding, padding]); //Los rangos no eran dependientes de las variables width y height, así que los hice dependientes para que sea responsiva y agregué la variable padding para que podamos trasladar toda la gráfica con eso y darle márgenes.

  var line = d3.svg.line()
    .x(function(d, i) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.value);
    });

    //Variable que nos ayuda a decidir el numero de ticks segun el tamaño de la pantalla
		var ticksX = 0;
    if(width<350) {
        ticksX=3;
		}else
		if(width>=350 && width<500) {
        ticksX=6;
    }else
    if(width>=500) {
        ticksX=10;
    }

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(ticksX);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5); //Las dos variables anteriores generan los ejes por medio de la función d3.svg.axis. Al pasar un número en "ticks" D3 automágicamente determina un número cercano de divisiones al eje para que no queden decimales y sea legible (en este caso, aunque el número de ticks sea 4 en el eje y, pone 6 para ir de 20 en 20)

  var canvas = d3.select("#frequency")
    .append("svg")
    .attr("width", width)
    .attr("viewbox", "0 0 200 200")
    .classed("resizeable", true)
    .attr("height", height);

  //se crea una variable para no contaminar nuestra data principal
  var NewDatos = dataFrequency1;
  if(resizes==0){
  NewDatos.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });}

  var path = canvas.append("path")
    .attr("d", line(NewDatos))
    .attr("stroke", "steelblue")
    .attr("stroke-width", "2")
    .attr("fill", "none");

  var length = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", length + " " + length)
    .attr("stroke-dashoffset", length)
    .transition()
    .duration(0)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

  //funcion de coloreo
  var area = d3.svg.area()
    .x(function(d) {
      return x(d.date);
    })
    .y0(gheight)
    .y1(function(d) {
      return y(d.value);
    });

  //coloreado
  var coloreado = canvas.append("path")
    .datum(NewDatos)
    .attr("d", area)
    .attr("opacity", "0.1")
    .attr("fill", "blue");

  canvas.append("g") //agrega el eje x (en realidad eso es al final con el call, pero ya sabes que D3 es todo al revés)
    .attr("class", "axis") //imputa la clase para poder dar estilo con CSS
    .attr("transform", "translate(0," + (height - padding) + ")") //traslada el eje del origen (esquina superior izquierda) a justo la base de la gráfica que se determina por dos variables, así que si le movemos las variables, esto se ajusta solo.
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-65)"
    });

  canvas.append("g") // básicamente lo mismo que arriba, pero para el eje y
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}

d3.select(window).on('resize', resizeCardinal);

function resizeCardinal() {
  resizes = 1;
  d3.select('#frequency').text('');
  inicioCardinal();
}
