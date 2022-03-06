import Swal from "sweetalert2";
import Layout from "../../layouts/main";
import Multiselect from "vue-multiselect";
export default {
    components: {
      Layout,
      Swal,
      Multiselect
    },
    data() {
      return { 
        infoEmpresa: JSON.parse(localStorage.getItem("globalEmpresasSelected")),
        
        optionsOrigen: [],
        optionsDestino: [],
        formComprobante: {
          empresa: "",
          n_encabezado: "",
          proveedor: "",
          f_emision: "",
          idInfo: "",
          fechaDocumento: "",
          origen: "",
          destino: "",
        },
        formComprobanteDebito: {
          empresa: "",
          n_encabezado: "",
          proveedor: "",
          f_emision: "",
          idInfo: "",
          fechaDocumento: "",
          origen: "",
          destino: "",
        },
        tableData: [],  
        title: "Empresas",
        items: [
          {
            text: "Tables",
          },
          {
            text: "Empresas",
            active: true,
          },
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [10, 25, 50, 100],
        filter: null,
        filterOn: [],
        sortBy: "tipo empresa",
        sortDesc: false,
        fields: [
           "acción",
          {
            label: "Tipo",
            key: "tipo",
            sortable: true,
          },
          {
            label: "N° Compra",
            key: "encabezado",
            sortable: true,
          },
          {
            label: "Gloca",
            key: "glosa",
            sortable: true,
          },
          {
            label: "Proveedor",
            key: "proveedorName",
            sortable: true,
          },
          {
            label: "Total",
            key: "total",
            sortable: true,
          },
          {
            label: "Fecha Emisión",
            key: "fecha_emision",
            sortable: true,
          },
          {
            label: "Estado",
            key: "estado",
            sortable: true,
          },
        ],
      };
    }, 
    
    mounted() {
        this.axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
        this.totalRows = this.items.length;
        this.getInicial();
    },
    methods: {

        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },  

        getInicial()
        {
            this.axios
                .get(`/api/getDocumentoEmitir/`+this.infoEmpresa.id_empresa)
                .then((res) => {
                    this.tableData = res.data.datos;
                        res.data.datos.map((p) => {
                            p['tipo']    = p.documento_tributario.tipo;
                            p['total']          = '$ '+p.total_documento;
                            p['proveedorName'] = p.encabezado.proveedor.razon_social;
                            p['encabezado'] = p.encabezado.num_encabezado;
                            if(p.estado_id == 13){ p["estado"]  = "APROBADO";}else{ p["estado"]  = "-";}
                            
                            return p;
                        });

                        res.data.cuentas.map((p) => {
                          if (p.manual_cuenta != null) {
                              p["codigo"] = "(S) " + p.manual_cuenta.codigo;
                              p["nombre"] = p.manual_cuenta.nombre;
                          } else if (p.mi_manual_cuenta != null) {
                              p["codigo"] = "(M) " + p.mi_manual_cuenta.codigo;
                              p["nombre"] = p.mi_manual_cuenta.nombre;
                          }
  
                          return p;
                        });

                    this.optionsOrigen = res.data.cuentas;
                    this.optionsDestino = res.data.cuentas;
                })
                .catch((error) => {
                console.log("error", error);
                const title = "Crear subnivel";
                const message = "Error al crear el subnivel";
                const type = "error";
    
                this.modal = false;
                this.$v.form.$reset();
    
                this.successmsg(title, message, type);
                });
        },
        
        emitirDocumento(documento)
        {   

          this.axios
          .get(`/api/MueveExistenciaComprobar/`+documento)
          .then((res) => {
          
              if(res.data == 1){
                this.$router.push('../emitirDocumentoExistencia/'+documento)
              }else{
                Swal.fire({
                  title: 'Emitir Documento',
                  text: "¿Esta seguro que quiere emitir este documento?, luego no podra modificarlo.",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#0b892c',
                  cancelButtonColor: '#d33',
                  cancelButtonText: "Cancelar",
                  confirmButtonText: 'Si, Emitir!',
                }).then((result) => { 
                  if (result.isConfirmed) {
                      this.axios
                      .get(`/api/emitirDocumento/`+documento)
                      .then((res) => {
                        if(res.data.estado == 1) //SI ES IGUAL A UNO HAY QUE CREAR COMPROBANTE PARA LA NOTA DE CREDITO
                        {  
                          this.$refs['my-modal'].show();
                          
                          this.formComprobante.empresa            = this.infoEmpresa.id_empresa;
                          this.formComprobante.n_encabezado       = res.data.n_encabezado;
                          this.formComprobante.proveedor          = res.data.proveedor;
                          this.formComprobante.idInfo             = res.data.idInfoDoc;
                          this.formComprobante.fechaDocumento     = res.data.fechaDocumento;

                        }else if(res.data.estado == 2){//SI ES IGUAL A DOS HAY QUE CREAR COMPROBANTE PARA LA NOTA DE DEBITO
                          console.log(res.data);
                          this.$refs['my-modalDebito'].show();
                          
                          this.formComprobanteDebito.empresa            = this.infoEmpresa.id_empresa;
                          this.formComprobanteDebito.n_encabezado       = res.data.n_encabezado;
                          this.formComprobanteDebito.proveedor          = res.data.proveedor;
                          this.formComprobanteDebito.idInfo             = res.data.idInfoDoc;
                          this.formComprobanteDebito.fechaDocumento     = res.data.fechaDocumento;
                        }else{
                          Swal.fire({
                            icon: 'success',
                            title: 'Emisión de Documento',
                            text: res.data.mensaje,
                            timer: 1500,
                            showConfirmButton: false
                          });
                          this.getInicial();
                        }
                          
                      })
                      .catch((error) => {
                        console.log("error", error);
                        const title = "Documento Tributario";
                        const message = "haasa";
                        const type = "error";
          
                        this.modal = false;
                        this.$v.form.$reset();
          
                        this.successmsg(title, message, type);
                      });
                  }
                });

              }
          })
          .catch((error) => {
            console.log("error", error);
          });
        },
  
        formComprobanteSubmit()
        {
          if(this.formComprobante.f_emision < this.formComprobante.fechaDocumento){
            Swal.fire({
              icon: 'warning',
              title: 'Fecha emisión',
              text: "Fecha de emisión no puede ser menor a la fecha de emisión del documento.",
              timer: 4500,
              showConfirmButton: false
            });
            return false;
          }else{
            Swal.fire({
              title: "Crear comprobante & Emitir Documento",
              text: "¿Esta seguro que desea emitir este documento?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#0b892c",
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancelar",
              confirmButtonText: "Si, Aprobar!",
            }).then((result) => {
              if (result.isConfirmed) { 
                  this.axios
                      .post(`api/crearComprobanteCompra`, this.formComprobante)
                      .then((res) => {
                          
                          if(res.data.estado == 1){

                              Swal.fire({
                                  icon: 'warning',
                                  title: 'Cuentas',
                                  text: "Debes seleccionar cuenta de origen y destino.",
                                  timer: 4500,
                                  showConfirmButton: false
                              });

                          }else{
                              this.getInicial();

                              this.$refs['my-modal'].hide();

                              this.formComprobante.empresa = "";
                              this.formComprobante.n_encabezado = "";
                              this.formComprobante.id_documento = "";
                              this.formComprobante.proveedor = "";
                              this.formComprobante.f_emision = "";
                              this.formComprobante.idInfo = "";
                              this.formComprobante.fechaDocumento = "";
                              this.formComprobante.origen = "";
                              this.formComprobante.destino = "";

                              Swal.fire({
                                  icon: 'success',
                                  title: res.data,
                                  text: res.data.mensaje,
                                  timer: 3500,
                                  showConfirmButton: false
                              });
                          }

                      })
                      .catch((error) => {
                          console.log("error", error);
                      });
              }
            });
          }

        },

        formComprobanteDebitoSubmit()
        {
          if(this.formComprobanteDebito.f_emision < this.formComprobanteDebito.fechaDocumento){
            Swal.fire({
              icon: 'warning',
              title: 'Fecha emisión',
              text: "Fecha de emisión no puede ser menor a la fecha de emisión del documento.",
              timer: 4500,
              showConfirmButton: false
            });
            return false;
          }else{
            Swal.fire({
              title: "Crear comprobante & Emitir Documento",
              text: "¿Esta seguro que desea emitir este documento?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#0b892c",
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancelar",
              confirmButtonText: "Si, Aprobar!",
            }).then((result) => {
              if (result.isConfirmed) { 
                  this.axios
                      .post(`api/crearComprobanteDebitoCompra`, this.formComprobanteDebito)
                      .then((res) => {
                          
                          if(res.data.estado == 1){

                              Swal.fire({
                                  icon: 'warning',
                                  title: 'Cuentas',
                                  text: "Debes seleccionar cuenta de origen y destino.",
                                  timer: 4500,
                                  showConfirmButton: false
                              });

                          }else{
                              this.getInicial();

                              this.$refs['my-modalDebito'].hide();

                              this.formComprobanteDebito.empresa = "";
                              this.formComprobanteDebito.n_encabezado = "";
                              this.formComprobanteDebito.id_documento = "";
                              this.formComprobanteDebito.proveedor = "";
                              this.formComprobanteDebito.f_emision = "";
                              this.formComprobanteDebito.idInfo = "";
                              this.formComprobanteDebito.fechaDocumento = "";
                              this.formComprobanteDebito.origen = "";
                              this.formComprobanteDebito.destino = "";

                              Swal.fire({
                                  icon: 'success',
                                  title: res.data,
                                  text: res.data.mensaje,
                                  timer: 3500,
                                  showConfirmButton: false
                              });
                          }

                      })
                      .catch((error) => {
                          console.log("error", error);
                      });
              }
            });
          }

        },


    },
    
  };