<?php

use Illuminate\Database\Seeder;

class UserflightsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Userflights::class, 90)->create();
    }
}
