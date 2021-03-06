
var styleFunction = function(feature, resolution) {
	var offset = 0;
	var name = feature.get('name'); // e.g. GMT -08:30
	var red = 255;
	var green = 255;
	if (!name) {
		name = 'GMT -08:30';
		red = 0;
	} else {
		green = 0;
	}
	var match = name.match(/([\-+]\d{2}):(\d{2})$/);
	if (match) {
		var hours = parseInt(match[1], 10);
		var minutes = parseInt(match[2], 10);
		offset = 60 * hours + minutes;
	}
	var date = new Date();
	var local = new Date(date.getTime() + (date.getTimezoneOffset() + offset) * 60000);
	// offset from local noon (in hours)
	var delta = Math.abs(12 - local.getHours() + (local.getMinutes() / 60));
	if (delta > 12) {
		delta = 24 - delta;
	}
	var opacity = 0.75 * (1 - delta / 12);
	return [new ol.style.Style({
		fill: new ol.style.Fill({
			// color: [0xff, 0xff, 0x33, opacity]
			color: [red, green, 0x33, opacity]
			// color: [255*Math.random(), 255*Math.random(), 255*Math.random(), 1]
		}),
		stroke: new ol.style.Stroke({
			color: '#ffffff'
		})
	})];
};

var vector = new ol.layer.Vector({
	source: new ol.source.KML({
		extractStyles: false,
		projection: 'EPSG:3857',
		url: 'data/kml/timezones.kml'
	}),
	style: styleFunction
});

var raster = new ol.layer.Tile({
	source: new ol.source.Stamen({
		layer: 'toner'
	})
});

var map = new ol.Map({
	layers: [raster, vector],
	target: 'map',
	view: new ol.View({
		center: [0, 0],
		zoom: 2
	})
});

var info = $('#info');
info.tooltip({
	animation: false,
	trigger: 'manual'
});

var displayFeatureInfo = function(pixel) {
	info.css({
		left: pixel[0] + 'px',
		top: (pixel[1] - 15) + 'px'
	});
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});
	if (feature) {
		info.tooltip('hide')
			.attr('data-original-title', feature.get('description'))
			.tooltip('fixTitle')
			.tooltip('show');
	} else {
		info.tooltip('hide');
	}
};

$(map.getViewport()).on('mousemove', function(evt) {
	displayFeatureInfo(map.getEventPixel(evt.originalEvent));
});

map.on('click', function(evt) {
	displayFeatureInfo(evt.pixel);
});
