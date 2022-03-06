<?php

namespace App\Http\Controllers;

use App\Models\Existencia;
use Illuminate\Http\Request;
use App\Models\InfoDocumento;
use App\Models\TarjetaProducto;
use App\Models\DetalleDocumento;


class ExistenciaController extends Controller
{   

    //MODULO EXISTENCIA -> TARJETAS
    public function getInicial($empresa)
    {
        $tarjetas = TarjetaProducto::where('empresa_id', $empresa)->get();
        return $tarjetas;
    }

    public function getTarjetasProducto($sku)
    {

        $existencias = TarjetaProducto::where('sku', $sku)->first();
        $datos = $existencias->load('Existencia');

        return $datos;

    }

    public function checkNameTarjeta($name, $empresa)
    {   
        if(TarjetaProducto::where('empresa_id', $empresa)->where('nombre', $name)->first())
        {
            return response()->json(1);
        }else{
            return response()->json(2);
        }

    }

    public function GenerarCodigo(){
        do {            
            $number = rand(0,99999);
            $codigo = TarjetaProducto::select('sku')->where('sku', $number)->first();
        } while (!empty($codigo->sku));

        return $number;
    }

    public function getDetalleExistencia($documento, $empresa)
    {   
        $existencia = TarjetaProducto::where('empresa_id', $empresa)->get();
        $doc = InfoDocumento::where('n_interno', $documento)->first();
        $doc->load('detalleDocumento.Producto', 'DocumentoTributario');
        
        $detalles = [];
        foreach($doc->DetalleDocumento as $value)
        {   
            $tarjeta = TarjetaProducto::where('producto_id', $value->producto_id)->where('empresa_id', $empresa)->first();
            
            $data = array();

            if($tarjeta)
            {   
                $data = array('id_detalle' => $value->id_detalle, 'nombre' => $value->Producto->nombre, 'cantidad' => $value->cantidad, 'precio' => $value->precio, 'total' => $value->total, 'tarjeta' => 1, 'producto_id' => $value->producto_id);
                array_push($detalles, $data);
            }else{
                $data = array('id_detalle' => $value->id_detalle,'nombre' => $value->Producto->nombre, 'cantidad' => $value->cantidad, 'precio' => $value->precio, 'total' => $value->total, 'tarjeta' => 2, 'producto_id' => $value->producto_id);
                array_push($detalles, $data);
            }

        }

        return ['existencias' => $existencia, 'info' => $doc, 'detalles' => $detalles];
    }

    public function emitirDocumentoWithExistencia(Request $request)
    {   
       
        $info = InfoDocumento::find($request->documento);

        foreach($info->DetalleDocumento as $key => $value)
        {   
  
            $tarjeta = TarjetaProducto::where('producto_id', $value->producto_id)->where('empresa_id', $request->empresa)->first();
            
            if($tarjeta)
            {   
                
                Existencia::create(['fecha' => $info->fecha_emision,  'info_id' => $info->id_info,    'encabezado_id' => $info->Encabezado->id_encabezado, 
                                                'tarjeta_id' => $tarjeta->id_tarjeta,                   'tipo_operacion' => 1,          'precio' => $value->precio, 
                                                'cant_entrada' => $value->cantidad,                   'cant_salida' => 0,             'total_cant' => Existencia::where('tarjeta_id', $tarjeta->id_tarjeta)->where('stock_estado', 1)->sum('control_stock')+$value->cantidad, 
                                                'total_entrada' => $value->precio*$value->cantidad, 'total_salida' => 0,            'total_precio' => intval(Existencia::where('tarjeta_id', $tarjeta->id_tarjeta)->pluck('total_precio')->last())+intval($value->precio*$value->cantidad), 
                                                'control_stock' => $value->cantidad,                  'stock_estado' => 1]);
            }else{

                $tarjeta =  TarjetaProducto::create(['sku' => $this->GenerarCodigo(), 'nombre' =>  $request->nombreTarjeta[$value->id_detalle], 'empresa_id' => $request->empresa, 'producto_id' => $value->producto_id]);
                            Existencia::create(['fecha' => $info->fecha_emision,                        'info_id' => $info->id_info,    'encabezado_id' => $info->Encabezado->id_encabezado, 
                                                'tarjeta_id' => $tarjeta->id_tarjeta,                   'tipo_operacion' => 1,          'precio' => $value->precio, 
                                                'cant_entrada' => $value->cantidad,                   'cant_salida' => 0,               'total_cant' => $value->cantidad, 
                                                'total_entrada' => $value->precio*$value->cantidad, 'total_salida' => 0,                'total_precio' => $value->precio*$value->cantidad, 
                                                'control_stock' => $value->cantidad,                  'stock_estado' => 1]);
 
            }

        }

        InfoDocumento::updateOrCreate(['id_info' => $request->documento],['estado_id' => 14]);

        return "Existencia y Documento emitido.";
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Existencia $existencia)
    {
        //
    }

    public function edit(Existencia $existencia)
    {
        //
    }

    public function update(Request $request, Existencia $existencia)
    {
        //
    }

    public function destroy(Existencia $existencia)
    {
        //
    }
}
