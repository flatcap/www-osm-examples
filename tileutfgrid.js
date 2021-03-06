
var mapLayer = new ol.layer.Tile({
	source: new ol.source.TileJSON({
		url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.json'
	})
});

var gridSource = new ol.source.TileUTFGrid({
	url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.json'
});

var gridLayer = new ol.layer.Tile({source: gridSource});

var view = new ol.View({
	center: [0, 0],
	zoom: 1
});

var mapElement = document.getElementById('map');
var map = new ol.Map({
	layers: [mapLayer, gridLayer],
	target: mapElement,
	view: view
});

var infoElement = document.getElementById('country-info');
var flagElement = document.getElementById('country-flag');
var nameElement = document.getElementById('country-name');

var infoOverlay = new ol.Overlay({
	element: infoElement,
	offset: [15, 15],
	stopEvent: false
});
map.addOverlay(infoOverlay);

var displayCountryInfo = function(coordinate) {
	var viewResolution = /** @type {number} */ (view.getResolution());
	gridSource.forDataAtCoordinateAndResolution(coordinate, viewResolution,
			function(data) {
				// If you want to use the template from the TileJSON,
				//	load the mustache.js library separately and call
				//	info.innerHTML = Mustache.render(gridSource.getTemplate(), data);
				mapElement.style.cursor = data ? 'pointer' : '';
				if (data) {
					/* jshint -W069 */
					flagElement.src = 'data:image/png;base64,' + data['flag_png'];
					nameElement.innerHTML = data['admin'];
					/* jshint +W069 */
				}
				infoOverlay.setPosition(data ? coordinate : undefined);
			});
};

$(map.getViewport()).on('mousemove', function(evt) {
	var coordinate = map.getEventCoordinate(evt.originalEvent);
	displayCountryInfo(coordinate);
});

map.on('click', function(evt) {
	displayCountryInfo(evt.coordinate);
});
