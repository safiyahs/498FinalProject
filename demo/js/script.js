$(document).ready(function() {
	/********** language box **********/
	var apikey = "240ba9d6177f4e176ac938b73435bbe8";
	var limit = "50"
	$.getJSON('../languages.json', function(data2) {
		var items = [];
		var languageArr = data2.result;
		var allTagList = [];

		$.each(languageArr, function(key, val) {
			var size = 14;
			items.push('<span id="' + htmlFriendly(val.name) + '" data-date="' + val.introduced +'" data-link="' + val.id + '" style="font-size:' + size + 'px">' + val.name + '<small> (' + val.introduced + ')</small></span>');
			allTagList.push(val.name);
		});

		items.sort();

		$('<span>', {
			'class': 'language-list',
			html: items.join(', ')
		}).appendTo('#language-panel-body');

		d3.csv("../stackoverflow_output.csv", function(error, data){
			var chart;
			var languageData = [];
			var languageNameList = [];
			var languageCount = 0; // used to determine color
			var colorList = ['#008cba', '#f04124', '#43ac6a', '#5bc0de', '#e99002', '#c4e3f3', '#d0e9c6', '#ebcccc', '#faf2cc'];
			initializeChart();

			$(".language-list span").on('click',function() {
				var language = $(this).text();
				// https://www.googleapis.com/freebase/v1/topic/
				// https://developers.google.com/freebase/v1/topic-overview
				var topic_id = $(this).data("link");
				var introduced = $(this).data("date");

				language = language.substring(0, language.indexOf(' ('));
				if (languageNameList.indexOf(language) == -1){
					$(this).css("color",colorList[languageCount % colorList.length]);

					var service_url = 'https://www.googleapis.com/freebase/v1/topic';
		      var params = {};
		      $.getJSON(service_url + topic_id + '?callback=?', params, function(topic) {
		      	var influenced_by = []

		      	if (topic.property['/computer/programming_language/influenced_by'].values[0]!= null){
			      	for (lang in topic.property['/computer/programming_language/influenced_by'].values[0]){
		      		influenced_by.push(lang.text);
			      	}
		      	}

		        $("#language-rows").append("<tr><td>" + language + "</td><td>" + introduced + "</td><td>"+ influenced_by.toString() + "</td><td>" + topic.property['/common/topic/description'].values[0].value + "</td></tr>");
		      });

					generatelanguage(language);
				}
			});

			$("#clear-button").on('click',function() {
				languageData = [];
				languageNameList = [];
				languageCount = 0;
				$("#chart > *").remove();
				$("#language-rows > *").remove();
				initializeChart();
				$(".language-list span").css("color","black");
			});

			/********** Adding language to data **********/
			function generatelanguage(LANGUAGE_NAME){  
				languageNameList.push(LANGUAGE_NAME);

				yearDict = [];
				yearDict2 = []
				data.forEach(function (d) {
					if (d.tag === LANGUAGE_NAME){
						yearDict.push({
							x: parseInt(d.year),
							y: parseFloat(d.total)
						})
						yearDict2.push({
							x: parseInt(d.year),
							y: parseFloat(d.unanswered)
						})
					}
				});
				languageData.push({"key": LANGUAGE_NAME, "values": yearDict, color: colorList[languageCount % colorList.length]});
				languageData.push({"key": LANGUAGE_NAME + " (unanswered)", "values": yearDict2, isDashed: true, color: colorList[languageCount % colorList.length]});
				languageCount++; // next color

				updateChart();
			}

			/********** Time Series Graph **********/
			function initializeChart(){
				nv.addGraph(function() {
					chart = nv.models.lineChart()
						.margin({left: 50, right: 75, bottom: 50})
						.useInteractiveGuideline(true)
						.forceY(0)
						.noData("Choose a language to see information.");
						// .color(colorList);

					chart.xAxis
						.axisLabel('Year')
						.tickFormat(d3.format("d"));

					chart.yAxis
						.axisLabel('Stackoverflow Posts')
						.tickFormat(d3.format(""))
						.axisLabelDistance(40);

					// chart.x2Axis.tickFormat(d3.format("d"));

					d3.select("#chart")
						.append("svg").attr("height","500")
						.datum(languageData)
						.transition().duration(500)
						.call(chart);

					nv.utils.windowResize(chart.update);
					return chart;
				});
			}

			function updateChart() {
				d3.select("#chart svg")
						.datum(languageData)
						.transition().duration(500)
						.call(chart);

				nv.utils.windowResize(chart.update);
				return chart;
			}
		});
	});

	function htmlFriendly(text){
		// removes spaces, #, *
		return text.replace(/\s+/g, '-').replace(/#/g, '').replace(/\*/g, '');
	}

});
