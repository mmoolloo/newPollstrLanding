var margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
}; // Convención de márgenes de D3

var winWidth = $("#sentiment").width();
var width = winWidth - margin.left - margin.right,
  height = winWidth/2 - margin.top - margin.bottom; //tamaño de la gráfica ya tomandoen cuenta los márgenes
var radius = Math.min(width, height) * .5; // El radio del círculo es la mitad del valor más chico entre la altura y el ancho
var donutWidth = radius * .4; // Para hacer que la dona se vea bien, defino el grueso en función del ancho total.
var centery = height / 2,
  centerx = width / 2; //centro de la dona
if(winWidth <= 490){
  width = winWidth - margin.left - margin.right;
  if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0)<=600) {
    height = radius * 2 + 120;
  }else {
    height = width/2 + 15 + datasetPie.length*20 + margin.top + margin.bottom;  //tamaño de la gráfica ya tomando en cuenta los márgenes
    //IMPORTANTE!!!! ... esta grafica funciona por el tamañoligada al pie... si se quiere usar sin el pie se teine que quitar el if en el width
  }
  radius = width/4; // El radio es la mitad de el ancho menos los márgenes
  donutWidth = radius * 1; // Para hacer que la dona se vea bien, defino el grueso en función del ancho total.
  centery = width / 4;
  centerx = width / 2 ; //centro de la dona
}else{
donutWidth = radius * .4;
centery = height / 2;
centerx = width / 2;
}

var legendRectSize = 15,
  legendSpacing = 5; //tamaño de la leyenda

var datasetDonut = [
  {"count": 364, "label": "positive", "example": '@realDonaldTrump God Bless you & everything u have done to help USA. Pray today you will be next President Elect!  #MAGA'},
  {"count": 200, "label": "neutral", "example": '@realDonaldTrump Just voted in Virginia! Lines were long at 6AM! TODAY IS OUR INDEPENDENCE DAY!!!'},
  {"count": 436, "label": "negative", "example": 'Don\'t fall 4 @HillaryClinton corruption & lies'}
  ]; //dataset de comentarios positivos, neutrales y negativos generado por 3 valores random enteros entre 1 y 1000

var color = d3.scale.ordinal()
  .range(['#009639', '#ffbf00', '#f9152f']); //escala de colores semáforo

var svg = d3.select('#sentiment')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr("transform", "translate(" + centerx + "," + centery + ")"); //inserta el chart en el div del html que tiene como id "chart"

var arc = d3.svg.arc()
  .innerRadius(radius - donutWidth)
  .outerRadius(radius); //inserta los arcos

var pie = d3.layout.pie()
  .value(function(d) {
    return d.count;
  })
  .sort(null); //pasa los valores del dataset a un layout de pie

var path = svg.selectAll('path')
  .data(pie(datasetDonut))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d, i) {
    return color(d.data.label);
  });//mete los paths que van a dibujar los arcos y les pone los colores correspondientes.

  path.transition()
    .ease("bounce")
    .duration(1350)
    .attrTween("d", tweenPie); //Inserta la transición a los arcos. No está encadenada a la selección anterior para que se guarde esa selección y pueda después llamarla para el mouseover.

function tweenPie(b) {
  var i = d3.interpolate({startAngle: 0*2*Math.PI, endAngle: .0*2*Math.PI}, b);
  return function(t) { return arc(i(t)); };
}//Esta es la función de animación

//legendas
if(width<=490){
var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var heightL = legendRectSize + legendSpacing;
    var horz = -radius + margin.left+(legendRectSize/2) - 20;
    var vert = i * heightL + radius + 2*margin.bottom;
    return 'translate(' + horz + ',' + vert + ')';
  }); //inserta la leyenda

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color); //genera los indicadores rectangulares de colores para la leyenda

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) {
    return d;
  }); //genera las etiquetas de la leyenda


}else{

var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset = height * color.domain().length / 2;
    var horz = -4 * legendRectSize + 20;
    var vert = i * height - offset;
    return 'translate(' + horz + ',' + vert + ')';
  }); //inserta la leyenda

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color); //genera los indicadores rectangulares de colores para la leyenda

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) {
    return d;
  }); //genera las etiquetas de la leyenda
}
path.on('mouseover', function(d) {
  var total = d3.sum(datasetDonut.map(function(d) {
    return d.count;
  }));
  var percent = Math.round(1000 * d.data.count / total) / 10;
  tooltip.select('.donutToolLabel').html(d.data.label);
  tooltip.select('.percent').html(percent + '%');
  tooltip.select('.donutExample').html('Example: \n"' + d.data.example + '"');
  tooltip.style('display', 'block');
}); //calcula el porcentaje redondeado a un decimal y le asigna la etiqueta correspondiente para el tooltip

path.on('mouseout', function() {
  tooltip.style('display', 'none');
}); //desaparece el tooltip cuando el mouse sale del arco

path.on('mousemove', function(d) {
  tooltip.style('top', (d3.event.layerY + 10) + 'px')
    .style('left', (d3.event.layerX + 10) + 'px');
}); //posiciona el tooltip en tiempo real junto al mouse

var tooltip = d3.select('#sentiment')
  .append('div')
  .attr('class', 'tooltip'); //crea el tooltip y las tres siguientes le agregan los datos correspondientes

tooltip.append('div')
  .attr('class', 'donutToolLabel');

tooltip.append('div')
  .attr('class', 'percent');

tooltip.append('div')
  .attr('class', 'donutExample');
// lee el evento de resize de la ventana
d3.select(window).on('resize', resizeDonut);
//la funcin que nos ayuda a ejecutar el resize
function resizeDonut(){
//calculos
winWidth = $("#sentiment").width();
width = winWidth - margin.left - margin.right;
height = winWidth/2 - margin.top - margin.bottom;
radius = Math.min(width, height) * .5;
if(width <= 490){
  width = winWidth - margin.left - margin.right;
  if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0)<=600) {
    height = radius * 2 + 120;
  }else {
    height = width/2 + 15 + datasetPie.length*20 + margin.top + margin.bottom;  //tamaño de la gráfica ya tomando en cuenta los márgenes
    //IMPORTANTE!!!! ... esta grafica funciona por el tamañoligada al pie... si se quiere usar sin el pie se teine que quitar el if en el width
  }
  radius = width/4; // El radio es la mitad de el ancho menos los márgenes
  donutWidth = radius * 1; // Para hacer que la dona se vea bien, defino el grueso en función del ancho total.
  centery = width / 4;
  centerx = width / 2 ; //centro de la dona
}else{
donutWidth = radius * .4;
centery = height / 2;
centerx = width / 2;
}
//fin de los calculos
d3.select("#sentiment").text("");
var svg = d3.select('#sentiment')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr("transform", "translate(" + centerx + "," + centery + ")"); //inserta el chart en el div del html que tiene como id "chart"

var arc = d3.svg.arc()
  .innerRadius(radius - donutWidth)
  .outerRadius(radius); //inserta los arcos

var pie = d3.layout.pie()
  .value(function(d) {
    return d.count;
  })
  .sort(null); //pasa los valores del dataset a un layout de pie

var path = svg.selectAll('path')
  .data(pie(datasetDonut))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d, i) {
    return color(d.data.label);
  });//mete los paths que van a dibujar los arcos y les pone los colores correspondientes.
//LEGENDAS
if(width<=490){
var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var heightL = legendRectSize + legendSpacing;
    var horz = -radius + margin.left+(legendRectSize/2) - 20;
    var vert = i * heightL + radius + 2*margin.bottom;
    return 'translate(' + horz + ',' + vert + ')';
  }); //inserta la leyenda

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color); //genera los indicadores rectangulares de colores para la leyenda

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) {
    return d;
  }); //genera las etiquetas de la leyenda

}else{
var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset = height * color.domain().length / 2;
    var horz = -4 * legendRectSize + 20;
    var vert = i * height - offset;
    return 'translate(' + horz + ',' + vert + ')';
  }); //inserta la leyenda

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color); //genera los indicadores rectangulares de colores para la leyenda

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) {
    return d;
  }); //genera las etiquetas de la leyenda
}
path.on('mouseover', function(d) {
  var total = d3.sum(datasetDonut.map(function(d) {
    return d.count;
  }));
  var percent = Math.round(1000 * d.data.count / total) / 10;
  tooltip.select('.donutToolLabel').html(d.data.label);
  tooltip.select('.percent').html(percent + '%');
  tooltip.select('.donutExample').html('Example: \n"' + d.data.example + '"');
  tooltip.style('display', 'block');
}); //calcula el porcentaje redondeado a un decimal y le asigna la etiqueta correspondiente para el tooltip

path.on('mouseout', function() {
  tooltip.style('display', 'none');
}); //desaparece el tooltip cuando el mouse sale del arco

path.on('mousemove', function(d) {
  tooltip.style('top', (d3.event.layerY + 10) + 'px')
    .style('left', (d3.event.layerX + 10) + 'px');
}); //posiciona el tooltip en tiempo real junto al mouse

var tooltip = d3.select('#sentiment')
  .append('div')
  .attr('class', 'tooltip'); //crea el tooltip y las tres siguientes le agregan los datos correspondientes

tooltip.append('div')
  .attr('class', 'donutToolLabel');

tooltip.append('div')
  .attr('class', 'percent');

tooltip.append('div')
  .attr('class', 'donutExample');
}
