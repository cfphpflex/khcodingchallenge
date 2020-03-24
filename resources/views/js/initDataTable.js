
<script>
var editor_userflighttable;
$(document).ready(function() {

    let HOST_BUILDER = function () {
        let host = window.location.hostname;
        //var schema = window.location.protocol;
        let url = window.location.href;
        let arr = url.split("/");
        let schema = arr[0];

        switch (host) {

            case 'localhost' :
                host = "http://localhost:8000/"
                // host = schema + '//' + host;
                break;

            default:
                if (window.location.port !== "") {
                    host += ':' + window.location.port;
                }
                host = schema + '//' + host;
                break;
        }

        return host;
    };

    //HOST_BUILDER to set dev, staging, prod urls
    let getuserflightsURL = "./getuserflights"; //IFFHOST_BUILDER()

    editor_userflighttable = new $.fn.dataTable.Editor( {
        ajax: {
            "type": "GET",
            "url": getuserflightsURL,

            retrieve: true,
            done: function (xhr, error, code) {
                console.log(xhr);
                console.log(code);
            },
            error: function (xhr, error, code) {
                console.log(xhr);
                console.log(code);
            }
        },
        async: true,
        table: "#userflighttable",
        idSrc:  'id',
        template: '#customForm',
        fields: [{
            label: "ID:",
            name: "id"
        }, {
            label: "Serial Number:",
            name: "serialnumber",
            type: 'text'
        }, {
            label: "Latitude:",
            name: "latitude",
            type: 'text'
        }, {
            label: "Longitude:",
            name: "longitude",
            type: 'text'
        }, {
            label: "Flightpath:",
            name: "flightpath",
            type: 'text'
        }, {
            label: "Height:",
            name: "height",
            type: 'text'
        }, {
            label: "Temperature:",
            name: "temperature",
            type: 'text'

        },

            {
                label: "Weather:",
                name:  "weather",
                type:  "select",
                options: [
                    { label: "Sunny", value: "Sunny" },
                    { label: "Clowdie",value: "Clowdie" },
                    { label: "Rainy",           value: "Rainy" }
                ]
            },
            {
                label: "Status:",
                name:  "status",
                type:  "select",
                options: [
                    { label: "Active", value: "Active" },
                    { label: "Inactive",value: "Inactive" }
                ]
            },


            {
                label: "Date:",
                name: "updated_at",
                type: 'datetime'
            }

        ],
        i18n: {
            create: {
                title:  "Create New Flight"
            },
            edit: {
                title:  "Edit Existing Flight"
            }
        }
    });

    editor_userflighttable.on( 'preSubmit', function ( e, o, action ) {
        if ( action !== 'remove' ) {
            let serialnumber = this.field( 'serialnumber' );
            if ( ! serialnumber.isMultiValue() ) {
                if ( ! serialnumber.val() ) {
                    serialnumber.error( 'A serial number is required' );
                }

                if ( serialnumber.val().length < 1 ) {
                    serialnumber.error( 'The Longitude requires at least one character' );

                }
                if ( serialnumber.val().length > 20 ) {
                    serialnumber.error( 'The Longitude length  must be less that 20 characters' );
                }
            }

            var Latitude = this.field( 'latitude' );
            if ( ! Latitude.isMultiValue() ) {
                if ( ! Latitude.val() ) {
                    Latitude.error( 'A Latitude is required' );
                }
                if ( Latitude.val().length < 1 ) {
                    Latitude.error( 'The Longitude length must be greater that 1 characters' );

                }
                if ( Latitude.val().length > 20 ) {
                    Latitude.error( 'The Longitude length  must be less that 20 characters' );
                }
            }

            let Longitude = this.field( 'longitude' );
            if ( ! Longitude.isMultiValue() ) {
                if ( ! Longitude.val() ) {
                    Longitude.error( 'A Longitude is required' );
                }

                if ( Longitude.val().length < 1 ) {
                    Longitude.error( 'The Longitude length must be greater that 1 characters' );

                }
                if ( Longitude.val().length > 20 ) {
                    Longitude.error( 'The Longitude length  must be less that 20 characters' );
                }
            }

            let height = this.field( 'height' );
            if ( ! height.isMultiValue() ) {
                if ( ! height.val() ) {
                    height.error( 'A height is required' );
                }

                if ( height.val().length < 1 ) {
                    height.error( 'The height length must be greater than 1 number' );

                }
                if ( height.val().length > 5 ) {
                    height.error( 'The height length  must be less than 5 numbers' );
                }

                let heightNum= parseInt(height.val());

                if ( ! Number.isInteger(heightNum) ) {
                    height.error( 'The height must be a number less than 4 in length' );
                }
            }

            let temperature = this.field( 'temperature' );
            if ( ! temperature.isMultiValue() ) {
                if ( ! temperature.val() ) {
                    temperature.error( 'A temperature is required' );
                }

                if ( temperature.val().length < 1 ) {
                    temperature.error( 'The temperature length must be greater than 1 number' );

                }
                if ( temperature.val().length > 5 ) {
                    temperature.error( 'The temperture length  must be less than 5 numbers' );
                }

                let tempertureNum= parseInt(temperature.val());

                if ( ! Number.isInteger(tempertureNum) ) {
                    temperature.error( 'The temperture must be a number less than 4 in length' );
                }
            }

            let weather = this.field( 'weather' );
            if ( ! weather.isMultiValue() ) {
                if ( ! weather.val() ) {
                    weather.error( 'A weather is required' );
                }

                if ( weather.val().length < 1 ) {
                    weather.error( 'The weather length must be greater than 1 letter' );

                }
                if ( weather.val().length > 15 ) {
                    weather.error( 'The weather length must be less than 15 letter' );
                }

                let weatherString=  weather.val();

                if ( Number.isInteger(weatherString) ) {
                    weather.error( 'The weather must be a letters greater than 1 and less than 15 letters in length' );
                }
            }

            // ... additional validation rules

            // If any error was reported, cancel the submission so it can be corrected
            if ( this.inError() ) {
                return false;
            }
        }
    } );



    var data_table, row_num=1, col_num=3, row_cell=1, col_cell=0, iter=0;
    var cols = [
        { "mDataProp": "Field1", sTitle: "id", sType : "numeric"},
        { "mDataProp": "Field2", sTitle: "serialnumber", sType : "numeric"},
        { "mDataProp": "Field3" , sTitle: "latitude", sType : "numeric"},
        { "mDataProp": "Field4" ,  sTitle: "longitude", sType : "numeric"},
        { "mDataProp": "Field5" ,  sTitle: "flightpath", sType : "numeric"},
        { "mDataProp": "Field6" ,  sTitle: "height", sType : "numeric"},
        { "mDataProp": "Field7" ,  sTitle: "temperature", sType : "numeric"},
        { "mDataProp": "Field8" ,  sTitle: "weather", sType : "string"},
        { "mDataProp": "Field9" ,  sTitle: "status", sType : "string"},
        { "mDataProp": "Field10" ,  sTitle: "updated_at", sType : "date"}
    ];


    function initDT(){

        let table =  $('#userflighttable').DataTable( {
            "createdRow": function ( row, data, index ) {
                // set row  lat lon from datatable
                let thisRowLat = data.latitude;
                let thisRowLon = data.longitude;

                // failed: weather= callAPIDarkSky(thisRowLat, thisRowLon);

                /// call darksky api
                urlDarkSkyAPI = './getDarkSkyWeather';
                $.ajax({
                    url: urlDarkSkyAPI+"/?lat="+thisRowLat+"&lon="+thisRowLon,
                    type: 'GET',
                    dataType: 'json',
                    success: function(res) {

                        //console.log(res);
                        let thisResWeather = '['+res+']';
                        let weather = JSON.parse(thisResWeather);
                        //console.log(weather);

                        let weathernow = "";
                        weathernow = (weather[0]['currently'])?weather[0]['currently']['summary']:"N/A";
                        //console.log(weather[0]['currently'] );
                        $('td', row).eq(7).html(weathernow);
                        $('td', row).eq(7).addClass('highlight');

                    }
                });

                //==========================
                // flightadvisories= callAPIKittyHawk(thisRowLat, thisRowLon);

                // call kittyhawk api
                urlKittyHawkAdvisories = './getAtlasadvisories';
                $.ajax({
                    url: urlKittyHawkAdvisories+"/?lat="+thisRowLat+"&lon="+thisRowLon,
                    type: 'GET',
                    dataType: 'json',
                    success: function(res) {
                        let thisRes = '['+res+']';
                        //console.log(thisRes);

                        let flightadvisories = JSON.parse(thisRes);

                        //console.log(flightadvisories[0]['status']);
                        airspace = (flightadvisories[0]['status'])?flightadvisories[0]['data']['overview']['full']:"N/A";
                        airspaceColor = (flightadvisories[0]['status'])?flightadvisories[0]['data']['color']['name']:"N/A";
                        //console.log(airspace);
                        //console.log(airspaceColor);

                        $('td', row).eq(8).html(airspace);
                        if(airspaceColor == 'green'){
                            $('td', row).eq(8).addClass('highlightgreen');
                        }
                        if(airspaceColor == 'red'){
                            $('td', row).eq(8).addClass('highlightred');
                        }

                    }
                });



            },

            retrieve: false,
            JQueryUI: true,
            cache : true,

            success: function () {
                //ShowDataTable is a js Function which takes ajax response data and display it.
                ShowDataTable(data);
            },
            async: true,
            dataType: 'json',
            headers: 'Content-Type: application/json',
            dom: 'Bfrtip',
            ajax: {
                url:getuserflightsURL,
                type:"GET"
            },
            idSrc:  'id',
            method:"GET",

            select: true,
            buttons: [
                { extend: 'create', editor: editor_userflighttable },
                { extend: 'edit',   editor: editor_userflighttable },
                { extend: 'remove', editor: editor_userflighttable }
            ],
            orderSequence:["desc"],
            columns: [
                { data: 'id' },
                { data: 'serialnumber' },
                { data: 'latitude' },
                { data: 'longitude' },
                { data: 'flightpath' },
                { data: 'height' },
                { data: 'temperature' },
                { data: 'weather' },
                { data: 'warning' },
                { data: 'status',editField: "status"},
                { data: 'updated_at' }

            ],
            "order": [[ 0, "desc" ]],
            "language": {
                "emptyTable":     "No records  to display"
            }

            //attachTableClickEventHandlers();
        });

        //table.reload();

        attachTableClickEventHandlers();

    }

    function callAPIDarkSky(thisRowLat,thisRowLon){

        // get weather use  HOST_BUILDER to set dev, staging, prod urls
        urlDarkSkyAPI = './getDarkSkyWeather';
        $.ajax({
            url: urlDarkSkyAPI+"/?lat="+thisRowLat+"&lon="+thisRowLon,
            type: 'GET',
            dataType: 'json',
            success: function(res) {

                //console.log(res);
                let thisResWeather = '['+res+']';
                let weather = JSON.parse(thisResWeather);
                //console.log(weather);

            }
        });



    }

    function callAPIKittyHawk(thisRowLat,thisRowLon){
        // Hardcoded URL, use  HOST_BUILDER to set dev, staging, prod urls
        urlKittyHawkAdvisories = './getAtlasadvisories';
        $.ajax({
            url: urlKittyHawkAdvisories+"/?lat="+thisRowLat+"&lon="+thisRowLon,
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                let thisRes = '['+res+']';
                //console.log(thisRes);

                let flightadvisories = JSON.parse(thisRes);
                return flightadvisories;
            }
        });

    }

    initDT();


    function attachTableClickEventHandlers(){

        // var UpdateTD = table.parent('td');
        // table.cell( latitude ).data( UpdateTD.html('MEOW!')).draw();

        //row/column indexing is zero based
        $("#userflighttable thead tr th").click(function() {
            col_num = parseInt( $(this).index() );
           // console.log("column_num ="+ col_num );
        });
        $("#userflighttable tbody tr td").click(function() {
            col_cell = parseInt( $(this).index() );
            row_cell = parseInt( $(this).parent().index() );
            //console.log("Row_num =" + row_cell + "  ,  column_num ="+ col_cell );
        });
    };


});
</script>

