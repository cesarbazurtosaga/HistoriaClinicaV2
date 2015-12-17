var AutoDisplayLeyend=function(c)
	{
	//console.log("VAL LEYENDA ACTUAL: "+c);
	if(c!==undefined){
		var leyend=document.getElementById('items');
		var labels=[];
		var val=c;
		labels.push('<b>Catidad De Registros</b>');
		if(val[0]==val[5]){
			labels.push('<i  style=" background:rgba(255,255,212,1);border-color:rgba(83,147,92,1);"></i> '+numeral(val[0]).format('0,0') +' - '+numeral(val[1]).format('0,0'));
		}
		else{
			labels.push('<i  style=" background:rgba(107,6,1,1);border-color:rgba(107,6,1,1);"></i> '+numeral(val[7]).format('0,0')+'+');
			labels.push('<i  style=" background:rgba(158,68,16,1);border-color:rgba(44,104,141,1);"></i> '+numeral((val[6])).format('0,0')+' - '+numeral(val[7]).format('0,0'));
			labels.push('<i  style=" background:rgba(214,133,34,1);	border-color:rgba(44,104,141,1);"></i> '+numeral((val[5])).format('0,0')+' - '+numeral(val[6]).format('0,0'));
			labels.push('<i  style=" background:rgba(247,186,62,1);border-color:rgba(44,104,141,1); "></i> '+numeral((val[4])).format('0,0')+' - '+numeral(val[5]).format('0,0'));
			labels.push('<i  style=" background:rgba(252,221,53,1);border-color:rgba(44,104,141,1);"></i> '+numeral((val[3])).format('0,0')+' - '+numeral(val[4]).format('0,0'));
			labels.push('<i  style=" background:rgba(252,248,78,1);border-color:rgba(44,104,141,1);"></i> '+numeral((val[2])).format('0,0')+' - '+numeral(val[3]).format('0,0'));
			labels.push('<i  style=" background:rgba(252,255,158,0.8);border-color:rgba(83,147,92,1);"></i> '+numeral(1).format('0,0')+' - '+numeral(val[2]).format('0,0'));
		}
		
		
		leyend.style.display='block';
		leyend.innerHTML=labels.join('<br>')
	}
};
