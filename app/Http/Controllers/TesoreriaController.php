<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InfoDocumento;
use App\Models\EncabezadoDocumento;
use App\Models\DetalleDocumento;
use App\Models\DocumentoTributario;
use App\Models\PlanCuenta;
use App\Models\TarjetaExistencia;
use App\Models\Operacion;
use App\Models\Existencia;
use App\Models\Comprobante;
use App\Models\DetalleComprobante;


class TesoreriaController extends Controller
{   

    public function getInicialCompras($empresa) 
    {   
        //TRAEMOS EL PLAN DE CUENTA DE LA EMPRESA.
        $cuentas = PlanCuenta::where('empresa_id', $empresa)->get();
        $cuentas->load('ManualCuenta', 'MiManualCuenta');

        //TRAEMOS LOS DOCUMENTOS TRIBUTARIOS QUE AL EMITIRLOS TIENE CONDICIONES DE REQUIREN PAGO
        $documentos = DocumentoTributario::where('ciclo', 1)->where('pago',  1)->get();
        $dato = array();
        foreach ($documentos as $key => $value) {
            array_push($dato, $value->id_documento);
        }

        $doc = InfoDocumento::whereIn('documento_id', $dato)->where('empresa_id', $empresa)->where('estado_id', 14)->get();
        $doc->load('Encabezado.Proveedor.Producto', 'Encabezado.UnidadNegocio', 'DocumentoTributario.RelacionAntecesor', 'detalleDocumento.Producto', 'detalleDocumento.CentroCosto');

        return ['doc' => $doc, 'cuentas' => $cuentas];
    }

    public function verificarTieneNotaCredito($encabezado)
    {   
        $credito = 0;
        $debito = 0;
        $encabezado = EncabezadoDocumento::select('id_encabezado')->where('num_encabezado', $encabezado)->first();

        if(count(InfoDocumento::where('encabezado_id', $encabezado->id_encabezado)->where('documento_id', 4)->where('estado_id', 14)->get()) > 0)
        {   
            $data = InfoDocumento::where('encabezado_id', $encabezado->id_encabezado)->where('documento_id', 4)->where('estado_id', 14)->first();
            $credito = $data->total_documento;
        }

        if(count(InfoDocumento::where('encabezado_id', $encabezado->id_encabezado)->where('documento_id', 5)->where('estado_id', 14)->get()) > 0){
            $data = InfoDocumento::where('encabezado_id', $encabezado->id_encabezado)->where('documento_id', 5)->where('estado_id', 14)->first();
            $debito = $data->total_documento;
            
        }

        if($debito > 0 || $credito > 0){
            return ['estado' => 1, 'credito' => $credito, 'debito' => $debito];
        }else{
            return ['estado' => 0];
        }
    }

    public function aprobarPago(Request $request)
    {   

        $data = EncabezadoDocumento::where('num_encabezado', $request->n_encabezado)->first();
        
        $factura = InfoDocumento::where('encabezado_id', $data->id_encabezado)->where('documento_id', 3)->first(); //BUSCA FACTURA

        if($factura->fecha_emision > $request->f_emision)
        {   
            
            return ['estado' => 1];
        }

        if($request->origen == "" || $request->destino == "")
        {
            return ['estado' => 2];
        }

        if($request->existe_ncredito == 1){
            $comprobante = Comprobante::create([
                'codigo'            => $this->GenerarCodigo(),
                'glosa'             => 'Pago de Factura de Compra '.$request->n_encabezado,
                'fecha_comprobante' => $request->f_emision,
                'empresa_id'        => $request->empresa,
                'unidadnegocio_id'  => 1,
                'tipocomprobante_id' => 2,
                'estado_id'         => 13,
                'haber'             => $request->monto_pagar ,
                'deber'             => $request->monto_pagar
            ]);

            DetalleComprobante::create([
                'comprobante_id'    => $comprobante->id_comprobante,
                'n_detalle'         => 1,
                'plancuenta_id'     =>  $request->origen['id_plan_cuenta'],
                'centrocosto_id'    => 2,
                'unidadnegocio_id'  => 1,
                'glosa'             => "Pago Origen",
                'debe'              => 0,
                'haber'             => $request->monto_pagar,
            ]);

            DetalleComprobante::create([
                'comprobante_id'    => $comprobante->id_comprobante,
                'n_detalle'         => 2,
                'plancuenta_id'     => $request->destino['id_plan_cuenta'],
                'centrocosto_id'    => 2,
                'unidadnegocio_id'  => 1,
                'glosa'             => "Pago Proveedores",
                'debe'              => $request->monto_pagar,
                'haber'             => 0,
            ]);
            
        }else{  

            $comprobante = Comprobante::create([
                'codigo'            => $this->GenerarCodigo(),
                'glosa'             => 'Pago de Factura de Compra '.$request->n_encabezado,
                'fecha_comprobante' => $request->f_emision,
                'empresa_id'        => $request->empresa,
                'unidadnegocio_id'  => 1,
                'tipocomprobante_id' => 2,
                'estado_id'         => 3,
                'haber'             => $factura->total_documento ,
                'deber'             => $factura->total_documento
        ]);

        DetalleComprobante::create([
            'comprobante_id'    => $comprobante->id_comprobante,
            'n_detalle'         => 1,
            'plancuenta_id'     =>  $request->origen['id_plan_cuenta'],
            'centrocosto_id'    => 2,
            'unidadnegocio_id'  => 1,
            'glosa'             => "Pago Origen",
            'debe'              => 0,
            'haber'             => $factura->total_documento,
        ]);

        DetalleComprobante::create([
            'comprobante_id'    => $comprobante->id_comprobante,
            'n_detalle'         => 2,
            'plancuenta_id'     => $request->destino['id_plan_cuenta'],
            'centrocosto_id'    => 2,
            'unidadnegocio_id'  => 1,
            'glosa'             => "Pago Proveedores",
            'debe'              => $factura->total_documento,
            'haber'             => 0,
        ]);
        }
        

        $factura->update(['estado_id' => 16]);

        return "Factura pagada exitosamente.";
    }

    public function GenerarCodigo(){
        do {
            $number = rand(0,99999);
            $codigo = Comprobante::select('codigo')->where('codigo', $number)->first();
        } while (!empty($codigo->codigo));

        return $number;
    }
    
}
