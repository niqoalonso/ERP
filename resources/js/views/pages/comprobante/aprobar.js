import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import Vue from 'vue';

export default {
  components: {
    Layout,
    Swal,
  },
  data() {
    return { 
      
      urlbackend: this.$urlBackend,
      idEmpresa: JSON.parse(Vue.prototype.$globalEmpresasSelected),
      comprobantes: [],
      
      // tabla

      tableData: [],

      title: "actividad",
      items: [
        {
          text: "Tables",
        },
        {
          text: "actividad",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100, 1000],
      filter: null,
      filterOn: [],
      sortBy: "Nivel",
      sortDesc: false,
      fields: [
        {
          label: "Codigo",
          key: "codigo",
          sortable: true,
        },
        {
          label: "Tipo Comprobante",
          key: "comprobante",
          sortable: true,
        },
        {
          label: "Glosa",
          key: "glosa",
          sortable: true,
        },
        {
          labe: "Unidad Negocio",
          key: "unidad",
          sortable: true,
        },
        {
          label: "Tipo Comprobante",
          key: "comprobante",
          sortable: true,
        },
        {
            label: "Deber",
            key: "deber",
            sortable: true,
        },
        {
            label: "Haber",
            key: "haber",
            sortable: true,
        },
        "action",
      ],
    };
  },

  mounted() {
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    this.totalRows = this.items.length;
    this.traerData();

  },
  methods: {

    traerData() {
      this.axios
        .get(`/api/ObtenerComprobantes/`+this.idEmpresa.id_empresa)
        .then((res) => {
            this.tableData = res.data;
            res.data.map((p) => {
                p["unidad"] = p.unidad_negocio.nombre;
                p["comprobante"] = p.tipo_comprobante.nombre;
                return p;
              });
        });
    },

    traerComprobantes() {
        this.axios
          .get(`/api/getComprobantes/`+this.idEmpresa.id_empresa)
          .then((response) => {
              console.log(response);
              response.data.map((p) => {
                p["unidad"] = p.unidad_negocio.nombre;
                p["comprobante"] = p.tipo_comprobante.nombre;
                // retornar el nuevo objeto
                return p;
              });
              this.tableData = response.data;
          });
      },

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    aprobar(comprobante)
    {   
        Swal.fire({
            title: 'Aprobar Comprobante',
            text: "¿Esta seguro que quiere aprobar este comprobante?",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#0b892c',
            cancelButtonColor: '#d33',
            cancelButtonText: "Cancelar",
            confirmButtonText: 'Si, aprobar!',
          }).then((result) => { 
            if (result.isConfirmed) {
                this.axios
                .get(`/api/aprobarComprobante/`+comprobante.id_comprobante)
                .then((res) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Comprobante',
                    text: res.data,
                    timer: 3500,
                    showConfirmButton: false
                  });
            
                  this.traerData();
                    
                })
                .catch((error) => {
                  console.log("error", error);
                  const title = "Error Detalle Comprobante";
                  const message = "Problema al eliminar detalle";
                  const type = "error";
    
                  this.modal = false;
                  this.$v.form.$reset();
    
                  this.successmsg(title, message, type);
                });
            }
        });
    },

    eliminar(comprobante)
    {   
        Swal.fire({
            title: 'Eliminar Comprobante',
            text: "¿Esta seguro que quiere eliminar este comprobante?",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#0b892c',
            cancelButtonColor: '#d33',
            cancelButtonText: "Cancelar",
            confirmButtonText: 'Si, Eliminar!',
          }).then((result) => { 
            if (result.isConfirmed) {
                this.axios
                .delete(`/api/deleteComprobante/`+comprobante.id_comprobante)
                .then((res) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Comprobante',
                    text: res.data,
                    timer: 3500,
                    showConfirmButton: false
                  });
            
                  this.traerData();
                    
                })
                .catch((error) => {
                  console.log("error", error);
                  const title = "Error Detalle Comprobante";
                  const message = "Problema al eliminar detalle";
                  const type = "error";
    
                  this.modal = false;
                  this.$v.form.$reset();
    
                  this.successmsg(title, message, type);
                });
            }
        });
    },
  },
};
