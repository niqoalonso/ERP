<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentoAntecesorsTable extends Migration
{

    public function up()
    {
        Schema::create('documento_antecesors', function (Blueprint $table) {
            $table->id('id_antecesor');
            $table->unsignedBigInteger('docantecesor_id')->nullable(); 
            $table->foreign('docantecesor_id')->references('id_documento')->on('documento_tributarios');
            $table->unsignedBigInteger('docactual_id')->nullable(); 
            $table->foreign('docactual_id')->references('id_documento')->on('documento_tributarios');
            $table->timestamps();
        });

        DB::table('documento_antecesors')->insert(['docantecesor_id' => 1, 'docactual_id' => 2]);
        DB::table('documento_antecesors')->insert(['docantecesor_id' => 2, 'docactual_id' => 3]);
        DB::table('documento_antecesors')->insert(['docantecesor_id' => 3, 'docactual_id' => 4]);
        DB::table('documento_antecesors')->insert(['docantecesor_id' => 3, 'docactual_id' => 5]);
    }

    public function down()
    {
        Schema::dropIfExists('documento_antecesors');
    }
}
