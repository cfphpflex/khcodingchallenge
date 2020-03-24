
// GET ALL map layer IDs
let getAllLayers = map.getStyle().layers;
//console.log( "get All Layers");
let i = 0;
for (var obj in getAllLayers) {
    //console.log(getAllLayers[i].id)
    if( getAllLayers[i].id== "places"){
        //console.log(getAllLayers[i].id);
    }
    i++
}