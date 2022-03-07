<script src="./historial.js"></script>

<template>
  <Layout>
    <div class="row">
        <div class="col-4">
                <div class="form-group mb-3">
                    <label>Selecciona el mes</label>
                    <br />
                    <date-picker
                        v-model="form.mes"
                        type="month"
                        lang="es"
                        confirm
                        placeholder="Selecciona mes"
                    ></date-picker>
                </div>
            </div>
            <div class="col-3">
                <div class="form-group mb-3">
                    <label>Selecciona estado</label>
                    <br/>
                    <multiselect
                            v-model="form.estado"
                            id="comprobante"
                            placeholder="Seleccionar"
                            :options="estados"
                            track-by="id"
                            :custom-label="customLabel"
                        ></multiselect> 
                </div>
            </div>
            <div class="col-2">
                <div class="form-group mb-3">
                    <label>Buscar</label>
                    <br/>
                    <button class="btn btn-success" 
                        v-on:click="Busqueda()">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
            </div>
        <div class="col-lg-12">
            <div class="card">
            <div class="card-body">
                <h5>Aprobar Comprobantes</h5>
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
                        
                        <li
                        class="list-inline-item"
                        >
                        <router-link
                            :to="'../verDetalle-comprobante/' + data.item.codigo"
                        >
                            <a class="px-2 text-primary" title="Detalle Comprobante">
                            <i class="uil uil-eye font-size-18"></i>
                            </a>
                        </router-link>
                        </li>
                        <li
                        class="list-inline-item"
                        >
                        <router-link
                            :to="'../comprobanteDetalle/' + data.item.codigo"
                        >
                            <a class="px-2 text-warning" title="Detalle Comprobante">
                            <i class="uil uil-edit font-size-18"></i>
                            </a>
                        </router-link>
                        </li>
                        <li class="list-inline-item">
                        <a
                            href="javascript:void(0);"
                            v-on:click="eliminar(data.item)"
                            class="px-2 text-danger"
                            v-b-tooltip.hover
                            title="Eliminar"
                        >
                            <i class="uil uil-trash font-size-18"></i>
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
