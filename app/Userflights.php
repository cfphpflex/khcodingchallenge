<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Userflights extends Model
{
    protected $table = 'userflights';
    protected $guarded = array();

    public function getData()
        {
            return static::orderBy('id','DESC')->get();
        }

    public function storeData($id,$UserflightData)
        { //  DEBUG      var_dump($data);  die();
            return static::find($id)->create($UserflightData);
           // return static::create($UserflightData);
        }

    public function findData($data)
        {
            $this->id = $data[1]['id'];
            return static::find($this->id);
        }

    public function updateData($id,$UserflightData)
        { //  var_dump($data);  die();
            return static::find($id)->update($UserflightData);
        }

    public function deleteData($id)
        { //  var_dump($id); die();
            return static::find($id)->delete( );

        }
}
