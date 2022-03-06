<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proveedor;
use App\Models\UnidadNegocio;
use App\Models\DocumentoTributario;
use App\Models\EncabezadoDocumento;
use App\Models\InfoDocumento;
use App\Models\CentroCosto;
use App\Models\DetalleDocumento;
use App\Models\DocumentoRelacionado;
use App\Models\TarjetaProducto;
use App\Models\Existencia;
use App\Models\PlanCuenta;
use App\Models\Comprobante;
use App\Models\DetalleComprobante;
use PDF;

class CompraController extends Controller
{

    public function getInicial($tipo, $empresa)
    {   
        $proveedores = Proveedor::all();
        $unidades = UnidadNegocio::where('empresa_id', $empresa)->get();
        $documento = DocumentoTributario::where('tipo', $tipo)->first();
        return ['proveedores'  => $proveedores, 'unidades' => $unidades, "documento" => $documento];
    }

    public function verificarDocumentoFormulario($tipo,$empresa)
    {   
        $doc = DocumentoTributario::where('tipo', $tipo)->first();
        
        if($doc->requiere_antecesor == 1)
        {   
            if(count($doc->RelacionAntecesor) != 0){
                $datos =  InfoDocumento::whereIn('documento_id', array_column($doc->RelacionAntecesor->toArray(), 'id_documento'))->where('empresa_id', $empresa)->whereIn('estado_id', [14,16])->get();
                $datos->load('Encabezado.Proveedor','DocumentoTributario');
                return ['estado' => 1, 'datos' => $datos, 'documento' => $doc];
            }else{
                return ['estado' => 3, 'documento' => $doc];
            }

        }else if($doc->requiere_antecesor == 2){
            $doc->load('RelacionSucesor');
            return ['estado' => 2, 'documento' => $doc];    
        }
    }

    public function VerificarDocumentoRelacionadoExistente($idDocumento, $TipoDocumento)
    {   
        //Obtenemos el info de documento y su encabezado
        $documento = InfoDocumento::find($idDocumento); 
        $documento->load('Encabezado');
        
        //Buscamos el documento tributario
        $tipo = DocumentoTributario::where('tipo', $TipoDocumento)->first();

        //Contamos la si hay documentos tributario ya emitido sobre una compra.
        $existeCreado = count(InfoDocumento::where('documento_id', $tipo->id_documento)->where('encabezado_id', $documento->encabezado->id_encabezado)->get());

        //Buscamos los info de documentos y verificamos que todo esten aprobados.
        $verificarDocAprovados = InfoDocumento::where('encabezado_id', $documento->encabezado_id)->whereNotIn('estado_id', [14,16])->get();

        if(count($verificarDocAprovados) == 0){
            return ['estado' => 0, 'existe' => $existeCreado, 'nombreDocumento' => $tipo->descripcion];
        }else{
            return ['estado' => 1];
        }
        
    }

    public function getCodigoDocumento($documento, $empresa)
    {   
        $doc = DocumentoTributario::select('id_documento')->where('tipo', $documento)->first();
        $num = InfoDocumento::select('n_documento')->where('documento_id', $doc->id_documento)->where('empresa_id', $empresa)->latest()->first();
        if(!empty($num)){
            return $num->n_documento+1;
        }else{
            return 1;
        }
        
    }

    public function getInicialDetalle($ninterno)
    {   
        $documento     = InfoDocumento::where('n_interno', $ninterno)->first();
            if($documento->estado_id == 14){
                return ['estado' => 1]; //SI EL DOCUMENTO ESTA EMITIDO NO PUEDE EDITARSE, SEGURIDAD DE URL
            }
        $documento->load('Encabezado.Proveedor.Producto', 'Encabezado.UnidadNegocio', 'DocumentoTributario.RelacionAntecesor', 'detalleDocumento.Producto', 'detalleDocumento.CentroCosto');

        $encabezados = InfoDocumento::where('encabezado_id', $documento->encabezado_id)->where('n_interno', '!=', $ninterno)->get();
        $encabezados->load('Encabezado.Proveedor.Producto', 'Encabezado.UnidadNegocio', 'DocumentoTributario.RelacionAntecesor', 'detalleDocumento.Producto', 'detalleDocumento.CentroCosto');
        $centros       = CentroCosto::all();

        return ["estado" => 0 ,"documento" => $documento, 'centros' => $centros, 'encabezados' => $encabezados];
    }

    public function getDocumentoAprobar($empresa)
    {   
        $datos = InfoDocumento::where('empresa_id', $empresa)->where('estado_id', 12)->get();
        $datos->load('DocumentoTributario', 'Encabezado.UnidadNegocio', 'Encabezado.Proveedor');
        return $datos;
    }

    public function getDocumentoModificar($empresa)
    {
        $datos = InfoDocumento::where('empresa_id', $empresa)->whereIn('estado_id', [12,13])->get();
        $datos->load('DocumentoTributario', 'Encabezado.UnidadNegocio', 'Encabezado.Proveedor');
        return $datos;
    }

    public function aprobarDocumento($id)
    {   
        
        $doc = InfoDocumento::find($id);
        if(count($doc->detalleDocumento) > 0)
        {   
            $doc->update(['estado_id' => 13]);
            return ['estado' => 1, 'mensaje' => "Documento aprobado, ahora puede emitirlo."];
        }else{
            return ['estado' => 0, 'mensaje' => "Este documento no posee ningun detalle de producto, no puede ser emitido."];
        }

        return "Documento aprobado, ahora puedes emitirlo.";
    }

    public function getDocumentoEmitir($empresa)
    {
        $datos = InfoDocumento::where('empresa_id', $empresa)->where('estado_id', 13)->get();
        $datos->load('DocumentoTributario', 'Encabezado.UnidadNegocio', 'Encabezado.Proveedor'); 
        $cuentas = PlanCuenta::where('empresa_id', $empresa)->get();
        $cuentas->load('ManualCuenta', 'MiManualCuenta');
        return ['datos' => $datos, 'cuentas' => $cuentas];
    }

    public function MueveExistenciaComprobar($id)
    {   
        $contador = 0; //Se encargara de sumar la aprobación de los IF, si es 1 solo sera que mueve existencia si es dos es que mueve existencia y ademas es anulacion
        $info = InfoDocumento::where('n_interno', $id)->first();

        if($info->DocumentoTributario->mueve_existencia == 1)
        {
            $contador++;
        }
        if($info->DocumentoTributario->anulacion == 1)
        {
            $contador++;
        }
        
        return $contador;
    }

    public function emitirDocumento($id)
    {   
        $doc = InfoDocumento::where('n_interno', $id)->first();
        $data = InfoDocumento::where('encabezado_id', $doc->encabezado_id)->where('documento_id', 3)->first(); //FACTURA AFECTA
        
        if($doc->documento_id == 4){ //NOTA DE CREDITO AFECTA
            if($data->estado_id == 16)
            {
                return ['estado' => 1, 'n_encabezado' => $data->Encabezado->num_encabezado, 'proveedor' => $data->Encabezado->Proveedor->razon_social, 'idInfoDoc' => $doc->id_info, 'fechaDocumento' => $doc->fecha_emision];
            }else{
                $doc->update(['estado_id' => 14]);
            }
        }else if($doc->documento_id == 5){
            if($data->estado_id == 16)
            {
                return ['estado' => 2, 'n_encabezado' => $data->Encabezado->num_encabezado, 'proveedor' => $data->Encabezado->Proveedor->razon_social, 'idInfoDoc' => $doc->id_info, 'fechaDocumento' => $doc->fecha_emision];
            }else{
                $doc->update(['estado_id' => 14]);
            }
        }else{
            InfoDocumento::updateOrCreate(['n_interno' => $id],['estado_id' => 14]);
        }
        
        return ['estado' => 0, 'mensaje' => "Documento emitido exitosamente."];
        
    }

    public function GenerarCodigo(){
        do {
            $number = rand(0,99999);
            $codigo = Comprobante::select('codigo')->where('codigo', $number)->first();
        } while (!empty($codigo->codigo));

        return $number;
    }

    public function GenerarComprobanteCompra(Request $request)
    {
        if($request->origen == "" || $request->destino == "")
        {
            return ['estado' => 1];
        }

        $data = InfoDocumento::where('id_info', $request->idInfo)->first();

        $comprobante = Comprobante::create([
                'codigo'            => $this->GenerarCodigo(),
                'glosa'             => 'Nota de Credito Compra '.$request->n_encabezado,
                'fecha_comprobante' => $request->f_emision,
                'empresa_id'        => $request->empresa,
                'unidadnegocio_id'  => 1,
                'tipocomprobante_id' => 2,
                'estado_id'         => 13,
                'haber'             => $data->total_documento ,
                'deber'             => $data->total_documento
        ]);

        DetalleComprobante::create([
            'comprobante_id'    => $comprobante->id_comprobante,
            'n_detalle'         => 1,
            'plancuenta_id'     =>  $request->origen['id_plan_cuenta'],
            'centrocosto_id'    => 2,
            'unidadnegocio_id'  => 1,
            'glosa'             => "Pago Proveedor",
            'debe'              => $data->total_documento,
            'haber'             => 0,
        ]);

        DetalleComprobante::create([
            'comprobante_id'    => $comprobante->id_comprobante,
            'n_detalle'         => 2,
            'plancuenta_id'     => $request->destino['id_plan_cuenta'],
            'centrocosto_id'    => 2,
            'unidadnegocio_id'  => 1,
            'glosa'             => "Pago Detino Proveedor",
            'debe'              => 0,
            'haber'             => $data->total_documento,
        ]);

        $data->update(['estado_id' => 14]);

        return "Documento emitido exitosamente.";
    
    }

    public function GenerarComprobanteDebitoCompra(Request $request)
    {
        if($request->origen == "" || $request->destino == "")
        {
            return ['estado' => 1];
        }

        $data = InfoDocumento::where('id_info', $request->idInfo)->first();

        $comprobante = Comprobante::create([
                'codigo'            => $this->GenerarCodigo(),
                'glosa'             => 'Nota de Debito '.$request->n_encabezado,
                'fecha_comprobante' => $request->f_emision,
                'empresa_id'        => $request->empresa,
                'unidadnegocio_id'  => 1, 
                'tipocomprobante_id' => 2,
                'estado_id'         => 13,
                'haber'             => $data->total_documento ,
                'deber'             => $data->total_documento
        ]);

        DetalleComprobante::create([
            'comprobante_id'    => $comprobante->id_comprobante,
            'n_detalle'         => 1,
            'plancuenta_id'     =>  $request->origen['id_plan_cuenta'],
            'centrocosto_id'    => 2,
            'unidadnegocio_id'  => 1,
            'glosa'             => "Pago Proveedor",
            'debe'              => 0,
            'haber'             => $data->total_documento,
        ]);

        DetalleComprobante::create([
            'comprobante_id'    => $comprobante->id_comprobante,
            'n_detalle'         => 2,
            'plancuenta_id'     => $request->destino['id_plan_cuenta'],
            'centrocosto_id'    => 2,
            'unidadnegocio_id'  => 1,
            'glosa'             => "Pago Detino Proveedor",
            'debe'              => $data->total_documento,
            'haber'             => 0,
        ]);

        $data->update(['estado_id' => 14]);

        return "Documento emitido exitosamente.";
    
    }

    public function getDocumentosEmitidos($empresa)
    {   
        $datos = InfoDocumento::where('empresa_id', $empresa)->where('estado_id', 14)->get();
        $datos->load('DocumentoTributario', 'Encabezado.UnidadNegocio', 'Encabezado.Proveedor');
        return $datos;
    }

    public function generarInfoDocumentoRelacionado($documento, $tipoDocumento)
    {   
        $info = InfoDocumento::find($documento);
        $info->load('Encabezado.Proveedor', 'Encabezado.UnidadNegocio', 'DetalleDocumento.Producto', 'DocumentoTributario');
        $doc = DocumentoTributario::where('tipo', $tipoDocumento)->first();
        $cod = InfoDocumento::select('n_documento')->where('documento_id', $doc->id_documento)->where('empresa_id', $info->empresa_id)->latest()->first();
        

        if(!empty($cod)){ $codigo = $cod->n_documento+1;}else{ $codigo = 1;}

        if($doc->id_documento == 4){ //NOTA DE CREDITO
            return ['informacion' => $info, 'documentoT' => $doc, 'codigo' => $codigo, 'anulacion' => 1];
        }else if($doc->id_documento == 5){ //NOTA DE DEBITO
            return ['informacion' => $info, 'documentoT' => $doc, 'codigo' => $codigo, 'debito' => 1];
        }else{
            return ['informacion' => $info, 'documentoT' => $doc, 'codigo' => $codigo];
        }
        
    }

    public function GenerarCodigoInterno()
    {
        do {            
            $number = rand(1, 99999);
            $codigo = InfoDocumento::select('n_interno')->where('n_interno', $number)->first();
        } while (!empty($codigo->n_interno));

        return $number;
    } 

    public function generarDocumentoPosterior(Request $request)
    {   
        //Buscamos el tipo de documento tributario a emitir.
        $docTributario = DocumentoTributario::where('tipo', $request->tipoDocumento)->first();
        
        //Verificamos que el documento no haya sido emitido antes, ya que no puede haber dos factura o dos guias para una orden de compra.
        if(count(DocumentoRelacionado::where([['documentotributario_id', $docTributario->id_documento],['encabezado_id', $request->encabezado_id]])->get()) > 0){
            return ['estado' => 2, 'mensaje' =>  "Documento tributario ya ha sido emitido anteriormente."];
        }

        //Aqui solo se ocupara cuando anulación "Documento Nota de Credito" se este generando, de lo contrario pasa de largo
        $respuesta = 0;
        if($request->anulacion == 1)
        {   
            foreach ($request->detalles as $key => $value) {
               $respuesta =  $this->ValidateStockExistencia($request->empresa_id, $value['producto_id'], $request->encabezado_id, $value['cantidad']);
               if($respuesta == 1)
               {    
                 $respuesta = 0;
                 return ['estado' => 3,'mensaje' => "Producto ".$value['nombre']." no posee stock suficiente para esta operación."];
               }
            }
        }

        //BUSCAMOS ENTRE TODO LOS DOCUMENTOS DEL ENCABEZADO EL DOCUMENTO CON LA FECHA MAYOR PARA COMPRAR CON LA FECHA DEL DOCUMENTO A CREAR
        $ultimoDocFecha = InfoDocumento::where('encabezado_id', $request->encabezado_id)->max('fecha_emision');
    
        //COMPROBAMOS QUE LA FECHA DEL NUEVO DOCUMENTO SEA MAYOR QUE LA FECHA DE CUALQUIER OTRO DOCUMENTO CREADO.
        
        if($ultimoDocFecha > $request->informacion['fechadoc'])
        {
            return ['estado' => 0, 'mensaje' => 'Fecha de emisión no puede ser inferior al dia '.$ultimoDocFecha];

        }else{

            //CREAMOS EL NUEVO DOCUMENTO TRIBUTARIO
            $doc = DocumentoTributario::where('tipo', $request->tipoDocumento)->first();
            $cod = InfoDocumento::select('n_documento')->where('documento_id', $doc->id_documento)->where('empresa_id', $request->informacion['infoEmpresa']['id_empresa'])->latest()->first();
            if(!empty($cod)){ $codigo = $cod->n_documento+1;}else{ $codigo = 1;}

            $info = InfoDocumento::create(['n_documento' => $codigo, 'fecha_emision' => $request->informacion['fechadoc'], 'fecha_vencimiento' => $request->informacion['fechaven'], 'glosa' => $request->informacion['glosa'],
                                    'empresa_id' => $request->informacion['infoEmpresa']['id_empresa'], 'documento_id' => $doc->id_documento, 'estado_id' => 12, 'encabezado_id' => $request->informacion['idEncabezado'] , 
                                    'total_documento' => $request->total , 'total_iva' => $request->m_iva, 'total_retenciones' => $request->retenciones, 
                                    'total_afecto' => $request->m_afecto, 'n_interno' => $this->GenerarCodigoInterno()]);
            
        
            //ESTA VALIDACIÓN ES POR SI SE ESTA CREANDO UNA NOTA DE CREDITO.
            if($request->anulacion == 1){
                
                foreach($request->detalles as $item){
                  
                    DetalleDocumento::create([
                        'sku'                       => $item['sku'],
                        'producto_id'               => $item['producto_id'],
                        'centrocosto_id'            => $item['centrocosto_id'],
                        'cantidad'                  => $item['cantidad'],
                        'precio'                    => $item['precio'],
                        'descuento_porcentaje'      => $item['descuento_porcentaje'],
                        'precio_descuento'          => $item['precio_descuento'],
                        'descripcion_adicional'     => $item['descripcion_adicional'],
                        'info_id'                   => $info->id_info,
                        'total'                     => $item['total'],
                    ]);
                }

                if($respuesta == 0)
                {
                    foreach ($request->detalles as $key => $value) {
                        $data = Existencia::find($value['existencia_id']);
                        if($data->control_stock-$value['cantidad'] == 0){
                            $data->update(['control_stock' => $data->control_stock-$value['cantidad'], 'stock_estado' => 2]);
                        }else{
                            $data->update(['control_stock' => $data->control_stock-$value['cantidad']]);
                        }
                        

                        Existencia::create(['fecha'     => $info->fecha_emision,                  'info_id' => $info->id_info,          'encabezado_id' => $info->Encabezado->id_encabezado, 
                                            'tarjeta_id' => $data->tarjeta_id,                    'tipo_operacion' => 3,                'precio' => $value['precio'], 
                                            'cant_entrada' => 0,                                  'cant_salida' => $value['cantidad'],  'total_cant' => Existencia::where('tarjeta_id', $data->tarjeta_id)->where('stock_estado', 1)->sum('control_stock'), 
                                            'total_entrada' => 0,                                 'total_salida' => $value['precio']*$value['cantidad'],                  'total_precio' => intval(Existencia::where('tarjeta_id', $data->tarjeta_id)->pluck('total_precio')->last())-intval($value['precio']*$value['cantidad']), 
                                            'control_stock' => 0,                                 'stock_estado' => 0]);
                    }
                }
            }else if($request->debito == 1){
                
                foreach($request->detalles as $item){
                  
                    DetalleDocumento::create([
                        'descripcion_debito'        => $item['descripcion'],
                        'cantidad'                  => $item['cantidad'],
                        'precio'                    => $item['precio'],
                        'descuento_porcentaje'      => $item['descuento_porcentaje'],
                        'precio_descuento'          => $item['precio_descuento'],
                        'info_id'                   => $info->id_info,
                        'total'                     => $item['total'],
                    ]);
                } 

            }else{

                foreach($request->detalles as $item){
                    DetalleDocumento::create([
                        'sku'                       => $item['producto']['sku'],
                        'producto_id'               => $item['producto']['id_prod_proveedor'],
                        'centrocosto_id'            => $item['centrocosto_id'],
                        'cantidad'                  => $item['cantidad'],
                        'precio'                    => $item['precio'],
                        'descuento_porcentaje'      => $item['descuento_porcentaje'],
                        'precio_descuento'          => $item['precio_descuento'],
                        'descripcion_adicional'     => $item['descripcion_adicional'],
                        'info_id'                   => $info->id_info,
                        'total'                     => $item['total'],
                    ]);
                }
            }

            //INSERTAMOS INFORMACIÓN EN TABLA DOCUMENTOS RELACIONADOS.
            $docPadre = InfoDocumento::find($request->documento_id)->first();
            DocumentoRelacionado::create(['documento_hijo' => $info->id_info, 'documento_padre' => $docPadre->id_info, 'documentotributario_id' => $docTributario->id_documento, 'encabezado_id' => $request->encabezado_id]);
   
            return ['estado' => 1, 'mensaje' =>  "Documento Tributario creado, puede aprobarlo."];

            //FIN CREACION DOCUMENTO TRIBUTARIO

        }
    }

    public function getDocumento($id)
    {
        $info = InfoDocumento::find($id);
        $hola = $info;
        $datos = DetalleDocumento::where('info_id', $id)->get();
        $pdf = PDF::loadView('pdf', compact('datos'));
        return $pdf->stream();
        return $pdf->download('afiliacion.pdf'); 
    }
    
    public function updateFechaEmision(Request $request)
    {      
        $doc = InfoDocumento::where('n_interno', $request->n_interno)->first();

        //BUSCAMOS ENTRE TODO LOS DOCUMENTOS DEL ENCABEZADO EL DOCUMENTO CON LA FECHA MAYOR PARA COMPRAR CON LA FECHA DEL DOCUMENTO A CREAR
        $ultimoDocFecha = InfoDocumento::where('encabezado_id', $doc->encabezado_id)->where('id_info', '!=', $doc->id_info)->max('fecha_emision');
        
        //COMPROBAMOS QUE LA FECHA DEL NUEVO DOCUMENTO SEA MAYOR QUE LA FECHA DE CUALQUIER OTRO DOCUMENTO CREADO.
        
        if($ultimoDocFecha > $request->fechadoc)
        {
            return ['estado' => 1, 'mensaje' => 'Fecha de emisión no puede ser inferior al dia '.$ultimoDocFecha];

        }else{
            $doc->update(['fecha_emision' => $request->fechadoc]);
            return ['estado' => 0, 'mensaje' => 'Encabezado ha sido actualizado exitosamente.'];
        }

    }

    public function checkStockExistencia($empresa, $producto, $encabezado)
    {   
        $tarjeta = TarjetaProducto::select('id_tarjeta')->where('empresa_id', $empresa)->where('producto_id', $producto)->first();
        $existencia = Existencia::where('encabezado_id', $encabezado)->where('tarjeta_id', $tarjeta->id_tarjeta)->where('tipo_operacion', 1)->first();
        return ['existencia' => $existencia, 'cantidad' => $existencia->control_stock, 'existencia_id' => $existencia->id_existencia];
    }

    public function ValidateStockExistencia($empresa, $producto, $encabezado, $cantidad)
    {
        $tarjeta = TarjetaProducto::select('id_tarjeta')->where('empresa_id', $empresa)->where('producto_id', $producto)->first();
        $existencia = Existencia::where('encabezado_id', $encabezado)->where('tarjeta_id', $tarjeta->id_tarjeta)->where('tipo_operacion', 1)->first();
        if($existencia->control_stock < $cantidad)
        {
            return 1; //Si es 1 quiere decir que el producto tiene menos stock del que se desea sacar;
        }else{
            return 0; //Si es 0 quiere decir que se cuenta con stock suficiente para retirar de existencia;
        }
    }

}
