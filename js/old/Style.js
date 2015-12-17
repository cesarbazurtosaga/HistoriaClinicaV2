var getColor=function(d) {

		if(global_valores[1]==global_valores[5]){
			return d > 1  ? 'rgba(255,255,255,0.7)' :'rgba(255,255,255,0.7)';
		}
		else{
		   	return d >= global_valores[7]  ? 'rgba(107,6,1,1)' :
		       d >= global_valores[6]  ? 'rgba(158,68,16,1)' :
		       d >= global_valores[5]  ? 'rgba(214,133,34,1)' :
		       d >= global_valores[4]  ? 'rgba(247,186,62,1)' :                   
		       d >= global_valores[3]   ? 'rgba(252,211,53,1)' :
		       d >= global_valores[2]   ? 'rgba(252,248,78,1)' :
		       d > global_valores[0]  ? 'rgba(252,255,158,0.8)' :
		                   'rgb(255,255,255)';	
		   
		}
};

var fill = new ol.style.Fill({
   color: 'rgba(255,255,255,0.3)'
});
var stroke = new ol.style.Stroke({
   color: '#3399CC',
   width: 1.25
});
var styles_none = [
   new ol.style.Style({
     fill: fill,
     stroke: stroke
   })
];
 

