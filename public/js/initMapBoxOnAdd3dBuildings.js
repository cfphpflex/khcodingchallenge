
//START 3D Insert the layer beneath any symbol layer.
alllayers = map.getStyle().layers;
let labelLayerId;
l=0;
for (var l = 0; l < alllayers.length; l++) {
    if (alllayers[l].type === 'symbol' && alllayers[l].layout['text-field']) {
        labelLayerId = alllayers[l].id;
        break;
    }
}

map.addLayer(
    {
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
        }
    },
    labelLayerId
);

// END 3d layers