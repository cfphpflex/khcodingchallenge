<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use DataTables;
use App\Userflights;
use PDOException;
use Yajra\DataTables\Services\DataTable;


class DisplayUserflightsDataController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->Userflights = new Userflights;

        $this->title = 'Userflights';
        $this->path = 'Userflights';
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

                //            $data = $this->validate($request, [
                //                'serialnumber' => 'required',
                //                'latitude' => 'required',
                //                'longitude' => 'required',
                //                'fligthpath' => 'required',
                //                'height' => 'required',
                //                'temperature' => 'required',
                //                'weather' => 'required',
                //                'status' => 'required',
                //                'updated_at' => 'required',
                //            ]);
                //
                //            if ($data->fails()) {
                //                return response()->json(['errors' => $data->errors()->all()]);
                //            }


            $action = isset($_GET['action'])?$_GET['action']:'none'; //   var_dump( $action);   die();
            $data = isset($_GET['data'])?$_GET['data']:'none';  //   var_dump( $data); die();

            if(isset($data) && is_array($data) && count($data) > 0){
                foreach($data as $row) {
                    $this->id=$row['id'];
                    break;
                }
            }else{$this->id=0;}





            if($action=="remove" && $this->id > 0):
                    //   var_dump($data);  die();
                $this->remove($this->id);

            elseif($action=="edit" && $this->id > 0):
                //  var_dump($data);  die();
                $this->edit($this->id,$data);

            elseif($action=="create" && ($this->id == 0 || $this->id == "")):
                //                var_dump($data);  die();
                $this->store(0,$data);

            endif;

            return Datatables::of($this->Userflights->getdata())->make(true); // get all data


        } catch (PDOException $e) {
            return json_encode("Something went wrong, please contact admin");
            die();
        }


    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('displaydata');
    }




    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($id,$data)
    {

        $userflightDataUpdate= [];
        $userflightDataUpdate["serialnumber"] = ($data[$id]['serialnumber'])?$data[$id]['serialnumber']:000;
        $userflightDataUpdate["latitude"]     =  ($data[$id]['serialnumber'])?$data[$id]['latitude']:000;
        $userflightDataUpdate["longitude"]    = $data[$id]['longitude'];
        $userflightDataUpdate["height"]       = $data[$id]['height'];
        $userflightDataUpdate["temperature"]  = $data[$id]['temperature'];
        $userflightDataUpdate["weather"]      = $data[$id]['weather'];
        $userflightDataUpdate["status"]       = $data[$id]['status'];


        $this->Userflights::create($userflightDataUpdate);


        return redirect('/userflightcreate')->with('success', 'Flight Create3d Successfully.');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $Userflight = Userflights::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id,$data)
    {

            //        $validator = Validator::make($_GET, [
            //            "serialnumber.*" => 'required|distinct|min:7|max:14',
            //            "latitude.*"    => 'required|integer|min:1',
            //            "longitude.*"   => "required|string"
            //        ]);
            //
            //        if ($validator->fails()) {
            //            return response()->json(['errors' => $validator->errors()->all()]);
            //        }


        $UserflightData = Userflights::find($id);

        $UserflightDataUpdate= [];
        $UserflightDataUpdate["serialnumber"] = $data[$id]['serialnumber'];
        $UserflightDataUpdate["latitude"]     = $data[$id]['latitude'];
        $UserflightData["longitude"]    = $data[$id]['longitude'];
        //$UserflightDataUpdate["fligthpath"]   = $data[$id]['fligthpath'];
        $UserflightDataUpdate["height"]       = $data[$id]['height'];
        $UserflightDataUpdate["temperature"]  = $data[$id]['temperature'];
        $UserflightDataUpdate["weather"]      = $data[$id]['weather'];
        $UserflightDataUpdate["status"]       = $data[$id]['status'];
        $UserflightDataUpdate["updated_at"]   = $data[$id]['updated_at'];

       $this->Userflights::find($id)->update($UserflightDataUpdate);


        return redirect('/userflightcreate')->with('success', 'Flight updated Successfully.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'serialnumber'      =>'required',
            'latitude'          => 'required|float',
            'longitude'         => 'required|float',
            'fligthpath'        => 'required|string',
            'height'            => 'required|integer',
            'temperature'       => 'required|integer',
            'weather'           => 'required|string',
            'status'             => 'required|string',
            'updated_at'        => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()]);
        }

        $this->userflights->updateData($id, $request->all());

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function remove($id)
    {
        if($id){
            $this->Userflights::find($id)->deleteData($id);

            return redirect('/userflightcreate')->with('success', 'Flight deleted Successfully.');
        }

    }

    /**
     * get KittyHawk advisories.
     * @param  lat
     *  @param  lon
     * @return \Illuminate\Http\Response
     */
    public function getAtlasadvisories()
    {

        //        var_dump($_GET);
        //        die();

        $lat= $_GET['lat'];
        $lon= $_GET['lon'];

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://app.kittyhawk.io/api/atlas/advisories",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "{\n    \"geometry\": {\n        \"format\": \"geojson\",\n        \"data\": \"{\\\"type\\\":\\\"Point\\\",\\\"coordinates\\\":[$lat,$lon]}\"\n    }\n}",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "charset: utf-8"
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        header('Content-Type: application/json');
        if($response) {
            http_response_code(200);
            echo json_encode($response);
        }else{
            http_response_code(400);
            echo json_encode($response);
        }

    }

    /**
     * get DarkSky weather.
     *
     *  @param  lat
     *  @param  lon
     * @return \Illuminate\Http\Response
     */
    public function getDarkSkyWeather()
    {

       // var_dump($_GET);  die();

        $lat= $_GET['lat'];
        $lon= $_GET['lon'];
        $curl = curl_init();
        $queryStringLatLon= $lat . ",". $lon;

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.darksky.net/forecast/567c7165830ffbdff9646e0c573eb94f/". $queryStringLatLon,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        header('Content-Type: application/json');
        if($response) {
            http_response_code(200);
            echo json_encode($response);
        }else{
            http_response_code(400);
            echo json_encode($response);
        }

    }

}
