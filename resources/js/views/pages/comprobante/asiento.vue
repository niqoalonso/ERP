<script src="./asiento.js"></script>

<template>
  <Layout>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
        
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                  <h4 class="card-title">Comprobante Contable</h4>
              </div>
              <div class="col-6 d-flex flex-row-reverse bd-highlight">
                  <h4 v-if="divButton === true && crearproveedor" class="card-title">Nuevo Proveedor</h4>
                  <h4 v-if="divButton === false && editarproveedor" class="card-title">Editar Proveedor</h4>
              </div> 
            </div> 
            
            <hr>
            <form class="needs-validation" @submit.prevent="formSubmit">
            <div class="row">
                <div class="col-md-3">
                    <div class="mb-3">
                        <label id="comprobante">Tipo Comprobante</label>
                        <multiselect
                            id="comprobante"
                            v-model="form.comprobante"
                            placeholder="Seleccionar"
                            :options="comprobantes"
                            track-by="id_tipocomprobante"
                            :custom-label="customLabel"
                            :class="{
                            'is-invalid': submitted && $v.form.comprobante.$error,
                            }"
                        ></multiselect>
                        <div
                            v-if="submitted && $v.form.comprobante.$error"
                            class="invalid-feedback"
                        >
                            <span v-if="!$v.form.comprobante.required"
                            >Comprobante requerido.</span
                            >
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label for="fecha_comprobante">Fecha comprobante</label>
                        <input
                            id="fecha_comprobante"
                            v-model="form.fecha_comprobante"
                            type="date"
                            class="form-control"
                            :class="{
                            'is-invalid': submitted && $v.form.fecha_comprobante.$error,
                            }"
                        />
                        <div
                            v-if="submitted && $v.form.fecha_comprobante.$error"
                            class="invalid-feedback"
                        >
                            <span v-if="!$v.form.fecha_comprobante.required"
                            >Fecha requerido.</span
                            >
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label id="comprobante">Unidad Negocio</label>
                        <multiselect
                            id="comprobante"
                            v-model="form.unidadnegocio"
                            placeholder="Seleccionar"
                            :options="unidadnegocios"
                            track-by="id_unidadnegocio"
                            :custom-label="customLabelNegocio"
                            :class="{
                            'is-invalid': submitted && $v.form.unidadnegocio.$error,
                            }"
                        ></multiselect>
                        <div
                            v-if="submitted && $v.form.unidadnegocio.$error"
                            class="invalid-feedback"
                        >
                            <span v-if="!$v.form.unidadnegocio.required"
                            >Comprobante requerido.</span
                            >
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="mb-3">
                        <label for="glosa">Glosa - <small>(Descripción General)</small></label>
                        <input
                            id="glosa"
                            v-model="form.glosa"
                            type="text"
                            class="form-control form-control-sm"
                            :class="{
                            'is-invalid': submitted && $v.form.glosa.$error,
                            }"
                        />
                        <div
                            v-if="submitted && $v.form.glosa.$error"
                            class="invalid-feedback"
                        >
                            <span v-if="!$v.form.glosa.required"
                            >Glosa requerido.</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="btnCreate" v-if="divButton === true">
              <button class="btn btn-success btn-soft-success float-end btnSubmit" type="submit"> 
                  <i class="far fa-save"></i> Ingresar Comprobante
              </button>
            </div>
            <div class="btnUpdate" v-else>
              <button class="btn btn-success btn-soft-success float-end btnSubmit" style="margin-left: 10px;" type="submit" disabled> 
                  <i class="fas fa-sync"></i> Actualizar Comprobante
              </button>
              <button class="btn btn-danger float-end" type="button" v-on:click="cancelar"> 
                  <i class="fas fa-ban"></i> Cancelar
              </button>
            </div>
            
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
