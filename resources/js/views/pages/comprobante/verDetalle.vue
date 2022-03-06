<script src="./verDetalle.js"></script>

<template>
  <Layout>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                  <h4 class="card-title">Encabezado Comprobante</h4>
              </div>
              <div class="col-6 d-flex justify-content-end">
                <router-link to="../historial-comprobante">
                  <button type="button" class="btn btn-outline-secondary btn-sm"><i class="uil uil-corner-down-left"></i> Volver</button>
                </router-link>
                
              </div>
            </div>
            
            <hr>
            <div class="row">
                <div class="col-md-3">
                    <div class="mb-3">
                        <label id="comprobante">Tipo Comprobante</label>
                        <input v-model="info.tipocomprobante" class="form-control form-control-sm" disabled/>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label for="fecha_comprobante">Fecha comprobante</label>
                        <input
                            id="fecha_comprobante"
                            v-model="info.fecha_comprobante"
                            type="date"
                            class="form-control form-control-sm"
                            disabled
                        />
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label id="comprobante">Unidad Negocio</label>
                        <input v-model="info.unidadnegocio" class="form-control form-control-sm" disabled/>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="glosa">Glosa - <small>(Descripción General)</small></label>
                        <input
                            id="glosa"
                            v-model="info.glosa"
                            type="text"
                            class="form-control form-control-sm"
                            disabled
                        />
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label for="glosa">Debe</label>
                        <input
                            id="glosa"
                            v-model="info.deber"
                            type="text"
                            class="form-control form-control-sm"
                            disabled
                        />
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label for="glosa">Haber</label>
                        <input
                            id="glosa"
                            v-model="info.haber"
                            type="text"
                            class="form-control form-control-sm"
                            disabled
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
              <h5>Detalle Comprobante</h5>
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
