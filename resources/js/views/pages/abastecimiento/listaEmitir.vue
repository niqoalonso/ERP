<script src="./listaEmitir.js"></script>

<template>
  <Layout>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body row"> 
            <div class="col-10">
                <h6><b>Emitir Documentos Triburatios</b></h6>
            </div>
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Show&nbsp;
                    <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
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
                    Search:
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Search..."
                      class="form-control form-control-sm ms-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>

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
              <template v-slot:cell(acción)="data">
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-success"
                        v-b-modal.aprobarpago
                        data-toggle="modal"
                        data-target=".bs-example-aprobarpago"
                        v-b-tooltip.hover
                        title="Emitir Documento"
                        v-on:click="emitirDocumento(data.item.n_interno)"
                      >
                        <i class="uil uil-export font-size-18"></i>
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <router-link :to="'modificarDocumento/'+data.item.n_interno">
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-warning"
                        v-b-tooltip.hover
                        title="Modificar"
                      >
                        <i class="uil uil-edit font-size-18"></i>
                      </a>
                      </router-link>
                    </li>
                  </ul>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div class="dataTables_paginate paging_simple_numbers float-end">
                  <ul class="pagination pagination-rounded mb-0">
                    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" ></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- modal para crear comprobante -->

    <b-modal
            size="lg"
            title-class="font-18"
            hide-footer 
            title="Generar Comprobante"
            ref="my-modal"
        >
            <form
                class="needs-validation"
                @submit.prevent="formComprobanteSubmit"
            >
                <div class="row">
                    <div class="col-md-2">
                        <div class="mb-3">
                            <label for="compra">N° COMPRA</label>
                            <input
                                id="compra"
                                v-model="formComprobante.n_encabezado"
                                type="text"
                                class="form-control form-control-sm"
                                readonly
                            />
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="mb-3">
                            <label for="proveedor">PROVEEDOR</label> 
                            <input 
                                id="proveedor"
                                v-model="formComprobante.proveedor"
                                type="text"
                                class="form-control form-control-sm"
                                readonly
                            />
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="mb-3">
                            <label for="fecha">FECHA EMISIÓN</label>
                            <input
                                id="fecha"
                                v-model="formComprobante.f_emision"
                                type="date"
                                class="form-control form-control-sm"
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label>CUENTA ORIGEN</label>
                            <multiselect
                                v-model="formComprobante.origen"
                                placeholder="Seleccionar"
                                :options="optionsOrigen"
                                track-by="id_plan_cuenta"
                                label="nombre"
                            ></multiselect>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label>CUENTA DESTINO</label>
                            <multiselect
                                v-model="formComprobante.destino"
                                placeholder="Seleccionar"
                                :options="optionsDestino"
                                track-by="id_plan_cuenta"
                                label="nombre"
                            ></multiselect>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary float-end" type="submit">
                    <i class="far fa-save"></i> Aprobar
                </button>
            </form>
    </b-modal>

    <!-- modal para crear comprobante DEBITO -->

    <b-modal
            size="lg"
            title-class="font-18"
            hide-footer 
            title="Generar Comprobante"
            ref="my-modalDebito"
        >
            <form
                class="needs-validation"
                @submit.prevent="formComprobanteDebitoSubmit"
            >
                <div class="row">
                    <div class="col-md-2">
                        <div class="mb-3">
                            <label for="compra">N° COMPRA</label>
                            <input
                                id="compra"
                                v-model="formComprobanteDebito.n_encabezado"
                                type="text"
                                class="form-control form-control-sm"
                                readonly
                            />
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="mb-3">
                            <label for="proveedor">PROVEEDOR</label> 
                            <input 
                                id="proveedor"
                                v-model="formComprobanteDebito.proveedor"
                                type="text"
                                class="form-control form-control-sm"
                                readonly
                            />
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="mb-3">
                            <label for="fecha">FECHA EMISIÓN</label>
                            <input
                                id="fecha"
                                v-model="formComprobanteDebito.f_emision"
                                type="date"
                                class="form-control form-control-sm"
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label>CUENTA ORIGEN</label>
                            <multiselect
                                v-model="formComprobanteDebito.origen"
                                placeholder="Seleccionar"
                                :options="optionsOrigen"
                                track-by="id_plan_cuenta"
                                label="nombre"
                            ></multiselect>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label>CUENTA DESTINO</label>
                            <multiselect
                                v-model="formComprobanteDebito.destino"
                                placeholder="Seleccionar"
                                :options="optionsDestino"
                                track-by="id_plan_cuenta"
                                label="nombre"
                            ></multiselect>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary float-end" type="submit">
                    <i class="far fa-save"></i> Aprobar
                </button>
            </form>
    </b-modal>

  </Layout>
</template>
