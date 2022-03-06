<?php

namespace App\Http\Controllers;
use App\Models\Comprobante;
use App\Models\DetalleComprobante;
use App\Models\PlanCuenta;
use App\Models\CentroCosto;
use Illuminate\Http\Request;

class DetalleComprobanteController extends Controller
{

    public function getInicial($id,$empresa)
    {   
        $info = Comprobante::where('codigo', $id)->first();
        $info->load('TipoComprobante', 'UnidadNegocio');
        $cuentas = PlanCuenta::where('empresa_id', $empresa)->get();
        $cuentas->load('ManualCuenta', 'MiManualCuenta');
        $centros = CentroCosto::all();

        return ['info' => $info, 'cuentas' => $cuentas, 'centros' => $centros];
    }

    public function getDetalle($id) 
    {
        $comprobante = Comprobante::where('codigo', $id)->first();

        $datos = DetalleComprobante::where('comprobante_id', $comprobante->id_comprobante)->get();
        $datos->load('PlanCuenta','PlanCuenta.ManualCuenta','PlanCuenta.MiManualCuenta' , 'CentroCosto', 'Comprobante');

        return $datos;
    }

    public function store(Request $request)
    {   
        $comprobante = Comprobante::where('codigo', $request->idComprobante)->first();
        $deber = $comprobante->deber+$request->deber;
        $haber = $comprobante->haber+$request->haber;

        $comprobante->update(['deber' => $deber, 'haber' => $haber]);

        DetalleComprobante::create([
                       'n_detalle'          => 1,
                       'unidadnegocio_id'   => 1,
                        'comprobante_id'    => $comprobante->id_comprobante,
                        'plancuenta_id'     =>  $request->cuenta['id_plan_cuenta'],
                        'centrocosto_id'    => $request->centro['id_centrocosto'],
                        'glosa'             => $request->glosa,
                        'debe'              => $request->deber,
                        'haber'             =>  $request->haber,
        ]);

        return  $this->successResponse('Detalle Comprobante añadida exitosamente', false);
    }


    public function show(DetalleComprobante $detalleComprobante)
    {
        //
    }

    public function edit(DetalleComprobante $detalleComprobante)
    {
        //
    }

    public function update(Request $request, DetalleComprobante $detalleComprobante)
    {
        //
    }

    public function deleteDetalle($id)
    {   
        DetalleComprobante::destroy($id);
        return "Detalle eliminado exsitosamente.";
    }
}
