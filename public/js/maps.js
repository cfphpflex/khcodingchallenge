
function searchInArray(idKey, myArray) {
    let filtered = myArray.filter(x => x.id === idKey);
    return filtered.length > 0 ? filtered[0] : null;
}

function loader_promise(e) {
    return new Promise(
        (resolve, reject) => {
            e.onload = (...args) => resolve(...args);
            e.onerror = (...err) => reject(...err);
        }
    )
};

function countPositions(obj) {
	let count = 0;
	obj.forEach(function(e) {
		count += e.positions.length;
	});
	return count;
}

function dateConverter(UNIX_timestamp_sec, formatString) {
    let a = new Date(UNIX_timestamp_sec);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time;
    switch (formatString) {
        default:
        case 'hh:mm':
            time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
            break;
        case 'y:MM:d':
            time = date + ' ' + month + ' ' + year;
            break;
    };
    return time;
}


function timestampToHours(ts1, ts2) {
    let date1 = new Date(ts1);
    let date2 = new Date(ts2);
    let res = Math.abs(date2 - date1) / 1000;
    // get days
    let days = Math.floor(res / 86400);

    // get hours
    let hours = Math.floor(res / 3600) % 24;

    // get minutes
    let minutes = Math.floor(res / 60) % 60;

    // get seconds
    let seconds = res % 60;
//    return `${((hours * 60) + minutes).toString().padStart(2, '0')} min ${Math.floor(seconds)} sec`;
    return `${Math.floor((hours * 60) + minutes).toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`;

}

function timestampToRoundedTime(ts1, ts2) {
    let date1 = new Date(ts1);
    let date2 = new Date(ts2);
    let res = Math.abs(date2 - date1)

    return dateToRoundedTime(res);
}

function dateToRoundedTime(date) {
    let res = date / 1000;

    // get days
    let days = Math.floor(res / 86400);

    // get hours
    let hours = Math.floor(res / 3600) % 24;

    // get minutes
    let minutes = Math.floor(res / 60) % 60;

    // get seconds
    let seconds = res % 60;
    
    if(days > 0)
    	return `${Math.floor(days).toString()} d`;
    else if(hours > 0)
    	return `${Math.floor(hours).toString()} h`;
    else if(minutes > 0)
        return `${Math.floor(minutes).toString()} m`;
    else
        return `${Math.floor(seconds).toString()} s`;
//    return `${((hours * 60) + minutes).toString().padStart(2, '0')} min ${Math.floor(seconds)} sec`;
//    return `${Math.floor((hours * 60) + minutes).toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`;
}

function timestampToRoundedTime2(ts1, ts2) {
    let date1 = new Date(ts1);
    let date2 = new Date(ts2);
    let res = Math.abs(date2 - date1) / 1000;
    // get days
    let days = Math.floor(res / 86400);

    // get hours
    let hours = Math.floor(res / 3600) % 24;

    // get minutes
    let minutes = Math.floor(res / 60) % 60;

    // get seconds
    let seconds = res % 60;

    return `${Math.floor(hours).toString()}:${Math.floor(minutes).toString()}`;

    if(days > 0)
        return `${Math.floor(days).toString()} d`;
    else if(hours > 0)
        return `${Math.floor(hours).toString()} h`;
    else if(minutes > 0)
        return `${Math.floor(minutes).toString()} m`;
    else
    	return `${Math.floor(seconds).toString()} s`;
//    return `${((hours * 60) + minutes).toString().padStart(2, '0')} min ${Math.floor(seconds)} sec`;
//    return `${Math.floor((hours * 60) + minutes).toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`;
}


function calcApproximateSpeed(obj) {
    // TODO speed calc should be done in app if not provided by API
    let speed = 0;

    if (obj.positions && obj.positions.length > 2) {
        let last_pos = obj.positions[obj.positions.length - 1];
        let prev_pos = obj.positions[obj.positions.length - (obj.positions.length > 5 ? 5 : obj.positions.length)]; //get diff from latest pos and 5 pos before it to avarega better and reduce error. TODO: use time range instead of index range.

        const approxDistanceLatLon = (point1, point2) => {
            let degToRad = Math.PI / 180;
            let R = 6371000;// meters
            return R * degToRad * Math.sqrt(Math.pow(Math.cos(point1.lat * degToRad) * (point1.lon - point2.lon), 2) + Math.pow(point1.lat - point2.lat, 2));
        };

//        let horizontal_distance_miles = approxDistanceLatLon(prev_pos, last_pos) / 1609.344;
//        let vertical_distance_miles = (last_pos.alt - prev_pos.alt) / 1609.344;
//        let distance_miles = Math.sqrt(Math.pow(horizontal_distance_miles, 2) + Math.pow(vertical_distance_miles, 2));
//        let ts_diff_hours = (last_pos.ts - prev_pos.ts) / 3600000; //ts in ms
//        speed = (distance_miles) / ts_diff_hours;
//         console.log("object speed ",obj);
        let horizontal_distance_meters = approxDistanceLatLon(prev_pos, last_pos);
        let vertical_distance_meters = (last_pos.alt - prev_pos.alt);
        let distance_meters = Math.sqrt(Math.pow(horizontal_distance_meters, 2) + Math.pow(vertical_distance_meters, 2));
        let ts_diff_seconds = (last_pos.ts - prev_pos.ts) / 1000; //ts in ms
        speed = (distance_meters) / ts_diff_seconds;
    }
    return speed;
}


function calApproxMaxSpeed(obj) {
    let maxSpeed = 0;

    for(let i=0;i<obj.positions.length-1;i++){
        let speed = 0;
        let last_pos = obj.positions[i+1];
        let prev_pos = obj.positions[i];

        const approxDistanceLatLon = (point1, point2) => {
            let degToRad = Math.PI / 180;
            let R = 6371000;// meters
            return R * degToRad * Math.sqrt(Math.pow(Math.cos(point1.lat * degToRad) * (point1.lon - point2.lon), 2) + Math.pow(point1.lat - point2.lat, 2));
        };

//        let horizontal_distance_miles = approxDistanceLatLon(prev_pos, last_pos) / 1609.344;
//        let vertical_distance_miles = (last_pos.alt - prev_pos.alt) / 1609.344;
//        let distance_miles = Math.sqrt(Math.pow(horizontal_distance_miles, 2) + Math.pow(vertical_distance_miles, 2));
//        let ts_diff_hours = (last_pos.ts - prev_pos.ts) / 3600000; //ts in ms
//        speed = (distance_miles) / ts_diff_hours;
        console.log("object speed ",obj);
        let horizontal_distance_meters = approxDistanceLatLon(prev_pos, last_pos);
        let vertical_distance_meters = (last_pos.alt - prev_pos.alt);
        let distance_meters = Math.sqrt(Math.pow(horizontal_distance_meters, 2) + Math.pow(vertical_distance_meters, 2));
        let ts_diff_seconds = (last_pos.ts - prev_pos.ts) / 1000; //ts in ms
        speed = (distance_meters) / ts_diff_seconds;
        maxSpeed = Math.max(maxSpeed, speed);
        console.log("get all speed ", obj.id," ",speed);
    }
    return maxSpeed;
}

function hexToRgb(hex) { // https://stackoverflow.com/a/5624139
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function map_measure_stops(minZoom, maxZoom, fn) {
    return [...Array(20).keys()].map(x => {
        let z = x + 1;
        if (z < minZoom || z > maxZoom) {
            return [z, 0];
        } else {
            return [z, fn(z)];
        }
    });
}

function ui_threat_lvl(obj) {
    if (world && world.user_overrides && world.user_overrides.threat_lvl && world.user_overrides.friendlies) {
        if (world.user_overrides.friendlies.find(id => id === obj.id)) {
            return 1;
        } else if (world.user_overrides.threat_lvl[obj.id] && world.user_overrides.threat_lvl[obj.id].expected === obj.threat_lvl) {
            return Math.min(4, Math.max(0, world.user_overrides.threat_lvl[obj.id].replacement));
        } else {
            return Math.min(4, Math.max(0, obj.threat_lvl));
        }
    } else {
        return Math.min(4, Math.max(0, obj.threat_lvl));
    }
}

function all_detections() {
   // console.log( world );
    if (typeof world !== 'undefined' && world) {
        // console.log("hi",world.identified_objects.length, "caller", all_detections.caller);

        // tab 1
        //
        // var ch = new BroadcastChannel('test');
        //     ch.postMessage( Array.isArray(world.identified_objects) );
        //     console.log("Left panel calling right panel");

        return [].concat(
            Array.isArray(world.identified_objects) ? world.identified_objects : [],
            Array.isArray(world.radio_detections) ? world.radio_detections : [],
            Array.isArray(world.indirect_detections) ? world.indirect_detections : []
        );
    } else {
        return [];
    }
}

function remove_from_detection(obj) {
    //console.log(obj)
    // PR-510 system selection feature implementation >0 detections case, set selected, system, user selected use cases
    if(obj.id != null){
        if(local_state.selected == obj.id) local_state.selected = null;
        if(local_state.user_selection == obj.id) local_state.user_selection = null;
        if(local_state.system_selection == obj.id) local_state.system_selection = null;

    }
	if (world) {
		world.identified_objects.splice(world.identified_objects.findIndex(e => e.id == obj.id), 1);
		world.radio_detections.splice(world.radio_detections.findIndex(e => e.id == obj.id), 1);
	}
	if (map) {
		remove_from_map(obj);
	}
}

// GMaps functions
var geocoder;
function initMap() {
	geocoder = new google.maps.Geocoder;
	console.log("Geocoder created!");
   // document.getElementById('map').style.marginTop = "35px";
    if(document.getElementById('liveicon')){
        document.getElementById('liveicon').style.marginTop = "11px";
        document.getElementById('liveText').style.marginTop = "11px";
    }
}

function geocodeLatLng(el, child, type, lat, lon) {
	let now_ts = (new Date).getTime();
//	console.log("Address search for "+el.id+" type "+type+" address_ts_diff:" +(now_ts - el.address_update_ts) +" home_ts_diff: " + (now_ts - el.home_update_ts));
	if((type != "home" && now_ts - el.address_update_ts > 30000) || (type == "home" && now_ts - el.home_update_ts > 30000)) { //update every 30s

	    console.log("updating ["+el.id+"] " + type + " address.");
		if (typeof geocoder !== 'undefined') {
		    var latlng = {lat: parseFloat(lat), lng: parseFloat(lon)};

		    geocoder.geocode({'location': latlng}, function(results, status) {
//	      console.log("callback ["+el.id+"] " + type + " request.");
//		      console.log(results);
		      if (status === 'OK') {
		        if (results[0]) {
		        	if(type == "home") {
                        let homeContainer = child.querySelector('.home-container');
                        let loading = homeContainer.querySelector('.lds-ellipsis');
                        if(loading != null) homeContainer.removeChild(loading);

                        el.home_address = results[0].formatted_address;
                        el.home_update_ts = now_ts;
		        	    if(simpleView){
                            let homeAddressContainer = child.querySelector('.home-address-container');
                            homeAddressContainer.innerText = "Operator: " + el.home_address;
                            if (homeAddressContainer.style.display === "none") {
                                homeAddressContainer.style.display = "flex";
                            }
                            if (child.querySelector('.home-container').style.display != "none") {
                                child.querySelector('.home-container').style.display = "none";
                            }
                        } else {
                            let homeAddressContainer = child.querySelector('.home-address-container');
                            homeAddressContainer.innerText = el.home_address;
                            if(homeAddressContainer.style.display === "none") {
                                homeAddressContainer.style.display = "flex";
                            }
                        }

		        	}
		        	else {
                        let locationContainer = child.querySelector('.location-container');
                        let loading = locationContainer.querySelector('.lds-ellipsis');
                        if(loading != null) locationContainer.removeChild(loading);

                        el.address = results[0].formatted_address;
                        el.address_update_ts = now_ts;
		        	    if(simpleView){
                            let addressContainer = child.querySelector('.address-container');
                            addressContainer.innerText = "Drone: " + (el.location ? el.location + ' | ' : 'N/A | ') + el.address;

                            if (addressContainer.style.display === "none") {
                                addressContainer.style.display = "flex";
                            }
                            if (child.querySelector('.location-container').style.display != "none") {
                                child.querySelector('.location-container').style.display = "none";
                            }

                        } else {
                            let addressContainer = child.querySelector('.address-container');
                            addressContainer.innerText = el.address;
                            if(addressContainer.style.display === "none") {
                                addressContainer.style.display = "flex";
                            }
                        }
		        	}
		        	report_coordinates = new maptalks.Coordinate({ y: lat, x: lon });
		        	console.log(type + " address for ["+el.id+"] (Lat: "+ lat +" Lon: "+ lon +") is "+results[0].formatted_address);
		        } else {
		        	el.address_update_ts = now_ts;
		        	console.log("No address found!" + el.id);
		        }
		      } else {
		    	el.address_update_ts = now_ts - 20000;
                  let homeContainer = child.querySelector('.home-container'),
                      locationContainer = child.querySelector('.location-container');
                  let loadingHome = homeContainer.querySelector('.lds-ellipsis'),
                      loadingAddress = locationContainer.querySelector('.lds-ellipsis');
                  if(loadingHome != null) homeContainer.removeChild(loadingHome);
                  if(loadingAddress != null) locationContainer.removeChild(loadingAddress);
		      	console.log('Geocoder [' + el.id + '] failed due to: ' + status);
		      }
		    });
		}
		else {
			console.log("Geocoder not created yet!");
		}
	}
}

// Clipboard
//
// const copyToClipboard = str => {
//
//     const el = document.createElement('textarea');  // Create a <textarea> element
//
//     el.value = str;                                 // Set its value to the string that you want copied
//     el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
//     el.style.position = 'absolute';
//     el.style.left = '-9999px';                      // Move outside the screen to make it invisible
//     document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
//
//     const selected =
//
//     document.getSelection().rangeCount > 0          // Check if there is any content selected previously
//     ? document.getSelection().getRangeAt(0)         // Store selection if found
//     : false;                                        // Mark as false to know no selection existed before
//
//     el.select();                                    // Select the <textarea> content
//     var status = document.execCommand('copy');      // Copy - only works as a result of a user action
//                                                     // (e.g. click events)
//
//     // var msg  = 'copyToClipboard( "' +str+'" '  ;
//     //     msg +=  status? 'success' : 'failure' ;
//     // console.log(  msg );
//
//     document.body.removeChild(el);                  // Remove the <textarea> element
//
//     if (selected) {                                 // If a selection existed before copying
//         document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
//         document.getSelection().addRange(selected); // Restore the original selection
//     }
// };

function url_query_val(field)
{
    var url   = window.location.href;
    var parts = url.split('?');
    if (parts.length !== 2 ){
        return false;
    }
    parts = parts[1].split('&');
    for( var ix = 0; ix < parts.length; ix++ ){
         var pair = parts[ix].split('=',2);
         if ( pair[0] == field ){ // found!
             return ( pair.length == 2 )? pair[1] : true;
         }
    }
    // scanned without success
    return false;
}
function is_debug()
{
    return url_query_val('debug');
}

function include_js( src, cond = true )
{
    var do_include = (typeof cond === 'function')? cond():cond;
    if (do_include){
        var head = document.getElementsByTagName('head')[0];
        var js = document.createElement('script');
        
        js.type = 'text/javascript';
        js.src  = src;
        head.appendChild(js);
        
        console.log( 'script loaded:', src );
    }
}

function constructSelectionMessage(obj, done)
{
    var host_url = window.location.protocol +'//' + window.location.hostname;
    
    if (!obj){
        done(false);
    }
    
    //console.log( obj );
    let  ch = null; // const will be read only; can not change inside if  and post reference
    // HOTFIX V7.11.7 multibrowser support: Test if browser and OS, Chrome on iOS, don't support cross channel communication
    let  iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let  isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    let  isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    let  isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
    if( (isMac && isSafari) || (iOS  && isChrome) || (iOS  && isSafari) ){
    }else{
        ch = new BroadcastChannel('clickedDetection');
        ch.postMessage( JSON.stringify(obj));
        console.log("Left panel calling right panel");
    }



    var text    = 'Detection ';
    var area    = obj.hasOwnProperty( 'location'   )? obj.location : false;
    
    if (area !== false ){
        text += ' at ' + area;
    }
    
    var thrt_lvl= obj.hasOwnProperty('threat_lvl'  )? obj.threat_lvl : false;
    
    if (thrt_lvl){
        text += ' threat level ' + thrt_lvl;
        switch( thrt_lvl ){
            case 0: text += ''; break;
            case 1: text += ', green - informational '; break;
            case 2: text += ', yellow - watch  '; break;
            case 3: text += ', orange - warning '; break;
            case 4: text += ', red - needs attention '; break;
        }
    }
    text += "\n\n";
    text += 'Drone ';
    var drone_id    = obj.hasOwnProperty( 'id'   )? obj.id : false;
    text += ( drone_id!== false )? ('[' + drone_id + ']' ): '[?]';
    
    var drone_model = obj.hasOwnProperty( 'name' )? obj.name : false;
    text += ' model ';
    text += ( drone_model!== false )? drone_model: '[unknown]';
    
    var pos = obj.hasOwnProperty('positions')?
              obj.positions[ obj.positions.length -1 ] : false;
    if ( pos ){
        // text += ' detected at https://www.google.com/maps/@?api=1&map_action=map&center='+pos.lat+','+pos.lon +' ';
        // PR-488  Remove URLS and add single report url #
        text += ' detected at ';
        // text += ' detected at '+pos.lat+','+pos.lon +') ';
        if (pos.alt) text+= ' ' + pos.alt + ' meter high,';
    }
    if ( area ){
        text + ' inside the ' + area + ' perimeter, ';
    }
    
    address = obj.hasOwnProperty('address')? obj.address : false;
    if ( address ){
        text += ' approximately at ' + address;
    }
    
    text += '.';
    // text += "\n\n";
    
    var lat     = obj.hasOwnProperty('home_lat'    )? obj.home_lat     : false;
    var lon     = obj.hasOwnProperty('home_lon'    )? obj.home_lon     : false;
    var address = obj.hasOwnProperty('home_address')? obj.home_address : false;
    
    // construct home address if any
    if ( lat && lon ){
        text += 'Operator location at ';
        // PR-488  Remove URLS and add single report url #
        // text += 'Operator location at https://www.google.com/maps/@?api=1&map_action=map&center='+lat+','+lon +' ';
        // text += 'Operator location at '+lat+','+lon +') ';
    }
    if ( address ) text += ' approximately at ' + address;
    
    if ( !lat && !address ){
        text += '(No operator information).';
    }
    // PR-488  Remove URLS and add single report url #
    // let token;
    // FIX ME: move url to backend
    // Its failing on dev commenout
    let reportTokenURL = 'https://devgalaxydvr.galaxy.airspace.co/reports?user_email=' + user_email + '&detection_ids='+obj.id;
    let myFirstPromise = new Promise((resolve, reject) => {
        getReportURL(reportTokenURL, (url) => {
            resolve(url);
        });
    })
    myFirstPromise.then((successMessage) => {
        text += " "+successMessage;
        console.log(text);
        done(text);
    });
    // makeRequest("GET", reportTokenURL, null, function (err, data) {
    //     if (err) {
    //         throw err;
    //
    //     }
    //     // PR-488  Remove URLS and add single report url #
    //     token = JSON.parse(data);
    //     token = token.substr(token.indexOf('&t=')+3,token.length);
    //     text += "https://galaxy.airspace.co/single.php?t="+token;
    //     text += "\n\n";
    //
    //     return text;
    // });
}

//
// const copySelectionToClipboard = obj =>
// {
//     constructSelectionMessage( obj, (text) => {
//         console.log( text );
//         if (text !== false ){
//             // console.log( text );
//             copyToClipboard( text );
//         }
//     });
//
// };

// class manipulation by class
function changeClassByClassName( with_cls, add_cls, rem_cls = false )
{
    var elements = document.getElementsByClassName(with_cls);
    
    for (var ix = 0; ix < elements.length; ix++) {
         var el = elements[ ix ];
        
         if (add_cls) el.classList.add   (add_cls);
         if (rem_cls) el.classList.remove(rem_cls);
    }
};

// obj has event handling methods
function is_eventable( obj )
{
    if (obj === null ) return false;
    return  (typeof obj.addEventListener    === 'function') &&
            (typeof obj.removeEventListener === 'function')  ;
}

function ResolveEventableElementById( id )
{
    if ( id == null ) return null;

    var el = null;
    
    if ( typeof id === 'string' ){
        el = document.getElementById( id );
    }
    else{
        el = id; // maybe id is a valid eventable object?
    }
        
    if ( !is_eventable( el ) ){
        el = null;
    }
    
    if ( typeof el === 'undefined' || el === null ){
        el = null;
        console.log( 'Could not resoleve ' + id  );
    }
    
    return el;
}

//   http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element
//    note: "styleName" is in CSS form (i.e. 'font-size', not 'fontSize').
var getStyle = function (e, styleName) {
    var styleValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle) {
        styleValue = document.defaultView.getComputedStyle(e, "").getPropertyValue(styleName);
    }
    else if(e.currentStyle) {
        styleName = styleName.replace(/\-(\w)/g, function (strMatch, p1) {
                                      return p1.toUpperCase();
                                      });
        styleValue = e.currentStyle[styleName];
    }
    return styleValue;
}


function boxPosition(container, box, desc) {

    //  fix hiding nav when auto scrolling
    var body = document.body,
        overlay = document.querySelector('.live-header');
    var overlayOpen = this.className === 'detected-threats-container';
    var livegroup = this.className === 'live-group';

    /* Toggle the aria-hidden state on the overlay and the no-scroll class on the body */
    document.getElementById('live-header').setAttribute('aria-hidden', !overlayOpen);
    document.getElementById('live-bar').setAttribute('aria-hidden', !livegroup);
    body.classList.toggle('noscroll', overlay);
    document.getElementById('live-header').scrollTop = 0;
    document.getElementById('live-bar').scrollTop = 0;
    document.getElementById('liveicon').style.marginTop = "11px";
    document.getElementById('liveText').style.marginTop = "11px";

    var pos = false;
    var cn_hor_center = (container.left + container.right) / 2 - box.width / 2;
    var cn_vrt_center = (container.top + container.bottom) / 2 - box.height / 2;

    switch (desc) {
        case 'top-left'      : pos = {left: container.left, top: container.top}; break;
        case 'top-center'    : pos = {left: cn_hor_center, top: container.top}; break;
        case 'top-right'     : pos = {left: container.right, top: container.top}; break;
        case 'bottom-left'   : pos = {left: container.left, top: container.bottom}; break;
        case 'bottom-center' : pos = {left: cn_hor_center, top: container.bottom}; break;
        case 'bottom-right'  : pos = {left: container.right, top: container.bottom}; break;
        case 'center'        : pos = {left: cn_hor_center, top: cn_vrt_center}; break;
        default: console.log('warning: unsupported pos string :', desc); break;
    }
    return pos;
}

// Helper to limit element's position to indide it's container
// (Notice: we use size attribute if it was installed, this helps
// with non-visible elements, with anninvalid getBoundingClientRect)
//
function adjustPositionToContainer( pos, element, container )
{
    var cn_info = container.getBoundingClientRect();
    var el_info = element.getBoundingClientRect();
    if ( typeof element.size !== 'undefined' ){ // if we have cached value - use it!
        el_info = element.size;
    }

    // translate string literal to {left,top}
    if ( typeof pos === 'string' ){
        pos = boxPosition( cn_info, el_info, pos );
    }

   //console.log( 'before: ', pos );

    if ( pos ){
        // adjust pos to container dimentions : underflow and overflow in X & Y

        var  overflow = pos.top + el_info.height - cn_info.bottom;
        if ( overflow > 0 ) pos.top -= overflow;
        if ( pos.top  < cn_info.top  ) pos.top  =  cn_info.top;

        overflow = pos.left + el_info.width - cn_info.right;
        if ( overflow > 0 ) pos.left -= overflow;
        if ( pos.left < cn_info.left   ) pos.left  =  cn_info.left;
    }
    return pos;
}

// popup object
function build_popup()
{
    var popup_obj = {
        
        id        : null,
        container : null,
        control   : null,
        popup     : null,
        enabled   : false,
        fixed_pos : false,
        last_pos  : false,
        ctl_event : null,
        
        setup_size: function(){
            if ( this.popup === null ) return;
            
            if ( typeof this.popup.size === 'undefined'){
                        this.popup.size = {width:0,height:0};
            }
            var visible = this.is_visible();
            if (!visible) this.show(); // getBoundingClientRect works only on visible elements
                
            var info   = this.popup.getBoundingClientRect();
            
            this.popup.size.width  = info.width ;
            this.popup.size.height = info.height;
            
            // getBoundingClientRect does not include margins!
            var style  = window.getComputedStyle(this.popup);
            if (style){
                var margin = parseInt(style[ 'margin-left' ]) + parseInt(style[ 'margin-right' ]);
                this.popup.size.width += margin;
                    margin = parseInt(style[ 'margin-top' ]) + parseInt(style[ 'margin-bottom' ]);
                this.popup.size.height += margin;
            }
            
            if (!visible) this.hide();
        },
        setup     : function(popup_id, event_type = 'click', ctl_id = null, container_id = null, fixed_pos = false, enable = true ){
            
            this.id = popup_id;
            
            var on_resize_handler = this.on_resize.bind(this);
            window.addEventListener('resize', on_resize_handler);
            
            var event_handler = this.position.bind(this);
            var current = this.control;
            
            this.hide(); // hide last popup (if exists)
            
            this.control = (typeof ctl_id === 'string' )? ResolveEventableElementById( ctl_id ) : ctl_id;
            
            if ( this.control !== null ){

                if (this.control != current ){
                    if (current !== null ){ // detach from current control
                        if (current.off !== 'undefined' )
                            current.off(event_type, event_handler, false);
                        else
                            current.removeEventListener(event_type, event_handler, false);
                    }
                    // attach to new control
                    if (typeof this.control.on !== 'undefined' )
                        this.control.on(event_type, event_handler, false);
                    else
                        this.control.addEventListener(event_type, event_handler, false);
                }
            }
            
            // resolve container & popup
            this.container = ResolveEventableElementById( container_id );
            this.popup     = ResolveEventableElementById( popup_id );
            this.fixed_pos = fixed_pos;
            
            // cache popup size for later us in position calculations
            this.setup_size();
            
            if (enable){
                this.enable();
                // show new popup
                if ( this.fixed_pos !== false ){
                     this.position();
                }
            }
            return true;
        },
        on_resize: function(){
            this.setup_size();
            this.reposition();
        },
        get_ctl_event: function(){
            return this.ctl_event;
        },
        reposition: function(){
            this.position( this.last_pos, toggle_visibility = false );
        },
        position : function( e = null, toggle_visibility = true ){ // called on event_type (see init above)
            
            this.ctl_event = e ;

            // console.log( e );
            var pos = {top:-1,left:-1};
            
            if ( this.fixed_pos !== false ){
                pos = this.fixed_pos;
            }
            else
            if ((typeof e === 'string' )){
                pos = e; // strings are handled in adjustPositionToContainer
            }
            else
            if ((typeof e.pageY !== 'undefined' )&& // normal dom event?
                (typeof e.pageX !== 'undefined' )){
                pos.left = e.pageX;
                pos.top  = e.pageY;
            }
            else
            if ( typeof e.containerPoint !== 'undefined' ){
                pos.left = e.containerPoint.x;
                pos.top  = e.containerPoint.y;
            }
            
            if ( this.popup !== null ){
                 this.last_pos = pos;
                 pos = adjustPositionToContainer( pos, this.popup,  this.container);
                
                 var on = this.is_visible();
                 this.hide();


                 if ( (pos.top >= 0) && (pos.left >= 0) ){
                     this.popup.style.top  = pos.top  + 'px';
                     this.popup.style.left = pos.left + 'px';
                 }
                 if ( this.enabled ){
                     // together with hide about this effectivly toggle_visibility the popup
                     if ((  toggle_visibility && !on )||
                         ( !toggle_visibility &&  on ) ){
                         
                         this.show();
                     }
                 }
            }
        },
        enable   : function( on = true ){
            this.enabled = on;
        },
        disable  : function(){
            this.hide();
            this.enable( false );
        },
        show: function(){
            if ( this.popup !== null ){
                this.popup.style.display = 'block';
            }
        },
        hide: function(){
            if ( this.popup !== null ){
                this.popup.style.display = 'none';
            }
        },
        is_visible: function(){
            var el_display = (this.popup)? this.popup.style.display:'none';
            // for some reason display:none set at css is read as ''
            return ( (el_display !== 'none') && (el_display !== '') );
        },
        toggle: function(){
            if ( this.is_visible() ) this.hide();
            else                     this.show();
        },
    };

    return popup_obj;
}

function build_timer( action, ms, start = false )
{
    var timer = {
        action: action,
            delay : ms,
        t: null,
        start: function(){
            this.stop();
            this.t = setInterval(this.action,this.delay);
        },
        stop: function(){
            if ( this.t !== null ) clearInterval( this.t );
            this.t = null;
        },
        toggle: function(){
            if ( this.t === null ) this.start();
            else                   this.stop ();
        },
        is_running: function(){
            return ( this.t !== null );
        },
    }
    if ( start ) timer.start();
    return timer;
}

function build_confirm()
{
    var confirm = build_popup();
    
    confirm.build_html = function()
    {
        if ( this.popup){
            var ok_id     = this.id +'-ok';
            var cancel_id = this.id +'-cancel';
            var cls = '';
            
            var html = '<div class="container">';
                cls   = (this.options.text_class !== '') ? (' ' + this.options.text_class):'';
                html +=     '<div class="confirm-text' + cls + '">' +
                                this.text +
                            '</div>';
                cls   = (this.options.ok_class !== '') ? (' class="' + this.options.ok_class)+'"':'';
                html +=     '<a id="'+ ok_id +'"'+ cls + '>' +
                                this.options.ok_text +
                            '</a>';
            
                cls   = (this.options.cancel_class !== '') ? (' class="' + this.options.cancel_class)+'"':'';
                html +=     '<a id="'+ cancel_id +'"' + cls + '>'+
                                this.options.cancel_text +
                            '</a>';
                html += '</div>';
            
            this.popup.innerHTML = html;
            this.on_resize(); // size changed due to html
            
            this.ok_id = ok_id;
            this.ok_el = document.getElementById(ok_id);
            
            this.cancel_id = cancel_id;
            this.cancel_el = document.getElementById(cancel_id);
        }
    };
    
    confirm.options = { // default options
        ok_text      : 'Ok',
        ok_class     : '',
        ok_flash     : '<div>Processing</div>',
        
        ok_flash_ms  : false,
        cancel_text  : 'Cancel',
        cancel_class : '',
        cancel_flash : 'Operation Cancelled',
        cancel_flash_ms: 3000,
        text_class: '',
        spinner_html : '<div class="spinner">' +
                            '<div class="bounce1"></div>' +
                            '<div class="bounce2"></div>' +
                            '<div class="bounce3"></div>' +
                        '</div>',
        
    };
    
    confirm.flash = function(text, ms = 3000 ){
        if ( typeof text === 'string' ){
            var cls   = (this.options.text_class !== '') ? (' ' + this.options.text_class):'';
            var html = '<div class="container">';
                html +=     '<div class="confirm-text' + cls + '">' +
                                text +
                            '</div>';
                html += '</div>';
        
            this.popup.innerHTML = html;
            this.on_resize(); // size changed due to html
        }
        
        if ( ms ){
            var hide_handler = this.disable.bind(this);
            this.timer = setTimeout(hide_handler, ms );
        }

        this.enable();
        this.show();
    };


    confirm.ok_flash_handler = function(){
        this.flash( this.options.ok_flash + this.options.spinner_html,
                    this.options.ok_flash_ms );
    };
    confirm.cancel_flash_handler = function(){
        this.flash( this.options.cancel_flash,
                    this.options.cancel_flash_ms );
    };
    confirm.message = function(text){
        if ( (typeof this.timer !== 'undefined' )&& (this.timer !== null ) ){
            clearTimeout( this.timer );
        }
        
        this.flash( '<div>'+text+'</div>' + this.options.spinner_html, false );
    };
    confirm.confirm = function(text,
                               ok_handler,
                               cancel_handler=null,
                               options = null ){
        
        if ( options !== null ){ // do we have caller supplied options
            Object.assign(this.options, options);
        }
        
        if ( (typeof this.timer !== 'undefined' )&& (this.timer !== null ) ){
            clearTimeout( this.timer );
        }
        
        this.text = text;
        this.build_html();
        
        if (this.ok_el){
            if ( typeof ok_handler === 'function' ){
                this.ok_el.addEventListener('click', ok_handler);
            }
            var handler = this.ok_flash_handler.bind(this);
            this.ok_el.addEventListener('click', handler);
        }
        if (this.cancel_el){
            if ( typeof cancel_handler === 'function' ){
                this.cancel_el.addEventListener('click', cancel_handler );
            }
            var handler = this.cancel_flash_handler.bind(this);
            this.cancel_el.addEventListener('click', handler);
        }
        this.enable();
        this.show();
    };
    confirm.action = function( action_handler, options = null ){
        if ( options !== null ){ // do we have caller supplied options
            Object.assign(this.options, options);
        }
        
        if ( (typeof this.timer !== 'undefined' )&& (this.timer !== null ) ){
            clearTimeout( this.timer );
        }
        
        this.ok_flash_handler();
        action_handler();
        
        this.enable();
        this.show();
    };
    return confirm;
}

// PR-360 Show Brooser not supported notification
function build_acknowledge()
{
    let acknowledge = build_popup();

    acknowledge.build_html = function()
    {
        if ( this.popup){
            var ok_id     = this.id +'-ok';
            var cancel_id = this.id +'-cancel';
            var cls = '';

            var html = '<div class="container">';
            cls   = (this.options.text_class !== '') ? (' ' + this.options.text_class):'';
            html +=     '<div class="confirm-text' + cls + '">' +
                this.text +
                '</div>';
            cls   = (this.options.ok_class !== '') ? (' class="' + this.options.ok_class)+'"':'';
            html +=     '<a id="'+ ok_id +'"'+ cls + '>' +
                this.options.ok_text +
                '</a>';

            // cls   = (this.options.cancel_class !== '') ? (' class="' + this.options.cancel_class)+'"':'';
            // html +=     '<a id="'+ cancel_id +'"' + cls + '>'+
            //     this.options.cancel_text +
            //     '</a>';
            html += '</div>';

            this.popup.innerHTML = html;
            this.on_resize(); // size changed due to html

            this.ok_id = ok_id;
            this.ok_el = document.getElementById(ok_id);

            this.cancel_id = cancel_id;
            this.cancel_el = document.getElementById(cancel_id);
        }
    };

    acknowledge.options = { // default options
        ok_text      : 'Ok',
        ok_class     : '',

        ok_flash_ms  : 3000,
        cancel_text  : 'Cancel',
        cancel_class : '',
        cancel_flash : 'Operation Cancelled',
        cancel_flash_ms: 3000,
        text_class: '',
        spinner_html : '<div class="spinner">' +
            '<div class="bounce1"></div>' +
            '<div class="bounce2"></div>' +
            '<div class="bounce3"></div>' +
            '</div>',

    };

    acknowledge.flash = function(text, ms = 3000 ){
        if ( typeof text === 'string' ){
            var cls   = (this.options.text_class !== '') ? (' ' + this.options.text_class):'';
            var html = '<div class="container">';
            html +=     '<div class="confirm-text' + cls + '">' +
                text +
                '</div>';
            html += '</div>';

            this.popup.innerHTML = html;
            this.on_resize(); // size changed due to html
        }

        if ( ms ){
            var hide_handler = this.disable.bind(this);
            this.timer = setTimeout(hide_handler, ms );
        }

        this.enable();
        this.show();
    };
    acknowledge.ok_flash_handler = function(){
        this.flash( this.options.ok_flash ,
            this.options.ok_flash_ms );
    };
    acknowledge.cancel_flash_handler = function(){
        this.flash( this.options.cancel_flash,
            this.options.cancel_flash_ms );
    };
    acknowledge.message = function(text){
        if ( (typeof this.timer !== 'undefined' )&& (this.timer !== null ) ){
            clearTimeout( this.timer );
        }

        this.flash( '<div>'+text+'</div>' + this.options.spinner_html, false );
    };
    acknowledge.confirm = function(text,
                               ok_handler,
                               cancel_handler=null,
                               options = null ){

        if ( options !== null ){ // do we have caller supplied options
            Object.assign(this.options, options);
        }

        if ( (typeof this.timer !== 'undefined' )&& (this.timer !== null ) ){
            clearTimeout( this.timer );
        }

        this.text = text;
        this.build_html();

        if (this.ok_el){
            if ( typeof ok_handler === 'function' ){
                this.ok_el.addEventListener('click', ok_handler);
            }
            var handler = this.ok_flash_handler.bind(this);
            this.ok_el.addEventListener('click', handler);
        }
        if (this.cancel_el){
            if ( typeof cancel_handler === 'function' ){
                this.cancel_el.addEventListener('click', cancel_handler );
            }
            var handler = this.cancel_flash_handler.bind(this);
            this.cancel_el.addEventListener('click', handler);
        }
        this.enable();
        this.show();
    };
    acknowledge.action = function( action_handler, options = null ){
        if ( options !== null ){ // do we have caller supplied options
            Object.assign(this.options, options);
        }

        if ( (typeof this.timer !== 'undefined' )&& (this.timer !== null ) ){
            clearTimeout( this.timer );
        }

        this.ok_flash_handler();
        action_handler();

        this.enable();
        this.show();
    };
    return acknowledge;
}


// UI BUILD SELECT DROP-DOWN
function build_select()
{
    var select = {
        
        id          : false,
        el          : false,
        options     : [],
        options_el  : [],
        handler     : null,
        selected_ix : null,
        selected_val: null,
        option_width: 0,
        session_key : false,
        
        reset : function(){
            this.id = false;
            this.el           = false;
            this.options      = [];
            this.options_el   = [];
            this.handler      = null;
            this.selected_ix  = null;
            this.option_width =  0;
        },

        setup : function( id, options, handler,
                         option_group_cls = false, option_cls =false,
                         session_key = false ){
            
            this.reset(); // just in case of a re-setup
        
            this.id      = id;
            this.options = options;
            this.handler = handler;
            this.session_key = session_key;
            
            this.el = document.getElementById( id );
            if ( this.el ){
                var ul_name = id +'-option-group';
                var html = '<ul id="'+ ul_name + '">';
                
                for( var ix=0; ix< options.length; ix++ ){
                    var item = options[ ix ];
                    var option_name = id + '-option-'+ ix;
                    html += '<li id="' + option_name + '" data-val="' + ix + '">' +
                        item.text +
                        '</li>';
                }
                
                html += '</ul>';
                this.el.innerHTML = html;
                
                var selectd_handler = this.selectd_handler.bind(this);
                this.el.addEventListener( 'click', selectd_handler )
               
                var option_group   = document.getElementById( ul_name );

                // PR-340 UI SELECT DROP DOWN TOGGLE OPTIONS CALENDAR & SHOW
                var toggle_options = this.toggle_options.bind(this);
                option_group.addEventListener( 'click', toggle_options );
                option_group.addEventListener( 'mouseleave', () => {
                    for (var ix = 0; ix < this.options_el.length; ix++) {
                        var option_el = this.options_el[ix];

                        if (option_el.classList.contains('show')) {
                            option_el.classList.remove('show');
                        }
                    }
                });
                
                if ( option_group_cls !== false ){
                    option_group.classList.add( option_group_cls );
                }
                
                var selected_ix = null;
                if(this.id === "role-select"){
                    selected_ix = (this.session_key !== false)?
                        sessionStorage.getItem(this.session_key): null;
                }
                
                for( var ix=0; ix< options.length; ix++ ){
                    var option_name = id + '-option-'+ ix;
                    var option_el = document.getElementById( option_name );
                    
                    if ( option_cls !== false ){
                         option_el.classList.add( option_cls );
                    }
                    // get width to calculate max width
                    option_el.classList.add('show');
                    var width = option_el.getBoundingClientRect().width;
                    if ( this.option_width < width ) this.option_width = width ;
                    option_el.classList.remove('show');
                    
                    this.options_el.push( option_el );
                    
                    if ( typeof options[ix].selected === 'undefined' ){
                        options[ix].selected = false;
                    }
                    
                    if ( (selected_ix === null) && options[ix].selected ){
                        selected_ix = ix;
                    }
                }
                // make sure we have a valid `selected_ix`, either from sessionStorage
                // from options or 0
                if ( selected_ix === null ) selected_ix = 0;
                if ( selected_ix >= this.options_el.length ) selected_ix = 0;

                // scale options to calculated option width
                for( var ix=0; ix< this.options_el.length; ix++ ){
                    var option_el = this.options_el[ ix ];
                    option_el.style.width = this.option_width + 'px';
                }
                
                selectd_handler( this.options_el[ selected_ix ]);
            }
        },
        // PR-340 UI SELECT DROP DOWN TOGGLE OPTIONS CALENDAR & SHOW
        toggle_options: function () {
            for (var ix = 0; ix < this.options_el.length; ix++) {
                var option_el = this.options_el[ix];

                if (option_el.classList.contains('show')) {
                    option_el.classList.remove('show');
                } else {
                    option_el.classList.add('show');
                }
            }
        },
        selectd_handler: function (e) {

            var el = false;
            var ix = false;

            if (typeof e.dataset !== 'undefined') {
                el = e;
            } else if (typeof e.target !== 'undefined') {
                el = e.target;
            } else {
                console.warn('unknown event : ', e);
                return;
            }

            if (typeof el.dataset !== 'undefined' &&
                typeof el.dataset.val !== 'undefined') {
                ix = el.dataset.val;
            }

            if (ix === false) {
                console.warn('no dataset val found in:', el);
                return;
            }

            var val = this.options[ix].value;
            this.selected_val = val;

            if (this.selected_ix !== null &&
                this.selected_ix != ix) {
                this.options_el[this.selected_ix].classList.remove('selected');
            }

            this.options_el[ix].classList.add('selected');

            if (this.selected_ix !== ix || this.options_el[ix].classList.contains("grayOut")) {
                let changed = false;
                if (this.selected_ix !== null) {
                    changed = true;
                }
                this.selected_ix = ix;
                console.log(this.id + ':' + val + ' selected');
                if(simpleView && !firstSelect) showAll();
                if (typeof this.handler === 'function') {
                    this.handler(val);
                }

                if (this.session_key && this.id === "role-select") {
                    sessionStorage.setItem(this.session_key, this.selected_ix);
                    if (changed) {
                        location.reload();
                    }
                }
            }


            // PR-582 Filter reselection show all Advanced and Standard Simple View
            if (this.selected_ix === ix && this.options_el[ix].classList.contains("show")){
                console.log('dropdown opened');

            } else {
                console.log(this.id + ':' + val + ' reselected, ignoring');
                if(simpleView && !firstSelect) showAll(); local_state.need_scrolling = true;
            }

        },
    };
    
    return select;
}

function msToNiceTime( ms )
{
    var mili= ms % 1000;
    var sec = (ms / 1000) % 60;
    var min = Math.floor(( ms / (60 * 1000)) % 60);
    
    var nice = '';
    
    if ( min !== 0 ){
        nice += min + ' min ';
        sec   = Math.floor( sec );
    }
    if ( sec > 1 ){
        mili  = 0;
        sec = ( sec > 10 )? Math.floor( sec ) : (Math.round( sec * 100 ) / 100);
        nice += sec + ' sec ';
    }
    if ( mili !== 0 ){
        if (( min === 0 )&&( sec < 4 )){
            nice += mili + ' ms';
        }
    }
    
    return nice;
}

function getLocation(handler, error_handler = null ) {
    
    function on_error( err, msg = false ){ // failure
        
        if ( typeof msg !== 'string' ){
             msg = 'An unknown error occurred (' + err.code + ')';
             switch( err.code ) {
                case err.PERMISSION_DENIED    : msg = 'User denied the request for Geolocation'   ; break;
                case err.POSITION_UNAVAILABLE : msg = 'Location information is unavailable'       ; break;
                case err.TIMEOUT              : msg = 'The request to get user location timed out'; break;
                case err.UNKNOWN_ERROR        : msg = 'An unknown error occurred'                 ; break;
            }
        }
        console.warn( 'getLocation error('+ err.code +'): ' + msg );
        if ( typeof error_handler === 'function' ){
            error_handler( err.code, msg );
        }
        return msg;
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
                 function( pos ){ // success
                    console.log( 'getLocation:' , pos );
                    if ( typeof handler === 'function' ) handler( pos );
                 },
                 on_error );
    }
    else{
        on_error( {code:-1}, 'Geolocation is not supported by this browser.' );
    }
}

function getUserName(){
    sessionStorage.setItem("userName", world.config.user_name);
    return (typeof  world.config.user_name === 'string')?
                    world.config.user_name : 'Airspace';
};

function getCompany(){
    return (typeof  world.config.company === 'string')?
        world.config.company : 'Airspace';
};


function playAudio(url, id = false ){
    
    if (id!==false){ // check if already exists -- bail if exists
        // Notice a race condition between checking if element
        // exists and adding to document below
        var el =  document.getElementById(id);
        if (typeof(el) != 'undefined' && el != null) return false;
    }
    
    var audio = document.createElement('audio');
    if (id !== false) audio.id  = id;
    
    audio.src = url;
    audio.style.display = 'none'; // added to fix ios issue
    audio.autoplay = false;   // no way to avoid the user has not interacted with your page issue
    
    audio.onended = function(){ // remove self after playing to clean the DOM
        audio.remove();
    };
    
    document.body.appendChild(audio);
    
    var promise = audio.play();
    if (promise !== undefined) {
        promise
        .then(function() {
                         // Audio playback started
        })
        .catch(function(error) {
               console.warn( error.message );
                // Audio playback failed.
        });
    }
    
    return true;
}

function removeElementById(id) {
    
    var ids = [];
    if (typeof ids === 'string' ){
        ids = [ id ];
    }
    else
    if ( Array.isArray && Array.isArray(id) ){
        ids = id;
    }
    else{
        console.warn( 'removeElementById invalid argument:', id );
        return;
    }
    
    for( var ix = 0; ix < ids.length; ix++ ){
        
        // Removes one element from the document
        var el = document.getElementById( ids[ix] );
        el.parentNode.removeChild(el);
    }
}

function dropdown_click(id) {
    document.getElementById(id).classList.toggle("show");
}

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

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}


function findNearestDrones(drones, camLocation) {
    //lat = y, lon = x
    let nearestDrones = [0,0], min = -1;
    let distanceSecond = -1;
    for (let drone of drones) {
        let pos = drone.positions.length-1;
        if(drone.positions[pos].lat && drone.positions[pos].lon){
            let distance = getDistanceFromLatLon(camLocation.y, camLocation.x, drone.positions[pos].lat, drone.positions[pos].lon);
            // console.log("distance: ", distance);
            if (distance < min || min === -1) {
                min = distance;
                nearestDrones[1] = nearestDrones[0];
                nearestDrones[0] = drone.last_detection_id;
            }else if(nearestDrones[1] === 0 || distance < distanceSecond){
                nearestDrones[1] = drone.last_detection_id;
                distanceSecond = distance;
            }
        }
    }
    // console.log("nearest: ", nearestCamera);
    return nearestDrones;
}

function findNewestDrones(drones) {
    //lat = y, lon = x
    let newestDrones = [0,0], max = -1;
    let timeSecond = -1;
    for (let drone of drones) {
        let pos = drone.positions.length-1;
            // console.log("distance: ", distance);
        if (max <  drone.positions[pos].ts || max === -1) {
            max = drone.positions[pos].ts;
            newestDrones[1] = newestDrones[0];
            newestDrones[0] = drone.last_detection_id;
        }else if(newestDrones[1] === 0 || drone.positions[pos].ts < timeSecond){
            newestDrones[1] = drone.last_detection_id;
            timeSecond = drone.positions[pos].ts;
        }
    }
    // console.log("nearest: ", nearestCamera);
    return newestDrones;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// PR-427 Add Product Tour & Satellite Button Manage Satellite View Logic (such as ruler, cones, assets, polygons)
function satelliteSwitching() {
    //console.log("satelliteSwitching to satellite view  on off ????");
    let baseLayer = null;
    if (world.config.map && world.config.map != "Map") {
        onOffButton("buttonToggleSatellite", "");
        world.config.map = "Map";
        world.config.base_layer.subdomains = ["a", "b", "c"];
        world.config.base_layer.urlTemplate = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
        base_draw();
    } else {
        onOffButton("buttonToggleSatellite", "");
        world.config.map = "Satellite";
        world.config.base_layer.subdomains = ["1"];
        world.config.base_layer.urlTemplate = "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
        base_draw();
    }
    let layers3d = map.getLayers()
        .filter(l => l._id.startsWith('3d'))
        .map(l => l._id);
    if (layers3d.length > 0) {
        let style = 'mapbox://styles/mapbox/light-v10';
        if (mapboxglLayer.getGlMap().getStyle().sprite === 'mapbox://sprites/mapbox/light-v10') {
            style = 'mapbox://styles/mapbox/satellite-streets-v11';
        }
        mapboxglLayer.getGlMap().setStyle(style);
        render_building();
        // PR-432  satelliteSwitching function requires return from PR-427
    } else {
        baseLayer = new maptalks.TileLayer('base',{
            'urlTemplate': world.config.base_layer.urlTemplate,
            'subdomains'  : world.config.base_layer.subdomains
        });
        map.setBaseLayer(baseLayer);
    }
}

function getReportURL(reportTokenURL, done){

    let text;
    fetch(reportTokenURL, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "error", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    })
        .then ( response => response.json())
        .then( data => {
            // token = JSON.parse(data);
            let token = data.substr(data.indexOf('&t=')+3,data.length);
            text = "https://galaxy.airspace.co/single.php?t="+token;
            text += "\n\n";

            done(text);
        });
}

function constructSelectionMessage2(obj,done)

{
    let text = "my Text";
    let reportTokenURL = 'https://devgalaxydvr.galaxy.airspace.co/reports?user_email=panu.kampanakorn@airspace.co&detection_ids=50580';
    console.log("in constructSelectionMessage2");
    let myFirstPromise = new Promise((resolve, reject) => {
        getReportURL(reportTokenURL, (url) => {
            resolve(url);
        });
    })
    myFirstPromise.then((successMessage) => {
        console.log("Yay! " + successMessage);
        // text += url;
        done(successMessage);
    });
}

function testMe() {

    // var ok_action = async function () {
        constructSelectionMessage2(111, function(returnValue) {
            // use the return value here instead of like a regular (non-evented) return value
            console.log("mytext", returnValue);
        });
    // }
}

function url_by_host()
{
    let host   = window.location.hostname;
    //var schema = window.location.protocol;
    let url = window.location.href;
    let arr = url.split("/");
    let schema = arr[0];


    switch(host){
        case 'localhost' :
            host = window.location.href.split('/www')[0] + '/www';
            break;

        case 'galaxy.airspace.co'    :
        case 'dev.galaxy.airspace.co':
        default:
            if(window.location.port != ""){
                host += ':' + window.location.port;
            }
            host = schema + '//' + host;
            break;
    }


    url = host +"/";
    return url;
}

function dvr_url_by_host()
{
    let host   = window.location.hostname;
    //var schema = window.location.protocol;
    let url = window.location.href;
    let arr = url.split("/");
    let schema = arr[0];


    switch(host){
        case 'localhost' :
            host = "devgalaxydvr.galaxy.airspace.co";
            break;

        case 'galaxy.airspace.co'    :
            host = "devgalaxydvr.galaxy.airspace.co"; //
            host = schema + '//' + host;
            break;
        case 'qa.galaxy.airspace.co'    :
            host = "devgalaxydvr.galaxy.airspace.co";
        case 'dev.galaxy.airspace.co':
            host = "devgalaxydvr.galaxy.airspace.co";
        default:
            if(window.location.port !== ""){
                host += ':' + window.location.port;
            }
            host = schema + '//' + host;
            break;
    }

    return host;
}
