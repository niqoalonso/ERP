<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductoSistema extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primarykey = "id_producto";

    protected $fillable = ['nombre', 'descripcion'];
}
