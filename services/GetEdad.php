<?php
require_once('./conexion.php');


$tabla=$_GET["tabla"];

if($tabla==1){
	$query_sql = "
	select array_to_json(array_agg(row.*)) AS edad 
	from (
	SELECT *
	FROM (	
		select descripcion||' ('||inicio||'-'||fin||')' as label,cod as value
		from salud.p_sius_grupoetario 
	)t
	) row;
	";
		
}else if($tabla==2){
	$query_sql = "
	select array_to_json(array_agg(row.*)) AS edad 
	from (
	SELECT *
	FROM (	
		select descripcion as label,cod as value
		from salud.p_sius_grupoquin 
		order by inicio
	)t
	) row;
	";
}else if($tabla==3){
	$query_sql = "
	select array_to_json(array_agg(row.*)) AS edad 
	from (
	SELECT *
	FROM (	
		select descripcion as label,cod as value
		from salud.p_sius_tresgrupos
		order by inicio
	)t
	) row;
	";
}
//equipo_pruebas  'N'
 //echo "$query_sql<br>";

$resultado = pg_query($cx, $query_sql) or die(pg_last_error());
$total_filas = pg_num_rows($resultado);

while ($fila_vertical = pg_fetch_assoc($resultado)) {
	$row_to_json = $fila_vertical['edad'];							
	echo "".$row_to_json."";
}	
// Liberando el conjunto de resultados
pg_free_result($resultado);

// Cerrando la conexión
pg_close($cx);
?>
