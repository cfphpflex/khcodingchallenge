// radar



// Radar
let frameCount = 5;
let currentImage = 0;

function getPath() {
    return (
        'https://docs.mapbox.com/mapbox-gl-js/assets/radar' +
        currentImage +
        '.gif'
    );
}
// Radar


map.addSource('radar', {
    type: 'image',
    url: getPath(),
    coordinates: [
        [-122.4948377165104,37.82133354817967],[-122.4633308736146,37.8318525307263],[-122.4545015832759,37.82833843766214],[-122.4962775580445,37.81274403465617]
    ]
});
map.addLayer({
    id: 'radar-layer',
    'type': 'raster',
    'source': 'radar',
    'paint': {
        'raster-fade-duration': 0
    }
});

setInterval(function() {
    currentImage = (currentImage + 1) % frameCount;
    map.getSource('radar').updateImage({ url: getPath() });
}, 200);

// radar