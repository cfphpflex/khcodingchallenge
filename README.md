#  Kittyhawk Coding Challenge 

## Overview
Kittyhawk processes a lot of data from various different places. Whether it's manually entered user data or programmatic data we capture from the drone itself, we're often operating on it. Not only are we collecting and processing large sums of data, but we're frequently adding valuable insight to it. For example, it's very handy to have the weather that a flight occurred in and very handy to have the airspace that it occurred in.

As part of the Kittyhawk Coding Challenge, we're going to put you in some real-world scenarios and evaluate your problem solving abilities.

For this challenge, please use the following base tools:

- Laravel 6.x latest
- Any Javascript library/framework you want, if you want.
- DarkSky API 
- Kittyhawk's Airspace API

## User Stories

1) As a user, I should be able to create and edit a flight from a website. If I enter in incorrect data, I should be notified. For example, the latitude must be a number between -90 and 90 and the longitude between -180 and 180. Or for example, there is no year -2000.
2) As a user, I should be able to view a flight on a website. That should include a map, time, latitude, longitude, temperature, and a simple weather string ie, "Sunny" or "Partly Cloudy" (Available from the DarkSky API). 
3) After a flight log has been created, my flight should asynchronously fetch the weather and airspace for the flight.
4) After logging a flight, I should know (A simple Boolean in your flight table called `warning` will do) if my flight happened inside of a TFR (Temporary Flight Restriction AKA NO FLY ZONE), according to Kittyhawk Airspace. 
5) If I change the location or time/date of a flight, the system should automatically update the weather and airspace for that new location.
6) As a user, I should be able to call an API endpoint that lists, in JSON, all of the flights with their weather and airspace advisories. Don't worry about filtering flights by user. Assume you're the only user on the platform for this.
7) As a user I should be able to list a single flight via API in JSON with it's weather and airspace advisories.
8) As a user, I should be able to create a flight using JSON from an API endpoint that will return errors with my input if it's wrong.

## Flight Table

    Schema::create('flights', function (Blueprint $table) {  
	  $table->increments('id');  
	  $table->datetime('flight_time');  //Time of flight. You'll have LAT/LONG so you can adjust into UTC if you wish 
	  $table->decimal('lat', 10, 8)->nullable();  
	  $table->decimal('long', 11, 8)->nullable();  
	  $table->integer('duration_in_seconds');   
	  $table->text('notes');  
	  $table->timestamps();  
	  $table->softDeletes();  
	});

Use your best judgement for adding weather and airspace. (Separate table, other columns, whatever you want)

## DarkSky Weather API
[https://darksky.net/dev](https://darksky.net/dev)

## Mapping API
We like http://Mapbox.com but you're free to use anything you'd like. 

## About Kittyhawk Airspace API
Submit a GeoJSON point and receive a full JSON listing of advisories that affect this. 

**Endpoint:** `POST`  https://app.kittyhawk.io/api/atlas/advisories

Request URL: https://app.kittyhawk.io/api/account/154427/atlas/advisories

Sample Body For Endpoint:

    {
    "geometry": {
        "format": "geojson",
        "data": "{\"type\":\"Point\",\"coordinates\":[-73.97786381,40.759211117]}"
    }
	} 

The API returns a list of advisories along with a color. Red is restricted. Blue is controlled. And Green is "Good to go!"

## Notes for convenience
- Laravel Docs!! https://laravel.com/docs/6.x
- Feel free to make your Laravel Queue driver Sync. Just throw a dump() into your job so we can see clearly that it's exeuting the job.
- You're INSIDE of a TFR if the distance to it is 0. 
- Use any packages you want to use from Composer. ie [https://laravelcollective.com/docs/6.0/html](https://laravelcollective.com/docs/6.0/html)
- Use as many models as you'd like
- No auth/etc is required. Just assume you're working in a larger project that handles all that for you.
- Bootstrap? Tailwind? Other CSS? Go nuts. 

## Oh Sh!T, WTFBBQ This isnt working like I thought.
If you have problems, please feel free to reach out to Josh. 


