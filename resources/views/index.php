<!DOCTYPE html>

<html>
    <head>
        <!-- LOAD JS and CSS Step JS-->
        <?php include("part_head.php"); ?>
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <script src="https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js?nocache=<?php echo rand(1,10000); ?>"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css?nocache=<?php echo rand(1,10000); ?>" rel="stylesheet" />
        <script src="https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v3.0.11/turf.min.js"></script>
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.js"></script>
        <link rel="stylesheet"
                href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css"
                type="text/css"   />
        <script src="https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css" rel="stylesheet" />
        <script
                src="https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v2.0.0/turf.min.js"
                charset="utf-8"
        ></script>
        <link href="css/kittyhawkmap.css" rel="stylesheet" />
    </head>
    <body onload="">
        <div id="wrapper">
            <div id="page-wrapper" class="gray-bg dashbard-1" style="padding-bottom: 100px">
                <?php include("part_topbar.php"); ?> <!-- Top Page Header Include -->
                <?php require_once("part_body_flight_page.php"); ?><!-- Body Page -->
            </div>
        </div>
    </body>
</html>


