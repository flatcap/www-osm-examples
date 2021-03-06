
var view = new ol.View({
	center: [0, 0],
	zoom: 2
});

var map = new ol.Map({
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM()
		})
	],
	target: 'map',
	controls: ol.control.defaults({
		attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			collapsible: false
		})
	}),
	view: view
});

var geolocation = new ol.Geolocation({
	projection: view.getProjection()
});

var track = new ol.dom.Input(document.getElementById('track'));
track.bindTo('checked', geolocation, 'tracking');

// update the HTML page when the position changes.
geolocation.on('change', function() {
	$('#accuracy').text(geolocation.getAccuracy() + ' [m]');
	$('#altitude').text(geolocation.getAltitude() + ' [m]');
	$('#altitudeAccuracy').text(geolocation.getAltitudeAccuracy() + ' [m]');
	$('#heading').text(geolocation.getHeading() + ' [rad]');
	$('#speed').text(geolocation.getSpeed() + ' [m/s]');
});

// handle geolocation error.
geolocation.on('error', function(error) {
	var info = document.getElementById('info');
	info.innerHTML = error.message;
	info.style.display = '';
});

var accuracyFeature = new ol.Feature();
accuracyFeature.bindTo('geometry', geolocation, 'accuracyGeometry');

var positionFeature = new ol.Feature();
positionFeature.setStyle(new ol.style.Style({
	image: new ol.style.Circle({
		radius: 6,
		fill: new ol.style.Fill({
			color: '#3399CC'
		}),
		stroke: new ol.style.Stroke({
			color: '#fff',
			width: 2
		})
	})
}));

positionFeature.bindTo('geometry', geolocation, 'position')
		.transform(function() {}, function(coordinates) {
			return coordinates ? new ol.geom.Point(coordinates) : null;
		});

var featuresOverlay = new ol.FeatureOverlay({
	map: map,
	features: [accuracyFeature, positionFeature]
});
