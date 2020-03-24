<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <!-- LOAD JS and CSS Step JS-->
        @php
            //echo(app_path());
            $viewPath= "/../resources/views/";
            //echo(app_path().$viewPath);
            include(app_path().$viewPath.'part_head.php');
            include(app_path().$viewPath.'css/kittyhawkflightblade.css');
        @endphp
        <script src="https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js?nocache=0"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css?nocache=0" rel="stylesheet" />
        <script src="https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v3.0.11/turf.min.js"></script>
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.js"></script>
        <link rel="stylesheet"
                href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css"
                type="text/css"   />
    </head>

    <body onload="">

        <div id="wrapper">
            <div id="page-wrapper" class="gray-bg dashbard-1" style="padding-bottom: 100px">

                <!-- Body Page -->
                @php
                    $viewPath= "/../resources/views/";
                    //echo(app_path().$viewPath);
                    include(app_path().$viewPath.'part_topbar.php');
                    include(app_path().$viewPath.'part_body_flight_page.php');
                @endphp

            </div>
        </div>

    </body>

    <!-- Scripts to load -->
    @php
        $viewPath= "/../resources/views/";
        // echo(app_path().$viewPath);
        include(app_path().$viewPath.'part_scripts.php');
    @endphp

</html>


