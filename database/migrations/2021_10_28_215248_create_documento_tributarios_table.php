<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentoTributariosTable extends Migration
{

    public function up()
    {
        Schema::create('documento_tributarios', function (Blueprint $table) {
            $table->id('id_documento');
            $table->string('tipo');
            $table->string('descripcion');
            $table->integer('cod_sii');
            $table->boolean('debe_haber');
            $table->boolean('f_vencimiento');
            $table->boolean('requiere_antecesor'); //Depende de alguna documento aterior
            $table->boolean('requiere_sucesor'); //Documentos que puedo generar a partir de este.
            $table->unsignedBigInteger('tipocomprobante_id')->nullable();
            $table->foreign('tipocomprobante_id')->references('id_tipocomprobante')->on('tipo_comprobantes');
            $table->boolean('ciclo');
            $table->boolean('libro');
            $table->boolean('pago');
            $table->boolean('mueve_existencia');
            $table->boolean('iva_honorario');
            $table->boolean('incrementa_disminuye');
            $table->boolean('anulacion');
            $table->boolean('doc_anulacion');
            $table->unsignedBigInteger('documento_id')->nullable();
            $table->foreign('documento_id')->references('id_documento')->on('documento_tributarios');
            $table->timestamps();
        });

        //NO SE PUEDE CAMBIAR EL ORDEN DE ESTOS INSERT, YA QUE POR LA ID SE ESTAN BUSCANDO LOS DOCUMENTOS
        // 1 = SI
        // 2 = NO

        DB::table('documento_tributarios')->insert(['tipo' => 'ODCA', 'descripcion' => 'ORDEN DE COMPRA AFECTA', 'cod_sii' => 1, 
                                                    'debe_haber' => 2, 'f_vencimiento' => 2, 'requiere_antecesor' => 2, 'requiere_sucesor' => 1, 
                                                    'tipocomprobante_id' => 4, 'ciclo' => 1, 'libro' => 4, 'pago' => 2, 'mueve_existencia' => 2,
                                                    'iva_honorario' => 1, 'incrementa_disminuye' => 3, 'anulacion' => 2, 'doc_anulacion' => 2, 'documento_id' => null]);
        
        DB::table('documento_tributarios')->insert(['tipo' => 'GRCA', 'descripcion' => 'GUIA RECEPCION DE COMPRA AFECTA', 'cod_sii' => 2, 
                                                    'debe_haber' => 2, 'f_vencimiento' => 2, 'requiere_antecesor' => 1, 'requiere_sucesor' => 1, 
                                                    'tipocomprobante_id' => 4, 'ciclo' => 1, 'libro' => 4, 'pago' => 2, 'mueve_existencia' => 1,
                                                    'iva_honorario' => 1, 'incrementa_disminuye' => 3, 'anulacion' => 2, 'doc_anulacion' => 2, 'documento_id' => null]);
        
        DB::table('documento_tributarios')->insert(['tipo' => 'FDCA', 'descripcion' => 'FACTURA AFECTA DE COMPRA', 'cod_sii' => 45, 
                                                    'debe_haber' => 2, 'f_vencimiento' => 1, 'requiere_antecesor' => 1, 'requiere_sucesor' => 1, 
                                                    'tipocomprobante_id' => 4, 'ciclo' => 1, 'libro'=> 1, 'pago' => 1, 'mueve_existencia' => 2,
                                                    'iva_honorario' => 1, 'incrementa_disminuye' => 3, 'anulacion' => 2, 'doc_anulacion' => 1, 'documento_id' => 3]);

        DB::table('documento_tributarios')->insert(['tipo' => 'NDCCA', 'descripcion' => 'NOTA DE CREDITO COMPRA AFECTA', 'cod_sii' => 61, 
                                                    'debe_haber' => 1, 'f_vencimiento' => 2, 'requiere_antecesor' => 1, 'requiere_sucesor' => 1, 
                                                    'tipocomprobante_id' => 4, 'ciclo' => 1, 'libro' => 4, 'pago' => 2, 'mueve_existencia' => 1,
                                                    'iva_honorario' => 1, 'incrementa_disminuye' => 3, 'anulacion' => 1, 'doc_anulacion' => 2, 'documento_id' => null]);
                                                    
        DB::table('documento_tributarios')->insert(['tipo' => 'NDDCA', 'descripcion' => 'NOTA DE DEBITO COMPRA AFECTA', 'cod_sii' => 56, 
                                                    'debe_haber' => 2, 'f_vencimiento' => 2, 'requiere_antecesor' => 1, 'requiere_sucesor' => 2, 
                                                    'tipocomprobante_id' => 4, 'ciclo' => 1, 'libro' => 4, 'pago' => 2, 'mueve_existencia' => 2,
                                                    'iva_honorario' => 1, 'incrementa_disminuye' => 3, 'anulacion' => 2, 'doc_anulacion' => 2, 'documento_id' => null]);
        

    }

    public function down()
    {
        Schema::dropIfExists('documento_tributarios');
    }
}
