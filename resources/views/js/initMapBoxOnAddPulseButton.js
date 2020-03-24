

// Pulse button
//map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

map.addSource('points', {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-122.4775894668929,37.81196137150869]
                }
            }
        ]
    }
});
map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'points',
    'layout': {
        'icon-image': 'pulsing-dot'
    }
});

// End pulse  button

