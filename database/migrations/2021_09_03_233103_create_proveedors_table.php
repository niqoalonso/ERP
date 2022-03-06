<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProveedorsTable extends Migration
{

    public function up()
    {
        Schema::create('proveedors', function (Blueprint $table) {
            $table->id('id_proveedor');
            $table->string('rut');
            $table->string('razon_social');
            $table->string('direccion');
            $table->integer('celular');
            $table->string('email');
            $table->unsignedBigInteger('giro_id'); 
            $table->foreign('giro_id')->references('id_giro')->on('giros'); 
            $table->timestamps();
        });

        DB::table('proveedors')->insert(['rut' => '76.123.123-3', 'razon_social' => 'Ferreteria Sodimac Ltda', 'direccion' => 'Calle San Martin 123, Santiago', 'celular' => '945453456', 'email' => 'contacto@sodimac.cl', 'giro_id' => 1]);
        DB::table('proveedors')->insert(['rut' => '96.123.123-5', 'razon_social' => 'Falabella Ltda', 'direccion' => 'Calle Ohhigins 5, 456, Santiago', 'celular' => '945673456', 'email' => 'contacto@falabella.cl', 'giro_id' => 1]);
    }

    public function down()
    {
        Schema::dropIfExists('proveedors');
    }
}
