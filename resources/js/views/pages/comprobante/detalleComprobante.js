import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import Vue from 'vue';


import { required, numeric} from "vuelidate/lib/validators";
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
        idComprobante: this.$route.params.codigo,  
        cuenta: "",
        centro: "",
        unidad : "",
        glosa: "",
        deber: 0,
        haber: 0,
      },
      info:{
        glosa: "",
        fecha_comprobante: "",
        tipocomprobante: "",
        debe: "",
        haber: "",
      },
      id: this.$route.params.codigo,
      idEmpresa: JSON.parse(Vue.prototype.$globalEmpresasSelected),
      cuentas: [],
      centros: [], 
      
      submitted: false,
      typeform: "create", 
      divButton: true, //Para actualizar y crear

      // permiso

      crearproveedor: this.$CrearProveedor,
      listarproveedor: this.$ListarProveedor,
      editarproveedor: this.$EditarProveedor,
      eliminarproveedor: this.$EliminarProveedor,

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
          label: "Glosa",
          key: "glosa",
          sortable: true,
        },
        {
          label: "Cuenta Contable",
          key: "cuenta",
          sortable: true,
        },
        {
          label: "Centro Costos",
          key: "centro",
          sortable: true,
        },
        {
            label: "Debe",
            key: "debe",
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
  validations: {
    form: {
      glosa: {
        required,
      },
      cuenta: {
        required,
      },
      centro: {
        required,
      },
      deber: {
        numeric,
      },
      haber: {
        numeric,
      },
      idComprobante: {
        required,
      }

    },
  },

  mounted() {
    this.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;
    this.traerData();
    this.traerDetalleComprobantes();

    this.totalRows = this.items.length;
    
  },
  methods: {

    traerData() {
      this.axios
        .get(`/api/getInicial/`+this.id+'/'+this.idEmpresa.id_empresa)
        .then((response) => {
            
            this.info.tipocomprobante = response.data.info.tipo_comprobante.nombre;
            this.info.glosa = response.data.info.glosa;
            this.info.fecha_comprobante = response.data.info.fecha_comprobante;
            this.info.unidadnegocio = '('+response.data.info.unidad_negocio.codigo+') '+response.data.info.unidad_negocio.nombre;
            this.info.deber = response.data.info.deber;
            this.info.haber = response.data.info.haber;
            
            response.data.cuentas.map((p) => {
              if (p.manual_cuenta != null) {
                  p["codigo"] = "(S) " + p.manual_cuenta.codigo;
                  p["nombre"] = p.manual_cuenta.nombre;
              } else if (p.mi_manual_cuenta != null) {
                  p["codigo"] = "(M) " + p.mi_manual_cuenta.codigo;
                  p["nombre"] = p.mi_manual_cuenta.nombre;
              }

              return p;
            });

            this.cuentas = response.data.cuentas;
            this.centros = response.data.centros;
            this.form.unidad = '('+response.data.info.unidad_negocio.codigo+') '+response.data.info.unidad_negocio.nombre;
        });
    },

    traerDetalleComprobantes() {
        this.axios
          .get(`/api/getdetalle/`+this.id)
          .then((response) => {
              
              response.data.map((p) => {
                if(p.plan_cuenta['manual_cuenta'] != null){
                    p["cuenta"] = p.plan_cuenta['manual_cuenta']['nombre'];  
                }else{
                    p["cuenta"] = p.plan_cuenta['mi_manual_cuenta']['nombre'];  
                }
                p["centro"] = p.centro_costo.nombre;
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

    customLabel({nombre}) {
      return nombre;
    },

    customLabelCosto({ nombre}) {
        return nombre;
    },

    formSubmit() {
      
      this.submitted = true;

      this.$v.$touch();
 
      if (!this.$v.$invalid) {
        if (this.typeform == "create") {
          this.axios
            .post(`/api/store`, this.form)
            .then((res) => {
              this.info.deber = Math.round(parseInt(this.info.deber)+(parseInt(this.form.deber)));
              this.info.haber = Math.round(parseInt(this.info.haber)+(parseInt(this.form.haber)));
              if (res.data.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Nuevo Detalle',
                  text: "Detalle a sido agregado al comprobante actual.",
                  timer: 3500,
                  showConfirmButton: false
                });

                this.form = {
                    idComprobante: this.$route.params.codigo,
                    centro: "",
                    cuenta: "",
                    glosa: "",
                    deber: 0,
                    haber: 0,
                };

                this.$v.form.$reset();
                this.traerData();
                this.traerDetalleComprobantes();
        
              }
            })
            .catch(error => {
                console.clear();
            });
        } else if (this.typeform == "edit") {
          this.axios
            .put(
              `${this.urlbackend}/proveedor/updateProveedor/${this.form.id_proveedor}`,
              this.form
            )
            .then((res) => {
              if (res.data.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Proveedor',
                  text: "Actualizado Exitosamente",
                  timer: 3500,
                  showConfirmButton: false
                });
              
                this.form = {
                  id_proveedor: "",
                  rut: "",
                  nombre: "",
                  celular: "",
                  correo: "",
                  direccion: "",
                  giro: "",
                };

                this.traerData();
                this.$v.form.$reset();
                this.divButton = true,

                $('.inputRUT').attr('style', 'border: 1px solid #ced4da !important');
                $('.btnSubmit').prop('disabled',  true);
              }
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

    editar(datos) {
      this.typeform = "edit";
      this.form.id_proveedor  = datos.id_proveedor;
      this.form.rut           = datos.rut;
      this.form.nombre        = datos.razon_social;
      this.form.celular       = datos.celular;
      this.form.correo        = datos.email;
      this.form.direccion     = datos.direccion;
      this.form.giro          = datos.giro;
      this.divButton = false;
    },

    cancelar()
    {
      this.form = {
        id_proveedor: "",
        rut: "",
        nombre: "",
        celular: "",
        correo: "",
        direccion: "",
        giro: "",
      };
      this.divButton = true;
      this.typeform = "create";
    },

    EliminarDetalle(detalle)
        {   
            Swal.fire({
                title: 'Eliminar Detalle',
                text: "¿Esta seguro que quiere eliminar este detalle?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#0b892c',
                cancelButtonColor: '#d33',
                cancelButtonText: "Cancelar",
                confirmButtonText: 'Si, Eliminar!',
              }).then((result) => { 
                if (result.isConfirmed) {
                    this.axios
                    .delete(`/api/deleteDetalle/`+detalle.id_detallecomprobante)
                    .then((res) => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Detalle Comprobante',
                        text: res.data,
                        timer: 3500,
                        showConfirmButton: false
                      });
                    
                      if(detalle.debe > 0)
                      { 
                        this.info.deber = Math.round(parseInt(this.info.deber)-(parseInt(detalle.debe)));
                        
                      }else if(detalle.haber > 0)
                      { 
                        this.info.haber = Math.round(parseInt(this.info.haber)-(parseInt(detalle.haber)));
                      }
                      this.traerDetalleComprobantes();
                        
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
