
// Map views always need a projection.	Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
var extent = [0, 0, 1024, 968];
var projection = new ol.proj.Projection({
	code: 'xkcd-image',
	units: 'pixels',
	extent: extent
});

var map = new ol.Map({
	layers: [
		new ol.layer.Image({
			source: new ol.source.ImageStatic({
				attributions: [
					new ol.Attribution({
						html: '&copy; <a href="http://xkcd.com/license.html">xkcd</a>'
					})
				],
				url: 'http://imgs.xkcd.com/comics/online_communities.png',
				projection: projection,
				imageExtent: extent
			})
		})
	],
	target: 'map',
	view: new ol.View({
		projection: projection,
		center: ol.extent.getCenter(extent),
		zoom: 2
	})
});
