<script src="./generarDocRelacion.js"></script>

<template>
  <Layout>

    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title"> <small>Generar</small>: {{documentoName}}</h4>
            <hr>
            <b-tabs
              justified
              nav-class="nav-tabs-custom"
              content-class="p-3 text-muted"
            >
              <b-tab active> 
                <template v-slot:title>
                  <span class="d-inline-block d-sm-none">
                    <i class="fas fa-home"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Encabezado</span>
                </template> 
                <form @submit.prevent="formSubmitEncabezado">
                    <div class="row">
                        <div class="mb-3 col-2">
                            <label><small> N° Documento</small></label>
                            <input type="text" class="form-control form-control-sm" v-model="form.n_documento" readonly>
                        </div>
                        <div class="mb-3 col-6">
                            <label><small> Proveedor </small></label>
                            <input type="text" class="form-control form-control-sm" v-model="form.proveedor" readonly>
                        </div>
                        <div class="mb-3 col-2">
                            <label><small> Fecha documento</small></label>
                            <input type="date" class="form-control form-control-sm" v-model="form.fechadoc">
                        </div>
                        <div class="mb-3 col-2">
                            <label><small> Fecha vencimiento</small></label>
                            <input type="date" class="form-control form-control-sm" v-model="form.fechaven" v-if="inputFechaVencimiento === true">
                            <input type="date" class="form-control form-control-sm" v-else disabled>
                        </div>
                        <div class="mb-3 col-5">
                            <label><small> Dirección</small></label>
                            <input type="text" class="form-control form-control-sm" v-model="form.direccion" readonly>
                        </div>
                        <div class="mb-3 col-4">
                            <label><small> Unidad de Negocio</small></label>
                            <input type="text" class="form-control form-control-sm" v-model="form.unidad" readonly>
                        </div>
                        <div class="mb-3 col-12">
                            <label><small> Glosa</small></label>
                            <input type="text" class="form-control form-control-sm" v-model="form.glosa" readonly />
                        </div>
                    </div>
                </form>
              </b-tab>

              <!-- <b-tab>
                <template v-slot:title>
                  <span class="d-inline-block d-sm-none">
                    <i class="far fa-user"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Detalle</span>
                </template>

                <form class="needs-validation" @submit.prevent="formSubmitDetalle">
                    <div class="row">
                        <div class="mb-3 col-2">
                            <label for="sku"><small> Codigo</small></label>
                            <input id="sku" type="number" class="form-control form-control-sm" v-model="formDetalle.sku"
                                 >

                        </div>
                        <div class="mb-3 col-8">
                            <label><small> Producto </small></label>
                            <multiselect
                            @input="onChangeProducto"
                            v-model="formDetalle.producto"
                            placeholder="Seleccionar"
                            :options="productos"
                            track-by="id_prod_proveedor"
                            label="nombre">
                            </multiselect>
                        </div>
                        <div class="mb-3 col-2">
                            <label><small> Cantidad</small></label>
                            <input type="number" class="form-control form-control-sm" @input="changeCantidad" v-model="formDetalle.cantidad">
                        </div>
                        <div class="mb-3 col-2">
                            <label><small> Precio</small></label>
                            <input type="number" class="form-control form-control-sm" v-model="formDetalle.precio" readonly>
                        </div>
                        <div class="mb-3 col-2">
                            <label><small> Porcentaje</small></label>
                            <input type="number" @input="calcularDescuento" class="form-control form-control-sm" v-model="formDetalle.descuento_porcentaje">
                        </div>
                        <div class="mb-3 col-2">
                            <label><small> Precio Descuento</small></label>
                            <input type="number" class="form-control form-control-sm" v-model="formDetalle.precio_descuento" readonly>
                        </div>
                        <div class="mb-3 col-6">
                            <label><small> Descripción</small></label>
                            <input type="text" class="form-control form-control-sm" v-model="formDetalle.descripcion" readonly>
                        </div>
                        <div class="mb-3 col-4">
                            <label><small> Centro de Costo</small></label>
                            <multiselect
                            v-model="formDetalle.centro_costo"
                            placeholder="Seleccionar"
                            :options="centros"
                            track-by="id_centrocosto"
                            label="nombre">
                            </multiselect>
                        </div>
                        <div class="mb-3 col-8">
                            <label><small> Descripcion adicional</small></label>
                            <input class="form-control form-control-sm" v-model="formDetalle.descripcion_adicional" />
                        </div>
                        <div class="mb-3 col-12 d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary btn-sm"><i class="uil uil-plus-circle"></i> Agregar</button>
                        </div>
                    </div>
                </form>

              </b-tab> -->

              <b-tab>
                <template v-slot:title>
                  <span class="d-inline-block d-sm-none">
                    <i class="far fa-envelope"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Documentos Asociados</span>
                </template>
                <p>Hola</p>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-3">
                <label><small>Monto Afecto</small></label>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">$</span>
                  <input type="text" class="form-control" :value="m_afecto" readonly>
                </div>
              </div>
              <div class="col-3">
                <label><small>Monto IVA</small></label>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">$</span>
                  <input type="text" class="form-control" :value="m_iva" readonly>
                </div>
              </div>
              <div class="col-3">
                <label><small>Retenciones</small></label>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">$</span>
                  <input type="text" class="form-control" :value="retenciones" readonly>
                </div>
              </div>
              <div class="col-3">
                <label><small>Total</small></label>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">$</span>
                  <input type="text" class="form-control" :value="total" readonly>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <h5>Detalle Documento</h5>
              </div>
              <div class="col-6 d-flex justify-content-end" v-if="buttonAnulacion == true">
                  <button class="btn btn-primary btn-sm" 
                  v-b-modal.crearanticipo
                  @click="modalNuevo">
                  <i class="fa fa-list"></i> 
                  Añadir Detalle</button>
              </div>
              <div class="col-6 d-flex justify-content-end" v-if="buttonDebito == true">
                  <button class="btn btn-primary btn-sm" 
                  v-b-modal.creardetalledebito
                  @click="modalNuevoDebito">
                  <i class="fa fa-list"></i> 
                  Añadir Detalle</button>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-4">
                  <label>Producto</label>
              </div>
              <div class="col-1">
                  <label>Cantidad</label>
              </div>
              <div class="col-2">
                  <label>Precio</label>
              </div>
              <div class="col-1">
                  <label>Porcentaje</label>
              </div>
              <div class="col-2">
                  <label>Precio Descuento</label>
              </div>
              <div class="col-1">
                  <label>Total</label>
              </div>
              <div class="col-1">
                  <label>Acción</label>
              </div> 
            </div>

            <hr> 

            <div class="row" v-for="(detalle, index) in detalles" :key="index"  style="border-bottom: 1px solid ##8d8b8b; margin-top: 0px; margin-bottom: 0px;">
              <div class="col-4">
                  <p>{{detalle.producto.nombre}}</p>
              </div>
               <div class="col-1">
                  <p>{{detalle.cantidad}}</p>
              </div>
              <div class="col-2">
                  <p>${{detalle.precio}}</p>
              </div>
              <div class="col-1" v-if="detalle.descuento_porcentaje != null ">
                  <p>{{detalle.descuento_porcentaje}}%</p>
              </div>
              <div class="col-1" v-else>
                  <p>-</p>
              </div>
              <div class="col-2" v-if="detalle.precio_descuento != null ">
                  <p>${{detalle.precio_descuento}}</p>
              </div>
              <div class="col-2" v-else>
                  <p>-</p>
              </div>
              <div class="col-1">
                  <p>${{detalle.total}}</p>
              </div>
            </div>
            
            <div class="row" v-for="(detalle, index) in detalleNotaCredito" :key="index"  style="border-bottom: 1px solid ##8d8b8b; margin-top: 0px; margin-bottom: 0px;">
              <div class="col-4">
                  <p>{{detalle.nombre}}</p>
              </div>
               <div class="col-1">
                  <p>{{detalle.cantidad}}</p>
              </div>
              <div class="col-2">
                  <p>${{detalle.precio}}</p>
              </div>
              <div class="col-1" v-if="detalle.descuento_porcentaje != null ">
                  <p>{{detalle.descuento_porcentaje}}%</p>
              </div>
              <div class="col-1" v-else>
                  <p>-</p>
              </div>
              <div class="col-2" v-if="detalle.precio_descuento != null ">
                  <p>${{detalle.precio_descuento}}</p>
              </div>
              <div class="col-2" v-else>
                  <p>-</p>
              </div>
              <div class="col-1">
                  <p>${{detalle.total}}</p> 
              </div>
              <div class="col-1">
                  <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteEvent(index, detalle.precio*detalle.cantidad)"><i class="uil uil-trash"></i></button>
              </div>
            </div>

            <div class="row" v-for="(detalle, index) in detalleDebito" :key="index"  style="border-bottom: 1px solid ##8d8b8b; margin-top: 0px; margin-bottom: 0px;">
              <div class="col-4">
                  <p>{{detalle.descripcion}}</p>
              </div>
               <div class="col-1">
                  <p>{{detalle.cantidad}}</p>
              </div>
              <div class="col-2">
                  <p>${{detalle.precio}}</p>
              </div>
              <div class="col-1" v-if="detalle.descuento_porcentaje != null ">
                  <p>{{detalle.descuento_porcentaje}}%</p>
              </div>
              <div class="col-1" v-else>
                  <p>-</p>
              </div>
              <div class="col-2" v-if="detalle.precio_descuento != null ">
                  <p>${{detalle.precio_descuento}}</p>
              </div>
              <div class="col-2" v-else>
                  <p>-</p>
              </div>
              <div class="col-1">
                  <p>${{detalle.total}}</p> 
              </div>
              <div class="col-1">
                  <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteEventDebito(index, detalle.precio*detalle.cantidad)"><i class="uil uil-trash"></i></button>
              </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-12 d-flex justify-content-end">
                    <button type="button" class="btn btn-success btn-sm" v-on:click="GenerarDocumento"><i class="uil uil-save"></i> Generar Documento</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  <b-modal
      id="crearanticipo"
      size="xl"
      :title="titlemodal"
      title-class="font-18"
      hide-footer
      v-if="modal"
    >
      <form class="needs-validation" @submit.prevent="formSubmit">

        <div class="row">

          <div class="col-md-10">
            <div class="mb-3">
              <label>Producto de Factura</label>
              <multiselect
                v-model="formAddDetalle.detalle"
                :options="detallesSelect"
                track-by="id_detalle"
                :custom-label="customLabel"
              ></multiselect>

              <span
              class="text-danger"
                  v-if="
                    !form.trabajador && submitted
                  "
                  >Seleccion requerida.</span
                >
            </div>
          </div>
          <div class="col-md-2">
            <div class="mb-3">
              <label>Cantidad</label>
              <input 
              type="number" 
              class="form-control"
              v-model="formAddDetalle.cantidad"
              >
              <span
              class="text-danger"
                  v-if="
                    !form.trabajador && submitted
                  "
                  >Seleccion requerida.</span
                >
            </div>
          </div>
      
        </div>

        <button @click="addDetalle()" class="btn btn-primary float-end" type="button">
          <i class="far fa-save"></i> Agregar
        </button>

      </form>
  </b-modal>

  <b-modal
      id="creardetalledebito"
      size="xl"
      :title="titlemodaldebito"
      title-class="font-18"
      hide-footer
      v-if="modalDebito"
    >
      <form class="needs-validation" @submit.prevent="formSubmitDebito">

        <div class="row">

          <div class="col-md-5">
            <div class="mb-3">
              <label>Descripción</label>
              <input 
              type="text"
              class="form-control form-control-sm"
              v-model="formAddDebito.descripcion"
              >
              <span
              class="text-danger"
                  v-if="
                    !form.trabajador && submitted
                  "
                  >Seleccion requerida.</span
                >
            </div>
          </div>
          <div class="col-md-1">
            <div class="mb-3">
              <label>Cantidad</label>
              <input 
              type="number" 
              class="form-control form-control-sm"
              v-model="formAddDebito.cantidad"
              @input="LimpiarInputCantidadDebito()"
              >
              <span
              class="text-danger"
                  v-if="
                    !form.trabajador && submitted
                  "
                  >Seleccion requerida.</span
                >
            </div>
          </div>
          <div class="col-md-2">
            <div class="mb-3">
              <label>Precio</label>
              <input 
              type="number" 
              class="form-control form-control-sm"
              v-model="formAddDebito.precio"
              @input="LimpiarInputDebito()"
              >
              <span
              class="text-danger"
                  v-if="
                    !form.trabajador && submitted
                  "
                  >Seleccion requerida.</span
                >
            </div>
          </div>
          <div class="col-md-2">
            <div class="mb-3">
              <label>Porcentaje Descuento</label>
              <input 
              type="number" 
              class="form-control form-control-sm"
              v-model="formAddDebito.porcentaje_descuento"
              @input="calcularDescuentoDebito()"
              >
              <span
              class="text-danger"
                  v-if="
                    !form.trabajador && submitted
                  "
                  >Seleccion requerida.</span
                >
            </div>
          </div>
          <div class="col-md-2">
            <div class="mb-3">
              <label>Precio Descuento</label>
              <input 
              type="number" 
              class="form-control form-control-sm"
              v-model="formAddDebito.precio_descuento"
              readonly
              >
              <span
              class="text-danger"
                  v-if="
                    !form.trabajador && submitted
                  "
                  >Seleccion requerida.</span
                >
            </div>
          </div>
      
        </div>

        <button class="btn btn-primary float-end" type="submit">
          <i class="far fa-save"></i> Agregar
        </button>

      </form>
  </b-modal>

  </Layout>
</template>
