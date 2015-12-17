var validaSel = 0;
var capa = 'LayerMun';
var tipo_ley = 1;
var global_sectores, global_indicador, global_valores, global_parametros, padre;
var host = "http://saga.cundinamarca.gov.co";
var date_values;
var styleCache = {};
var feature_select;
var ingreso_app = 0;

var valida_feature, feature_sel;
var highlight, highlight2;
var lastPixel = [];
var escalaVer, escalaMun, escalaPro, escalaDep;
var nom_mostrar = "nom",
    val_mostrar = "cont",
    tit_tooltip = "",
    nom_padre = "padre",
    titulo_map = "HISTORIAS CLINICAS",
    tematica = "Salud",
    seleccion_diagnostico=$("#Diagnostico").text();
    
var excepciones = ["total", "poblacion", "area", "nbi", "presupuesto_aprobado", "presupuesto_ejecutado", "codigo_mun", "codigo_mun", "cod_mun", "cod_dane"];
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var resolutions_zoom = [305, 152, 76, 38];

$("#InpClave").attr("disabled", true);
String.prototype.trunc = String.prototype.trunc ||
    function(n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this.substr(0);
    };

$('#datetimepicker_ini').datetimepicker({
    language: 'es',
    viewMode: 'months',
    defaultDate: moment("01/01/"+moment().format("YYYY"),"DD/MM/YYYY").format("DD/MM/YYYY"),
    pickTime: false
});
$('#datetimepicker_fin').datetimepicker({
    language: 'es',
    viewMode: 'months',
    defaultDate: moment().format("DD/MM/YYYY"),
    pickTime: false
});
$('#datetimepicker_fin').data("DateTimePicker").setMinDate($('#datetimepicker_ini').data("DateTimePicker").getDate());
$('#datetimepicker_ini').data("DateTimePicker").setMaxDate($('#datetimepicker_fin').data("DateTimePicker").getDate());
$("#datetimepicker_ini").on("dp.change",function (e) {
   $('#datetimepicker_fin').data("DateTimePicker").setMinDate(e.date);                     
});
$("#datetimepicker_fin").on("dp.change",function (e) {
   $('#datetimepicker_ini').data("DateTimePicker").setMaxDate(e.date);
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	    var idnewtab = ($(e.target).attr('href'));
	    $(idnewtab + "Color").addClass("text-primary");
	    
	    var idoldtab = ($(e.relatedTarget).attr('href'));
	    $(idoldtab + "Color").removeClass("text-primary");
	    
	});
});

waitingDialog.show();
