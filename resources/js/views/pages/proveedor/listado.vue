<script src="./listado.js"></script>

<template>
  <Layout>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Gestión Producto Sistema</h4>
            <hr>
            <form class="needs-validation" @submit.prevent="formSubmit">
            <div class="row">
              <input id="id_producto" v-model="form.id_producto" type="number" class="form-control"
                    
                hidden=""/>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="nombre">Nombre</label>
                  <input
                      id="nombre"
                      v-model="form.nombre"
                      type="text"
                      class="form-control"
                      :class="{
                      'is-invalid': submitted && $v.form.nombre.$error,
                      }"
                  />
                  <div 
                      v-if="submitted && $v.form.nombre.$error"
                      class="invalid-feedback"
                  >
                      <span v-if="!$v.form.nombre.required"
                      >Nombre requeridos.</span
                      >
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <div class="mb-3">
                  <label for="descripcion">Descripcion - <small>(opcional)</small></label>
                    <input
                      id="descripcion"
                      v-model="form.descripcion"
                      type="text"
                      class="form-control"
                    />
                </div>
              </div>
            </div>
              <div v-if="divButton === true">
                  <button class="btn btn-primary float-end" type="submit"> Agregar Producto</button>
              </div>
              <div v-else>
                  <button class="btn btn-primary float-end" style="margin-left: 10px;" type="submit"> Actualizar Producto </button>
                  <button class="btn btn-danger float-end" type="button" v-on:click="cancelar"> Cancelar </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">

            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Mostrar&nbsp;
                    <b-form-select
                      v-model="perPage"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select
                    >&nbsp;entradas
                  </label>
                </div>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div
                  id="tickets-table_filter"
                  class="dataTables_filter text-md-end"
                >
                  <label class="d-inline-flex align-items-center">
                    Buscar:
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Buscar..."
                      class="form-control form-control-sm ms-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>

            <div class="table-responsive mb-0">
              <b-table
                :items="tableData"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <template v-slot:cell(action)="data">
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        v-on:click="editar(data.item)"
                        class="px-2 text-primary"
                        v-b-modal.creargiro
                        data-toggle="modal"
                        data-target=".bs-example-creargiro"
                        v-b-tooltip.hover
                        title="Editar"
                      >
                        <i class="uil uil-pen font-size-18"></i>
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        v-on:click="eliminar(data.item)"
                        class="px-2 text-danger"
                        v-b-tooltip.hover
                        title="Eliminar"
                      >
                        <i class="uil uil-power font-size-18"></i>
                      </a>
                    </li>
                  </ul>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="totalRows"
                      :per-page="perPage"
                    ></b-pagination>
                  </ul>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>

    </div>
  </Layout>
</template>
