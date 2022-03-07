<?php

namespace App\Http\Controllers;

use App\Models\ProductoSistema;
use App\Models\TarjetaProducto;
use App\Models\ProductoProveedor;
use App\Models\DetalleDocumento;
use Illuminate\Http\Request;

class ProductoSistemaController extends Controller
{

    public function getProducto()
    {
        $datos = ProductoSistema::all();
        return response()->json($datos);
    }

    public function storeProducto(Request $request)
    {   
        if(count(ProductoSistema::where('nombre', $request->nombre)->get()) > 0)
        {
            return ['estado' => 1];
        }else{
            ProductoSistema::create(['nombre' => $request->nombre, 'descripcion' => $request->descripcion]);
            $datos = ProductoSistema::all();
            return response()->json(['datos' => $datos, 'mensaje' => "Producto agregado exitosamente."]);
        }
        
    }

    public function updateProducto(Request $request, $id)
    {   
       
        ProductoSistema::updateOrCreate(['id_producto' => $id],['nombre' => $request->nombre, 'descripcion' => $request->descripcion]);
        $datos = ProductoSistema::all();

        return response()->json(['datos' => $datos, 'mensaje' => 'Producto actualizado exitosamente']);
    }

    public function deleteProducto($id)
    {
        $contador = 0;

        if(count(TarjetaProducto::where('producto_id', $id)->get()) > 0){ $contador++; }
        if(count(ProductoProveedor::where('producto_id', $id)->get()) > 0){ $contador++; }
        if(count(DetalleDocumento::where('producto_id', $id)->get()) > 0){ $contador++; }
        
        if($contador > 0)
        {
            ProductoSistema::where('id_producto',$id)->delete();
        }else{
            ProductoSistema::where('id_producto', $id)->forceDelete();
        }

        return "Producto eliminado exitosamente";
    }

}
