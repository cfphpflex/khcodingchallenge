$(document).ready(function () {


let uploadButton = $('#upload');
let fileInput = $('#files');
let global_geojson = "";
let saveButton = $('#save');

let api_base_url="https://devgalaxydvr.galaxy.airspace.co/";

uploadButton.on('click', function() {
    console.log("Pressed!");
    if (!window.FileReader) {
        alert('Your browser is not supported');
        return false;
    }
    var input = fileInput.get(0);

    // Create a reader object
    var reader = new FileReader();

    if (input.files.length) {
        var textFile = input.files[0];
        // Read the file
        reader.readAsText(textFile);
        // When it's loaded, process it
        $(reader).on('load', processFile);
    } else {
        alert('Please upload a file before continuing')
    }
});


    //called when key is pressed in textbox
    $("#allowNumber").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message

            return false;
        }
    });

    $("#rolesel1").on('change', function(event){
        var role_id=$(this).val();
        //let host = host_builder();
        let url = api_base_url+"roles/"+role_id;

        $.ajax({
            type: "POST",
            url: url,
            success: function(data){

            }
        });
        //console.log($(this).val());
    });

    $("#locality-dropdown").on('change', function(event){
        let poly_id=$(this).val();
        let url =api_base_url+"polygons/"+poly_id;
        $.ajax({
            type: "POST",
            url: url,
            success: function(data){
                let jsonobj = JSON.stringify(data)

                console.log("polygon JSON Response");
                console.log( jsonobj );

                let obj=jsonobj;
                console.log(obj);
                $('#shape_display').DataTable().destroy();

                let zonetype='';let threattype='';let activestatus='';let inactivestatus='';
                if(obj.type=="zone"){ zonetype="selected";}
                if(obj.type=="threat"){ threattype="selected";}
                if(obj.id_status=="1"){ activestatus="selected";}
                if(obj.id_status=="0"){ inactivestatus="selected";}

                let display_action=''; let displayslt='';
                for(let c=0;c<=10;c++){
                    if(obj.id_action==c){displayslt="selected";}
                    display_action+='<option value="'+c+'" '+displayslt+'>'+c+'</option>';
                    displayslt='';
                }


                $('#polygon_id').val(obj.id);


                $('#files').val('');
                $("#shape_display > tbody > tr").remove();

                let newRowContent='<tr><td class = "text allowNumber">1</td><td class = "text">'+obj.name+'</td><td class = "text"><span>Polygon</span></td><td><select class = "drop_down_table_field polygon_type" id="polygon_type" name="type"><option value="zone" '+zonetype+'>Zone</option><option value="threat" '+threattype+'>Threat</option></select></td><td><select  class = "drop_down_table_field" id="polygon_status" name="type"><option value="1" '+activestatus+'>Active</option><option value="0" '+inactivestatus+'>Inactive</option></select></td><td><select class = "drop_down_table_field polygon_action" id="polygon_action" name="type">'+display_action+'</select></td><td class = "td_top_class"><span class = "coordinate_cell">'+obj.polygon+'</span></td><td><span class = "edit action_btn" onclick = "editRow()"><i class="fa fa-edit"></i></span><span data-toggle="modal" data-target="#myModal" onclick = "deleteRow(this);" class = "deleteRow action_btn"><i class="fa fa-trash"></i></span></td></tr>'

                $("#shape_display tbody").append(newRowContent);
                $('#shape_display').DataTable({
                    "paging":   false,
                    "ordering": false,
                    "info":     false
                }).draw();
            }
        });
    });

    $("#rolesel").on('change', function(event){

        let role_id=$(this).val();
        let url =api_base_url+"roles/"+role_id;
        $.ajax({
            type: "POST",
            url: url,
            success: function(data){
                //console.log(data);
                let jsonobj = jQuery.parseJSON(data);
                let obj=jsonobj[0];
                let pobj=jsonobj['polygons'][0];
                console.log(pobj);
                let coordinates=pobj.polygon;
                let spltcord=coordinates.split('))');
                let polysplt=spltcord[0].split('((');
                let actualsplt=polysplt[1];
                let arrsplt=actualsplt.split(',');
                //let arr_spacesplt=arrsplt.split(' ');

                //let coord_json=JSON.stringify(arr_spacesplt);
                //let coord_space_json=JSON.stringify(arrsplt);

                $('#role_name').val(obj.role);
                $('#coordinates').html(coordinates);
                /*$('#shape_display').DataTable().destroy();

                let zonetype='';let threattype='';let activestatus='';let inactivestatus='';
                if(obj.type=="zone"){ zonetype="selected";}
                if(obj.type=="threat"){ threattype="selected";}
                if(obj.id_status=="1"){ activestatus="selected";}
                if(obj.id_status=="0"){ inactivestatus="selected";}

                let display_action=''; let displayslt='';
                for(let c=0;c<=10;c++){
                    if(obj.id_action==c){displayslt="selected";}
                    display_action+='<option value="'+c+'" '+displayslt+'>'+c+'</option>';
                    displayslt='';
                }

                $('#polygon_id').val(obj.id);

                $('#files').val('');
                $("#shape_display > tbody > tr").remove();

                let newRowContent='<tr><td class = "text allowNumber">1</td><td class = "text">'+obj.name+'</td><td class = "text"><span>Polygon</span></td><td><select class = "drop_down_table_field polygon_type" id="polygon_type" name="type"><option value="zone" '+zonetype+'>Zone</option><option value="threat" '+threattype+'>Threat</option></select></td><td><select  class = "drop_down_table_field" id="polygon_status" name="type"><option value="1" '+activestatus+'>Active</option><option value="0" '+inactivestatus+'>Inactive</option></select></td><td><select class = "drop_down_table_field polygon_action" id="polygon_action" name="type">'+display_action+'</select></td><td class = "td_top_class"><span class = "coordinate_cell">'+obj.polygon+'</span></td><td><span class = "edit action_btn" onclick = "editRow()"><i class="fa fa-edit"></i></span><span data-toggle="modal" data-target="#myModal" onclick = "deleteRow(this);" class = "deleteRow action_btn"><i class="fa fa-trash"></i></span></td></tr>'

                $("#shape_display tbody").append(newRowContent);
                $('#shape_display').DataTable({
                        "paging":   false,
                        "ordering": false,
                        "info":     false
                    }).draw();*/
            }
        });
    });


function processFile(e) {
    var file = e.target.result,
        results;
    if (file && file.length) {
        console.log("Parsing...");
        let geojson = maptalks.Formats.kml.parse(file);
        console.log(fileInput.get(0).files[0].name);
        //new maptalks.VectorLayer(fileInput.get(0).files[0].name, geojson).addTo(map);
        // var geometry = maptalks.GeoJSON.toGeometry(geojson);

        //console.log(geojson.features[0].geometry.coordinates[0][0]);
        KMLProcess(geojson);
        //console.log(geoparam.geometry);

        let options2D = {
            zoom: 10,
            center: [geojson.features[0].geometry.coordinates[0][0], geojson.features[0].geometry.coordinates[0][1]],
            pitch: 0,
            bearing: 0,
        };

        // console.log(options2D.center);

        // map.animateTo(options2D, {
        //     duration: 500,
        //     easing: 'out'
        // }, (frame) => {
        //     if (frame.state.playState === 'finished') {
        //         animating = false;
        //         // map_draw();
        //     }
        // });


        //console.log(geojson);
        geojson.features[0].geometry.type = "Polygon";
        var tmp3DCoords = geojson.features[0].geometry.coordinates;

        // console.log(tmp3DCoords);

        var tmpCoords = [];
        for(var i = 0; i < tmp3DCoords.length; i++)
        {
            tmpCoords[i] = [ tmp3DCoords[i][0], tmp3DCoords[i][1] ];
        }


        geojson.features[0].geometry.coordinates = Array(tmpCoords);
        //console.log(JSON.stringify(geojson.features[0].geometry));
        global_geojson = geojson.features[0].geometry;

        let shapecnt=document.getElementById('shapecnt').value;
        document.getElementById('shapecnt').value=parseInt(shapecnt)+1;

        $('#saveDiv').show();
    }
}

// dom letiables
let msf_getFsTag = document.getElementsByTagName("fieldset");

// declaring the active fieldset & the total fieldset count
let msf_form_nr = 0;
let fieldset = msf_getFsTag[msf_form_nr];
fieldset.className = "msf_show";

// creates and stores a number of bullets
let msf_bullet_nr = "<div class='msf_bullet'></div>";
let msf_length = msf_getFsTag.length;
for (let i = 1; i < msf_length; ++i) {
    msf_bullet_nr += "<div class='msf_bullet'></div>";
};
// injects bullets
let msf_bullet_o = document.getElementsByClassName("msf_bullet_o");
for (let i = 0; i < msf_bullet_o.length; ++i) {
    let msf_b_item = msf_bullet_o[i];
    msf_b_item.innerHTML = msf_bullet_nr;
};

// removes the first back button & the last next button
document.getElementsByName("back")[0].className = "msf_hide";
document.getElementsByName("next")[msf_bullet_o.length - 1].className = "msf_hide";

// Makes the first dot active
let msf_bullets = document.getElementsByClassName("msf_bullet");
msf_bullets[msf_form_nr].className += " msf_bullet_active";

// Validation loop & goes to the next step
function msf_btn_next() {
    let msf_val = true;

    let msf_fs = document.querySelectorAll("fieldset")[msf_form_nr];
    let msf_fs_i_count = msf_fs.querySelectorAll("input").length;

    for (i = 0; i < msf_fs_i_count; ++i) {
        let msf_input_s = msf_fs.querySelectorAll("input")[i];
        if (msf_input_s.getAttribute("type") === "button") {
            // nothing happens
        } else {
            if (msf_input_s.value === "") {
                msf_input_s.style.backgroundColor = "pink";
                msf_val = false;
            } else {
                if (msf_val === false) {} else {
                    msf_val = true;
                    msf_input_s.style.backgroundColor = "lime";
                }
            }
        };
    };
    if (msf_val === true) {
        // goes to the next step
        let selection = msf_getFsTag[msf_form_nr];
        selection.className = "msf_hide";
        msf_form_nr = msf_form_nr + 1;
        selection = msf_getFsTag[msf_form_nr];
        selection.className = "msf_show";
        // refreshes the bullet
        let msf_bullets_a = msf_form_nr * msf_length + msf_form_nr;
        msf_bullets[msf_bullets_a].className += " msf_bullet_active";
    }
};

function KMLProcess(geojson)
{
    let geoparam=geojson.features[0];
    let kml_geometry=geoparam.geometry;


    let kml_name=geoparam.properties.name;

    //let kml_type=kml_geometry.Type;
    let kml_coordinates=geoparam.geometry.coordinates;
    let myJSON = JSON.stringify(kml_coordinates);
    let kml_type="Polygon";
    console.log(geoparam.geometry.type);

    let polygon_id=$('#polygon_id').val();
    console.log(polygon_id);

    if(polygon_id!=""){
        $('.coordinate_cell').html(myJSON);

    }else{
        $('#shape_display').DataTable().destroy();


        let newRowContent='<tr><td class = "text allowNumber" ></td><td class = "text">'+kml_name+'</td><td class = "text"><span>'+kml_type+'</span></td><td><select class = "drop_down_table_field polygon_type" id="polygon_type" name="type"><option value="zone">Zone</option><option value="threat">Threat</option></select></td><td><select  class = "drop_down_table_field" id="polygon_status" name="type"><option value="1">Active</option><option value="0">Inactive</option></select></td><td><select class = "drop_down_table_field polygon_action" id="polygon_action" name="type"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td class = "td_top_class"><span class = "coordinate_cell">'+myJSON+'</span></td><td><span class = "edit action_btn" onclick = "editRow()"><i class="fa fa-edit"></i></span><span data-toggle="modal" data-target="#myModal" onclick = "deleteRow(this);" class = "deleteRow action_btn"><i class="fa fa-trash"></i></span></td></tr>'


        $("#shape_display tbody").append(newRowContent);
        var t = $('#shape_display').DataTable({
            //console.log('shape_display');
            "paging": false,
            "ordering": false,
            "info": false,
            "targets": 0
            //console.log('get target');
        });
        t.on('order.datatable search.datatable', function () {
            //console.log('got order td');
            t.column(0).nodes().each(function (cell, i) {
                //console.log('column select');
                cell.innerHTML = i + 1;
            });
            //console.log('success');
        }).draw();


        $("#shape_display tbody").append(newRowContent);
        var t=$('#shape_display').DataTable({
            //console.log('shape_display');
            "paging":   false,
            "ordering": false,
            "info":     false,
            "targets": 0
            //console.log('get target');
        });
        t.on( 'order.datatable search.datatable', function () {
            //console.log('got order td');
            t.column(0).nodes().each( function (cell, i) {
                //console.log('column select');
                cell.innerHTML = i+1;
            } );
            //console.log('success');
        } ).draw();



    }
    let html_input='<input type="hidden" class="sid" name="sid" id="sid" >';
    html_input+='<input type="hidden" class="sname" name="sname_101" id="sname_101" value="'+kml_name+'">';
    html_input+='<input type="hidden" class="scoord" name="coord_101" id="coord_101" value="'+myJSON+'">';

    $('#allinputs').append(html_input);

}


function msf_polygon_next() {


//    console.log( $('#shape_display').DataTable().row( this ).data());

    // console.log('new polygons from table row data', table.row( this ).data());

    $('#shape_display tbody').on( 'load', 'tr', function () {
        console.log( $('#shape_display').row( this ).data() );
    } );


    let msf_val = true;
    let polygonName = document.getElementById('polygon_name');
    let polygon_numbers = document.getElementById('polygon_numbers');
    let shapecnt = document.getElementById('shapecnt');


    let checkMap = document.getElementById('map');
    let e = document.getElementById("polygon_type");
    let error = document.getElementById('polygonError');
    let polygon_type = e.options[e.selectedIndex].value;
    let s = document.getElementById("polygon_status");
    let polygon_status = s.options[s.selectedIndex].value;
    let y = document.getElementById("polygon_action");
    let polygon_action = y.options[s.selectedIndex].value;
    error.innerText = "";

    let roless = document.getElementById("rolesel");
    let rolesid = roless.options[roless.selectedIndex].value;



    // console.log( rolesid );
    let a = [];
    let id= $(".sid").map(function() {return $(this).val();}).get();
    //console.log( "polygon_name" );
    // console.log( id );

    let polygon_name= $(".sname").map(function() {return $(this).val();}).get();
    let full_polygon_type= $(".polygon_type option:selected").map(function() {return $(this).val();}).get().join(',');
    let polygon_idaction= $(".polygon_action option:selected").map(function() {return $(this).val();}).get().join(',');
    //console.log(full_polygon_type);
    //console.log( "polygon_name" );
    console.log( polygon_name );

    // $('.coordinates_display').html('');
    let coordinates_display = $(".scoord").map(function() {return $(this).val();}).get();   //.coordinates_display  //$('.coordinates_display').html(); //
    //  console.log( "coordinates_display" );
    console.log(coordinates_display);




    if (typeof polygon_name !== 'undefined') { // test defined

        for (let i = 0; i < Object.values(polygon_name); i++) {
            //console.log(a[i]);


            console.log("polygon objects ");
            console.log(Object.values(polygon_name));

            if (typeof new_polygons !== 'undefined') { // test defined

                polygon += coordinates_display[i][0];

                console.log(" coordinates_display ");
                console.log(coordinates_display[i]);

                if (i + 1 < shapecnt.value) {
                    polygon += " " + coordinates_display[i][1] + ",";
                } else {
                    polygon += " " + coordinates_display[i][1];
                }
            }else{
                //      console.log( "new_polygons not defined");
            }
        }
    }else{
        //     console.log( "shapecnt not defined");
    }


//    polygon += "))";

    //console.log("polygon",polygon);

    let polygon_id=$('#polygon_id').val();
//    if (msf_val === true) {
    let request = {

        "id": polygon_id,

        "name": polygon_name,
        "type":polygon_type,
        "action":polygon_action,
        "id_status" : polygon_status,
        "polygon_idaction":polygon_idaction,
        "coordinates_display": coordinates_display,
        "roleid": rolesid
    };

    console.log("request",request);

    function host_builder()
    {
        let host   = window.location.hostname;
        //var schema = window.location.protocol;
        let url = window.location.href;
        let arr = url.split("/");
        let schema = arr[0];


        switch(host){
            case 'localhost' :
                host = "http://localhost/indiaAnandDashboard/index.php?";
                break;


            default:
                if(window.location.port !== ""){
                    host += ':' + window.location.port;
                }
                host = schema + '//' + host;
                break;
        }

        return host;
    }


    let host = host_builder();
    let url = host + "/createPolygon?ACTION=createpolygon";


    $.ajax({
        type: "POST",
        url: url,
        data:  JSON.stringify(request),
        success: function(data){
            let wr = JSON.parse(data);
            if(wr == "200"){
                // goes to the next step
                let selection = msf_getFsTag[msf_form_nr];
                selection.className = "msf_hide";
                msf_form_nr = msf_form_nr + 1;
                selection = msf_getFsTag[msf_form_nr];
                selection.className = "msf_show";
                // refreshes the bullet
                let msf_bullets_a = msf_form_nr * msf_length + msf_form_nr;
                msf_bullets[msf_bullets_a].className += " msf_bullet_active";
                delayResize();
                $('.table_content').css('display','none');
            }
        }
    });

    /* makeRequest("POST", url,  JSON.stringify(request), function (err, data) {
         if (err) {
             throw err;
             error.style.color = "red";
             error.innerText = "Create Polygon Error.";
         }else{
             error.innerText = "";
             let wr = JSON.parse(data);
             if(wr === "200"){
                 // goes to the next step
                 let selection = msf_getFsTag[msf_form_nr];
                 selection.className = "msf_hide";
                 msf_form_nr = msf_form_nr + 1;
                 selection = msf_getFsTag[msf_form_nr];
                 selection.className = "msf_show";
                 // refreshes the bullet
                 let msf_bullets_a = msf_form_nr * msf_length + msf_form_nr;
                 msf_bullets[msf_bullets_a].className += " msf_bullet_active";
                 delayResize();
             }else{
                 error.style.color = "red";
                 error.innerText = "Create Polygon Error (" + wr.trim()+ ")";
             }
         }

     });*/
    //  }




};

function msf_role_next() {
    let msf_val = true;
    let rolename = document.getElementById('role_name');
    let settings = document.getElementById('role_settings');
    let center_lon = document.getElementById('center_lon');
    let center_lat = document.getElementById('center_lat');
    let checkMap2 = document.getElementById('map2');
    let error = document.getElementById('roleError');
    error.innerText = "";

    if(rolename.value === ""){
        $('.warning_rolename').css('display','inline-block');
        msf_val = false;
    }else{
        $('.warning_rolename').css('display','none');
    }
    if(document.getElementById('center_lon').value == 0){
        checkMap2.style.border = "2px solid pink";
        $('.warning_map2').css('display','inline-block');
        msf_val = false;
    }else{
        checkMap2.style.border = "";
        $('.warning_map2').css('display','none');
    }

    if (msf_val === true) {
        let request = {
            "role": rolename.value,
            "map_center_lon": center_lon.value,
            "map_center_lat": center_lat.value,
            "settings" : settings.value
        };
        console.log(JSON.stringify(request));



        function host_builder()
        {
            let host   = window.location.hostname;
            //var schema = window.location.protocol;
            let url = window.location.href;
            let arr = url.split("/");
            let schema = arr[0];


            switch(host){
                case 'localhost' :
                    host = "http://localhost/indiaAnandDashboard/index.php?";
                    break;

                case 'galaxy.airspace.co'    :
                    host = "api.galaxy.airspace.co"; //
                    host = schema + '//' + host;
                    break;

                case 'qa.galaxy.airspace.co'    :
                    host = "devgalaxydvr.galaxy.airspace.co/";
                    host = schema + '//' + host;
                    break;

                case 'admindev.galaxy.airspace.co':
                    host = "devgalaxydvr.galaxy.airspace.co/";

                    host = schema + '//' + host;
                    break;

                default:
                    if(window.location.port !== ""){
                        host += ':' + window.location.port;
                    }
                    host = schema + '//' + host;
                    break;
            }

            return host;
        }


        let host = host_builder();
        let url = host + "/createRole?ACTION=createrole";


        $.ajax({
            type: "POST",
            url: url,
            data:JSON.stringify(request),
            success: function(data){
                //if request if made successfully then the response represent the data
                //console.log(data);
                let wr = JSON.parse(data);

                if(wr == "200"){
                    // goes to the next step
                    let selection = msf_getFsTag[msf_form_nr];
                    selection.className = "msf_hide";
                    msf_form_nr = msf_form_nr + 1;
                    selection = msf_getFsTag[msf_form_nr];
                    selection.className = "msf_show";
                    // refreshes the bullet
                    let msf_bullets_a = msf_form_nr * msf_length + msf_form_nr;
                    msf_bullets[msf_bullets_a].className += " msf_bullet_active";

                }else{
                    error.style.color = "red";
                    error.innerText = "Create Polygon Error (" + wr.trim()+ ")";
                }
            }
        });


    }
};

function msf_user_next() {
    let msf_val = true;
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');
    let company = document.getElementById('company');
    let phone = document.getElementById('phone');
    let email = document.getElementById('email');
    let warning = document.getElementById('warning');
    let error = document.getElementById('userError');
    let e = document.getElementById("passExpire");
    let passExpire = e.options[e.selectedIndex].value;
    let s = document.getElementById("account_status");
    let id_status = s.options[s.selectedIndex].value;

    let tz = document.getElementById("time_azone");
    let timezone = tz.options[tz.selectedIndex].value;

    let tname = document.getElementById("timezone_name");
    let timezonename = tname.options[tname.selectedIndex].value;

    let dt = document.getElementById("defaultunit");
    let default_unit = dt.options[dt.selectedIndex].value;

    let mz = document.getElementById("mini_zoom");
    let minizoom = mz.options[mz.selectedIndex].value;

    let vm = document.getElementById("view_mode");
    let vm_status = vm.options[vm.selectedIndex].value;

    let er = document.getElementById("email_report");
    let er_rept = er.options[er.selectedIndex].value;
    error.innerText = "";



    if(userName.value === ""){
        //userName.style.backgroundColor = "pink";
        $('.warning_name').css('diaplay','inline-block');
        msf_val = false;
    }else{
        // userName.style.backgroundColor = "lightgrey";
        $('.warning_name').css('diaplay','none');
    }
    if(password.value === ""){
        password.style.backgroundColor = "pink";
        $('.warning_password').css('diaplay','inline-block');
        msf_val = false;
    }else{
        password.style.backgroundColor = "lightgrey";
        $('.warning_password').css('diaplay','none');
    }
    if(company.value === ""){
        company.style.backgroundColor = "pink";
        $('.warning_company').css('diaplay','inline-block');
        msf_val = false;
    }else{
        company.style.backgroundColor = "lightgrey";
        $('.warning_company').css('diaplay','none');
    }
    if(phone.value === ""){
        phone.style.backgroundColor = "pink";
        $('.warning_phone').css('diaplay','inline-block');
        msf_val = false;
    }else{
        phone.style.backgroundColor = "lightgrey";
        $('.warning_phone').css('diaplay','none');
    }



    if(validateEmail(email.value)){
        warning.innerText = "";
        msf_val = true;
    }else{
        msf_val = false;
        email.style.backgroundColor = "pink";
        warning.style.color = "red";
        warning.innerText = "Please input a valid email address.";
    }

    if (msf_val === true) {
        let request = {
            "name": userName.value,
            "email": email.value,
            "phone": phone.value,
            "company" : company.value,
            "password" : password.value,
            "password_expired" : passExpire,
            "id_status" : id_status,
            "timezone"  : timezone,
            "timezonename" : timezonename,
            "default_unit" : default_unit,
            "minizoom" : minizoom,
            "vm_status" : vm_status,
            "er_rept" : er_rept
        };




        function host_builder()
        {
            let host   = window.location.hostname;
            //var schema = window.location.protocol;
            let url = window.location.href;
            let arr = url.split("/");
            let schema = arr[0];


            switch(host){
                case 'localhost' :
                    host = "http://localhost/indiaAnandDashboard/index.php?";
                    break;

                case 'galaxy.airspace.co'    :
                    host = "api.galaxy.airspace.co"; //
                    host = schema + '//' + host;
                    break;

                case 'qa.galaxy.airspace.co'    :
                    host = "devgalaxydvr.galaxy.airspace.co/";
                    host = schema + '//' + host;
                    break;

                case 'admindev.galaxy.airspace.co':
                    host = "devgalaxydvr.galaxy.airspace.co/";

                    host = schema + '//' + host;
                    break;

                default:
                    if(window.location.port !== ""){
                        host += ':' + window.location.port;
                    }
                    host = schema + '//' + host;
                    break;
            }

            return host;
        }


        let host = host_builder();

        let url = host + "/createUser?ACTION=createuser";




        makeRequest("POST", url,  JSON.stringify(request), function (err, data) {
            if (err) {
                throw err;
                console.log("Request err",err);
            }else{
                let wr = JSON.parse(data);
                //  console.log("Request Sent",wr);
                if(wr == "200"){
                    // goes to the next step
                    let selection = msf_getFsTag[msf_form_nr];
                    selection.className = "msf_hide";
                    msf_form_nr = msf_form_nr + 1;
                    selection = msf_getFsTag[msf_form_nr];
                    selection.className = "msf_show";
                }else{
                    error.style.color = "red";
                    error.innerText = "Create Polygon Error (" + wr.trim()+ ")";
                }
            }
        });
    }
};

// goes one step back
function msf_btn_back() {
    $('.table_content').css('display','block');
    msf_getFsTag[msf_form_nr].className = "msf_hide";
    msf_form_nr = msf_form_nr - 1;
    msf_getFsTag[msf_form_nr].className = "msf_showhide";
    delayResize();
};

$(".back_third_step").on('click', function(event){
    $('.table_content').css('display','none');
});


console.log("loaded");
delayResize();

function makeRequest(method, url, param, done) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (method === "POST") {
        xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.onload = function () {
        done(null, xhr.response);
    };
    xhr.onerror = function () {
        done(xhr.response);
    };
    xhr.send(param);
}

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function one_step() {
    $('.one_step').css('display','block');
    $('.table_content').css('display','block');

    $('.two_step').css('display','none');
    $('.three_step').css('display','none');
}

function two_step() {
    $('.two_step').css('display','block');

    $('.one_step').css('display','none');
    $('.table_content').css('display','none');
    $('.three_step').css('display','none');
}

function three_step() {
    $('.three_step').css('display','block');

    $('.one_step').css('display','none');
    $('.table_content').css('display','none');
    $('.two_step').css('display','none');
}



});
