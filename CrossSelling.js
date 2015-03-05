define(["jquery", "text!./CrossSelling.css", "./CrossSellingHelper"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qInitialDataFetch : [{
					qTop: 0,
					qLeft: 0,
					qHeight: 1000,
					qWidth: 3
				}],
			},
			
			NumDecimals: 0, 
			Thousands: true, 
			DecimalSep: ",", 
			ThousandSep: "."
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 2,
					max : 2
				},
				
				sorting : {
					uses : "sorting"
				},
				settings: {
					uses: "settings",
					items: {
						Venn: {
							type: "items",
							label: "Number formatting",
							items: {
								NumDecimals:{
									ref: "NumDecimals",
									translation: "Number of decimals to show",
									type: "number",
									defaultValue: 0
								},
								Thousands:{
									ref: "Thousands",
									translation: "Use a Thousands separator",
									type: "boolean",
									defaultValue: true
								},
								DecimalSep:{
									ref: "DecimalSep",
									translation: "Decimals separator",
									type: "string",
									defaultValue: ","
								},
								ThousandSep:{
									ref: "ThousandSep",
									translation: "Thousands separator",
									type: "string",
									defaultValue: "."
								}
							}
						}
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
			
			var html = "";
			var self = this, lastrow = 0;

			var TotalCountA = 0, TotalCountB = 0, TotalCountC = 0, TotalCountAB = 0, TotalCountAC = 0, TotalCountBC = 0, TotalCountABC = 0 ;
			var curItem = "";
			
			var numElements=[];
			var numPrincipals=[];
			
			var secondDimName = "";
			$.each(this.backendApi.getDimensionInfos(), function(key, value) {
				secondDimName = value.qFallbackTitle;
			});
			
			
			var multiArray = new Array();
			
			
			
			this.backendApi.eachDataRow(function(rownum, row) {
				lastrow = rownum;
				
				var Item = row[0].qText, Set = row[1].qText;
				multiArray[lastrow] = new Array(2);
				multiArray[lastrow][0] = row[0].qText;
				multiArray[lastrow][1] = row[1].qText;
				multiArray[lastrow][2] = row[0].qElemNumber;
				numElements.push(row[1].qText);
				numPrincipals.push(row[0].qText);
				
			});
			
			
			var threeValues = numElements.filter(onlyUnique).sort();
			var nPrincipals = numPrincipals.filter(onlyUnique);
			var htmlFlag = "";
					
			
			var previousElement = "";
			var newMultiArray = new Array();
			for (var ii = 0; ii < nPrincipals.length; ii++)
			{
				newMultiArray[ii] = new Array(4);
			}
			var newRow = -1;
			var newCol = 0;
			
			for(var y=0;y<numElements.length;y++)
			{
				
				if(multiArray[y][0] != previousElement)
				{
					newRow++;
					newMultiArray[newRow][0] = multiArray[y][0];
					newMultiArray[newRow][1] = "";
					newMultiArray[newRow][2] = "";
					newMultiArray[newRow][3] = "";
					newMultiArray[newRow][4] = multiArray[y][2];
				}
				
				switch (multiArray[y][1])
					{
						case threeValues[0]:
							newMultiArray[newRow][1] = multiArray[y][1];
							break;
						case threeValues[1]:
							newMultiArray[newRow][2] = multiArray[y][1];
							break;
						case threeValues[2]:
							newMultiArray[newRow][3] = multiArray[y][1];
							break;
					}
				previousElement = multiArray[y][0];
			}
			
			
			var arrayElemA = new Array();
			var arrayElemB = new Array();
			var arrayElemC = new Array();
			var arrayElemAB = new Array();
			var arrayElemAC = new Array();
			var arrayElemBC = new Array();
			var arrayElemABC = new Array();
			
			for(var yy=0;yy<nPrincipals.length;yy++)
			{
				if (newMultiArray[yy][1] != "") {
					if (newMultiArray[yy][2] != "") {
						if (newMultiArray[yy][3] != "") {
							TotalCountABC++;
							arrayElemABC.push(newMultiArray[yy][4]);
						}else
						{
							TotalCountAB++;
							arrayElemAB.push(newMultiArray[yy][4]);
						}
					}else{
						if (newMultiArray[yy][3] != "") {
							TotalCountAC++;
							arrayElemAC.push(newMultiArray[yy][4]);
						}else
						{
							TotalCountA++;
							arrayElemA.push(newMultiArray[yy][4]);
							
						}
					}
				}else
				{
					if (newMultiArray[yy][2] != "") {
						if (newMultiArray[yy][3] != "") {
							TotalCountBC++;
							arrayElemBC.push(newMultiArray[yy][4]);
						}else
						{
							TotalCountB++;
							arrayElemB.push(newMultiArray[yy][4]);
						}
					}else
					{
						TotalCountC++;
						arrayElemC.push(newMultiArray[yy][4]);
					}
				}
			}
			
			var TextA = (TotalCountA == 0) ? "":formatNumber(TotalCountA, layout.NumDecimals, layout.Thousands, layout.DecimalSep, layout.ThousandSep);
			var TextB = (TotalCountB == 0) ? "":formatNumber(TotalCountB, layout.NumDecimals, layout.Thousands, layout.DecimalSep, layout.ThousandSep);
			var TextC = (TotalCountC == 0) ? "":formatNumber(TotalCountC, layout.NumDecimals, layout.Thousands, layout.DecimalSep, layout.ThousandSep);
			var TextAB = (TotalCountAB == 0) ? "":formatNumber(TotalCountAB, layout.NumDecimals, layout.Thousands, layout.DecimalSep, layout.ThousandSep);
			var TextAC = (TotalCountAC == 0) ? "":formatNumber(TotalCountAC, layout.NumDecimals, layout.Thousands, layout.DecimalSep, layout.ThousandSep);
			var TextBC = (TotalCountBC == 0) ? "":formatNumber(TotalCountBC, layout.NumDecimals, layout.Thousands, layout.DecimalSep, layout.ThousandSep);
			var TextABC = (TotalCountABC == 0) ? "":formatNumber(TotalCountABC, layout.NumDecimals, layout.Thousands, layout.DecimalSep, layout.ThousandSep);
			var Error3Values = "Please select a maximum of 3 " + secondDimName + " ( currently " + threeValues.length + " )";
			var TextLegendA = "",TextLegendB = "",TextLegendC = "";
			switch (threeValues.length)
			{
				case 1:
					TextLegendA = threeValues[0].substring(0,10);
					TextLegendB = "";
					TextLegendC = "";
					break;
				case 2:
					TextLegendA = threeValues[0].substring(0,10);
					TextLegendB = threeValues[1].substring(0,10);
					TextLegendC = "";
					break;
				case 3:
					TextLegendA = threeValues[0].substring(0,10);
					TextLegendB = threeValues[1].substring(0,10);	
					TextLegendC = threeValues[2].substring(0,10);
					break;
				default:
					TextLegendA="",TextLegendB="",TextLegendC="";
			}
			
			if (threeValues.length>=0)
			{
						
				if (threeValues[0].length>10 && TextLegendA!="")
				{			
					for(var fillTextA=TextLegendA.length;fillTextA<11;fillTextA++)
					{
						TextLegendA+="*";
					}
				}
			}
			
			if (threeValues.length>1)
			{
				if (threeValues[1].length>10 && TextLegendB!="")
				{			
					for(var fillTextB=TextLegendB.length;fillTextB<11;fillTextB++)
					{
						TextLegendB+="*";
					}
				}
			}
			
			if (threeValues.length==3)
			{
				if (threeValues[2].length>10 && TextLegendC!="")
				{			
					for(var fillTextC=TextLegendC.length;fillTextC<11;fillTextC++)
					{
						TextLegendC+="*";
					}
				}
			}
			
			var MaxSize = Math.min($element.width(), $element.height());
			var Diameter = MaxSize * 0.65;
			var Offset = MaxSize * 0.35;
			
			// A text coordinates
			var FontSizeOnlyA = Math.floor((MaxSize * 0.2) / TextA.length);
			var xTextOnlyA = MaxSize * 0.05 + (MaxSize * 0.5 - TextA.length * FontSizeOnlyA) / 2;
			var yTextOnlyA = MaxSize * 0.2;
				
			// B text coordinates
			var FontSizeOnlyB = Math.floor((MaxSize * 0.2) / TextB.length);
			var xTextOnlyB = MaxSize * 0.65 + (MaxSize * 0.5 - TextB.length * FontSizeOnlyB) / 2;
			var yTextOnlyB = MaxSize * 0.2;
			
			// C text coordinates
			var FontSizeOnlyC = Math.floor((MaxSize * 0.2) / TextC.length);
			var xTextOnlyC = MaxSize * 0.3 + (MaxSize * 0.5 - TextC.length * FontSizeOnlyC) / 2;
			var yTextOnlyC = MaxSize * 0.65;
			
			
			// A * B text coordinates
			if (threeValues.length==2)
			{
				var FontSizeAandB = Math.floor((MaxSize * 0.2) / TextAB.length);
				var xTextAandB = MaxSize * 0.3 + (MaxSize * 0.5 - TextAB.length * FontSizeAandB) / 2;
				var yTextAandB = MaxSize * 0.2;
			}else
			{
				var FontSizeAandB = Math.floor((MaxSize * 0.2) / TextAB.length);
				var xTextAandB = MaxSize * 0.30 + (MaxSize * 0.5 - TextAB.length * FontSizeAandB) / 2;
				var yTextAandB = MaxSize * 0.07;	
			}
			
			
			// A * C text coordinates
			var FontSizeAandC = Math.floor((MaxSize * 0.2) / TextAC.length);
			var xTextAandC = MaxSize * 0.10 + (MaxSize * 0.5 - TextAC.length * FontSizeAandC) / 2;
			var yTextAandC = MaxSize * 0.45;
			
			// B * C text coordinates
			var FontSizeBandC = Math.floor((MaxSize * 0.2) / TextBC.length);
			var xTextBandC = MaxSize * 0.50 + (MaxSize * 0.5 - TextBC.length * FontSizeBandC) / 2;
			var yTextBandC = MaxSize * 0.45;
			
			// A * B * C text coordinates
			var FontSizeAandBandC = Math.floor((MaxSize * 0.2) / TextABC.length);
			var xTextAandBandC = MaxSize * 0.3 + (MaxSize * 0.5 - TextABC.length * FontSizeAandBandC) / 2;
			var yTextAandBandC = MaxSize * 0.35;
			
			// Error3Values text coordinates
			var FontSizeError3 = Math.floor(MaxSize * 0.05);
			var xTextError3 = 0;
			var yTextError3 = MaxSize * 0.3;
			
			// LegendA
			var FontSizeLegendA = Math.floor((MaxSize * 0.3) / 6);
			var xTextLegendA = MaxSize * 0.05 + (MaxSize * 0.5 - TextLegendA.length * FontSizeLegendA) / 2;
			var yTextLegendA = MaxSize * 0.90;
			
			// LegendB
			var FontSizeLegendB = Math.floor((MaxSize * 0.3) / 6);
			var xTextLegendB = MaxSize * 0.65 + (MaxSize * 0.5 - TextLegendB.length * FontSizeLegendB) / 2;
			var yTextLegendB = MaxSize * 0.90;
			
			// LegendC
			var FontSizeLegendC = Math.floor((MaxSize * 0.3) / 6);
			var xTextLegendC = MaxSize * 0.3 + (MaxSize * 0.5 - TextLegendC.length * FontSizeLegendC) / 2;
			var yTextLegendC = MaxSize * 0.94;
			
			
			var StartTable = Diameter + 20;
			var midlePositionX = Offset.toString() / 2;
			var midlePositionY = Offset.toString() * 0.75;
			
			
			switch (threeValues.length)
			{
				case 1:
					html += "<div class='OnlyA' title='" + threeValues[0] + ": " + TextA + " customers' style = 'position:absolute;left:0px;top:0px;width:" + Diameter.toString() + "px; height:" + Diameter.toString() + "px;'></div>";
					html += "<div id = 'ClusterA' class='TextA'  style = 'position:absolute;left:" + xTextOnlyA.toString() + "px; top:" + yTextOnlyA.toString() + "px;font-size:" + FontSizeOnlyA.toString() + "px;'>" + TextA + "</div>";
					html += "<div id = 'LegendA' class='TextLegendA' style = 'position:absolute;left:" + xTextLegendA.toString() + "px; top:" + yTextLegendA.toString() + "px;font-size:" + FontSizeLegendA.toString() + "px;'>" + TextLegendA + "</div>";
					break;
				case 2:
					html += "<div class='OnlyA' title='" + threeValues[0] + ": " + TextA + " customers' style = 'position:absolute;left:0px;top:0px;width:" + Diameter.toString() + "px; height:" + Diameter.toString() + "px;'></div>";
					html += "<div class='OnlyB' title='" + threeValues[1] + ": " + TextB + " customers' style = 'position:absolute;left:" + Offset.toString() + "px;top:0px;width:" + Diameter.toString() + "px; height:" + Diameter.toString() + "px;'></div>";
					html += "<div id = 'ClusterA' class='TextA'  style = 'position:absolute;left:" + xTextOnlyA.toString() + "px; top:" + yTextOnlyA.toString() + "px;font-size:" + FontSizeOnlyA.toString() + "px;'>" + TextA + "</div>";
					html += "<div id = 'ClusterB' class='TextB'  style = 'position:absolute;left:" + xTextOnlyB.toString() + "px; top:" + yTextOnlyB.toString() + "px;font-size:" + FontSizeOnlyB.toString() + "px;'>" + TextB + "</div>";
					html += "<div id = 'ClusterAB' class='TextAB' style = 'position:absolute;left:" + xTextAandB.toString() + "px; top:" + yTextAandB.toString() + "px;font-size:" + FontSizeAandB.toString() + "px;'>" + TextAB + "</div>";
					html += "<div id = 'LegendA' class='TextLegendA' style = 'position:absolute;left:" + xTextLegendA.toString() + "px; top:" + yTextLegendA.toString() + "px;font-size:" + FontSizeLegendA.toString() + "px;'>" + TextLegendA + "</div>";
					html += "<div id = 'LegendB' class='TextLegendB' style = 'position:absolute;left:" + xTextLegendB.toString() + "px; top:" + yTextLegendB.toString() + "px;font-size:" + FontSizeLegendB.toString() + "px;'>" + TextLegendB + "</div>";
					break;
				case 3:
					html += "<div class='OnlyA' title='" + threeValues[0] + ": " + TextA + " customers' style = 'position:absolute;left:0px;top:0px;width:" + Diameter.toString() + "px; height:" + Diameter.toString() + "px;'></div>";
					html += "<div class='OnlyB' title='" + threeValues[1] + ": " + TextB + " customers' style = 'position:absolute;left:" + Offset.toString() + "px;top:0px;width:" + Diameter.toString() + "px; height:" + Diameter.toString() + "px;'></div>";
					html += "<div class='OnlyC' title='" + threeValues[2] + ": " + TextC + " customers' style = 'position:absolute;left:" + midlePositionX + "px;top:" + midlePositionY + "px;width:" + Diameter.toString() + "px; height:" + Diameter.toString() + "px;'></div>";
					html += "<div id = 'ClusterA' class='TextA'  style = 'position:absolute;left:" + xTextOnlyA.toString() + "px; top:" + yTextOnlyA.toString() + "px;font-size:" + FontSizeOnlyA.toString() + "px;'>" + TextA + "</div>";
					html += "<div id = 'ClusterB' class='TextB'  style = 'position:absolute;left:" + xTextOnlyB.toString() + "px; top:" + yTextOnlyB.toString() + "px;font-size:" + FontSizeOnlyB.toString() + "px;'>" + TextB + "</div>";
					html += "<div id = 'ClusterC' class='TextC'  style = 'position:absolute;left:" + xTextOnlyC.toString() + "px; top:" + yTextOnlyC.toString() + "px;font-size:" + FontSizeOnlyC.toString() + "px;'>" + TextC + "</div>";
					html += "<div id = 'ClusterAB' class='TextAB' style = 'position:absolute;left:" + xTextAandB.toString() + "px; top:" + yTextAandB.toString() + "px;font-size:" + FontSizeAandB.toString() + "px;'>" + TextAB + "</div>";
					html += "<div id = 'ClusterAC' class='TextAC' style = 'position:absolute;left:" + xTextAandC.toString() + "px; top:" + yTextAandC.toString() + "px;font-size:" + FontSizeAandC.toString() + "px;'>" + TextAC + "</div>";
					html += "<div id = 'ClusterBC' class='TextBC' style = 'position:absolute;left:" + xTextBandC.toString() + "px; top:" + yTextBandC.toString() + "px;font-size:" + FontSizeBandC.toString() + "px;'>" + TextBC + "</div>";
					html += "<div id = 'ClusterABC' class='TextABC' style = 'position:absolute;left:" + xTextAandBandC.toString() + "px; top:" + yTextAandBandC.toString() + "px;font-size:" + FontSizeAandBandC.toString() + "px;'>" + TextABC + "</div>";
					html += "<div id = 'LegendA' class='TextLegendA' style = 'position:absolute;left:" + xTextLegendA.toString() + "px; top:" + yTextLegendA.toString() + "px;font-size:" + FontSizeLegendA.toString() + "px;'>" + TextLegendA + "</div>";
					html += "<div id = 'LegendB' class='TextLegendB' style = 'position:absolute;left:" + xTextLegendB.toString() + "px; top:" + yTextLegendB.toString() + "px;font-size:" + FontSizeLegendB.toString() + "px;'>" + TextLegendB + "</div>";
					html += "<div id = 'LegendC' class='TextLegendC' style = 'position:absolute;left:" + xTextLegendC.toString() + "px; top:" + yTextLegendC.toString() + "px;font-size:" + FontSizeLegendC.toString() + "px;'>" + TextLegendC + "</div>";
					break;
				default:
					html = "<div id = 'ClusterError3' class='Error3Values' style = 'position:absolute;left:" + xTextError3.toString() + "px; top:" + yTextError3.toString() + "px;font-size:" + FontSizeError3.toString() + "px;'>" + Error3Values + "</div>";
			}
				
			
			function onClickClusterA()
			{
				
				var SelectA = "";
				for (var selA = 0;selA<arrayElemA.length;selA++)
				{
					SelectA = arrayElemA[selA];
					self.backendApi.selectValues(0,[SelectA],true);
				}
				$(this).toggleClass("selected");
			
			};
			
			function onClickClusterB()
			{
				
				var SelectB = "";
				for (var selB = 0;selB<arrayElemB.length;selB++)
				{
					SelectB = arrayElemB[selB];
					self.backendApi.selectValues(0,[SelectB],true);
				}
				$(this).toggleClass("selected");
			
			};
			
			function onClickClusterC()
			{
				
				var SelectC = "";
				for (var selC = 0;selC<arrayElemC.length;selC++)
				{
					SelectC = arrayElemC[selC];
					self.backendApi.selectValues(0,[SelectC],true);
				}
				$(this).toggleClass("selected");
			
			};
			
			function onClickClusterAB()
			{
				
				var SelectAB = "";
				for (var selAB = 0;selAB<arrayElemAB.length;selAB++)
				{
					SelectAB = arrayElemAB[selAB];
					self.backendApi.selectValues(0,[SelectAB],true);
				}
				$(this).toggleClass("selected");
			
			};
			
			function onClickClusterAC()
			{
				
				var SelectAC = "";
				for (var selAC = 0;selAC<arrayElemAC.length;selAC++)
				{
					SelectAC = arrayElemAC[selAC];
					self.backendApi.selectValues(0,[SelectAC],true);
				}
				$(this).toggleClass("selected");
			
			};
			
			function onClickClusterBC()
			{
				
				var SelectBC = "";
				for (var selBC = 0;selBC<arrayElemBC.length;selBC++)
				{
					SelectBC = arrayElemBC[selBC];
					self.backendApi.selectValues(0,[SelectBC],true);
				}
				$(this).toggleClass("selected");
			
			};
			
			function onClickClusterABC()
			{
				
				var SelectABC = "";
				for (var selABC = 0;selABC<arrayElemABC.length;selABC++)
				{
					SelectABC = arrayElemABC[selABC];
					self.backendApi.selectValues(0,[SelectABC],true);
				}
				$(this).toggleClass("selected");
			
			};
			
			$element.html(html);
			$element.find('#ClusterA').on('qv-activate', onClickClusterA);
			$element.find('#ClusterB').on('qv-activate', onClickClusterB);
			$element.find('#ClusterC').on('qv-activate', onClickClusterC);
			$element.find('#ClusterAB').on('qv-activate', onClickClusterAB);
			$element.find('#ClusterAC').on('qv-activate', onClickClusterAC);
			$element.find('#ClusterBC').on('qv-activate', onClickClusterBC);
			$element.find('#ClusterABC').on('qv-activate', onClickClusterABC);
			
			
			
		}
	};
});
