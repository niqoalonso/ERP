<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentoSucesorTable extends Migration
{

    public function up()
    {
        Schema::create('documento_sucesor', function (Blueprint $table) {
            $table->id('id_sucesor');
            $table->unsignedBigInteger('docsucesor_id')->nullable(); 
            $table->foreign('docsucesor_id')->references('id_documento')->on('documento_tributarios');
            $table->unsignedBigInteger('docactual_id')->nullable(); 
            $table->foreign('docactual_id')->references('id_documento')->on('documento_tributarios');
            $table->timestamps();
        });

        DB::table('documento_sucesor')->insert(['docsucesor_id' => 2, 'docactual_id' => 1]);
        DB::table('documento_sucesor')->insert(['docsucesor_id' => 5, 'docactual_id' => 2]);
        DB::table('documento_sucesor')->insert(['docsucesor_id' => 3, 'docactual_id' => 5]);
        DB::table('documento_sucesor')->insert(['docsucesor_id' => 3, 'docactual_id' => 2]);
    }

    public function down()
    {
        Schema::dropIfExists('documento_sucesor');
    }
}

//estamos probando todo desde el principio y no funciona algunas cosas, eso hay que verlo como la talba de detalles de fatuas.