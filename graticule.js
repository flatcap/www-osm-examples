
var map = new ol.Map({
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM()
		})
	],
	renderer: 'canvas',
	target: 'map',
	view: new ol.View({
		center: ol.proj.transform([4.8, 47.75], 'EPSG:4326', 'EPSG:3857'),
		zoom: 5
	})
});

// Create the graticule component
var graticule = new ol.Graticule({
	// the style to use for the lines, optional.
	strokeStyle: new ol.style.Stroke({
		color: 'rgba(255,120,0,0.9)',
		width: 2,
		lineDash: [0.5, 4]
	})
});
graticule.setMap(map);
