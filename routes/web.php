<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('usercreate',           'DisplayDataController@create');
Route::get('getuser',              'DisplayDataController@index');

Route::get('userflightcreate',      'DisplayUserflightsDataController@create');
Route::get('getuserflights',        'DisplayUserflightsDataController@index');
Route::get('getAtlasadvisories',    'DisplayUserflightsDataController@getAtlasadvisories');
Route::get('getDarkSkyWeather',     'DisplayUserflightsDataController@getDarkSkyWeather');