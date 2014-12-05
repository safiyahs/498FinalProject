$(document).ready(function() {
	for (i = 2008; i < 2015; i++){
		d3.csv("../" + i + "_top_lang.csv", function(error, data){
			var colors = []
			for (d in data){
				colors.push(stringToColour(htmlFriendly(data[d].tag)))
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

function htmlFriendly(text){
	// removes spaces, #, *
	if (text != null) {
		return text.replace(/\s+/g, '-').replace(/#/g, '').replace(/\*/g, '');
	}
	return text;
}

// http://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
function stringToColour(str) {
  // str to hash
  if (str != null){
	  for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
	  for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

	  return colour;
  }
}



