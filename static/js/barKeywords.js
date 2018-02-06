$('.cclose').click(removeSvg);
$('#loadBar').click(barKeywords);

d3.select(window).on("resize", resizeBarKeywords);
var resized = 0;

function resizeBarKeywords() {
  resized = 1;
  d3.select('#keywords').text("");
  barKeywords();
}

function barKeywords() {
  //variables
  var width = $('#keywords').width();
  var height = 450;
  var padding = 25;
  var margin = {
    left: 120,
    top: 25,
    right: 50,
    bottom: 25
  };
  var w = width - margin.left - margin.right;
  var h = height - margin.top - margin.bottom;
  var dataKeywords = [
  {"value": 57, "keyword": "michigan"},
  {"value": 57, "keyword": "president"},
  {"value": 57, "keyword": "america"},
  {"value": 59, "keyword": "maga"},
  {"value": 63, "keyword": "electionday"},
  {"value": 87, "keyword": "amp"},
  {"value": 89, "keyword": "myvote2016"},
  {"value": 126, "keyword": "trump"},
  {"value": 150, "keyword": "vote"},
  {"value": 265, "keyword": "hillaryclinton"}];

  var color = d3.scale.ordinal().range(["#1098D5", "#B0D35E", "#F0668D", "#017D8F", "#EC1A52", "#08456E", "#57BBC1", "#FBAE19", "#621F60", "#F05848"]);

  //scales
  var xExtent = d3.extent(dataKeywords, function(d) {
    return d.value;
  });
  var xScale = d3.scale.linear()
    .domain([0, d3.max(dataKeywords, function(d) {
      return d.value
    })])
    .range([0, w - padding]);
  var yScale = d3.scale.ordinal()
    .domain(d3.range(0, dataKeywords.length))
    .rangeRoundBands([padding, h - padding], 0);
  var yGuideScale = d3.scale.ordinal()
    .domain(dataKeywords.map(function(d) {
      return d.keyword
    }))
    .rangeRoundBands([margin.top, h - padding]);
  var labelScale = d3.scale.ordinal()
    .domain(d3.range(0, dataKeywords.length))
    .rangePoints([padding + 22, h - padding - 13]);
  //create the SVG
  var svg2 = d3.select('#keywords')
    .append('svg').attr('class','svg2')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  var loadingText = svg2.append('text');
  if (resized == 0) {
    loadingText
      .attr('x', w / 2)
      .attr('y', h / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', 18)
      .text('Loading Data - Please Wait');
  }
  //append rectangles
  var barChart = svg2.selectAll('rect')
    .data(dataKeywords)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', function(d, i) {
      return yScale(i);
    })
    .attr('width', 0)
    .attr('height', yScale.rangeBand())
    .attr('fill', function(d, i) {
      return color(i);
    })
    .attr('shape-rendering', 'crispEdges')
    .attr('stroke', 'none');
  //x-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5)
  var xGuide = d3.select('.svg2')
    .append('g')
    .attr('opacity', 0);
  xAxis(xGuide)
  xGuide.attr('transform', 'translate(' + margin.left + ', ' + (h) + ')')
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-65)"
    });
  xGuide.selectAll('path')
    .style({
      fill: 'none',
      stroke: '#000'
    });
  //y-axis
  var yAxis = d3.svg.axis()
    .scale(yGuideScale)
    .orient('left')
  var yGuide = d3.select('.svg2')
    .append('g')
    //.attr('display', 'none')
    .attr('opacity', 0)
  yAxis(yGuide)
  yGuide.attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
  yGuide.attr('text-anchor', 'bottom');
  yGuide.selectAll('path')
    .style({
      fill: 'none',
      stroke: 'none'
    });
  //append labels
  var barText = svg2.selectAll('.bartext')
    .data(dataKeywords)
    .enter()
    .append('text')
    .attr('class', 'bartext')
    .attr('text-anchor', 'end')
    .attr('fill', 'white')
    .attr('x', 0)
    //.attr('x', function(d) {
    //    return xScale(d.value) - 5
    //})
    .attr('y', function(d, i) {
      return labelScale(i);
    })
    .text(function(d) {
      return Math.round(d.value);
    })
    //append legend
  d3.select('.svg2')
    .append('text')
    //.text('Number of value')
    .attr('text-size', 16)
    .attr('x', (margin.left))
    .attr('y', (height - 5));
    //apply transitions
  if (resized == 0) {
    barChart.transition()
      .attr('width', function(d) {
        return xScale(d.value);
      })
      .delay(1500)
      .duration(1400)
      .ease('elastic')
    barText.transition()
      .attr('x', function(d) {
        return xScale(d.value) - 5
      })
      .delay(1500)
      .duration(1400)
      .ease('elastic')
    loadingText.transition()
      .delay(1000)
      .remove();
      //cambio para sacar los numeros de la grafica
        barText.transition().delay(1500).duration(1400)
          .attr('x', function(d) {
          	res=xScale(d.value);
            var tam=JSON.stringify(d.value).length;
            var BreakNumber=tam*15;
            if(res<=BreakNumber){
            res=res+(tam*10);
            }else
            res=res-5;
            return res;
          })
          //
          .attr('fill', function(d) {
            res=xScale(d.value);
            var fill='white';
            var tam=JSON.stringify(d.value).length;
            var BreakColor=tam*15;
            if(res<=BreakColor)
            fill = 'black';
            return fill;
          });
    yGuide.transition()
      .delay(1700)
      .duration(800)
      //.attr('display', 'block');
      .attr('opacity', 1);
    xGuide.transition()
      .delay(1700)
      .duration(800)
      //.attr('display', 'block');
      .attr('opacity', 1);
  } else {
    barChart.transition()
      .attr('width', function(d) {
        return xScale(d.value);
      })
      .delay(0)
      .duration(0)
      .ease('elastic')
    barText.transition()
      .attr('x', function(d) {
        return xScale(d.value) - 5
      })
      .delay(0)
      .duration(0)
      .ease('elastic')
    loadingText.transition()
      .delay(0)
      .remove();
      //cambio para sacar los numeros de la grafica
        barText.transition().delay(0).duration(0)
          .attr('x', function(d) {
          	res=xScale(d.value);
            var tam=JSON.stringify(d.value).length;
            var BreakNumber=tam*15;
            if(res<=BreakNumber){
            res=res+(tam*10);
            }else
            res=res-5;
            return res;
          })
          //
          .attr('fill', function(d) {
            res=xScale(d.value);
            var fill='white';
            var tam=JSON.stringify(d.value).length;
            var BreakColor=tam*15;
            if(res<=BreakColor)
            fill = 'black';
            return fill;
          });
    yGuide.transition()
      .delay(0)
      .duration(0)
      //.attr('display', 'block');
      .attr('opacity', 1);
    xGuide.transition()
      .delay(0)
      .duration(0)
      //.attr('display', 'block');
      .attr('opacity', 1);
  }
}
//Remove SVG
function removeSvg() {
  $('.svg2').remove();
}
barKeywords();
