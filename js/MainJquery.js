$(document).ready(function() {
  
	//TITULO DE MAPA
	$("#title").text(titulo_map);
	//console.log(window.location.href);
	if(window.location.href.search("this_map")>1){
		$("#Comparativos").hide();	
	}
	$("#TodosCasos").click(function() {
		$("#CodDiagnostico").empty();
		$("#InpClave").val("");
		$("#Diagnostico").empty();
		seleccion_diagnostico="";
		filtrar();
	});
	
	$("#Comparativos").click(function() {
			window.open('http://saga.cundinamarca.gov.co/apps/comparativeSalud/','_blank');
		});
 	 $("#InpClave").autocomplete({
	    source: function (request, response) {
	    	 
	        $.ajax({
          		  url: "./services/GetDiagnosticos.php",
          		  data:{
          		  	clave:request.term.toUpperCase(),
          		  	tabla:$('#TablaGrupo').val()
          		  },
		          dataType: "jsonp",
		          jsonpCallback:'getDiagnostico',
		          success: function(data) {
		          	/*console.log("data");
		          	console.log(data);*/
		          	if(data){
		          		response($.map(data, function (el) {
		                return {
		                    label: el.f2,
		                    value: el.f2,
		                    codigo:el.f1,
		                    nombre:el.f2		                };
		            	}));
		          	}
		          }
	        });
	    },
	    minLength: 3,
	    select: function (event, ui) {
	    	$("#CodDiagnostico").empty().append(ui.item.codigo);
	        seleccion_diagnostico=ui.item.nombre;
	    },
	    open: function () {
	        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
	        $(this).addClass("list-group");
	    },
	    close: function () {
	        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
	    }
	}).keypress(function (e) {
	    if (e.keyCode === 13) {
	        e.preventDefault();
	        return false;
	    }
	}).autocomplete("instance")._renderItem = function (ul, item) {
	    ul.addClass("list-group");
	    ul.addClass("Ancho");
	    
	    return $( '<li class="list-group-item" style="max-width:200px;">' )
	        .append('<h6>' + item.label + '</h6>' +
	                '</li>').appendTo(ul);     
	};
	
	
	$('#BorrarDiag').click(function(){
		$("#InpClave").val("").focus();
	});
	
	$("#TablaGrupo").change(function(){
		$("#InpClave").val("").focus();		
	});
	
	$("#MostrarBusquedas").click(function(){
		$("#panelBusquedas").show( 300, function() {
				$("#MostrarBusquedas").hide(300);
		});
	});	

  	$("#MostrarBusquedas").hide(100);
  	$("#OcultarBusqueda").click(function(){
		$("#panelBusquedas").hide( 300, function() {
				$("#MostrarBusquedas").show(300);
		});
	});
	
	$("#MostrarBusquedas").click(function(){
		$("#panelBusquedas").show( 300, function() {
				$("#MostrarBusquedas").hide(300);
		});
	});
    
});

function getMultiSelect(id){
	var brands = $('#'+id+' option:selected');
    var selection = [];
    $(brands).each(function(index, brand){
           selection.push((brand.value));
    });
    return selection;
}

function getparametros(){
	var escala="",msProcedencia="";
	var Procedencia=$('#msProcedencia').val();
	$( "select option:selected" ).each(function() {
   	  var str = $( this ).text();
      if(str=="Departamento"){
		escala='diag_dpto';
		lvGob_Dep.setVisible(true);
		lvGob_Prov.setVisible(false);
		lvGob_Mun.setVisible(false);
		if(Procedencia=="procedencia"){
			msProcedencia="cod_dpto";
		}else {
			msProcedencia="cod_dpto_aten";
		}
      }else if(str=="Provincia"){
		escala=	'diag_prov';
		lvGob_Dep.setVisible(false);
		lvGob_Prov.setVisible(true);
		lvGob_Mun.setVisible(false);
		if(Procedencia=="procedencia"){
			msProcedencia="cod_prov";
		}else{
			msProcedencia="cod_prov_aten";
		}
      }else if(str=="Municipio"){
		escala='diag_mun';
		lvGob_Dep.setVisible(false);
		lvGob_Prov.setVisible(false);
		lvGob_Mun.setVisible(true);
		if(Procedencia=="procedencia"){
			msProcedencia="municipio";
		}else{
			msProcedencia="municipio_aten";
		}
      }
    });
	var fechaini=$('#datetimepicker_ini').data("DateTimePicker").getDate().format('YYYY-MM-DD');
  	var fechafin=$('#datetimepicker_fin').data("DateTimePicker").getDate().format('YYYY-MM-DD');
  	var CodDiagnostico=$('#CodDiagnostico').text();
  	var sexo=$('#sexo').val();
  	var msEdad=getMultiSelect('msEdad');
  	var msTipoRegimen=getMultiSelect('msTipoRegimen');
  	var msEPS=getMultiSelect('msEPS');
  	var msEtnia=getMultiSelect('msEtnia');
  	var msEstadoCivil=getMultiSelect('msEstadoCivil');
  	var msTipoAtencion=getMultiSelect('msTipoAtencion');
  	var campocodDiag="grupo_codigo_cie10";
  	if(CodDiagnostico==""){
  		campocodDiag=1;
  		CodDiagnostico=1;
  	}else if(CodDiagnostico=="GRUSG1"){
  		campocodDiag='cod_chik';
  		CodDiagnostico=1;
  	}else if(CodDiagnostico!=""){
  		if($('#TablaGrupo').val()=="1"){
  			campocodDiag='cie10';
  			CodDiagnostico=CodDiagnostico;	
  		}else if($('#TablaGrupo').val()=="2"){
  			campocodDiag='grupo_codigo_cie10';
  			CodDiagnostico=CodDiagnostico;
  		}
  		
  	}
  	
  	var parametros = {
	    fechaini:fechaini,
	    fechafin:fechafin,
	    grupodiag:campocodDiag,
	    CodDiagnostico:CodDiagnostico,
	    escala:escala,
	    sexo:sexo,
	    msEdad:msEdad,
	    msEstadoCivil:msEstadoCivil,
	    msTipoRegimen:msTipoRegimen,
	    msEPS:msEPS,
	    msEtnia:msEtnia,	    
	    msTipoAtencion:msTipoAtencion,
	    msProcedencia:msProcedencia	    
	};
	//featureOverlay1.removeFeature(highlight2);
	$("#Diagnostico").empty().append(seleccion_diagnostico);
	return parametros; 
}

function filtrar(){
	refreshfeatures("");   
}

    $('#msEtnia,#msTipoRegimen,#msEPS,#msEdad,#msTipoAtencion,#msEstadoCivil').multiselect({
    	includeSelectAllOption: true,
    	enableFiltering: true,
    	selectAllText:'Todos',
    	enableCaseInsensitiveFiltering: true,
    	buttonWidth: '132px',
        dropRight: true,
        maxHeight: 250,
        filterPlaceholder:'Buscar...',
        buttonText: function(options, select) {
                if (options.length === 0) {
                    return 'No hay Selección';
                }
                else if (options.length > 3) {
                    return 'Mas de 3 Selecciónados';
                }
                 else {
                     var labels = [];
                     options.each(function() {
                         if ($(this).attr('label') !== undefined) {
                             labels.push($(this).attr('label'));
                         }
                         else {
                             labels.push($(this).html());
                         }
                     });
                     return labels.join(', ') + '';
                 }
            }
        
    });
    
	$.getJSON( "./services/GetEtnia.php", function( options ) {
		
		$('#msEtnia').multiselect('dataprovider', options); 
 	});	

    $.getJSON( "./services/GetTipoRegimen.php", function( options ) {
		$('#msTipoRegimen').multiselect('dataprovider', options); 
 	});	
 	$.getJSON( "./services/GetEPS.php", function( options ) {
		$('#msEPS').multiselect('dataprovider', options); 
 	});	
 	$.getJSON( "./services/GetEdad.php", function( options ) {
		$('#msEdad').multiselect('dataprovider', options); 
 	});	
	
	$.getJSON( "./services/GetTipoAtencion.php", function( options ) {
		$('#msTipoAtencion').multiselect('dataprovider', options); 
 	});	
 	$.getJSON( "./services/GetEstadoCivil.php", function( options ) {
		$('#msEstadoCivil').multiselect('dataprovider', options); 
 	});	
	
	