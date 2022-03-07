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
        n_interno: this.$route.params.documento, 
        detalles: [],  
        selectExistencias: [], 
        tarjetas: [],
        nombreTarjeta: [],
        moverExistencia: [],
        documentoName: "",
        typeform: "create", 
        aprobacion: 0,
        buttonForm: true,
        infoEmpresa: JSON.parse(localStorage.getItem("globalEmpresasSelected")),
        form: { 
            documento: "",
            empresa: "",
            moverExistencia: [],
        }
      };
    },
    
    mounted() {
        this.axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
        this.getInformacionInicial();
    },
    methods: {

        getInformacionInicial()
        { 
          this.axios
            .get(`/api/getDetalleExistencia/`+this.n_interno+'/'+this.infoEmpresa.id_empresa)
            .then((res) => {
                this.form.documento = res.data.info.id_info;
                this.form.empresa = this.infoEmpresa.id_empresa;
                console.log(res.data.detalles);
                this.detalles = res.data.detalles;
                this.documentoName = res.data.info.documento_tributario.descripcion;
                var info = {'id_tarjeta': 0, 'nombre': 'Nueva existencia'};
                var array = res.data.existencias;
                array.push(info);   
                array.reverse();             
                
                this.selectExistencias = array;
                
            })
            .catch((error) => {
              console.log("error", error);
            });
        },

        nameTarjeta(data)
        {       
            this.axios
                .get(`/api/checkNameTarjeta/`+data.target.value+'/'+this.infoEmpresa.id_empresa)
                .then((res) => {
                    if(res.data == 1){
                        var name = document.getElementById(data.target.id);
                        name.value = "";
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
                            title: "Nombre de tarjeta ya existe, probar con otro nombre.",
                        })
                    }
                    
                })
            .catch((error) => {
              console.log("error", error);
            });
        },


        formSubmit() {

            this.aprobacion = 0;
            this.moverExistencia = [];

            this.detalles.forEach(element => {
                if(element.tarjeta  == 2){
                    if(this.nombreTarjeta[element.id_detalle].length == 0){
                        Swal.fire({
                            icon: 'warning',
                            title: 'Nombre Tarjeta',
                            text: 'Debes ingresar el nombre de la nueva tarjeta.',
                            timer: 2500,
                            showConfirmButton: false
                        });
                        this.aprobacion++;
                        return false;
                    }
                }
                
            });

            if(this.aprobacion == 0)
            {
                
                this.form.nombreTarjeta = this.nombreTarjeta;
       
                this.axios
                .post(`/api/emitirDocumentoWithExistencia/`, this.form)
                .then((res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Existencia y Documento emitido.',
                        text: res.data.mensaje,
                        timer: 3500,
                        showConfirmButton: false
                    });
                    this.$router.push('../emitirDocumento'); 
                    
                })
                .catch((error) => {
                    console.log("error", error);
                });
            }

        },

    },
    
  };