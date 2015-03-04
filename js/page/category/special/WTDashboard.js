
var WTDashboard = function() {
//	console.log(JSON.stringify(dashboard));
	var me = this;	
	var $dashboard = $('#dashboard');	
	
	me.displaySummary($dashboard, dashboard.summary);
	me.displayTaskHierachy($dashboard, dashboard.taskhierachydata);
	me.displayGraph($dashboard);	
};

WTDashboard.prototype.displaySummary = function($dashboard, summarydata) {
	console.log(JSON.stringify(summarydata));
	$dashboard.append('<h2>Summary</h2>');
	this.addSummary($dashboard, 'All Tasks Summary (100%):', summarydata.total);
	this.addSummary($dashboard, 'Task with incompleted metadata Summary ('+((summarydata.meta.nrOfTasks/summarydata.total.nrOfTasks)*100).toFixed(2)+'%):', summarydata.meta);
	this.addSummary($dashboard, 'Task with completed metadata Summary ('+((summarydata.content.nrOfTasks/summarydata.total.nrOfTasks)*100).toFixed(2)+'%):', summarydata.content);
}

WTDashboard.prototype.addSummary = function($dashboard, headline, data) {
	var ls = 'style="padding-left:35px;font-style:italic;"';
	var cs = 'style="font-style:italic;"';
	$dashboard.append('<h3>'+headline+'</h3>');
	$dashboard.append('<table>'+
				'<tr><td>Total number of Tasks:</td><td>'+data.nrOfTasks+'</td></tr>'+
				'<tr><td>Percentage of Tasks with Type:</td><td>'+(data.percentageOfType*100).toFixed(2)+'%</td></tr>'+
				'<tr><td '+ls+'>Percentage of highlevel tasks:</td><td '+cs+'>'+(data.avgTypeHigh*100).toFixed(2)+'%</td></tr>'+
				'<tr><td '+ls+'>Percentage of mediumlevel tasks:</td><td '+cs+'>'+(data.avgTypeMedium*100).toFixed(2)+'%</td></tr>'+
				'<tr><td '+ls+'>Percentage of lowlevel tasks:</td><td '+cs+'>'+(data.avgTypeLow*100).toFixed(2)+'%</td></tr>'+			
				'<tr><td>Percentage of Tasks with Progress:</td><td>'+(data.percentageOfProgress*100).toFixed(2)+'%</td></tr>'+
				'<tr><td '+ls+'>Avg progress of tasks:</td><td '+cs+'>'+data.avgProgress.toFixed(2)+'%</td></tr>'+				
				'<tr><td>Percentage of Tasks with Startdate:</td><td>'+(data.percentageOfStart*100).toFixed(2)+'%</td></tr>'+
				'<tr><td>Percentage of Tasks with Targetdate:</td><td>'+(data.percentageOfTarget*100).toFixed(2)+'%</td></tr>'+
				'<tr><td>Percentage of Tasks with Start- and Targetdate:</td><td>'+(data.percentageOfStartAndTarget*100).toFixed(2)+'%</td></tr>'+
				'<tr><td '+ls+'>Avg time between Start- and Targetdate in days:</td><td '+cs+'>'+data.avgStartTargetInvalInDays.toFixed(2)+'</td></tr>'+
				'<tr><td>Percentage of Tasks with Owner:</td><td>'+(data.percentageOfOwners*100).toFixed(2)+'%</td></tr>'+				
				'<tr><td>Percentage of Tasks with Participants:</td><td>'+(data.percentageOfParticipants*100).toFixed(2)+'%</td></tr>'+
				'<tr><td '+ls+'>Avg number of participants per task:</td><td '+cs+'>'+data.avgNrOfParticipants.toFixed(4)+'</td></tr>'+
				'<tr><td>Percentage of Tasks with Expertise:</td><td>'+(data.percentageOfExpertise*100).toFixed(2)+'%</td></tr>'+
				'<tr><td '+ls+'>Avg number of expertise per task:</td><td '+cs+'>'+data.avgNrOfExpertise.toFixed(4)+'</td></tr>'+
		  '</table>');
	$dashboard.append('<br/>');
}

WTDashboard.prototype.displayTaskHierachy = function($dashboard, taskhierachydata) {
	$dashboard.append('<h2>Subtask Hierachies</h2>');
	$dashboard.append('<div id="taskancestorsdiagram"></div>');
	$dashboard.append('<div id="taskchildrendiagram"></div>');
	
	google.load('visualization', '1.0', {'packages':['corechart']});
	google.setOnLoadCallback(drawChart);


	function drawChart() {
		
		/** Ancestor Diagram */
		var rawdata = [];
		rawdata.push(["Number of ancestors", "Number of Tasks", { role: "style" } ]);
		$.each(taskhierachydata.ancestors.leveldata, function(k, v){
			rawdata.push([v.level+"", v.nrOfTasks, "#70ad47"]);
		});
	    var data = google.visualization.arrayToDataTable(rawdata);
	    var view = new google.visualization.DataView(data);
	    view.setColumns([0, 1,
	                       { calc: "stringify",
	                         sourceColumn: 1,
	                         type: "string",
	                         role: "annotation" },
	                       2]);
	    var options = {
	    	title: "Task-Ancestor-Relation",
	    	bar: {groupWidth: "95%"},
	        legend: { position: "none" },
	        width: 500,
	        height: 300,
	        hAxis: {
	        	title: 'Number of ancestors'
	        },
	        vAxis: {
	        	title: 'Number of Tasks'
	        }
	    };
	    var chart = new google.visualization.ColumnChart(document.getElementById("taskancestorsdiagram"));
	    chart.draw(view, options);
	    
	    /** Children Diagramm */
		var rawdata = [];
		rawdata.push(["Number of ancestors", "Contentlevel", "Metalevel", { role: "style" } ]);
		$.each(taskhierachydata.children.childdata, function(k, v){
			rawdata.push([v.nrofchilds+"", v.contentlevel, v.metalevel, "#70ad47"]);			
		});
	    var data = google.visualization.arrayToDataTable(rawdata);
	    var view = new google.visualization.DataView(data);
	    view.setColumns([0, 1,
	                       { calc: "stringify",
	                         sourceColumn: 1,
	                         type: "string",
	                         role: "annotation" },
	                       2]);
	    var options = {
	    	title: "Task-Children-Relation",
	    	bar: {groupWidth: "95%"},
	        legend: { position: 'top' },
	        isStacked: true,
	        colors: ['#70ad47','#e2f0d9'],
	        width: 500,
	        height: 300,
	        hAxis: {
	        	title: 'Number of children'
	        },
	        vAxis: {
	        	title: 'Number of Tasks'
	        }
	    };
	    var chart = new google.visualization.ColumnChart(document.getElementById("taskchildrendiagram"));
	    chart.draw(view, options);
	 }
}

WTDashboard.prototype.displayGraph = function($dashboard) {
	$dashboard.append('<h2>Collaboration Graph</h2>');
	$dashboard.append('<p>The following network graph is created by using task metadata properties owner and participants in tasks. Users are represented as nodes in the network, and each edge between two nodes represents that the two users are signed up for the same task one or more times. The number of tasks they have in common is expressed by the strength of edges.</p>');
	$dashboard.append('<canvas id="collaboration-graph" width="800" height="600"></canvas>');
	var sys = arbor.ParticleSystem(1000, 400,1);
	sys.parameters({gravity:true});
	sys.renderer = Renderer("#collaboration-graph");
	
	var margins;
	$.each(dashboard.collaborationgraph.edges, function(k, e){
		if(k==0){
			margins = {min:e.weight, max:e.weight};
		}else{
			margins.min = Math.min(margins.min, e.weight);
			margins.max = Math.max(margins.max, e.weight);
		}			
	});
	
	var nodes = {};
	$.each(dashboard.collaborationgraph.nodes, function(k, n){
		nodes[n.id] = {'color':'#70ad47','shape':'rectangle','label': n.label};
	});
	
	var edges = {};
	$.each(dashboard.collaborationgraph.edges, function(k, e){
		var normalizedWeight = (e.weight/margins.max)*5;
		var evalue = {'weight':normalizedWeight, 'color':'#70ad47'};
		if(edges.hasOwnProperty(e.source)){
			edges[e.source][e.target] = evalue;
		}else{
			var nodeedge = {}
			nodeedge[e.target] = evalue;
			edges[e.source] = nodeedge;
		}			
	});

	var graphdata = {nodes:nodes, edges: edges};
	sys.graft(graphdata);
	
	this.offerGephiCSV($dashboard, dashboard.collaborationgraph);
};

WTDashboard.prototype.offerGephiCSV = function($dashboard, graph) {
	
	var $showData= $('<a>Show Gephi CSV Data</a>');
	var $hideData= $('<a>Hide Gephi CSV Data</a>');
	var $dataDiv = $('<div style="background-color:#eee;"></div>');
	$hideData.hide();
	$dataDiv.hide();
	$showData.click(function(){
		$showData.hide();
		$hideData.show();
		$dataDiv.show();
		var csv = '--Edges---------------------<br\>';
		csv += 'Source,Target,Type,Weight<br\>';
		$.each(graph.edges, function(k, edge) {
			csv += edge.source+','+edge.target+',Undirected,'+edge.weight+'\n'+'<br\>';
		});
		csv += '<br\>--Nodes---------------------<br\>';
		csv += 'NodeId<br\>';
		$.each(graph.nodes, function(k, node) {
			csv += node.id+'\n'+'<br\>';
		});		
		$dataDiv.html(csv);
	});
	$hideData.click(function(){
		$hideData.hide();
		$showData.show();
		$dataDiv.hide();
	});
	$dashboard.append('<br/>');
	$dashboard.append($showData);
	$dashboard.append($hideData);
	$dashboard.append($dataDiv);
}




$(function() {
	new WTDashboard();    
});