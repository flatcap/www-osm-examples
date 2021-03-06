
var style1 = new ol.style.Style({
	fill: new ol.style.Fill({
		color: 'rgba(255, 255, 255, 0.5)'
	}),
});
var style2 = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: '#00FF00',
		width: 1
	}),
});
var style3 = new ol.style.Style({
	text: new ol.style.Text({
		font: '12px Calibri,sans-serif',
		fill: new ol.style.Fill({
			color: '#000'
		}),
		stroke: new ol.style.Stroke({
			color: '#fff',
			width: 3
		})
	})
});

var styles = [style1, style2, style3];

var vectorLayer = new ol.layer.Vector({
	source: new ol.source.GeoJSON({
		projection: 'EPSG:3857',
		url: 'data/geojson/countries.geojson'
	}),
	style: function(feature, resolution) {
		style3.getText().setText(resolution < 5000 ? feature.get('name') : '');
		return styles;
	}
});

var map = new ol.Map({
	layers: [
		new ol.layer.Tile({
			source: new ol.source.MapQuest({layer: 'sat'})
		}),
		vectorLayer
	],
	target: 'map',
	view: new ol.View({
		// center: [0, 0],
		center: ol.proj.transform([-3.143848, 54.699234], 'EPSG:4326', 'EPSG:3857'),
		zoom: 5
	})
});

var highlightStyleCache = {};

var featureOverlay = new ol.FeatureOverlay({
	map: map,
	style: function(feature, resolution) {
		var text = resolution < 5000 ? feature.get('name') : '';
		if (!highlightStyleCache[text]) {
			highlightStyleCache[text] = [new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: '#f00',
					width: 1
				}),
				fill: new ol.style.Fill({
					color: 'rgba(255,0,0,0.1)'
				}),
				text: new ol.style.Text({
					font: '12px Calibri,sans-serif',
					text: text,
					fill: new ol.style.Fill({
						color: '#000'
					}),
					stroke: new ol.style.Stroke({
						color: '#f00',
						width: 3
					})
				})
			})];
		}
		return highlightStyleCache[text];
	}
});

var highlight;
var displayFeatureInfo = function(pixel) {

	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});

	var info = document.getElementById('info');
	if (feature) {
		info.innerHTML = feature.getId() + ': ' + feature.get('name');
	} else {
		info.innerHTML = '&nbsp;';
	}

	if (feature !== highlight) {
		if (highlight) {
			featureOverlay.removeFeature(highlight);
		}
		if (feature) {
			featureOverlay.addFeature(feature);
		}
		highlight = feature;
	}

};

$(map.getViewport()).on('mousemove', function(evt) {
	var pixel = map.getEventPixel(evt.originalEvent);
	displayFeatureInfo(pixel);
});

map.on('click', function(evt) {
	displayFeatureInfo(evt.pixel);
});
