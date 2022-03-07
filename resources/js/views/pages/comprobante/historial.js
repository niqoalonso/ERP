import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import Vue from 'vue';
import DatePicker from "vue2-datepicker";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Layout,
    Swal,
    DatePicker, 
    Multiselect
  },
  data() {
    return { 
      
      urlbackend: this.$urlBackend,
      idEmpresa: JSON.parse(Vue.prototype.$globalEmpresasSelected),
      comprobantes: [],
      estados: [{'id': 13, 'nombre': 'Aprobado'},{'id': 12, 'nombre': 'Ingresado'}],
      form :  {
        estado: "",
        mes: "",
        
      },
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
  },
  methods: {
    
    customLabel({ nombre}) {
        return nombre;
    },


    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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

    Busqueda()
    {
        this.axios
          .post(`/api/buscarComprobantes`, this.form)
          .then((res) => {
                this.tableData = res.data;
                res.data.map((p) => {
                    p["unidad"] = p.unidad_negocio.nombre;
                    p["comprobante"] = p.tipo_comprobante.nombre;
                    return p;
                });
        });
    }
  },
};
