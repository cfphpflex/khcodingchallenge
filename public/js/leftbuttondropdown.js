
window.addEventListener('groundspace_load', () => {
    initLeftLayout();
});
let unitDefaultSet = false;
let firstLoad = false;      // PR-437  Flag to Prevent snapshot from adding a lot of events
let buttonChangePitch;
let buttonToggleHeatmap;
let buttonToggleClustering;
let buttonToggleSatellite;  // PR-427 Add Product Tour & Satellite Button Manage Satellite View Logic (such as ruler, cones, assets, polygons)
let buttonToggleRuler;
let buttonToggleReport;
let buttonToggleBuildings;
let buttonToggleTerrain;

let viewModeBlock = true;
let firstViewModeChange = true;

let buttonTogglePause;
let mainSlider;
let mainSliderIndex;
let fromDate = (new Date).getTime();
let toDate = (new Date).getTime();
let urlParams = new URLSearchParams(window.location.search);
let live = true;

// PR-298  call api  replace calling galaxydvr tracks
let histFrom;
let histTo;
let hist_limit_hourstominutes =
    sessionStorage.getItem( "cal_default_history_limit") !== null ?
        dateLabelToMinutes(sessionStorage.getItem( "cal_default_history_limit").split(" ")) : 15;  // PR-494  Fix Remove threats outside selected time range interval


//console.log("URL paramas ", urlParams);
let visibleBuildings = true;
let visibleTerrain = false;

let timeline_playing = false;

//PR-250 Hotfix:  7.11.3 single drone display, prevent reload set stop_loading flag to false, set true as needed to stop loading
let stop_loading = false;

// let dataMap = {};


let confirm_popup = build_confirm();
let map_action_popup = build_popup();

let filter_select = build_select();

//UI_settings config

let ui_settings = {};

let time_select = build_select();



const update_profile_url = "https://devgalaxydvr.galaxy.airspace.co/profiles";
const get_profile_url = "https://devgalaxydvr.galaxy.airspace.co/profiles?id=";
const add_drone_url = "https://devgalaxydvr.galaxy.airspace.co/adddrone";



function initLeftLayout() {

    // PR-360 Show Browser not supported notification
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    let isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
    if( (isMac && isSafari) || (iOS  && isChrome) || (iOS  && isSafari) ){
    }else{
        // selectionChannel.postMessage(local_state.selected);
        // console.log("isMac",isMac, " Safari", isSafari, " Chrome",isChrome );
    }


    buttonChangePitch = document.getElementById('buttonChangePitch');
    buttonToggleHeatmap = document.getElementById('buttonToggleHeatmap');
    buttonToggleClustering = document.getElementById('buttonToggleClustering');
    buttonToggleSatellite = document.getElementById('buttonToggleSatellite');     // PR-427 Add Product Tour & Satellite Button Manage Satellite View Logic (such as ruler, cones, assets, polygons)
    buttonToggleRuler = document.getElementById('buttonToggleRuler');
    buttonToggleReport = document.getElementById('buttonToggleReport');
    buttonToggleBuildings = document.getElementById('buttonToggleBuildings');
    buttonToggleTerrain = document.getElementById('buttonToggleTerrain');
    buttonTogglePause = document.getElementById('liveicon');
    let buttonCam = document.getElementById('buttonCam');
    let buttonReCentre = document.getElementById('buttonReCentre');
    let buttonMyLocation = document.getElementById('buttonMyLocation');
    let buttonActionInactive = document.getElementById('buttonActionInactive');// actionInactiveMessage
    let buttonHidePanel = document.getElementById('buttonHidePanel');
    let buttonMetric = document.getElementById('buttonMetric');
    let searchTracks = document.getElementById('searchTracks');
//    let searchSerial = document.getElementById('searchSerial');
    let calendarDate = document.getElementById('calendarDate');

    let username_el = document.getElementById('userName');
    if (username_el) username_el.innerHTML = getUserName();

    // PR-   Stream cameras of bayarea user
    //console.log("stream user url");
    let cameraurl_el = document.getElementById('cameraLabel');
    let cameraUserName = getUserName();
    //console.log( cameraUserName );
    // if(cameraUserName === "Bay Area" || cameraUserName === "Admin" || cameraUserName === "Verizon SF" || cameraUserName === "Verizon NY" ){
    //     //console.log("https://stream.galaxy.airspace.co/");
    //     document.getElementById("cameraLabel").href="https://stream.galaxy.airspace.co/";
    // }

    buttonTogglePause.onclick = function() {
        pauseLoading(!stop_loading);
    }

    // START PR-487  added help button  Help: Get the modal
    let helpmodal = document.getElementById("simpleModal");

    //Click on the help button
    let modalbtn = document.getElementById("helpModal");
    //Get close help modal
    let closebtn = document.getElementsByClassName('closeBtn')[0];


    modalbtn.addEventListener('click', openHelpModal);

    closebtn.addEventListener('click', closeHelpModal);
    //listen for outside click
    window.addEventListener('click', clickOutside);

    //function to open help modal
    function openHelpModal(){
        helpmodal.style.display = "block";
    }
    //function to close help modal
    function closeHelpModal(){
        helpmodal.style.display = "none";
    }

    //function to close help modal, outside click
    function clickOutside(e){
        if(e.target == helpmodal) {
            helpmodal.style.display = "none";
        }
        if(e.target == metricsModal) {
            helpmodal.style.display = "none";
        }
    }

    // END PR-487  added help button

    //Report: Get the modal
    let modal = document.getElementById("myModal");

    //Report: Get the <span> element that closes the modal
    let closeMark = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    closeMark.onclick = function () {
        modal.style.display = "none";

        //PR-388 auto-untoggles report-button-toggle when reprort modal is closed  1143792497677020-report-toggle-fix
        buttonToggleReport.className = "buttonOff";
        toggleReport();

    }

    //Report: Get the copied link by clicking on the copy button
    let copyLink = document.getElementsByClassName("modalButton")[0];

    copyLink.onclick = function() {
        let link = reportRespLink;
        //link.select();
        clipboard.writeText(link);
        // document.execCommand("copy");
    }

    //Report: CloseButton
    let closeButton = document.getElementsByClassName("modalButton")[1];
    // When the user clicks on <span> (x), close the modal
    closeButton.onclick = function () {
        modal.style.display = "none";

        //PR-388 auto-untoggles report-button-toggle when reprort modal is closed  1143792497677020-report-toggle-fix
        buttonToggleReport.className = "buttonOff";
        toggleReport();

    }


    //Report: When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";

            //PR-388 auto-untoggles report-button-toggle when reprort modal is closed  1143792497677020-report-toggle-fix
            buttonToggleReport.className = "buttonOff";
            toggleReport();

        }
    }

    //console.log("Made a request");


    build_actions(getCompany());

    buttonToggleBuildings.style.display = 'none';
    buttonToggleTerrain.style.display = 'none';


    // set map style to display blinking button
    document.getElementById('map').style.top = "45px";
    document.getElementById('map').style.position = "relative";
    document.getElementById('live-header').style.position = "relative";
    document.getElementById('live-header').style.top = "0px";
    document.getElementById('live-bar').style.position = "relative";
    document.getElementById('live-bar').style.top = "0px";
    document.getElementById('live-bar').style.height = "0px";

    // Buttons
    buttonChangePitch.addEventListener('click', () => {
        console.log("Button us clicked 3d ", map.getPitch());

        // //google analytics
        // gtag('config', 'UA-137022463-1', {
        //     'page_title' : 'Switch to 3D',
        //     'page_path': '/'+user_role+'/3d-button'
        // });

        if (map && !map.isAnimating()) {
            if (map.getPitch() === 0) {
                buttonCam.className = "buttonOff"; //disable screenshots while in 3d

                ui_settings.threeD = 1;

                ui_settings.HM = buttonToggleClustering.className == "buttonOn" ? 1 : 0;
                buttonToggleClustering.className = "buttonOff isDisabled";
                uiSettings_update();
                onOffButton("buttonChangePitch", "3d");
                // if (buttonToggleHeatmap.className === "buttonOn") {
                //     onOffButton("buttonToggleHeatmap", "ui_settings.HM");
                //     toggleHeatmap();
                // }
                go_3d();
                console.log("what is animating? ", animating);
            } else {
                buttonCam.className = "buttonOff"; //re-enable screenshots when 2d

                onOffButton("buttonChangePitch", "3d");
                // console.log("Update 3D data");
                ui_settings.threeD = 0;
                buttonToggleClustering.className = ui_settings.cluster == 1 ? "buttonOn" : "buttonOff";
                uiSettings_update();

                buttonToggleBuildings.style.display = 'none';
                buttonToggleTerrain.style.display = 'none';
                go_2d();
                console.log("what is animating? ", animating);
            }
            //PR-434 untoggles ruler if toggled when switched to/from 3d
            if(buttonToggleRuler.className == 'buttonOn'){
                buttonToggleRuler.dispatchEvent(new Event('click'))
            }

        }
    });

    buttonToggleHeatmap.addEventListener('click', () => {
        if (map) {
            onOffButton("buttonToggleHeatmap", "ui_settings.HM");
            uiSettings_update();
            toggleHeatmap();
        }
    });

    buttonToggleClustering.addEventListener('click', () => {
        if (map) {
            onOffButton("buttonToggleClustering", "ui_settings.cluster");
            uiSettings_update();
            toggleClusters();
        }
    });

    // PR-427 Add Product Tour & Satellite Button Manage Satellite View Logic (such as ruler, cones, assets, polygons)
    buttonToggleSatellite.onclick = function () {
        if (map) {
            satelliteSwitching();
        }
    };

    buttonToggleReport.onclick = function() {
        if (map) {
            onOffButton("buttonToggleReport", "ui_settings.report");
            toggleReport();
        }
    };

    buttonActionInactive.addEventListener('click', actionInactiveMessage);



    document.querySelector('#buttonHidePanel').onclick = function() {
        //Stuff
        if ($('.panel-body').classList.contains('visible')) {
            console.log("hi1");
            $('.panel-body').classList.remove('visible');
            buttonHidePanel.classList.remove('panel-visible');
        } else {
            console.log("hi2");
            $('.panel-body').classList.add('visible');
            buttonHidePanel.classList.add('panel-visible');
        }
    };

    // PR-437  Flag to Prevent snapshot from adding a lot of events
    // PR-485  3D screenshot button on Mapbox call apis
    buttonCam.onclick = function () {
        // let opt = options2D();
        if (map.getPitch() === 0) {
            groundspace_snapshot();
        }else {
            //  GrabzIt("ODJlYjIxY2RhMzk2NDU0NDhjODg5NGFlYWI4NDc4MGU=").ConvertPage({"target": ".maptalks-canvas-layer"}).Create();
            console.log("Take snapshot");
            //let canvas = document.getElementsByClassName(".maptalks-canvas-layer");
            screenshot = true;
            toggleReport();
        }
        // let region = document.querySelector("body"); // whole screen
        // html2canvas(canvas, {
        //     onrendered: function(canvas) {
        //         var img = new Image();
        //         let pngUrl = canvas.toDataURL(); // png in dataURL format
        //         //let img = document.querySelector(".screen");
        //         img.src = pngUrl;
        //         img.crossOrigin = 'anonymous';
        //         var url = img.src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
        //         window.open(url);
        //         console.log("img.src ", img);
        //         // here you can allow user to set bug-region
        //         // and send it with 'pngUrl' to server
        //     },
        // });
        // html2canvas(document.querySelector("main")).then(function(canvas) {
        //     //document.body.appendChild(canvas);
        //     saveAs(canvas.toDataURL(), 'file-name.png');
        // });
        //function save() {
        //setTimeout(function () {
        // imageCapture.takePhoto()
        //     .then(function(blob) {
        //         console.log('Took photo:', blob);
        //         img.classList.remove('hidden');
        //         img.src = URL.createObjectURL(blob);
        //     })
        //     .catch(function(error) {
        //         console.log('takePhoto() error: ', error);
        //     });

        // var data = map.toDataURL({
        //      'crossOrigin' : 'anonymous', // required if renderer is canvas
        //      'renderer' : 'canvas',
        //     'mimeType' : 'image/jpeg', // or 'image/png'
        //     'save' : true,             // to pop a save dialog
        //     'fileName' : 'map'         // file name
        // });
        //},2000);

        // }
        //groundspace_snapshot()
    };

    // PR-485  3D screenshot button on Mapbox call apis
    function saveAs(uri, filename) {

        var link = document.createElement('a');

        if (typeof link.download === 'string') {

            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);

        } else {

            window.open(uri);

        }
    }



    buttonReCentre.addEventListener('click', () => {
        center_map();
    });

    buttonMyLocation.addEventListener('click', () => {
        confirm_popup.message('Going to current location');
        getLocation((pos) => { // on success
                panTo(pos.coords);
                confirm_popup.flash('Current location set ok');
            },
            (err, msg) => { // on error
                confirm_popup.flash('Current location setup failure (' + err + '):' + msg);
            });
    });

    buttonMetric.addEventListener('click', () => {
        let metricToggle = document.getElementById('buttonMetric');




        update_metric_unit();
        if(unitDefaultSet){

            let metricValue = metricToggle.getAttribute('value') === 'm' ? 'meters' : 'feet';
            console.log(metricToggle.innerHTML);
            //let viewmode = document.getElementById('viewModeToggle');
            //console.log(viewmode.innerText);

            let viewmodeValue = simpleView ? 'simple' : 'advanced';
            fetch(get_api_url()+'/setusersettings', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                redirect: "error", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify({"id": user_id, "unitDefault": metricValue, "viewMode": viewmodeValue}),
            }).then(response => response.json())


                .then(resp => {
                    if (resp.status == "OK") {




                    }

                })
                .catch(console.warn);   // PR-276  Fix map recenter
        }
        let imperialValue = metricToggle.getAttribute('value') === "m" ? false : true;
        toggleRuler(imperialValue, true);
    });



    buttonToggleBuildings.addEventListener('click', () => {
        let visible = "visible";
        visibleBuildings = true;
        if (map && mapboxglLayer.getGlMap()) {
            if (mapboxglLayer.getGlMap().getLayer("3d-buildings").visibility === "visible") {
                visible = "none";
                visibleBuildings = false;
            }
            console.log("Inside left layout buldings ");
            console.log("Buindings  visible? ", visibleBuildings);
            onOffButton("buttonToggleBuildings", "none");
            showHideLayer("3d-buildings", visible);
        }
    });

    buttonToggleTerrain.addEventListener('click', () => {
        let visible = "visible";
        visibleTerrain = true;
        if (map && mapboxglLayer.getGlMap()) {
            if (mapboxglLayer.getGlMap().getLayer("hillshading").visibility === "visible") {
                visible = "none";
                visibleTerrain = false;
            }
            onOffButton("buttonToggleTerrain", "none");
            showHideLayer("hillshading", visible);
        }
    });

    searchTracks.addEventListener('click', () => {
        let droneSerial = document.getElementById('droneSerial').value;
        pauseLoading(droneSerial === "" ? false : true);
        clearTimeout(update_world_interval);
        console.log("Search for: ", droneSerial);
        searchDrones(droneSerial);
    });

    calendarDate.addEventListener('click', () => {
        if(calendarDate.className.includes("grayCalendarDate")){
            live = false;
            calendarDate.className = "calendarDate";
            // for(let i = 0 ; i < 8 ; i++){
            //     let li = document.getElementById('time-select-option-'+i);
            //     if(li.className.includes("selected")){
            //         li.className = "h6 grayOut selected";
            //     }else{
            //         li.className = "h6";
            //     }
            // }
        }
    });







}

function uiSettings_update() {
    //Double check settings to prevent UI error
    if (typeof ui_settings.threeD === 'undefined') {
        console.log("Cannot get 3D session");
        ui_settings.threeD = 0;
    }
    if (typeof ui_settings.HM === 'undefined') {
        console.log("Cannot get HM session");
        ui_settings.HM = 0;
    }
    if (typeof ui_settings.cluster === 'undefined') {
        console.log("Cannot get cluster session");
        ui_settings.cluster = 0;
    }
    if (typeof ui_settings.report === 'undefined') {
        console.log("Cannot get report session");
        ui_settings.report = 0;
    }
    if (typeof ui_settings.show === 'undefined') {
        console.log("Cannot get show session");
        ui_settings.show = 0;
    }
    if (typeof ui_settings.live === 'undefined') {
        console.log("Cannot get live session");
        ui_settings.live = 0;
    }
    if (typeof ui_settings.flightpathgradient === 'undefined') {
        console.log("Cannot get gradient session");
        ui_settings.flightpathgradient = 0;
    }
    if (typeof ui_settings.flightpathgradient === 'undefined') {
        console.log("Cannot get max Zoom out");
        ui_settings.minZoomOut = user_minZoomOut;
    }

    // get profile detail from backend api
    // const update_ui_params = "ui_settings="+JSON.stringify(ui_settings)+"&id="+user_id;
    ui_settings.id = user_id;
    console.log("ui_settings",ui_settings)
    makeRequest("POST", update_profile_url, JSON.stringify(ui_settings), function (err, data) {
        if (err) {
            throw err;
        } else {
            // console.log("update success: ",data);
        }
    });
}

function onOffButton(buttonId, type) {
    if (document.getElementById(buttonId).classList.contains('buttonOff')) {
        if (type === "ui_settings.HM") ui_settings.HM = 1;
        else if (type === "ui_settings.cluster") ui_settings.cluster = 1;
        else if (type === "ui_settings.report") ui_settings.report = 1;
        document.getElementById(buttonId).className = "buttonOn";
    } else {
        if (type === "ui_settings.HM") ui_settings.HM = 0;
        else if (type === "ui_settings.cluster") ui_settings.cluster = 0;
        else if (type === "ui_settings.report") ui_settings.report = 0;
        document.getElementById(buttonId).className = "buttonOff";
    }
}

window.addEventListener('groundspace_update', () => {
    // uiSettings_update();
    update_threats_overlay_panel();
});

window.addEventListener('threat-level-update', function (e) {
    console.log('threat-level-update event recieved:', e);

    var threat_lvl = false;

    if ((typeof e.detail !== 'undefined') &&
        (typeof e.detail.threat_lvl !== 'undefined')) {
        threat_lvl = e.detail.threat_lvl;
    }

    if (threat_lvl !== false) {

        var cls = 'threat-level-' + threat_lvl;
        var ids = ['map', 'live-msg', 'live-bar'];

        for (var ix = 0; ix < ids.length; ix++) {
            var el = document.getElementById(ids[ix]);
            if (el) {
                if (typeof el.threat_lvl !== 'undefined') {
                    el.classList.remove(el.threat_lvl);
                }
                el.threat_lvl = cls;
                el.classList.add(cls);
            }
        }
        // edit #live-msg
        var el = document.getElementById('live-msg');
        if (el) {
            el.style.top = "60px";

            el.innerHTML = threat_lvl ? ('GLOBAL THREAT LEVEL #' + threat_lvl) : '';
            var e = new Event('resize');
            window.dispatchEvent(e);
        }
    }
});

// dataMap.darkGreen = {
//     //max : 3200,
//     15:     [0, 0, 0, 0, 0, 0, 0, 0],
//     60:     [0, 0, 0, 0, 0, 0, 0, 0],
//     360:    [0, 0, 0, 0, 0, 0, 0, 0],
//     720:    [0, 0, 0, 0, 0, 0, 0, 0],
//     1440:   [0, 0, 0, 0, 0, 0, 0, 0],
//     2880:   [0, 0, 0, 0, 0, 0, 0, 0],
//     10080:  [0, 0, 0, 0, 0, 0, 0, 0],
//     44640:  [0, 0, 0, 0, 0, 0, 0, 0],
//     };
//

/*
Getting Micro time
 */
let microtime, now, multiplier;

if (typeof performance !== 'undefined' && performance.now) {
    now = (performance.now() + performance.timing.navigationStart) / 1000;
    multiplier = 1e6; // 1,000,000 for microseconds
} else {
    now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
    multiplier = 1e3; // 1,000
}

// Dirty trick to only get the integer part
microtime = now | 0;
//
//     // update text in the UI
//     document.getElementById('active-hour').innerText = textTime + suffix;
//
//     let request = {
//         "action": "set_hist_limit",
//         "history_limit": time
//     };
//     fetch('../api.php', {
//         method: "POST",
//         cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//         headers: {
//             "Content-Type": "application/json; charset=utf-8",
//         },
//         redirect: "error", // manual, *follow, error
//         referrer: "no-referrer", // no-referrer, *client
//         body: JSON.stringify(request),
//     })
//     // .then(console.log)
//         .then(() => {
//             ui_settings.live = time;
//         })
//         .catch(console.warn)
//         // .then(() => {
//         //     //Calling to refresh data on map
//         //     filter(microtime*1000 - time*60*1000);
//         // })
//
//
// });

let time_change = (timeIndex) => {
    let time = timelineIndexToTime(timeIndex);

    mainSlider.dispatchAction({
        type: 'showTip',
        // index of series, which is optional when trigger of tooltip is axis
        seriesIndex: 0,
        dataIndex: timeIndex
    });

    filter(microtime * 1000 - time * 60 * 1000);

}

let getLiveValue = (time) => {
    switch (time) {
        case 15: {
            return 0;
        }
        case 60: {
            return 1;
        }
        case 360: {
            return 2;
        }
        case 720: {
            return 3;
        }
        case 1440: {
            return 4;
        }
        case 2880: {
            return 5;
        }
        case 10080: {
            return 6;
        }
        case 44640: {
            return 7;
        }
        default : {
            return 0;
        }
    }
}

let timelineIndexToTime = (index) => {
    let time;
    switch (index) {
        case 0: {
            time = 15;
            break;
        }
        case 1: {
            time = 60;
            break;
        }
        case 2: {
            time = 360;
            break;
        }
        case 3: {
            time = 720;
            break;
        }
        case 4: {
            time = 1440;
            break;
        }
        case 5: {
            time = 2880;
            break;
        }
        case 6: {
            time = 10080;
            break;
        }
        case 7: {
            time = 44640;
            break;
        }
        default : {
            time = 15;
            break;
        }
    }
    return time;
}

function initMainTimeLine() {


    let option2 = {
        baseOption: {
            timeline: {
                // y: 0,
                axisType: 'category',
                // realtime: false,
                // loop: false,
                autoPlay: false,
                currentIndex: mainSliderIndex,
                playInterval: 1500,
                symbol: 'circle',
                controlStyle: {
                    color: '#273335',
                    borderColor: 'white',
                    showPrevBtn: false,
                    showNextBtn: false,
                    itemGap: 80,
                },
                //Hide timeline
                left: '0px',
                right: '40px',
                top: '12px',
                z: -1,
                lineStyle: {
                    show: false,
                },
                label: {
                    show: false,
                },
                itemStyle: {
                    color: '#273335',
                    borderColor: 'white',
                },
                data: [
                    '15 Min', '1 HR', '6 HR', '12 HR',
                    '24 HR', '48 HR', '7 Days', '1 Months'
                ],
                // label:
                //     {
                //         // formatter : function(s) {
                //         //     return (new Date(s)).getFullYear();
                //         // },
                //
                //         fontSize: 10,
                //         fontFamily: 'SourceSansPro, sans-serif',
                //         // color: 'white'
                //     }
            },
            // title: {
            //     subtext: 'Time Line',
            //     triggerEvent: true
            // },

            textStyle: {
                fontSize: 10,
                fontFamily: 'SourceSansPro, sans-serif',
                color: 'white'
            },
            tooltip: {
                alwaysShowContent: true,
                position: ['50%', '50%']
            },
            // legend: {
            //     x: 'right',
            //     data: ['Threat lv3', 'Threat lv2', 'Threat lv1', 'Threat lv4', 'Threat lv5', 'Threat lv6'],
            //     selected: {
            //         'GDP': false, '金融': false, '房地产': false
            //     }
            // },
            calculable: true,
            grid: {
                top: 10,
                bottom: 70,
                right: 10,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: true,
                            formatter: function (params) {
                                return params.value.replace('\n', '');
                            }
                        }
                    }
                }
            },
            xAxis: [
                {
                    'type': 'category',
                    'axisLabel': {'interval': 0},
                    'data': [
                        '15 Min', '1 HR', '6 HR', '12 HR', '24 HR', '48 HR', '7 Days', '1 Month'
                    ],
                    splitLine: {show: true}
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'Drones（counts）'
                }
            ],
            series: [
                // {name: 'Threat lv4', type: 'bar'},
                {name: 'Threat lv0', type: 'line'},
                {name: 'Threat lv1', type: 'line'},
                {name: 'Threat lv2', type: 'line'},
                {name: 'Threat lv3', type: 'line'},
                {name: 'Threat lv4', type: 'line'}
            ]
        },
        options: [
            {
                // title: {text: '15 Min'},
                series: [
                    // {data: dataMap.dataGDP['2002']},
                    {data: timelineMap.darkGreen['15'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['15'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['15'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['15'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['15'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            },
            {
                // title : {text: '1 HR'},
                series: [
                    // {data: dataMap.dataGDP['2003']},
                    {data: timelineMap.darkGreen['60'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['60'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['60'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['60'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['60'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            },
            {
                // title : {text: '6 HR'},
                series: [
                    // {data: dataMap.dataGDP['2004']},
                    {data: timelineMap.darkGreen['360'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['360'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['360'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['360'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['360'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            },
            {
                // title : {text: '12 HR'},
                series: [
                    // {data: dataMap.dataGDP['2005']},
                    {data: timelineMap.darkGreen['720'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['720'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['720'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['720'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['720'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            },
            {
                // title : {text: '24 HR'},
                series: [
                    // {data: dataMap.dataGDP['2006']},
                    {data: timelineMap.darkGreen['1440'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['1440'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['1440'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['1440'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['1440'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            },
            {
                // title : {text: '48 HR'},
                series: [
                    // {data: dataMap.dataGDP['2007']},
                    {data: timelineMap.darkGreen['2880'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['2880'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['2880'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['2880'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['2880'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            },
            {
                // title : {text: '7 Days'},
                series: [
                    // {data: dataMap.dataGDP['2008']},
                    {data: timelineMap.darkGreen['10080'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['10080'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['10080'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['10080'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['10080'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            },
            {
                // title : {text: '1 Months'},
                series: [
                    // {data: dataMap.dataGDP['2009']},
                    {data: timelineMap.darkGreen['44640'], itemStyle: {color: settings.threat_lvl_color[0]}},
                    {
                        data: timelineMap.green['44640'], itemStyle: {color: settings.threat_lvl_color[1]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[1]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[1]
                            }])
                        }
                    },
                    {
                        data: timelineMap.yellow['44640'], itemStyle: {color: settings.threat_lvl_color[2]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[2]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[2]
                            }])
                        }
                    },
                    {
                        data: timelineMap.orange['44640'], itemStyle: {color: settings.threat_lvl_color[3]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[3]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[3]
                            }])
                        }
                    },
                    {
                        data: timelineMap.red['44640'], itemStyle: {color: settings.threat_lvl_color[4]},
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: settings.threat_lvl_color[4]
                            }, {
                                offset: 1,
                                color: settings.threat_lvl_color2[4]
                            }])
                        }
                    }
                ]
            }
        ]
    };

    mainSlider.setOption(option2);


    mainSlider.on('timelinechanged', (index) => {
        // console.log("index: "+index.currentIndex);
        mainSliderIndex = index.currentIndex;
        time_change(index.currentIndex);
    });


    // mainSlider.on('timelineplaychanged', (index) => {
    //     let tempOption = {
    //         baseOption: {
    //             timeline: {
    //                 currentIndex: 0,
    //             }
    //         }
    //     }
    //     if (!timeline_playing) {
    //         mainSliderIndex = 0;
    //         mainSlider.setOption(tempOption);
    //         console.log("Stop loading world");
    //
    //         // Time Select
    //         let options = [{text: '15 Min', value: 15},
    //             {text: ' 1 Hr ', value: 60},
    //             {text: ' 6 Hr ', value: 360},
    //             {text: '12 Hr ', value: 720},
    //             {text: '24 Hr ', value: 1440},
    //             {text: '48 Hr ', value: 2880},
    //             {text: '7 Days', value: 10080},
    //             {text: '1 Month', value: 44640}
    //         ];
    //
    //
    //         options[7].selected = true;
    //         time_select.setup(id = 'time-select',
    //             options,
    //             (value) => {
    //                 let request = {
    //                     "action": "set_hist_limit",
    //                     "history_limit": value
    //                 };
    //                 fetch('../api.php', {
    //                     method: "POST",
    //                     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //                     headers: {
    //                         "Content-Type": "application/json; charset=utf-8",
    //                     },
    //                     redirect: "error", // manual, *follow, error
    //                     referrer: "no-referrer", // no-referrer, *client
    //                     body: JSON.stringify(request),
    //                 })
    //                 /* .then(console.log) */
    //                     .then(() => {
    //                         ui_settings.live = time_select.selected_ix;
    //                     })
    //                     .then(() => {
    //                         update_world();
    //                     })
    //                     .then(() => {
    //                         timeline_playing = true;
    //                     })
    //                     .catch(console.warn);
    //             },
    //             option_group_cls = false,
    //             option_cls = 'h6',
    //             session_key = 'time_select_ix')
    //         //where is the 2nd interval
    //     } else {
    //         timeline_playing = false;
    //         update_world_interval = setTimeout(update_world, update_interval_ms);
    //     }
    // });
}


function findPrimaryCameras(cameras, clickPoint) {
    //lat = y, lon = x
    let nearestCamera = ['primary','secondary'], min = -1;
    for (let cam of cameras) {
        if(cam.lat && cam.lon){
            let distance = getDistanceFromLatLon(clickPoint.y, clickPoint.x, cam.lat, cam.lon);
            // console.log("distance: ", distance);
            if (distance < min || min === -1) {
                min = distance;
                nearestCamera[1] = nearestCamera[0];
                nearestCamera[0] = cam;
            }
        }
    }
    // console.log("nearest: ", nearestCamera);
    return nearestCamera;
}

function moveCamera(lat, lon, res_id) {
    console.log("Moving to lat: " + lat + " lon:" + lon);
    let request = {
        "action": "camera",
        "lat": lat,
        "lon": lon,
        "alt": 0,
        "cam": res_id
    };
    fetch('../camera_control_ajax.php', {
        method: "POST",
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "error", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(request),
    })
    // .then(function(response) { return console.log(response.json()); })
        .catch(console.warn);
}

function cameraActions(action, lat, lon, detection, res_id, targetID) {
    console.log("Cam ID: "+ res_id +" Action to lat: " + lat + " lon:" + lon + " action: " + action);
    let request = {
        "action": action,
        "lat": lat,
        "lon": lon,
        "alt": 0,
        "cam": res_id
    };
    fetch('../camera_control_ajax.php', {
        method: "POST",
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "error", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(request),
    })
    // .then(function(response) { return console.log(response.json()); })
        .catch(console.warn);
}

function cameraZoomActions(action, pan, tilt, zoom, detection, cameraName, targetID) {
    console.log("Zoom Action to pan: " + pan + " tilt:" + tilt + " action: " + action);
    let request = {
        "action": action,
        "pan": pan,
        "tilt": tilt,
        "zoom": zoom
    };
    fetch('../camera_control_ajax.php', {
        method: "POST",
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "error", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(request),
    })
    // .then(function(response) { return console.log(response.json()); })
        .catch(console.warn);
}

function searchDrones(serial) {
    let request = {
        "droneSerial": serial
    };
    window.dispatchEvent(new Event('groundspace_update'));
    window.dispatchEvent(new Event('groundspace_map_update'));
    fetch('../searchDrones.php', {
        method: "POST",
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "error", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(request),
    })
        .then(response => response.json())
        .then(wr => {
            if(!wr.auth && !is_debug()) {
                console.log("Auth fail, redirecting to login page.");
                window.location.replace(wr.auth_url);
                Promise.reject(wr.status);
                return;
            }

            if (wr.status && wr.update) {
                let to_update_map = false;
                if(wr.update_identified_objects.length > 0) {
                    if(wr.update_identified_objects.length > world.identified_objects.length) {
                        to_update_map = true;
                    }
                    // console.log("Search result", wr.update_identified_objects);
                    world.identified_objects = _.unionBy(wr.update_identified_objects, world.identified_objects, "id");
                    world.pending_identified_objects = _.unionBy(wr.update_identified_objects, world.pending_identified_objects, "id");
                }

                world.radio_detections = wr.update_radio_detections;
                world.user_overrides = wr.update_user_overrides;
                if(to_update_map)  {
                    window.dispatchEvent(new Event('groundspace_update'));
                    window.dispatchEvent(new Event('groundspace_map_update'));
                }
                fail_count = 0;

            } else if(!wr.update) {
                window.dispatchEvent(new Event('groundspace_update'));

            } else {
                console.warn( 'invalid data :', wr );
                Promise.reject(wr.status);
            }
            // schedule the next update
            pauseLoading(false);
//            update_world_interval = setTimeout(update_world, update_interval_ms);

        })
        .catch((...err) => {
            if (fail_count < 13) {
                var time = (Math.pow(4 + fail_count, 4));
                console.error(...err, 'update_world failed: next attempt in ' + msToNiceTime(time) );
                fail_count += 1;
                setTimeout(update_world, time );
            } else {
                console.warn("Assuming no dynamic server, too many connection failures");
            }
        });
}

async function searchByDateAndSerial(dateFrom, dateTo, serial) {
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    dateFrom = new Date(dateFrom).getTime();
    dateTo = new Date(dateTo).getTime();

    // PR-298  call api  replace calling galaxydvr tracks
    histFrom = dateFrom;
    histTo = dateTo;
    // let value;


    // console.log("ui calenda from: ",dateFrom," to:",dateTo, "label", serial);

    // convert history sereal label to mimutes
    let hist_limit2 = serial.split(" ");
    //console.log( "UI cal hist_limit ===");
    // console.log(  hist_limit2[ );

    //FIXME: Worst implementation ever, we need to redo all this logic... HistFrom and To needs to be updated every loop.

    hist_limit_hourstominutes = dateLabelToMinutes(hist_limit2);  // PR-494   Fix Remove threats outside selected time range interval
    let action = "set_hist_range";

    // if(hist_limit2[1]== 'Minutes'){
    //     hist_limit_hourstominutes= hist_limit2[0];
    //     action = "set_hist_limit";
    //     histTo += 24*60*60*1000;
    //     histFrom = new Date().getTime() - (hist_limit_hourstominutes*60*1000);
    // }
    // if(hist_limit2[1]== 'Hour' || hist_limit2[1]== 'Hours' ) {
    //     hist_limit_hourstominutes = hist_limit2[0] * 60;
    //     action = "set_hist_limit";
    //     histTo += 24*60*60*1000;
    //     histFrom = new Date().getTime() - (hist_limit_hourstominutes*60*1000);
    // }
    // if(hist_limit2[1]== 'Days'){
    //     hist_limit_hourstominutes= hist_limit2[0]*24*60;
    //     action = "set_hist_limit";
    //     histTo += 24*60*60*1000;
    //     histFrom = new Date().getTime() - (hist_limit_hourstominutes*60*1000);
    // }
    // if(hist_limit2[1]== 'Month'){
    //     hist_limit_hourstominutes= hist_limit2[0]*31*24*60;
    //
    // }

    // PR-338 Persist Admin Calendar search across accounts save to sessionStorage
    if (hist_limit_hourstominutes !== 0){
        action = "set_hist_limit";
        histTo += 24*60*60*1000;
        histFrom = new Date().getTime() - (hist_limit_hourstominutes*60*1000);
        sessionStorage.setItem("cal_default_history_limit", serial);
    } else {
        sessionStorage.setItem("cal_default_history_limit", dateFrom + "-" + dateTo);
    }


    // console.log( hist_limit_hourstominutes );

    // include required history_limit &  action = set_hist_limit, not range
    let request = {
        "action": action,
        "history_limit": hist_limit_hourstominutes,
        "history_from": dateFrom,
        "history_to": dateTo
    };


    // let request = {
    //     "action": "set_hist_range",
    //     "history_from": dateFrom,
    //     "history_to": dateTo
    // };

    // PR-298  call api  replace calling galaxydvr tracks
    // fetch('../api.php', {
    //     method: "POST",
    //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //     headers: {
    //         "Content-Type": "application/json; charset=utf-8",
    //     },
    //     redirect: "error", // manual, *follow, error
    //     referrer: "no-referrer", // no-referrer, *client
    //     body: JSON.stringify(request),
    // })
    //     .catch(console.warn);
    //
    // gtag('config', 'UA-137022463-1', {
    //     'page_title' : 'Change Time Filter',
    //     'page_path': '/'+user_role+'/time-filter/'+action+'='+serial,
    // });
    /*
    Switch to live if select time <= 6 hrs
     */
    // if(dateTo - dateFrom <= 21600000){
    //     pauseLoading(false);
    //     switch (serial) {
    //         case "Last 15 Mins": {
    //             value = 15;
    //             break;
    //         }
    //         case "Last Hour":{
    //             value = 60;
    //             break;
    //         }
    //         case "Last 6 Hours":{
    //             value = 360;
    //             break;
    //         }
    //     }
    //             let request = {
    //                 "action": "set_hist_limit",
    //                 "history_limit": value
    //             };
    //             fetch('../api.php', {
    //                 method: "POST",
    //                 cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //                 headers: {
    //                     "Content-Type": "application/json; charset=utf-8",
    //                 },
    //                 redirect: "error", // manual, *follow, error
    //                 referrer: "no-referrer", // no-referrer, *client
    //                 body: JSON.stringify(request),
    //             }).catch(console.warn);
    // }
    // else{
    //     // pauseLoading(true);
    //     // clearTimeout(update_world_interval);



    // // Admin case
    // if(user_polygon_id.length === 0){
    //     user_polygon_id = 0;
    // }
    // let get_tracks_url = "https://api.galaxy.airspace.co/tracks?polygon="+user_polygon_id+"&fromDate="+dateFrom+"&toDate="+dateTo;
    // if(serial !== "" && !live && !/\s/.test(serial)){
    //     get_tracks_url = "https://api.galaxy.airspace.co/trackscombination?polygon="+user_polygon_id+"&fromDate="+dateFrom+"&toDate="+dateTo+"&serial="+serial;
    // }else if(live && !/\s/.test(serial)){ //search serial only
    //     get_tracks_url = "https://api.galaxy.airspace.co/tracksbyserial?polygon="+user_polygon_id+"&serial="+serial;
    // }
    // let url = get_tracks_url;
    // console.log("Search url: ", url);
    // makeRequest("GET", url, null, function (err, data) {
    //     if (err) {
    //         throw err;
    //     }else{
    //         let wr = JSON.parse(data);
    //         world.identified_objects = wr.update_identified_objects;
    //         console.log("my wr",world.identified_objects );
    //         window.dispatchEvent(new Event('groundspace_update'));
    //         window.dispatchEvent(new Event('groundspace_map_update'));
    //         map_draw();
    //
    //     }
    // });

    // PR-298  call api  replace calling galaxydvr tracks
    await sleep(2000);
    if(simpleView && !firstSelect) showAll();
    update_threats_overlay_panel();
    local_state.need_scrolling = true;
    await sleep(2000);

    map_draw();
    // }
}

function pauseLoading(isPaused) {
    stop_loading = isPaused;
    let liveIcon = document.getElementById('liveicon');
    let liveText = document.getElementById('liveText');
    if(isPaused) {
        liveText.innerText = "Paused";
        liveIcon.src = "assets/imgs/icons/icon_paused.svg";
    } else {
        liveText.innerText = "Live";
        liveIcon.src = "assets/imgs/icons/icon_live.svg";
        update_world_interval = setTimeout(update_world, update_interval_ms);
    }

}

function addNewDrone(){
    let serialDiv = document.getElementById('newSerial');
    let latDiv = document.getElementById('newLat');
    let lonDiv = document.getElementById('newLon');
    let request = {
        "serialnumber": serialDiv.value,
        "latitude": latDiv.value,
        "longitude" : lonDiv.value
    };
    // drone_data.serialnumber = serialDiv.value;
    // drone_data.latitude = latDiv.value;
    // drone_data.longitude = lonDiv.value;
    // console.log("in add drone", serialDiv.value, latDiv.value.length, lonDiv.value.length);
    if(serialDiv.value.length < 10){
        serialDiv.style.borderColor = "red";
        if(latDiv.value.length < 4) {
            latDiv.style.borderColor = "red";
        }else{
            latDiv.style.borderColor = "white";
        }
        if(lonDiv.value.length < 4){
            lonDiv.style.borderColor = "red";
        }else{
            lonDiv.style.borderColor = "white";
        }
    }else if(latDiv.value.length < 4){
        latDiv.style.borderColor = "red";
        serialDiv.style.borderColor = "white";
        if(lonDiv.value.length < 4){
            lonDiv.style.borderColor = "red";
        }else{
            lonDiv.style.borderColor = "white";
        }
    }else if(lonDiv.value.length < 4){
        lonDiv.style.borderColor = "red";
        serialDiv.style.borderColor = "white";
        latDiv.style.borderColor = "white";
    }else{
        serialDiv.style.borderColor = "white";
        latDiv.style.borderColor = "white";
        lonDiv.style.borderColor = "white";

        console.log("drone_data",request.serialnumber);
        makeRequest("POST", add_drone_url, JSON.stringify(request), function (err, data) {
            if (err) {
                throw err;
            } else {
                console.log("Add new drone success: ",data);
                let result =  document.getElementById('addDroneResult');
                result.innerText = "Drone Added";
            }
        });
    }
    document.getElementById('infoWindows').remove();
}

function dateLabelToMinutes(label){
    if(label[1]== 'Minutes'){
        return label[0];
    }
    if(label[1]== 'Hour' || label[1]== 'Hours' ) {
        return label[0] * 60;
    }
    if(label[1]== 'Days'){
        return label[0]*24*60;
    }
    if(label[1]== 'Month'){
        return label[0]*31*24*60;
    }
    return 0;
}


function get_api_url()
{
    let currentHost   = window.location.hostname;
    let apiHostURL    = null;

    let url = window.location.href;
    let arr = url.split("/");
    let schema = arr[0];


    // DO NOT TOUCH  TODO
    switch(currentHost){
        case 'localhost' :
            apiHostURL = "http://localhost:9000";
            //apiHostURL = schema + '//' + apiHostURL;
            break;

        default:
            if(window.location.port !== ""){
                apiHostURL += ':' + window.location.port;
            }
            apiHostURL = schema + '//' + apiHostURL;
            break;
    }

    return apiHostURL;
}

