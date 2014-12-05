$(document).ready(function() {
	for (i = 2008; i < 2015; i++){
		d3.csv("../" + i + "_top_lang.csv", function(error, data){
			var colors = [];
			for (d in data){
				colors.push(stringToColour(data[d].tag))
			}
			initializeChart(data,colors);
		});
	}
});

/********** Pie Graph **********/
function initializeChart(data,colors){
	nv.addGraph(function() {
		var chart = nv.models.pieChart()
	    .x(function(d) { return d.tag })
	    .y(function(d) { return d.total })
	    .width(300).height(300)
	    .showLabels(true)
	    .showLegend(false)
	    .color(colors)
	    .valueFormat(d3.format('d'))
			.noData("Choose a language to see information.");

		d3.select("#chart" + data[0].year)
			.append("svg").attr("height","400")
			.datum(data)
			.transition().duration(500)
			.call(chart).style({ 'width': 300, 'height': 300 });

		nv.utils.windowResize(chart.update);
		return chart;
		});
	}	

// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
function stringToColour(str) {
  var scale = d3.scale.category20b().domain(d3.range(0,20));
  var scale2 = d3.scale.category20().domain(d3.range(0,20));
  if (str != null){
  	var semihash = str.split("").reduce(function(a,b){a=((a<<2)-a)+b.charCodeAt(0);return a&a},0);
	  var color;
	  if (semihash > 1000) {
	  	color = scale2(semihash % 19);
	  } else {
	  	color = scale(semihash % 15);
	  }

	  return color;
  }
}



