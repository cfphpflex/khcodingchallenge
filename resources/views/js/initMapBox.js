// instantiate new MapBox using accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoicGFudW1hcCIsImEiOiJjand5MHZiZTAweTkyM3lwZ3g4dHlhZHY3In0.FE_j4gHJdMTmLPJsMkhUKw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    //style: 'mapbox://styles/mapbox/light-v10',
    //style: 'mapbox://styles/mapbox/streets-v11',  //street
    //  style: 'mapbox://styles/mapbox/satellite-v9', //hosted style id
    center: [-122.4789600484191,37.8201464706122],// starting position
    zoom: 13,
});
