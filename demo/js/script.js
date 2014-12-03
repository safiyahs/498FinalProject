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
			items.push('<span id="' + htmlFriendly(val.name) + '" style="font-size:' + size + 'px">' + val.name + '<small> (' + val.introduced + ')</small></span>');
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

			/********** Auto complete **********/
			// var sourceArr = [];
			// for (var i=0; i<data.length; i++) {
			// 	if (sourceArr.indexOf(data[i].name) == -1){
			// 		 sourceArr.push(data[i].name);
			// 	}
			// }

			// // https://gist.github.com/jharding/9458744#file-the-basics-js
			// var substringMatcher = function(strs) {
			// 	return function findMatches(q, cb) {
			// 		var matches, substrRegex;
			// 		matches = [];
			// 		substrRegex = new RegExp(q, 'i');
			// 		$.each(strs, function(i, str) {
			// 			if (substrRegex.test(str)) {
			// 				matches.push({ value: str });
			// 			}
			// 		});
			// 		cb(matches);
			// 	};
			// };
			// $('#language-name').typeahead({
			// 	highlight: true,
			// 	minLength: 1
			// },{
			// 	name: "language",
			// 	source: substringMatcher(sourceArr)
			// });

			/********** Button Actions **********/		
			// $("#submit-button").on('click',function() {
			// 	var languageName = htmlFriendly($("#language-name").val());
			// 	if ($("#"+ languageName).length) {
			// 		$("#"+ languageName).css("color",colorList[languageCount % colorList.length]);
			// 	}
			// 	generatelanguage($("#language-name").val());
			// 	$("#language-name").val("");
			// });

			$(".language-list span").on('click',function() {
				var language = $(this).text();
				language = language.substring(0, language.indexOf(' ('));
				if (languageNameList.indexOf(language) == -1){
					$(this).css("color",colorList[languageCount % colorList.length]);
					generatelanguage(language);
				}
			});

			$("#clear-button").on('click',function() {
				languageData = [];
				languageNameList = [];
				languageCount = 0;
				$("#chart > *").remove();
				initializeChart();
				$(".language-list span").css("color","black");
			});

			$("#select-all-button").on('click',function() {
				for (tag in allTagList){
					$("#" + htmlFriendly(allTagList[tag])).css("color",colorList[languageCount % colorList.length]);
					generatelanguage(allTagList[tag]);
				}	
			});

			/********** Adding language to data **********/
			function generatelanguage(LANGUAGE_NAME){  
				// if (LANGUAGE_NAME ==="" || LANGUAGE_NAME.match(/^\s/) || languageNameList.indexOf(LANGUAGE_NAME) > -1) {
				// 	return;
				// }
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
