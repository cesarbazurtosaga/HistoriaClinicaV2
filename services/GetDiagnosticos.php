<?php
require_once('./conexion.php');

function stripAccents($string){
	return strtr($string,'àáâãäçèéêëìíîïòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝ','aaaaaceeeeiiiiooooouuuuyyAAAAACEEEEIIIIOOOOOUUUUY');
}

$tabla=$_GET["tabla"];
$clave=stripAccents(strtolower($_GET["clave"]));

if($tabla==1){
	
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
	SELECT *
	FROM (	
		select gecodigo,gecodigo||' - '||genombre genombre
		from salud.p_sius_cie10 g
	)t   where  lower ( translate (genombre, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') )  like '%$clave%'
	order by gecodigo  
	) row;
	";	
}elseif($tabla==2){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
	SELECT *
	FROM (	
		select gecodigo,gecodigo||' - '||genombre genombre
		from salud.p_sius_grupocie10 g
	)t  where lower ( translate (genombre, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') )  like '%$clave%'
	order by gecodigo
	) row;
	";	
}elseif($tabla==3){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
		select codigo gecodigo,codigo||' - '||descripcion genombre
		from salud.p_sius_lista667 
	 	where lower ( translate (descripcion, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') )  like '%$clave%'
	order by gecodigo
	) row;
	";	
}elseif($tabla==4){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
		select codigo gecodigo,codigo||' - '||descripcion genombre
		from salud.p_sius_lista105 
	 	where lower ( translate (descripcion, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') )  like '%$clave%'
	order by gecodigo
	) row;
	";	
}elseif($tabla==5){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
		select codigo gecodigo,codigo||' - '||descripcion genombre
		from salud.p_sius_taucher 
	 	where lower ( translate (descripcion, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') )  like '%$clave%'
	order by gecodigo
	) row;
	";	
}elseif($tabla==6){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
		select codigo gecodigo,codigo||' - '||descripcion genombre
		from salud.p_sius_taucher_subgrupo 
	 	where lower ( translate (descripcion, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') ) like '%$clave%'
	order by gecodigo
	) row;
	";	
}elseif($tabla==7){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
		select codigo gecodigo,codigo||' - '||descripcion genombre
		from salud.p_sius_taucher_grupo 
	 	where lower ( translate (descripcion, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') ) like '%$clave%'
	order by gecodigo
	) row;
	";	
}elseif($tabla==8){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
		select codigo gecodigo,codigo||' - '||descripcion genombre
		from salud.p_sius_lista667_grupo 
	 	where lower ( translate (descripcion, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ') ) like '%$clave%'
	order by gecodigo
	) row;
	";	
}

//equipo_pruebas  'N'
 //echo "$query_sql<br>";

$resultado = pg_query($cx, $query_sql) or die(pg_last_error());
$total_filas = pg_num_rows($resultado);

while ($fila_vertical = pg_fetch_assoc($resultado)) {
	$row_to_json = $fila_vertical['diagnosticos'];							
	echo "getDiagnostico(".$row_to_json.")";
}	
// Liberando el conjunto de resultados
pg_free_result($resultado);

// Cerrando la conexión
pg_close($cx);
?>
