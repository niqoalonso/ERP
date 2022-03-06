<?php

namespace App\Http\Controllers;

use App\Models\ProductoProveedor;
use App\Models\ProductoSistema;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use App\Http\Requests\Proveedor\ProductoRequest;

class ProductoProveedorController extends Controller
{
    
    public function obtenerProveedores()
    {   
        $proveedores = Proveedor::all();
        $productos = ProductoSistema::all();
        return ['proveedores' => $proveedores, 'productos' => $productos];
    }

    public function obtenerProductoProveedor($id)
    {
        $productos = ProductoProveedor::where('proveedor_id', $id)->get();
        return $productos;
    } 

    public function GenerarCodigo($id_proveedor){
        do {            
            $number = rand(0,99999);
            $codigo = ProductoProveedor::select('sku')->where('sku', $number)->where('proveedor_id', $id_proveedor)->withTrashed()->first();
        } while (!empty($codigo->sku));

        return $number;
    }

    public function store(Request $request)
    {   
        if(count(ProductoProveedor::where('producto_id', $request->id_producto)->where('proveedor_id', $request->id_proveedor)->get()) > 0)
        {
            return ['estado' => 1];
        }

        ProductoProveedor::create(['nombre' => $request->nombre, 'sku' => $this->GenerarCodigo($request->id_proveedor), 'precio_neto' => $request->p_neto, 'iva' => $request->iva, 
                                    'precio_bruto' => $request->p_bruto, 'proveedor_id' => $request->id_proveedor, 'descripcion' => $request->descripcion, 'producto_id' => $request->id_producto]);
        return  $this->successResponse('Producto Creado Exitosamente', false);
    }

    public function update(ProductoRequest $request, ProductoProveedor $producto)
    {   
        $producto->update(['nombre' => $request->nombre, 'precio_bruto' => $request->p_bruto, 'iva' => $request->iva, 'precio_neto' => $request->p_neto, 'descripcion' => $request->descripcion]);
        return  $this->successResponse('Producto Actualizado Exitosamente', false);
    }

}
