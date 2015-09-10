//SENSOR PARAMETERS VARIABLES
var s1Parameters=[];
var s2Parameters=[];
var sensorType=[];
var sensor_data=[];
var sensor_data1=[];
var sensor_data2=[];
var sensor_data3=[];
var sensor_data4=[];
var sensor_data5=[];
sensorPar="" 
var varFilterLineFrom, varFilterLineTo,costValue, selectedSensor="";
var tempFromArd=0;
//ENERGY AND GAS GLOBAL VARIABLES
var tempDataEnergyCombo=[],tempDataGasCombo=[],tempDataWaterCombo=[];

var strSensorValues="";
var monthlyTypeSelected="";

 $(document).ready(function(){
var strFilterEnergyYear="", strFilterEnergyMonth="",strFilterGasYear="",strFilterGasMonth="",strFilterWaterYear="",strFilterWaterMonth="";
	$('#selectSensor').click(function(){
 		var sensorID = document.getElementById("selectSensorType");		
		var strSensor = sensorID.options[sensorID.selectedIndex].value;
		$("#IP_Sensor").show();	
	});		
	$('#invoices').click(function(){
		hide();	
		$("#divInvoices").show("slow");	
	});	
	$('#showHomeButton').click(function(){
		hide();	
		$( "#result" ).load( "ajax/page.htm #homePageTable" );
		$("#homePageTable").show("slow");	
	});

	$('#dateFilter').click(function(){
		if(monthlyTypeSelected=="energy"){
			doFilterString2Combo('energy');	
			clearYourListSelection("multipleSelectYear");
			clearYourListSelection("multipleSelectMonth");							
		}
		else if(monthlyTypeSelected=="gas"){
			doFilterString2Combo('gas');	
			clearYourListSelection("multipleSelectYear");
			clearYourListSelection("multipleSelectMonth");					
		
		}
		else if(monthlyTypeSelected=="water"){
			doFilterString2Combo('water');
			clearYourListSelection("multipleSelectYear");
			clearYourListSelection("multipleSelectMonth");					
		}
	
	});
	$('#invoiceSubmit').click(function(){		
		submitInv();	
	});
	$('#invoiceWaterButton').click(function(){
		document.getElementById("invoiceValuesTitle").innerHTML	="INVOICE WATER VALUES";
		$("#invoiceMenu").show("slow");		
	});
	$('#invoiceGasButton').click(function(){
		document.getElementById("invoiceValuesTitle").innerHTML	="INVOICE GAS VALUES";
		$("#invoiceMenu").show("slow");		
	});
	$('#invoiceEnergyButton').click(function(){
		document.getElementById("invoiceValuesTitle").innerHTML = "INVOICE ENERGY VALUES";
		$("#invoiceMenu").show("slow");		
	});
    $("#showDashboards").click(function(){
		hide();
		google.setOnLoadCallback(drawCombo);
		$("#dashboardsMenu").show("slow");
    });  	 
  	$("#selectSensorType").click(function(){
		doSelectSensorType();
    }); 	 	
 	$("#hideHelpNetwork").click(function(){	
        $("#detailHelpNetworkText").hide();
		$("#netButtons").show("slow");
		$("#hideHelpNetwork").hide();
		$("#helpNetwork").show();
		$("#submitNetworkSettings").show();
		
    });	
 	$("#helpNetwork").click(function(){	
        $("#netButtons").hide();
		$("#detailHelpNetworkText").show("slow");
		$("#hideHelpNetwork").show();
		$("#helpNetwork").hide();
		$("#submitNetworkSettings").hide();
    });	 
 	$("#submitNetworkSettings").click(function(){	
        doNetworkPermissionTest();
    });
 	$("#networkSettings").click(function(){
		hide();		
		$("#detailHelpNetworkText").hide();
		$("#hideHelpNetwork").hide();	
		$("#networkPage").show("slow");	
		$("#helpNetwork").show();
		$("#netButtons").show();
		$("#submitNetworkSettings").show();
    });	 
	 
 	$("#submitcostValue").click(function(){
		costValue = document.getElementById("costValue").value;
		if (isNaN(costValue)==false && costValue != ""){
			document.getElementById("costValue").value="";
			document.getElementById("textCostValue").innerHTML="Cost Value: " + costValue + " Eur/kWh";			
		}
		else{
			alert("Please Enter a Valid Cost Value. ");
		
		}
    });
 
 	$("#hideDetail").click(function(){
		$("#chartEnergyCombo").show("slow");	
		$("#detailText").hide();
		$("#hideDetail").hide();
		$("#showDetail").show("slow");
    });
	
	$("#showDetail").click(function(){
		$("#chartEnergyCombo").hide();
		$("#detailText").show("slow");
		$("#showDetail").hide();
		$("#hideDetail").show();
    }); 
 
     $("#submitChartFilters").click(function(){
		varFilterLineFrom = document.getElementById("chartLineFrom").value;
		varFilterLineTo = document.getElementById("chartLineTo").value;
		var e = document.getElementById("lineChartselectSensor");		
		var strSensor = e.options[e.selectedIndex].value; 
		document.getElementById("waitMessage").innerHTML = "Loading data, please wait...";
		$("#line_chart").hide();
		$("#channelsInfo").hide();
		$("#divLoadingGif").show();
		document.getElementById("filterLineText").innerHTML="(Filter From: " + varFilterLineFrom + " To: " + varFilterLineTo +")";
		if (strSensor == "Sensor 1" && selectedSensor != "Sensor 1"){
			selectedSensor="Sensor 1";
			doGetSensorData("sensor1");
		} 
		else if (strSensor == "Sensor 2" && selectedSensor != "Sensor 2"){
			selectedSensor="Sensor 2";
			doGetSensorData("sensor2");		
		}
		else if (strSensor == "Sensor 3" && selectedSensor != "Sensor 3"){
			selectedSensor="Sensor 3";
			doGetSensorData("sensor3");
		}
		else if (strSensor == "Sensor 4" && selectedSensor != "Sensor 4"){
			selectedSensor="Sensor 4";
			doGetSensorData("sensor4");	
		}
		else if (strSensor == "Sensor 5" && selectedSensor != "Sensor 5"){
			selectedSensor="Sensor 5";
			doGetSensorData("sensor5");
		}
		else drawChartSensor();
    });    
    $("#realValues").click(function(){
		hide();
		$("#input").show("slow");
    });    
	$("#inputBox").click(function(){
		hide();
		$("#IP_Sensor").show("slow");
    });
    $("#showBarWater").click(function(){
		$("#chartFilters").hide();
		doGetInvoiceValFromArduino("water");
		monthlyTypeSelected="water";		
		$("#divMonthlyConsumption").show("slow");	
		$("#channelsConsumptionInfo").show();
		$("#chartWaterCombo").show('slow');
		$("#chartEnergyCombo").hide();
		$("#chartGasCombo").hide();
    });
    $("#showBarGas").click(function(){
		$("#chartFilters").hide();
		doGetInvoiceValFromArduino("gas");
		monthlyTypeSelected="gas";		
		$("#divMonthlyConsumption").show("slow");	
		$("#channelsConsumptionInfo").show();
		$("#chartGasCombo").show('slow');
		$("#chartEnergyCombo").hide();
		$("#chartWaterCombo").hide();
    });
    $("#showBarEnergy").click(function(){		
		$("#chartFilters").hide();
		doGetInvoiceValFromArduino("energy");
		monthlyTypeSelected="energy";	
		$("#divMonthlyConsumption").show("slow");	
		$("#channelsConsumptionInfo").show();
		$("#chartEnergyCombo").show('slow');
		$("#chartGasCombo").hide();
		$("#chartWaterCombo").hide();
    });
    $("#showSensorsChart").click(function(){
		$("#divMonthlyConsumption").hide();
		$("#channelsConsumptionInfo").hide();	
		$("#chartFilters").show("slow"); 
		$("#line_chart").show("slow");	
		drawChartSensor();
		$("#channelsInfo").show(); 		
    });
    $("#s1").click(function(){
		document.getElementById("sensorName").value="";
		document.getElementById("PMAX").value="";
		document.getElementById("PMIN").value="";

		if (s1Parameters[0] != undefined) document.getElementById("sensorName").value=s1Parameters[0];
		if (s1Parameters[1] != undefined) document.getElementById("PMAX").value=s1Parameters[1];
		if (s1Parameters[2] != undefined) document.getElementById("PMIN").value=s1Parameters[2];
        
		$("#IP_Sensor").show();
    });
    $("#s2").click(function(){
		document.getElementById("sensorName").value="";
		document.getElementById("PMAX").value="";
		document.getElementById("PMIN").value="";		
		if (s2Parameters[0] != undefined) document.getElementById("sensorName").value=s2Parameters[0];
		if (s2Parameters[1] != undefined) document.getElementById("PMAX").value=s2Parameters[1];
		if (s2Parameters[2] != undefined) document.getElementById("PMIN").value=s2Parameters[2];		
		$("#sensorParameters").show();
		$("#IP_Sensor").show();
    }); 
    $("#buttonSensorParDisable").click(function(){
		doResetSP();
    });	
    $("#buttonSensorParSubmit").click(function(){
		doSubmitSP();
    });
}); 

var invoiceEnergyValues="";
function hide()
{
	//funtion to hide everything before any chage, my fastest way to create a structure with menus
	document.getElementById("refreshField").innerHTML ='';
	$("#homePageTable").hide();
	$("#tempData").hide();
	$("#divMonthlyConsumption").hide();
	$("#networkPage").hide();
	$("#line_chart").hide();
	$("#IP_Sensor").hide();
	$("#input").hide();
	$("#chartFilters").hide();
	$("#channelsInfo").hide();
	$("#myMapPos").hide();
	$("#dashboardsMenu").hide();
	$("#invoiceMenu").hide();
	$("#divInvoices").hide(); 
	$("#channelsConsumptionInfo").hide();
	$("#divLoadingGif").hide();
	document.getElementById("sensorName").innerHTML = "(No Sensor Selected)";
	document.getElementById("filterLineText").innerHTML= "(No Filter Applied To The Chart)";
//	document.getElementById("textCostValue").innerHTML="";
}

	google.load('visualization', '1', {'packages':["corechart","gauge"]});
    google.setOnLoadCallback(drawChartSensor);	
    google.setOnLoadCallback(drawTemperatureGauge);


 function drawChartSensor() {
	var tempSensName="",  dataTest = new google.visualization.DataTable();
	var format='', activeSensor="";
	var sensor_data=[];
	dataTest.addColumn('date', 'Time');
	//dataTest.addColumn('number', "Sensor");	
    activeSensor=document.getElementById("lineChartselectSensor").value;
	var tempTotalSens=0;
	var tempFilterFrom = new Date(varFilterLineFrom);
	var tempFilterTo = new Date(varFilterLineTo);
	if (typeof varFilterLineFrom == 'undefined' || typeof varFilterLineTo == 'undefined' || varFilterLineFrom == "" || varFilterLineTo == "") {
		document.getElementById("filterLineText").innerHTML= "(No Filter Applied To The Chart)"
	}
	if (activeSensor=="..."){
		document.getElementById("filterLineText").innerHTML= "(No sensors configured. Please go to menu Sensors Parameters and define at least one sensor)"
		dataTest.addColumn('number', "Sensor");	
	}
	else if (activeSensor=="Sensor 1"){
		sensor_data=sensor_data1;
		dataTest.addColumn('number', "Sensor 1");
		tempSensName="Sensor 1";
	}
	else if (activeSensor=="Sensor 2"){
		sensor_data=sensor_data2;
		tempSensName="Sensor 2";
		dataTest.addColumn('number', "Sensor 2");	
	}
	else if (activeSensor=="Sensor 3"){
		sensor_data=sensor_data3;
		tempSensName="Sensor 3";
		dataTest.addColumn('number', "Sensor 3");	
	}
	else if (activeSensor=="Sensor 4"){
		sensor_data=sensor_data4;
		tempSensName="Sensor 4";
		dataTest.addColumn('number', "Sensor 4");	
	}
	else if (activeSensor=="Sensor 5"){
		sensor_data=sensor_data5;
		tempSensName="Sensor 5";
		dataTest.addColumn('number', "Sensor 5");	
	}
	var totalPointChart=0;
	var dateGap=[],finalGap=0;

	if (typeof sensor_data != 'undefined'){

		for (var i=0; i<sensor_data.length-2;i++){
			if (typeof varFilterLineFrom != 'undefined' && typeof varFilterLineTo != 'undefined' && varFilterLineFrom != "" && varFilterLineTo != "") {	
				if (sensor_data[i][0]>= tempFilterFrom && sensor_data[i][0]<= tempFilterTo){
						dataTest.addRow(sensor_data[i]);
						tempTotalSens +=sensor_data[i][1];
						totalPointChart++;
				}
			}
			else{
				dataTest.addRow(sensor_data[i]);
				tempTotalSens +=sensor_data[i][1];
				totalPointChart++;
			}			
		}	
	}
    if (activeSensor != "..." ){
		document.getElementById("channelsInfo").innerHTML = "<p style=padding:10px;> <font size=5>Statistics </font></p>";
		document.getElementById("channelsInfo").innerHTML += "<ul><li> " + tempSensName+" <br> Total: " + tempTotalSens.toFixed(2) + " kWh <br> Average: " +(tempTotalSens/totalPointChart).toFixed(2) +" kWh</li></ul><br>";
    } 
	var options = {'title':'Sensors Control',
				   'width':1000,
				   'height':500,
					hAxis: {
					  title: 'Time',
					  format: 'dd/MM/yyyy HH:mm',
					},
					vAxis: {
					  title: 'Degrees',
					  viewWindow:{
						min:0
					  }
					},
				//   backgroundColor: '#f1f8e9',
				   chartArea:{left:80,top:50}
				   };

	var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
	var date_formatter = new google.visualization.DateFormat({ 
		pattern: 'dd/MM/yyyy HH:mm'
	}); 
	date_formatter.format(dataTest, 0);
	chart.draw(dataTest, options);
	
	if (sensor_data.length<=1){
		$("#divLoadingGif").hide();	
		$("#line_chart").hide();
		$("#channelsInfo").hide();			
	}
	else{
		$("#divLoadingGif").hide();	
		$("#line_chart").show();
		$("#channelsInfo").show();		
	}

	document.getElementById("waitMessage").innerHTML = "";
}  

function doResetSP(){
 	var sNumber = document.getElementById("sensorName").innerHTML;
   	if (sNumber.indexOf("Sensor 1")>-1){
 		s1Parameters[0] = "";
		s1Parameters[1] = "";
		s1Parameters[2] = ""; 	
	}   
 	else if (sNumber.indexOf("Sensor 2")>-1){
 		s2Parameters[0] = "";
		s2Parameters[1] = "";
		s2Parameters[2] = ""; 
	}
	document.getElementById("sensorName").value="";
	document.getElementById("PMAX").value="";
	document.getElementById("PMIN").value="";
	
}


function doSubmitSP(){
	var sensorID = document.getElementById("selectSensor");		
	var sNumber = sensorID.options[sensorID.selectedIndex].value;
	var parameter=[];
	parameter[0] = document.getElementById("sensorName").value;
	parameter[1] = document.getElementById("PMAX").value;
	parameter[2] = document.getElementById("PMIN").value; 
   	if (sNumber.indexOf("Select Sensor")>-1 ) alert("No sensor selected.")
	else if (parameter[0] == "" || parameter[1] == "" || parameter[2] == "") alert("Fill all sensor fields before submit.")
	else {
		$("#IP_Sensor").hide();
		alert( sNumber + " (Submited)" +"\n" +"Name: " + parameter[0] +"\n" + " Parameter Max: " + parameter[1] +"\n" +" Parameter Min: " + parameter[2]);
	}
 	// else if (sNumber.indexOf("Sensor 2")>-1){
		// s2Parameters[0] = document.getElementById("sensorName").value;
		// s2Parameters[1] = document.getElementById("PMAX").value;
		// s2Parameters[2] = document.getElementById("PMIN").value;
		// $("#IP_Sensor").hide();
		// document.getElementById("sensorName").innerHTML = sNumber + " (Submited)" +"<br /><br />" +"Name: " + s2Parameters[0] +"<br />" + " Parameter Max: " + s2Parameters[1] +"<br />" +" Parameter Min: " + s2Parameters[2];			
	// }	
}

function doNetworkPermissionTest(){
    var pw = prompt("Password Required ", "Password");
    if (pw == "domotech") {
		doSubmitNetworkSettings();
    }	
	else{
		alert("Wrong Password! Try Again");
	}
}

function doSubmitNetworkSettings(){
	var IP="";
	var GateWay="";
	var subnet="";
	var mask="";
	for (var i=1; i<5;i++){
	  IP += document.getElementById("boxIP"+i).value + ".";
	  GateWay += document.getElementById("boxGW"+i).value + ".";
	  subnet += document.getElementById("boxMask"+i).value + ".";
	  mask += document.getElementById("boxSN"+i).value + ".";
	  
	  
	}
	var F_IP=IP.slice(0, IP.lastIndexOf("."));
	var F_GateWay=GateWay.slice(0, GateWay.lastIndexOf("."));
	var F_subnet=subnet.slice(0, subnet.lastIndexOf("."));
	var F_mask=mask.slice(0, mask.lastIndexOf("."));
	
	alert(F_IP +"\n"+ F_GateWay +"\n"+ F_subnet +"\n"+ F_mask);
	
	IP=GateWay=subnet=mask="";
	for (var i=1; i<5;i++){
	  document.getElementById("boxIP"+i).value = "";
	  document.getElementById("boxGW"+i).value = "";
	  document.getElementById("boxMask"+i).value = "";
	  document.getElementById("boxSN"+i).value = "";
	}
	
	document.getElementById("msgAlert").innerHTML="Reset Domotech Equipment to set new network values. Your new IP will be: " + F_IP;
}

function doSelectSensorType(){
 	var sNumber = document.getElementById("sensorName").innerHTML;
	var selectedValue=document.getElementById("selectSensorType").value;
	if (selectedValue != 'Select Type'){
		if (sNumber.indexOf("Sensor 1")>-1)sensorType[0]=selectedValue;		
		else if (sNumber.indexOf("Sensor 2")>-1)sensorType[1]=selectedValue;
		else if (sNumber.indexOf("Sensor 3")>-1)sensorType[2]=selectedValue;
		else if (sNumber.indexOf("Sensor 4")>-1)sensorType[3]=selectedValue;
		if(selectedValue == "kWh" || selectedValue == "m3")$("#sensorParameters").hide();
		else $("#sensorParameters").show();	
	}
}

function clearYourListSelection(listID) {
	var list = document.getElementById(listID);
	for (var i=0; i<list.options.length; i++) {
		if (list.options[i].selected) {
			list.options[i].selected=false;  
		}
	}  

}


function drawTemperatureGauge() {
	
	var data = google.visualization.arrayToDataTable([
	  ['Label', 'Value'],
	  ['Temperature', tempFromArd],
	]);

	var options = {
	  width: 450, height:270,
	  redFrom: 40, redTo: 60,
	  yellowFrom:30, yellowTo: 40,
	  minorTicks: 2,
	  max:60,
	};

	var chart = new google.visualization.Gauge(document.getElementById('home_chart_div_temp'));

	chart.draw(data, options);
}
function loadPage(){
	hide();
	$("#homePageTable").show("slow");	
	doGetGlobalValFromArduino();
}

function doGetGlobalValFromArduino()
{
    
	nocache = "&nocache=" + Math.random() * 1000000;
	var request = new XMLHttpRequest();
	request.onreadystatechange = function()
	{
		if (this.readyState == 4) {
			if (this.status == 200) {
				if (this.responseXML != null) {
					var tempArd=0,humArd=0,avgEnerEur=0,avgEnerkWh=0,avgGasEur=0,avgGasm3=0;
					tempArd=this.responseXML.getElementsByTagName('analog0')[0].childNodes[0].nodeValue; 
					tempFromArd=Math.round(parseInt(tempArd));
					humArd=Math.round(parseInt(this.responseXML.getElementsByTagName('analog1')[0].childNodes[0].nodeValue)/8)
					document.getElementById("humData").innerHTML = humArd + " %";
					avgEnerkWh=parseInt(this.responseXML.getElementsByTagName('analog2')[0].childNodes[0].nodeValue)
					document.getElementById("averageEnergykWh").innerHTML= avgEnerkWh + " kWh";
					avgEnerEur=parseInt(this.responseXML.getElementsByTagName('analog3')[0].childNodes[0].nodeValue)
					document.getElementById("averageEnergyEur").innerHTML = avgEnerEur + " Eur";
					avgGasm3=parseInt(this.responseXML.getElementsByTagName('analog4')[0].childNodes[0].nodeValue)
					document.getElementById("averageGasm3").innerHTML = avgGasm3 + " m<sup>3</sup>";
					avgGasEur=parseInt(this.responseXML.getElementsByTagName('analog5')[0].childNodes[0].nodeValue)
					document.getElementById("averageGasEur").innerHTML = avgGasEur + " Eur";					
					drawTemperatureGauge();
				}
			}
		}
	}
	request.open("GET", "ajax_inputs" +nocache , true);
	request.send(null);
	
	setTimeout('doGetGlobalValFromArduino()', 60000);
}

function doGetSensorData(sensorName){
    	
	nocache = "&nocache=" + Math.random() * 1000000;
	document.getElementById("testData").value="";
	var request = new XMLHttpRequest();
	strSensorValues="";
	var strTemp="";
	request.onreadystatechange = function()
	{
		if (this.readyState == 4) {
			if (this.status == 200) {
				if (this.responseXML != null) {					
					var strTemp="";
					document.getElementById("testData").value += this.responseXML.getElementsByTagName('analog3')[0].childNodes[0].nodeValue;
					strTemp = document.getElementById("testData").value;
					strSensorValues = strTemp;
					doTransformSensorData(sensorName,strSensorValues);
				    drawChartSensor();
				}
			}
		}
	}	
	request.open("GET", "ajax_"+ sensorName +nocache , true);
	request.send(null);	
  
}

function doTransformSensorData(sensorName,strData){
	var arrayStr=strData.split(";")	
	var tempSensorData=[];
	for (var i=0; i<arrayStr.length;i++){
		temp=arrayStr[i].split("#");
		var date = new Date(parseInt(temp[0])*1000);
		tempSensorData[i]=[];
		tempSensorData[i][0]=date;
		tempSensorData[i][1]=parseFloat(temp[1]);			
	}
	if (sensorName == "sensor1") sensor_data1=tempSensorData;
	else if (sensorName == "sensor2") sensor_data2=tempSensorData;
	else if (sensorName == "sensor3") sensor_data3=tempSensorData;
	else if (sensorName == "sensor4") sensor_data4=tempSensorData;
	else if (sensorName == "sensor5") sensor_data5=tempSensorData;
}

function doGetInvoiceValFromArduino(invoiceType)
{
	nocache = "&nocache=" + Math.random() * 1000000;
	document.getElementById("testData").value="";
	var request = new XMLHttpRequest();
	var strTemp="";
	request.onreadystatechange = function()
	{
		if (this.readyState == 4) {
			if (this.status == 200) {
				if (this.responseXML != null) {
					var strTemp="";
					document.getElementById("testData").value += this.responseXML.getElementsByTagName('analog3')[0].childNodes[0].nodeValue;
					strTemp = document.getElementById("testData").value;
					invoiceEnergyValues = ('energy' == invoiceType)?strTemp:"";
					invoiceGasValues = ('gas' == invoiceType)?strTemp:"";
					invoiceWaterValues = ('water' == invoiceType)?strTemp:"";
				//	alert(strTemp)
					strFilterEnergyYear=strFilterEnergyMonth=strFilterGasYear=strFilterGasMonth=strFilterWaterYear=strFilterWaterMonth="";
					transformInvoiceValues(invoiceType,strTemp);
					if (invoiceType=="energy") drawCombo(tempDataEnergyCombo,"chartEnergyCombo", "kWh","Energy",strFilterEnergyYear,strFilterEnergyMonth);
					else if (invoiceType=="gas") drawCombo(tempDataGasCombo,"chartGasCombo", "m3","Gas",strFilterGasYear,strFilterGasMonth);
					else if (invoiceType=="water") drawCombo(tempDataWaterCombo,"chartWaterCombo", "m3","Water",strFilterWaterYear,strFilterWaterMonth);
				}
			}
		}
	}	
	request.open("GET", "ajax_"+ invoiceType +nocache , true);
	request.send(null);
	
}

function transformInvoiceValues(invoiceType, arduinoInvStr)
{
	var arrayTemp=[];
	var temInvStr=String(arduinoInvStr);
	temInvStr=temInvStr.replace("undefined"," ");
	var tempSplitVal=temInvStr.split(";");
	for (var i=0; i<tempSplitVal.length-1;i++){
		var strTemp=tempSplitVal[i].split("#");
		arrayTemp[i]=[];
		arrayTemp[i][0]=strTemp[0];
		arrayTemp[i][1]=parseFloat(strTemp[1]);
		arrayTemp[i][2]=parseFloat(strTemp[2]);		
	}
	if ('energy'==invoiceType) tempDataEnergyCombo=arrayTemp;
	else if ('gas'==invoiceType) tempDataGasCombo=arrayTemp;
	else if ('water'==invoiceType) tempDataWaterCombo=arrayTemp;
}

function doInvoiceValuesSubmit(invType){

	var tempDate="",options_year="",options_month="",Consumption=0, Cost=0;
	var array2Combo=[];
	options_year = document.getElementById("invoiceYear").options;
	year_id = options_year[options_year.selectedIndex].id;
	options_month = document.getElementById("invoiceMonth").options;
	month_id = options_month[options_month.selectedIndex].id;
    Consumption=parseFloat(document.getElementById("invoiceConsumption").value);
	Cost=parseFloat(document.getElementById("invoiceCost").value);

	if (isNaN(parseFloat(year_id))==false && isNaN(parseFloat(month_id))==false && isNaN(parseInt(Consumption))==false && isNaN(parseFloat(Cost))==false) {	
		tempDate=year_id + "/" + month_id;
		values2send=tempDate+";"+parseFloat(Consumption)+";"+parseFloat(Cost);
		doSendVal2Arduino(invType,values2send);
	//	alert(values2send)
		alert("You Submited those values: \n" + "Date: " + tempDate + "\n Consum: " + parseFloat(Consumption) + " kWh \n Cost: " + parseFloat(Cost) +" Eur");		
	}
	else{
		alert("DOMOTECH ALERT \n\n One or more fields are empty. Complete them and try again please.");
	}

}

function doFilterString2Combo(invType){
 	var selectedArray = new Array();
	var selObjYear="", tempStr="",strFilterYear="",strFilterMonth="";
	var selObjYear = document.getElementById('multipleSelectYear');
	var selObjMonth = document.getElementById('multipleSelectMonth');
	//HERE IS IMPORTANT FOR CLEAN STR FILTERS
	strFilterEnergyYear="",strFilterEnergyMonth="";
	strFilterGasYear="",strFilterGasMonth="";
	strFilterWaterYear="",strFilterWaterMonth="";
	var count = 0;
	for (var i=0; i<selObjYear.options.length; i++) {
		if (selObjYear.options[i].selected) {
			strFilterYear += ",";
			strFilterYear += selObjYear.options[i].value;
		}
	}
	for (var i=0; i<selObjMonth.options.length; i++) {
		if (selObjMonth.options[i].selected) {
			strFilterMonth += ",";
			strFilterMonth += selObjMonth.options[i].id;
		}
	}

	if (invType == "energy") {
		strFilterEnergyYear=strFilterYear;
		strFilterEnergyMonth=strFilterMonth;
		drawCombo(tempDataEnergyCombo,"chartEnergyCombo", "kWh","Energy",strFilterEnergyYear,strFilterEnergyMonth);			
	}
	else if (invType=="gas"){
		strFilterGasYear=strFilterYear;
		strFilterGasMonth=strFilterMonth;
		drawCombo(tempDataGasCombo,"chartGasCombo", "m3","Gas",strFilterGasYear,strFilterGasMonth);
	}
	else if (invType=="water"){
		strFilterWaterYear=strFilterYear;
		strFilterWaterMonth=strFilterMonth;
		drawCombo(tempDataWaterCombo,"chartWaterCombo", "m3","Water",strFilterWaterYear,strFilterWaterMonth);
	}
}

function drawCombo(tempDataCombo,divName,unitType,filterType,filterStrYear,filterStrMonth) {
	var data = google.visualization.arrayToDataTable([
		['Month', 'Consum', 'Cost'],
		['0',  0,    0],		
	]);
	var totalCons=0, totalCost=0,average=[0,0],maximum=[0,0],minimum=[100000000,0],finalData=[];
	tempDataCombo.sort();
	if (filterStrYear != ""){
		var count=0;
		for (var i=0; i<tempDataCombo.length;i++){
			var year=tempDataCombo[i][0].split("/");
			if(filterStrYear.indexOf(year[0])>=0){
				finalData[count]=[];
				finalData[count][0]=tempDataCombo[i][0];
				finalData[count][1]=tempDataCombo[i][1];
				finalData[count][2]=tempDataCombo[i][2];
				count++;
			}
		}
		tempDataCombo=finalData;
	}
	finalData=[];
	if (filterStrMonth != ""){
		var count=0;
		for (var i=0; i<tempDataCombo.length;i++){
			var month=tempDataCombo[i][0].split("/");
			if(filterStrMonth.indexOf(month[1])>=0){
				finalData[count]=[];
				finalData[count][0]=tempDataCombo[i][0];
				finalData[count][1]=tempDataCombo[i][1];
				finalData[count][2]=tempDataCombo[i][2];
				count++;
			}
		}
		tempDataCombo=finalData;
	}
	for (var i=0; i<tempDataCombo.length;i++){

	data.addRow(tempDataCombo[i]);
	totalCons+=tempDataCombo[i][1];
	totalCost+=tempDataCombo[i][2];
	if (parseFloat(tempDataCombo[i][1])>maximum[0]){
		maximum[0]=parseFloat(tempDataCombo[i][1]);
		maximum[1]=tempDataCombo[i][0];
	}
	if (parseFloat(tempDataCombo[i][1])<minimum[0]){
		minimum[0]=parseFloat(tempDataCombo[i][1]);
		minimum[1]=tempDataCombo[i][0];
	}		
	}
	data.removeRow(0);
	var options = {
		title : 'Monthly Totals',
		'width':1100,
		'height':650,
		vAxis: {title: "Consum ("+unitType+")"},
		hAxis: {title: "Month"},
		chartArea:{left:100,top:50},
		legend: { position: 'top', alignment: 'end' },
		seriesType: "bars",
		series:{1:{targetAxisIndex:1,type: "line"}}, vAxes:{1:{title:'Cost (Eur)'}}
	};

	var chart = new google.visualization.ComboChart(document.getElementById(divName));
	chart.draw(data, options);
	document.getElementById("channelsConsumptionInfo").innerHTML = "<center>STATISTICS </center>"
	document.getElementById("channelsConsumptionInfo").innerHTML += "<ul> <li> Totals <br> Consum: " + totalCons.toFixed(2) + " "+unitType+" <br> Cost: " + totalCost.toFixed(2) +" Eur</li></ul>";
	document.getElementById("channelsConsumptionInfo").innerHTML += "<ul> <li> Average <br> Consum: " + (totalCons/tempDataCombo.length).toFixed(1) + " "+unitType+" <br> Cost: " + (totalCost/tempDataCombo.length).toFixed(1)+" Eur</li></ul>";
	document.getElementById("channelsConsumptionInfo").innerHTML += "<ul> <li> Maximum: " + maximum[0].toFixed(1) + " "+unitType+ " (" + maximum[1] +")</li></ul>";
	document.getElementById("channelsConsumptionInfo").innerHTML += "<ul> <li> Minimum: " + minimum[0].toFixed(1) + " "+unitType+ " (" + minimum[1] +")</li></ul>";
}

function submitInv()	{
	var invTyp=String(document.getElementById("invoiceValuesTitle").innerHTML);
	if (invTyp.indexOf("ENERGY")>1){
		doInvoiceValuesSubmit('energy');	
	}
	else if (invTyp.indexOf("GAS")>1){
		doInvoiceValuesSubmit('gas');	
	}
	else if (invTyp.indexOf("WATER")>1){
		doInvoiceValuesSubmit('water');	
	}
}


function doSendVal2Arduino(invoiceType,values)
{
	nocache = "_nocache=" + Math.random() * 1000000;
	var xmlhttp = new XMLHttpRequest();
	var strTemp="";	
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  // if (xmlhttp.readyState==4 && xmlhttp.status==200)
		// {
		// document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		// }
	  }
	// xmlhttp.open("GET","demo_get2.asp?fname=Henry&lname=Ford",true);
	// xmlhttp.send();
	xmlhttp.open("GET","invSubmit.asp?inType=" + invoiceType + "&invValues="+values + "&",true);
//	alert("invSubmit.asp?inType=" + invoiceType + "&invValues="+values + "&");
	xmlhttp.send();
	
}
