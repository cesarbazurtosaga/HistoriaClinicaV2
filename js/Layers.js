var geoserver="http://saga.cundinamarca.gov.co:8080/geoserver/";

/**
 *Funciones de carga de layers  
*/
var peticionjsonp=function(esquema,layer,funcioncarga,viewparams){
    var url = geoserver+esquema+'/ows?service=WFS&' +
    'version=1.0.0&request=GetFeature&typeName='+esquema+':'+layer+
    '&outputFormat=text/javascript&format_options=' +funcioncarga+
    '&srsname=EPSG:900913';
    waitingDialog.show();
    if(viewparams){url+=viewparams;} 
    console.log(moment().format('h:mm:ss:SSSS')+" pet");
    $.ajax({
      url: url,
      dataType: 'jsonp'
    });
    global_valores = undefined;
};



var removerfeatures=function(_vectorsource){
    var nombre,i;
    var features=_vectorsource.getFeatures();
    if(features.length>0){
        for(i=0;i<features.length;i++){
            _vectorsource.removeFeature(features[i]);
        }
    }
};

var ListaTotales=function(_vectorsource){
    var i;
    var features=_vectorsource.getFeatures();
    var SumaTotal=0;
    if(features.length>0){
    	for(i=0;i<features.length;i++){
        	SumaTotal=SumaTotal+features[i].get("cont");
        }        
    }
    $("#TotalDiagnostico").empty().append(numeral(SumaTotal).format('0,0') +" Registros");
};

var getbreaks=function(fc){	
	var fcFilter=turf.remove(fc, val_mostrar, 0);
	var breaks;
	if(fcFilter.features.length>7){
		 breaks=turf.jenks(fcFilter, val_mostrar, 8);
	}else{
		 breaks=turf.jenks(fcFilter, val_mostrar, fc.features.lenth);
	}
			
	if(breaks[0]!=0){
		breaks.unshift(0);
		breaks[1]=breaks[1]+1;
	}
		
	global_valores=breaks;
	//console.log(global_valores);
	AutoDisplayLeyend(global_valores);    
};


var loadFeatures = function(response) {
	console.log(moment().format('h:mm:ss:SSSS')+" rest");
	  var capa =  $("#layers option:selected").attr('value');	//console.log("LoadFeatures: " + capa);
	  getbreaks(response);
	  if (capa=='Departamento'){
	    removerfeatures(vectorSource);
	    vectorSource.addFeatures(vectorSource.readFeatures(response));
	    ListaTotales(vectorSource);
	  }else if(capa=='Provincia'){
	    removerfeatures(vsGob_Prov);
	    vsGob_Prov.addFeatures(vsGob_Prov.readFeatures(response));
	    ListaTotales(vsGob_Prov);
	  }else if(capa=='Municipio'){
	    removerfeatures(vsGob_Mun);
	    vsGob_Mun.addFeatures(vsGob_Mun.readFeatures(response));
	    ListaTotales(vsGob_Mun);
	  }
	  $("#InpClave").attr("disabled", false);
	  waitingDialog.hide();
	
}; 
var refreshfeatures=function(cobertura){
    var parametros=getparametros();
    var params="&viewparams=fecha_ini:"+parametros.fechaini+";fecha_fin:"+parametros.fechafin+
	";diag:"+parametros.CodDiagnostico+";sexo:"+parametros.sexo+
	";grupodiag:"+parametros.grupodiag+";sptorigen:"+parametros.msProcedencia;
	
	
	params=parametros.msEPS.length==0?params:params+';grupoeps:'+parametros.msEPS.join('\\,');
	params=parametros.msTipoAtencion.length==0?params:params+';tipoatencion:'+parametros.msTipoAtencion.join('\\,');
	params=parametros.msEdad.length==0?params:params+';edad:'+parametros.msEdad.join('\\,');
	params=parametros.msEtnia.length==0?params:params+';etnia:'+parametros.msEtnia.join('\\,');
	params=parametros.msTipoRegimen.length==0?params:params+';regimen:'+parametros.msTipoRegimen.join('\\,');
	params=parametros.msEstadoCivil.length==0?params:params+';estadocivil:'+parametros.msEstadoCivil.join('\\,');
	
	if(cobertura!=""){
		peticionjsonp('salud',cobertura,'callback:loadFeatures',params);	
	}else{
		peticionjsonp('salud',parametros.escala,'callback:loadFeatures',params);
	}
	
};

var limiteDPTO=new ol.layer.Tile({
        source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
          url: geoserver+'/gwc/service/wms',
          params: {'LAYERS': 'administrativa:g_colombia_dpto', 'TILED': true,'STYLES':'g_colombia_dpto_border','SRS':'EPSG%3A900913'},
          serverType: 'geoserver'
        }))
      });

//LIMITE PROVINCIA WMS
var LayerProvLinea =  new ol.layer.Tile({
        source: new ol.source.TileWMS( /** @type {olx.source.TileWMSOptions} */ ({
          url: geoserver+'/wms',
          params: {'LAYERS': 'administrativa:g_provincia_simp', 'TILED': true, 'STYLES':'Sym_Provincia_96a4ca5d','SRS':'EPSG%3A900913'},
          serverType: 'geoserver'
        }))
        ,minResolution: 100
    	,maxResolution: 999
      });
LayerProvLinea.setVisible(true);
//LIMITE MUNICIPIO WMS
var LayerMuniLinea =  new ol.layer.Tile({
        source: new ol.source.TileWMS( /** @type {olx.source.TileWMSOptions} */ ({
          url: geoserver+'/wms',
          params: {'LAYERS': 'administrativa:g_municipio_simp', 'TILED': true, 'STYLES':'Sym_Municipio_limite','SRS':'EPSG%3A900913'},
          serverType: 'geoserver'
        }))
        ,minResolution: 0
    	,maxResolution: 999
      });
LayerMuniLinea.setVisible(false);

/*********************************************************************************
 *-------------------------------CUNDINAMARCA------------------------------------*
 *********************************************************************************/


  
      
var vectorSource = new ol.source.ServerVector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection) {
      refreshfeatures("diag_dpto");
  },
  strategy: function() {
                return [ [-8772091.3, 261157.7, -7723375.2, 799885.8]];
  },
  projection: 'EPSG:3857'
});

var lvGob_Dep = new ol.layer.Vector({
  source: vectorSource,
   style: function(feature, resolution) {
  	
	var texto = feature.get(nom_mostrar);
	var fuente = "";

	if(resolution <= 160) {
		fuente = '11px Calibri,sans-serif';
	}else{
		fuente = '9px Calibri,sans-serif';
	}
      var styleC = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: getColor(parseFloat(feature.get(val_mostrar)))
          //color:'#FBFB55' 
        }),
        stroke: new ol.style.Stroke({
          color: '#727220',
          width: 1
        }),
        text: new ol.style.Text({
          font: fuente,
          text: texto,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
          })
        })
    })];
    return styleC;
  }
});
lvGob_Dep.setVisible(true);

/***************************************************************************************************
 *--------------------------------------------PROVINCIA--------------------------------------------
 ***************************************************************************************************/
var vsGob_Prov = new ol.source.ServerVector({
	format: new ol.format.GeoJSON(),
   	loader: function(extent, resolution, projection) {
		 refreshfeatures("diag_prov");
	},
   strategy: function() {
                return [ [-8772091.3, 261157.7, -7723375.2, 799885.8]];
  	},
  	projection: 'EPSG:3857',
  	minResolution: 100
	,maxResolution: 999999999
});

var lvGob_Prov = new ol.layer.Vector({
  source: vsGob_Prov,
  style: function(feature, resolution) {
	var texto = feature.get(nom_mostrar);
	   var styleC = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: getColor(parseFloat(feature.get(val_mostrar)))
          //color:'#FBFB55' 
        }),
        stroke: new ol.style.Stroke({
          color: '#727220',
          width: 1
        })
        ,text: new ol.style.Text({
          font: '11px Calibri,sans-serif',
          text: texto,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
          })
        })
    })];
    return styleC;
  }
});
lvGob_Prov.setVisible(false);

/***************************************************************************************************
 *--------------------------------------------MUNICIPIO--------------------------------------------
 ***************************************************************************************************/
var lfGob_DiagMun = function(response) {
    vsGob_Mun.addFeatures(vsGob_Mun.readFeatures(response));
}; 
var vsGob_Mun = new ol.source.ServerVector({
  format: new ol.format.GeoJSON(),
   loader: function(extent, resolution, projection) {
   	 refreshfeatures("diag_mun");
  },
   strategy: function() {
                return [ [-8772091.3, 261157.7, -7723375.2, 799885.8]];
  	},
  projection: 'EPSG:3857'
});
var lvGob_Mun = new ol.layer.Vector({
  source: vsGob_Mun,
  style: function(feature, resolution) {
  	
	var texto = feature.get(nom_mostrar).trunc(12);
	var fuente = "";
	if(resolution <= 160) {
		fuente = '11px Calibri,sans-serif';
	}else if(resolution > 160 && resolution <= 300){
		fuente = '9px Calibri,sans-serif';
	}else if(resolution > 300 && resolution <= 320){
		fuente = '8px Calibri,sans-serif';
	}else {
		fuente = '0px Calibri,sans-serif';
	}

	var styleC = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: getColor(parseFloat(feature.get(val_mostrar)))
          //color:'#FBFB55' 
        }),
        stroke: new ol.style.Stroke({
          color: '#727220',
          width: 1
        }),
        text: new ol.style.Text({
          font: fuente,
          text: texto,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2.5
          })
        })
    })];
    return styleC;
 }
});
lvGob_Mun.setVisible(false);
/***************************************************************************************************/

/***************************************************************************************************
 *--------------------------------------------VEREDA--------------------------------------------
 ***************************************************************************************************/
var lfGob_Ver = function(response) {
    vsGob_Ver.addFeatures(vsGob_Ver.readFeatures(response));
}; 
var vsGob_Ver = new ol.source.ServerVector({
  format: new ol.format.GeoJSON(),
   loader: function(extent, resolution, projection) {
    var url = geoserver + 'administrativa/ows?service=WFS&' +
        'version=1.0.0&request=GetFeature&typeName=administrativa:g_vereda_simp&' +
        'outputFormat=text/javascript&format_options=callback:lfGob_Ver' +
        '&srsname=EPSG:3857';
    $.ajax({
      url: url,
      dataType: 'jsonp'
    });
  },
   strategy: function() {
                return [ [-8772091.3, 261157.7, -7723375.2, 799885.8]];
  	},
  projection: 'EPSG:3857'
});
var lvGob_Ver = new ol.layer.Vector({
  source: vsGob_Ver,
  style: function(feature, resolution) {
  	
	var texto = feature.get(nom_mostrar);
	var fuente = "";

	if(resolution <= 50) {
		fuente = '9px Calibri,sans-serif';
	}else {
		fuente = '0px Calibri,sans-serif';
	}

	var styleC = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: getColor('Vereda',parseFloat(feature.get(val_mostrar)),feature.get(nom_mostrar))
          //color:'#FBFB55' 
        }),
        stroke: new ol.style.Stroke({
          color: '#727220',
          width: 1
        }),
        text: new ol.style.Text({
          font: fuente,
          text: texto,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
          })
        })
    })];
    return styleC;

  }
});
lvGob_Ver.setVisible(false);
/***************************************************************************************************
 *--------------------------------------------CAPA BASE--------------------------------------------
 ***************************************************************************************************/

var openSeaMapLayer =    new ol.layer.Tile({
      source: new ol.source.OSM({
        attributions: [
          new ol.Attribution({
            html: 'Tiles &copy; <a href="http://www.opencyclemap.org/">' +
                'OpenCycleMap</a>'
          }),
          ol.source.OSM.ATTRIBUTION
        ],
        url: 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
 })
  });
