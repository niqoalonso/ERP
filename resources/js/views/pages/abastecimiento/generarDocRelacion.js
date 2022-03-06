import Layout from "../../layouts/main";
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";
import detalle from "./detalle";


//import { required, numeric } from "vuelidate/lib/validators";
export default {
  components: { Layout, Swal, Multiselect },

  data() {
    return {    
        proveedores: [],
        unidades: [],
        productos: [],
        centros: [],
        detalleDebito: [],
        detalles: [],
        detalleNotaCredito: [],
        detallesSelect: [],
        existeDetalle: 0,
        tipoImpuesto: '',
        m_afecto: 0,
        m_iva: 0, 
        retenciones: 0,
        total: 0,
        afectoIva: "",
        submitted: false,
        inputFechaVencimiento: true,
        buttonAnulacion: false,
        buttonDebito: false,
        idDocumento: "",
        guardarDetalle: {
          detalles: [],
          m_afecto: 0,
          m_iva: 0,
          retenciones: 0,
          total: 0,
          documento: '',
        },
        modal: false,
        modalDebito: false,
        titlemodaldebito: "Nuevo Detalle",
        titlemodal: "Detalle Compra",
        existencia: "",

        typeform: "create",
        buttonForm: true,
        
        documentoName: "",

        form : {
            documento_id: "",
            n_documento: "",
            proveedor: "",
            fechadoc: "",
            fechaven: "",
            glosa: "",
            direccion: "",
            unidad: "",
            idEncabezado: "",
            infoEmpresa: JSON.parse(localStorage.getItem("globalEmpresasSelected")),
        },

        formDetalle: {
            sku: "",
            producto: "",
            cantidad: "",
            precio: "",
            descuento_porcentaje: "",
            precio_descuento: "",
            descripcion: "",
            descripcion_adicional: "",
            total: "",
            centrocosto_id: "",
        },

        formInformacion: {
            informacion: "",
            detalle: "",
        },

        formAddDetalle: {
          detalle: "",
          cantidad: "",
        },

        formAddDebito: {
          descripcion: "",
          cantidad: "",
          precio: "",
          porcentaje_descuento: "",
          precio_descuento: "",
        },
    };
    
  },

  middleware: "authentication",

  mounted() {
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    this.getInicial();
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Documento listo para agregar detalles.'
    })
},

methods: {

    customLabel({ producto, cantidad }) {
      return `${producto.nombre} - ${cantidad} Unidades`;
    },
   
    getInicial()
    {   
        this.axios
            .get(`/api/generarInfoDocumentoRelacionado/`+this.$route.params.documento+'/'+this.$route.params.tipo)
            .then((res) => {
                console.log(res.data);
                this.documentoName = res.data.documentoT.descripcion;

                this.form.documento_id = res.data.informacion.id_info;
                this.form.n_documento =  res.data.informacion.n_documento;
                this.form.proveedor = res.data.informacion.encabezado.proveedor.razon_social;
                this.form.glosa = res.data.informacion.glosa;
                this.form.direccion = res.data.informacion.encabezado.proveedor.direccion;
                this.form.unidad = res.data.informacion.encabezado.unidad_negocio.nombre;
                this.form.idEncabezado = res.data.informacion.encabezado.id_encabezado;
                this.form.NumEncabezado = res.data.informacion.encabezado.num_encabezado;
                this.idDocumento = res.data.informacion.id_info;
                if(res.data.documentoT.f_vencimiento == 1){ this.inputFechaVencimiento= true; }else if(res.data.documentoT.f_vencimiento == 2){ this.inputFechaVencimiento = false;}
                
               
                if(res.data.anulacion == 1){
                  this.buttonAnulacion = true;
                  this.buttonDebito = false;
                  this.detallesSelect  = res.data.informacion.detalle_documento;
                }else if(res.data.debito == 1){
                  this.buttonAnulacion = false;
                  this.buttonDebito = true;
                }else{
                  this.buttonAnulacion = false;
                  this.buttonDebito = false;
                  if(res.data.informacion.total_afecto != null){ this.m_afecto = res.data.informacion.total_afecto; }
                  if(res.data.informacion.total_iva != null){ this.m_iva = res.data.informacion.total_iva; }
                  if(res.data.informacion.total_retenciones != null){ this.retenciones = res.data.informacion.total_retenciones; }
                  if(res.data.informacion.total_documento != null){ this.total = res.data.informacion.total_documento; }

                  this.detalles = res.data.informacion.detalle_documento;
                }
 
            })
            .catch((error) => {
              console.log("error", error);
            });
    },

    GenerarDocumento()
    { 

      if(this.buttonAnulacion == true){
        if(this.detalleNotaCredito.length == 0){
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        
          Toast.fire({
              icon: 'warning',
              title: "Debes tener minimo un detalle agregado al documento."
          });
          return false;
        }
        
      }else if(this.buttonDebito == true){
        if(this.detalleDebito.length == 0){
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        
          Toast.fire({
              icon: 'warning',
              title: "Debes tener minimo un detalle agregado al documento."
          });
          return false;
        }
      }else{
        if(this.detalles.length == 0){
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        
          Toast.fire({
              icon: 'warning',
              title: "Debes tener minimo un detalle agregado al documento."
          })
          return false;
        }
      }
  
        if(this.inputFechaVencimiento == true){
          if(this.form.fechaven.length < 1){
            Swal.fire({
              icon: 'warning',
              title: 'Fecha vencimiento',
              text: "Debe ingresar una fecha de vencimiento",
              timer: 1500,
              showConfirmButton: false 
            });
            return false;
          }
        }

        if(this.form.fechadoc.length < 1){
          Swal.fire({
            icon: 'warning',
            title: 'Fecha emisión',
            text: "Debe ingresar una fecha de emisión",
            timer: 1500,
            showConfirmButton: false
          });
          return false;
        }

        if(this.inputFechaVencimiento == true){
          if(this.form.fechadoc > this.form.fechaven){
            Swal.fire({
              icon: 'warning',
              title: 'Fechas Denegadas',
              text: "Fecha vencimiento no puede ser menor a la fecha de emisión",
              timer: 1500,
              showConfirmButton: false
            });
            return false;
          }
        }

        if(this.buttonAnulacion == true){
          this.guardarDetalle = {
            documento_id: this.form.documento_id,
            encabezado_id: this.form.idEncabezado,
            detalles: this.detalleNotaCredito,
            info_id: this.idDocumento,
            m_afecto: this.m_afecto,
            m_iva: this.m_iva,
            retenciones: this.retenciones,
            total: this.total, 
            informacion: this.form, 
            tipoDocumento: this.$route.params.tipo,
            empresa_id: this.form.infoEmpresa.id_empresa, 
            anulacion: 1,
          }
        }else if(this.buttonDebito == true){

          this.guardarDetalle = {
            documento_id: this.form.documento_id,
            encabezado_id: this.form.idEncabezado,
            detalles: this.detalleDebito,
            info_id: this.idDocumento,
            m_afecto: this.m_afecto,
            m_iva: this.m_iva,
            total: this.total, 
            informacion: this.form, 
            tipoDocumento: this.$route.params.tipo,
            empresa_id: this.form.infoEmpresa.id_empresa, 
            debito: 1,
          }

        }else{
          this.guardarDetalle = {
            documento_id: this.form.documento_id,
            encabezado_id: this.form.idEncabezado,
            detalles: this.detalles,
            info_id: this.idDocumento,
            m_afecto: this.m_afecto,
            m_iva: this.m_iva,
            retenciones: this.retenciones,
            total: this.total, 
            informacion: this.form, 
            tipoDocumento: this.$route.params.tipo,
            anulacion: 0,
            
          }
        }
        
        this.axios
            .post(`/api/generarDocumentoPosterior/`, this.guardarDetalle)
            .then((res) => {
                // console.log(res);
                // return false;
                if(res.data.estado == 1){
                  Swal.fire({
                      icon: 'success',
                      title: 'Documento Tributario',
                      text: res.data.mensaje,
                      timer: 1500,
                      showConfirmButton: false
                  });
                }else if(res.data.estado == 0){
                  Swal.fire({
                    icon: 'warning',
                    title: 'Fecha emisión',
                    text: res.data.mensaje,
                    timer: 4500,
                    showConfirmButton: false
                });
                }else if(res.data.estado == 2){
                  Swal.fire({
                      icon: 'error',
                      title: 'Documento Tributario',
                      text: res.data.mensaje,
                      timer: 4500,
                      showConfirmButton: false
                  });
                }else if(res.data.estado == 3){
                  Swal.fire({
                    icon: 'error',
                    title: 'Existencia',
                    text: res.data.mensaje,
                    timer: 4500,
                    showConfirmButton: false
                });
                }
            })
            .catch((error) => {
              console.log("error", error);
            });
      
    },

    modalNuevo() {
      this.modal = true;
    },

    modalNuevoDebito(){
        this.modalDebito = true;
    },

    addDetalle()
    {  
     
      if(this.formAddDetalle.cantidad > this.formAddDetalle.detalle.cantidad)
      {
        Swal.fire({
          icon: 'warning',
          title: 'Cantidad Producto',
          text: "La cantidad ingresada no puede ser mayor a la cantidad de la compra.",
          timer: 2500,
          showConfirmButton: false 
        });
        return false;
      }

      this.axios
        .get(`/api/checkStockExistencia/`+this.form.infoEmpresa.id_empresa+'/'+this.formAddDetalle.detalle.producto_id+'/'+this.form.idEncabezado)
        .then((res) => {
          if(res.data.existencia.control_stock < this.formAddDetalle.cantidad){
              Swal.fire({
                icon: 'warning',
                title: 'Existencia no disponible',
                text: "Cantidad de stock disponible en existencias es solo de "+res.data.cantidad+" unidades.",
                timer: 2500,
                showConfirmButton: false 
              });
              return false;
          }else{   

            var id = this.formAddDetalle.detalle.producto_id;
            var existeDetalle = 0;
            this.detalleNotaCredito.forEach( function(valor, indice, array) {
              if(valor.producto_id == id)
              { 
                existeDetalle = 1;
              }  
            });

            //Verificamos si el producto existe o no.
            if(existeDetalle == 1){
              existeDetalle = 0;
              Swal.fire({
                icon: 'warning',
                title: 'Producto',
                text: "Producto ya existe.",
                timer: 2500,
                showConfirmButton: false 
              });
              return false;
            } 
            
            var data = {'nombre': this.formAddDetalle.detalle.producto.nombre, 
                        'cantidad': this.formAddDetalle.cantidad,
                        'precio': this.formAddDetalle.detalle.precio,
                        'descuento_porcentaje': this.formAddDetalle.detalle.descuento_porcentaje,
                        'precio_descuento': this.formAddDetalle.detalle.precio_descuento,
                        'total': this.formAddDetalle.detalle.precio*this.formAddDetalle.cantidad,
                        'id_detalle': this.formAddDetalle.detalle.id_detalle,
                        'producto_id': this.formAddDetalle.detalle.producto_id,
                        'sku': this.formAddDetalle.detalle.sku,
                        'descripcion_adicional': this.formAddDetalle.detalle.descripcion_adicional,
                        'centrocosto_id': this.formAddDetalle.detalle.centrocosto_id,
                        'existencia_id': res.data.existencia_id};

            this.m_afecto = this.m_afecto+this.formAddDetalle.detalle.precio*this.formAddDetalle.cantidad;
            this.total = Math.round(this.m_afecto*1.19);
            this.m_iva = Math.round(this.m_afecto*0.19);

            this.modal = false;

            Swal.fire({
              icon: 'success', 
              title: 'Producto',
              text: "Producto agregado exitsamente.",
              timer: 1500,
              showConfirmButton: false
          });

            this.detalleNotaCredito.push(data);

            this.formAddDetalle = {
                detalle: "",
                cantidad: "",
            }
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
      
    },

    formSubmitDebito()
    {     
          console.log(this.formAddDebito.precio_descuento > 0);
          if(this.formAddDebito.precio_descuento.length != 0){
            var data = {'descripcion': this.formAddDebito.descripcion, 
                        'cantidad': this.formAddDebito.cantidad,
                        'precio': this.formAddDebito.precio,
                        'descuento_porcentaje': this.formAddDebito.porcentaje_descuento,
                        'precio_descuento': this.formAddDebito.precio_descuento,
                        'total': this.formAddDebito.precio_descuento*this.formAddDebito.cantidad,
                       };
          }else{
            var data = {'descripcion': this.formAddDebito.descripcion, 
                        'cantidad': this.formAddDebito.cantidad,
                        'precio': this.formAddDebito.precio,
                        'descuento_porcentaje': null,
                        'precio_descuento': null,
                        'total': this.formAddDebito.precio*this.formAddDebito.cantidad,
                       };
          }
              
          if(this.formAddDebito.precio_descuento.length > 0){
            this.m_afecto = this.m_afecto+this.formAddDebito.precio_descuento*this.formAddDebito.cantidad;
          }else{
            this.m_afecto = this.m_afecto+this.formAddDebito.precio*this.formAddDebito.cantidad;
          }
            this.total = Math.round(this.m_afecto*1.19);
            this.m_iva = Math.round(this.m_afecto*0.19);

            this.detalleDebito.push(data);

            this.modalDebito = false;

            this.formAddDebito = {
              descripcion: "",
              cantidad: "",
              precio: "",
              porcentaje_descuento: "",
              precio_descuneto: "",
            }

            Swal.fire({
              icon: 'success', 
              title: 'Detalle',
              text: "Agregado exitosamente.",
              timer: 1500,
              showConfirmButton: false
          });
    },

    LimpiarInputDebito()
    {
        this.formAddDebito.porcentaje_descuento = "";
        this.formAddDebito.precio_descuento = "";
    },

    LimpiarInputCantidadDebito()
    {
      this.formAddDebito.porcentaje_descuento = "";
      this.formAddDebito.precio_descuento = "";
    },

    calcularDescuentoDebito()
    {
      if(this.formAddDebito.porcentaje_descuento > 100){
        this.formAddDebito.porcentaje_descuento = "";
        this.formAddDebito.precio_descuento = "";
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
      })
      
      Toast.fire({
          icon: 'warning',
          title: "Maximo 100% descuento."
      })
      }else{
        console.log("aqui");
        this.formAddDebito.precio_descuento = this.formAddDebito.precio-(Math.round(this.formAddDebito.precio*this.formAddDebito.porcentaje_descuento/100));
      }
    },

    deleteEvent: function(index, precio) {
      this.m_afecto = this.m_afecto-precio;
      this.total = Math.round(this.m_afecto*1.19);
      this.m_iva = Math.round(this.m_afecto*0.19);

      this.detalleNotaCredito.splice(index, 1);
    },

    deleteEventDebito: function(index, precio) {
      this.m_afecto = this.m_afecto-precio;
      this.total = Math.round(this.m_afecto*1.19);
      this.m_iva = Math.round(this.m_afecto*0.19);

      this.detalleDebito.splice(index, 1);
    }

},
};