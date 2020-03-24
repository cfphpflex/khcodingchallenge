<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserflightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('userflights', function (Blueprint $table) {
            $table->increments('id');
            //$table->integer('userID', 10,null);
            $table->string('serialnumber', 25)->nullable();
            $table->double('latitude', 25)->nullable();
            $table->double('longitude', 25)->nullable();
            $table->text('flightpath', 100000)->nullable();
            $table->string('height', 10)->nullable();
            $table->string('temperature', 5)->nullable();
            $table->string('weather', 25)->nullable();
            $table->string('warning', 10)->nullable();
            $table->string('status', 10)->nullable();
            $table->text('description', 1000)->nullable();
            $table->nullableTimestamps();

            $table->unique( array('id') );

            // $table->foreign('userID')->references('id')->on('user');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Userflights');
    }
}
