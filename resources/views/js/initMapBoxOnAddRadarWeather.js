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


// Check if the Mapbox-GL style is loaded.
function checkIfMapboxStyleIsLoaded() {
    if (map.isStyleLoaded()) {
        return true; // When it is safe to manipulate layers
    } else {
        return false; // When it is not safe to manipulate layers
    }
}

swapLayer3();

function swapLayer3() {
    var check = checkIfMapboxStyleIsLoaded();
    if (!check) {
        // It's not safe to manipulate layers yet, so wait 200ms and then check again
        setTimeout(function() {
            swapLayer3();
        }, 200);
        return;
    }

    // Whew, now it's safe to manipulate layers!
   // the rest of the swapLayer logic goes here...


    // if (map.getSource('radar')) map.removeSource('radar');
    // if (map.getSource('radar-layer')) map.removeSource('radar-layer');

    map.addSource('radar', {
        type: 'image',
        url: getPath(),
        coordinates: [
            [-122.4948377165104,37.82133354817967],[-122.4633308736146,37.8318525307263],[-122.4545015832759,37.82833843766214],[-122.4962775580445,37.81274403465617]
        ]
    });

    map.addLayer({
        id: 'radar-layer<php echo rand(1,10000); ?>',
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

}

// radar