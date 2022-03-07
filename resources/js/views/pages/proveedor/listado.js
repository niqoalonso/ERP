import Layout from "../../layouts/main";
import Swal from "sweetalert2";


import { required} from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
export default {
  
  components: {
    Layout,
    Multiselect, 
    Swal,
  },
 
  data() {
    return {
      urlbackend: this.$urlBackend,
      form: {
        nombre: "",
        descripcion: "",
        id_producto: "",
      }, 
      submitted: false,
      typeform: "create",
      modeSelectProveedor: false,
      divButton: true,
      proveedores: [],
 
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
          labe: "Nombre",
          key: "nombre",
          sortable: true,
        },
        {
          label: "Descripcion",
          key: "descripcion",
          sortable: true,
        },
        "action",
      ],
    };
  },

  validations: {
    form: {
      nombre: {
        required,
      },
      descripcion: {
        required,
      },
    },
  },

  mounted() {  
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem('token')}`;
    this.traerProductos();
  },
  methods: {

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    traerProductos(id)
    {
      this.axios
            .get(`/api/getProductoSistema`)
            .then((res) => {
              this.tableData = res.data;
            })
            .catch(error => {
                console.log(error);
            });
    },

    formSubmit() {
      this.submitted = true;

      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.typeform == "create") {
          this.axios
            .post(`/api/crearProductosistema`, this.form)
            .then((res) => {
                if(res.data.estado == 1)
                { 
                  Swal.fire({
                    icon: 'warning',
                    title: 'Producto Sistema',
                    text: "Producto ya esta registrao en nuestro sistema.",
                    timer: 1500,
                    showConfirmButton: false
                  });
                  return false;
                } 
                Swal.fire({
                  icon: 'success',
                  title: 'Producto',
                  text: "Producto Agregado Exitosamente",
                  timer: 1500,
                  showConfirmButton: false
                });

                this.$v.form.$reset();
                this.form.nombre = "";
                this.form.descripcion = "";

                this.divButton = true;
                this.typeform = "create";

                this.tableData = res.data.datos;

            })
            .catch(error => { 
                console.clear();
            });
        } else if (this.typeform == "edit") {
          this.axios
            .put(
              `/api/actualizarProductoSistema/${this.form.id_producto}`,
              this.form
            )
            .then((res) => {
              Swal.fire({
                icon: 'success',
                title: 'Producto',
                text: "Producto Actualizado Exitosamente",
                timer: 1500,
                showConfirmButton: false
              });

                this.$v.form.$reset();
                this.form.id_producto = "";
                this.form.nombre = "";
                this.form.descripcion = "";

                this.divButton = true;
                this.typeform = "create";

                this.tableData = res.data.datos;

            })
            .catch((error) => {
                console.clear();
            });
        }
      }
    },

    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },

    editar(datos)
    {
      this.typeform = "edit";
      this.form.id_producto  = datos.id_producto;
      this.form.nombre      = datos.nombre;
      this.form.descripcion      =datos.descripcion;
      this.divButton = false;
    },

    cancelar()
    {
        this.divButton = true;
        this.typeform = "create";
        this.$v.form.$reset();
        this.form.nombre = "";
        this.form.sku = "";
        this.form.p_bruto = "";
        this.form.iva = "";
        this.form.p_neto = "";
        this.form.descripcion = "";
    },

    eliminar(datos) {
      console.log(datos);
      Swal.fire({
        title: "Eliminar Producto",
        text:  "¿Esta seguro que que desea eliminar producto?",
        icon:  "warning",
        showCancelButton: true,
        confirmButtonColor: "#0b892c",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, Aprobar!",
      }).then((result) => {
        if (result.isConfirmed) {
            this.axios
                .delete(`api/eliminarProductoSistema/`+datos.id_producto)
                .then((res) => {
                    
                    console.log(res);
                    return;
                        Swal.fire({
                            icon: 'success',
                            title: 'Pago realizado exitosamente',
                            text: res.data.mensaje,
                            timer: 3500,
                            showConfirmButton: false
                        });
                    

                })
                .catch((error) => {
                    console.log("error", error);
                });
        }
      });
    },
  },
};
