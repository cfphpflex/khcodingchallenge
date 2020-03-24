
<!-- MapBox Map-->
<div id='map' class='map'  style="height: 300px; width: 100%; border: 2px solid grey"></div>

<!--JS Script files -->
<script>
    let animationStep = 50;
    <!-- Body Page -->
    <?php
        $viewPathJS= app_path()."/../resources/views/js/";
        include( $viewPathJS.'initMapBox.js');
        include($viewPathJS.'initMapBoxDroneFligthPathAnimate.js');
    ?>

    map.on('load', function() {

        <?php
            $viewPathJS= app_path()."/../resources/views/js/";
            include( $viewPathJS.'initMapBoxOnAddPlacesSource.js');
            include( $viewPathJS.'initMapBoxOnAdd3dBuildings.js');  // Init MapBox
            include( $viewPathJS.'initMapBoxGetAllLayers.js');
            include( $viewPathJS.'initMapBoxOnDrawJSONLine.js');
            include( $viewPathJS.'initMapBoxOnAddPulseButton.js');
            include($viewPathJS.'initMapBoxOnAddRadarWeather.js');
        ?>

    });  // close map on

    <?php
        $viewPathJS= app_path()."/../resources/views/js/";
        include($viewPathJS.'initMapBoxOnAddRadarWeather.js');
        include($viewPathJS.'initMapBoxOnAddPulseButton2.js');  // Init MapBox
        //include($viewPathJS.'initMapBoxOnAddFeatureCollection.js');  // Init MapBox
    ?>

    let geojson = {
        type: 'FeatureCollection',
        features: [ ,
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-122.4775894668929,37.81196137150869]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Flight End'
                }
            }]
    };

    if (map.getSource('markerDrone')) map.removeSource('markerDrone');
    // add markers to map
    geojson.features.forEach(function(marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'markerDrone';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });

    geojson = {
        type: 'FeatureCollection',
        features: [ ,
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-122.4835292756866,37.8297123835807]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Flight End'
                }
            }]
    };

    // add markers to map
    if (map.getSource('markerController')) map.removeSource('markerController');
    geojson.features.forEach(function(marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'markerController';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });



    // Check if the Mapbox-GL style is loaded.
    function checkIfMapboxStyleIsLoaded1() {
        if (map.isStyleLoaded()) {
            return true; // When it is safe to manipulate layers
        } else {
            return false; // When it is not safe to manipulate layers
        }
    }

    swapLayer2();
    function swapLayer2() {
        var check = checkIfMapboxStyleIsLoaded1();
        if (!check) {
            // It's not safe to manipulate layers yet, so wait 200ms and then check again
            setTimeout(function() {
                swapLayer2();
            }, 200);
            return;
        }

        // Whew, now it's safe to manipulate layers!
       // the rest of the swapLayer logic goes here...
        if (map.getSource('contours')) map.removeSource('contours');
        map.addSource('contours', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-terrain-v2'
        });
        map.addLayer({
            'id': 'contours',
            'type': 'line',
            'source': 'contours',
            'source-layer': 'contour',
            'layout': {
                'visibility': 'visible',
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#877b59',
                'line-width': 1
            }
        });

        // Start the animation.
        //animate(counter);
    }

    simpleView=1;
    zoomView = 14;
    pitchDegrees = 0;
    let animationTimeMs = 500;

</script>

<!--  Flights DATATABLE -->
<?php
    $viewPath= app_path()."/../resources/views/";
    include($viewPath.'part_body_managerflights.php');
?>
