
var overviewMapControl = new ol.control.OverviewMap({
	// see in overviewmap-custom.html to see the custom CSS used
	className: 'ol-overviewmap ol-custom-overviewmap',
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM({
				'url': '//{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
			})
		})
	],
	collapseLabel: '\u00BB',
	label: '\u00AB',
	collapsed: false
});

var map = new ol.Map({
	controls: ol.control.defaults().extend([
		overviewMapControl
	]),
	interactions: ol.interaction.defaults().extend([
		new ol.interaction.DragRotateAndZoom()
	]),
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM()
		})
	],
	target: 'map',
	view: new ol.View({
		center: [500000, 6000000],
		zoom: 7
	})
});
