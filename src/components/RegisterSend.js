import React, { useEffect, useRef, useState } from 'react'
import { formatNumber } from '../helpers/formatNumbers.js';
import { addDiscountPurchase } from '../helpers/addDiscountPurchase.js';

export const RegisterSend = ({discountPurchase, setDiscountPurchase, totalDiscount, setTotalDiscount, iva, setTotal, total, subtotal, productsCart, setProductsCart, setAlertSuccess, setBlockOptions}) => {

    const URL_CLIENTS = "https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Clientes_Report";
    const URL_CITIES = "https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Municipio1";

    //const [clients, setClients] = useState([]);

    const [error, setError] = useState('');
    const [dataUser, setDataUser] = useState(null);
    const [enableRegister, setEnableRegister] = useState(false);
    const [cities, setCities] = useState('');
    const [citiesDep, setCitiesDep] = useState('');
    const [departaments, setDepartaments] = useState('');
    const [errors, setErrors] = useState([]);
    const [formWompi, setFormWompi] = useState();
    const [idCliente, setIdCliente] = useState('');
    const [loadSuccess, setLoadSuccess] = useState(false);
    const [dataSend, setDataSend] = useState('');
    const [dataInfo, setDataInfo] = useState('');
    const [dataInfoJSON, setDataInfoJSON] = useState('');

    const discountCoupon = useRef();

    const verifyUser = async(e) => {
       

        e.preventDefault();
        let id = e.target.document_id.value;
        let tipo = e.target.type_document.value;
        
        let exist = false;
        let errorMessage = '';

        let load = document.querySelector('.load-send');
        

     

        if ( id.length === 0 ) {
            errorMessage = 'Campo vacío, ingresa tu documento';
           
        }

        if ( tipo.length === 0 || tipo === 'Tipo') {
            errorMessage = 'Campo vacío, ingresa el tipo de documento';
           
        }

        if (id.length > 11) {
            errorMessage = 'El campo no puede tener más de 11 dígitos';
            console.log("mayor");
        }

        setAlertSuccess(false);
    if (errorMessage.length === 0) {
        load.classList.add('show');
        await fetch(URL_CLIENTS + `?where=Documento%3D%3D%22${id}%22`)
        .then(response => response.json())
        .then(data => {

                let client_exists = '';
                
                if (data.length !== undefined) {
                    data.map(client => {
                        if (client.Documento === id) {
                            exist = true;
                            setDataUser(client);
                            client_exists = client;
                            setIdCliente(client.ID);
                        }   
                    });
                }

      
                
                if (exist) {
                    setAlertSuccess(true); 
                    let form_send = document.querySelector('#form-datos-envio');
                    let form_resumen = document.querySelector('#form-resumen-compra');
                    
                    form_send.classList.add('show');
                    form_resumen.classList.add('hide');

                    setEnableRegister(false);

                    let list_cities = [];
                    cities.map( city => {
                        console.log()
                        if (client_exists !== null && city.Codigo_Deapartamento === client_exists.Departamento1.Codigo_Deapartamento) {
            
                            list_cities.push(city);
            
                        }
                    });
                    
                   // console.log(dataUser);

                    setCitiesDep(list_cities);

                

                }else{
                 
                    let form_send = document.querySelector('#form-datos-envio');
                    let form_resumen = document.querySelector('#form-resumen-compra');
                    
                    form_send.classList.add('show');
                    form_resumen.classList.add('hide');

                    setEnableRegister(true);
                    setDataUser(null);

                    //Activado solo para cuando no exista un cliente
                    const alert = document.querySelector('.alert');
                    const progress = document.querySelector('.alert-progress');
            
                    alert.classList.add('active');
                    progress.classList.add('active');
            
                    setTimeout( () => {
                        alert.classList.remove('active');  
                        progress.classList.remove('active');         
                    }, 4000)
                }
    
                setBlockOptions(true);

                setError('');       

                
        

            load.classList.remove('show');
        });/* .catch(error => {
                setAlertSuccess(false);
                
                console.log(error);
        }); */

       
        }

        setError(errorMessage);
    }
    

    const orders = async(e) => {

        e.preventDefault();

        const data = e.target;  

        let type_document = document.querySelector('#type_document').value;
        let document_id = document.querySelector('#document_id').value;

        let city_api = '';

        let verify = verifyInputs(data);

        let city = citiesDep.filter( city => {

            city_api = city.ID;

           return city.Codigo_Municipio === data.ciudad.value;
        });
        let departament = departaments.filter( departament => departament.id === data.departamento.value);


        
        city.map( city => {
            city_api = city.ID.toString();
        })
 

        if (verify) {

            const detailOrder = {
                Direccion: data.direccion.value, 
                Ciudad: city_api
                
            };

            setDataInfo(`ID cliente: ${idCliente}`);

            setDataSend(detailOrder);

            const cont_success = document.querySelector('#detail-success');
            const trama = document.querySelector('.trama');
            const cart = document.querySelector("#cart");
            
    
            cart.classList.remove("open-cart");
                    
            trama.classList.add('open-trama');
            cont_success.classList.add('open');
            setTimeout( () => {
                trama.classList.add('open-trama-styles');
                cont_success.classList.add('show');
                
            }, 300);

            const data_json = {
                Fecha: new Date(),
                ID: parseInt(document_id),
                amount: total,
                E_Cormers: "1hr"
            }
    
             const config_json = {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_json)
            };

            const URL_SIGNATURE = 'https://berry-connect.accsolutions.tech/api/Signature';
            await fetch(URL_SIGNATURE, config_json)
            .then(res => res.json())
            .then(data_api => {
                setFormWompi([data_api]);
                console.log(data_api);

                
            });

            /* const URL_SIGNATURE = 'https://6064-190-0-247-116.ngrok-free.app/api/v1/api/Signature';
            const ngrok_API = await fetch(URL_SIGNATURE, config_json);
            const data_api = await ngrok_API.json();
            setFormWompi([data_api]);
           console.log(data_api); */ 

           //console.log(formWompi);
        }

       
    }  

    const registerClient = async(e) => {
        e.preventDefault();

        const data = e.target;

        let type_document = document.querySelector('#type_document').value;
        let document_id = document.querySelector('#document_id').value;

        let city_api = '';

        let verify = verifyInputs(data);

        let city = citiesDep.filter( city => {

            city_api = city.ID;

           return city.Codigo_Municipio === data.ciudad.value;
        });
        let departament = departaments.filter( departament => departament.id === data.departamento.value);


        
        city.map( city => {
            city_api = city.ID.toString();
        })
     

        if (verify) {
            const newClient = {
                Nombre: data.nombre.value,
                Primer_Apellido: data.apellido.value,
                Tipo1: type_document,
                Documento: document_id,
                Celular: data.telefono.value,
                Correo: data.correo.value,
                Retenedor: "No",
                Fecha_de_Nacimiento: data.fecha_nacimiento.value,
                //Segundo_Apellido: data.Segundo_Apellido.value,
                Acepta_que_la_factura_sea_enviada_por_medios_electr_nicos: "Si",
                Departamento1: city_api,
                Municipio: city_api,
                Regimen: data.tipo_persona.value,
                Estado: "Activo",
                Cupo: 0,
                Tipo: "Detal",
                Dias: 0,
                "Registro_externo": "Si",
                location: {
                    country2: "Colombia ",
                    address_line_12: data.direccion.value,
                    state_province2: city[0].Departamento,
                    district_city2: city[0].Municipio,
                    postal_Code2: "05001"
        
                }
                
            };

            setDataInfo(`N Documento: ${document_id} - Nombre: ${data.nombre.value} ${data.apellido.value}`);
            setDataInfoJSON(JSON.stringify(newClient));
            //dataInfo(`ID cliente: ${idCliente}`);

            const detailOrder = {
                Direccion: data.direccion.value,  
                Ciudad: city_api
            };

            setDataSend(detailOrder);

    
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newClient)
            };

            const cont_success = document.querySelector('#detail-success');
            const trama = document.querySelector('.trama');
            const cart = document.querySelector("#cart");
            
    
            cart.classList.remove("open-cart");
                    
            trama.classList.add('open-trama');
            cont_success.classList.add('open');
            setTimeout( () => {
                trama.classList.add('open-trama-styles');
                cont_success.classList.add('show');
                
            }, 300);
    
            await fetch('https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Clientes', config)
                .then(response => response.json())
                .then(data => {
                    console.log('Datos registrados correctamente:', data);
                    setIdCliente(data.ID);
                })
                .catch(error => {
                    console.error('Los datos no se registraron:', error.message);
                    //return error.text();
                })/* .then(errorMessage => {
                    console.error('Detalles del error:', errorMessage)
                }); */

            const data_json = {
                Fecha: new Date(),
                ID: parseInt(document_id),
                amount: total,
                E_Cormers: "1hr"
            }
    
            const config_json = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_json)
            };

            const URL_SIGNATURE = 'https://berry-connect.accsolutions.tech/api/Signature';
            await fetch(URL_SIGNATURE, config_json)
            .then(res => res.json())
            .then(data_api => {
                setFormWompi(data_api);
                console.log(data_api);

                
            });
    
          
        }
        
    }

    const getCities = (e) => {

        let departament = e.target.value; 

        let list_cities = [];
    
        cities.map( city => {

            if (city.Codigo_Deapartamento === departament) {

                list_cities.push(city);
                
            }

        });
        setCitiesDep(list_cities);

        
    }

    
    const returnFormSummary = () => {
        let form_send = document.querySelector('#form-datos-envio');
                    let form_resumen = document.querySelector('#form-resumen-compra');

        form_send.classList.remove('show');
        form_resumen.classList.remove('hide');

        setBlockOptions(false);
    }

    const verifyInputs = (input) => {
        
        let name = input.nombre.value; 
        let last_name = input.apellido.value;
        let email = input.correo.value;
        let phone = input.telefono.value;
        let departament = input.departamento.value;
        let city = input.ciudad.value;
        let address = input.direccion.value;
        let date_birth = input.fecha_nacimiento ? input.fecha_nacimiento.value : null;
        let type_person = input.tipo_persona ? input.tipo_persona.value : null;

        let errors = {};
 

        if ( name.length === 0 ) {
            errors.name = "El campo está vacío";
        }/* else if(!verifyContentNumbers(name)) {
            errors.name = "El campo no puede contener numeros";
        } */

        if ( last_name.length === 0 ) {
            errors.last_name = "El campo está vacío";
        }/* else if(!verifyContentNumbers(last_name)) {
            errors.last_name = "El campo no puede contener numeros";
        } */

        if (email.length === 0) {
            errors.email = "El campo está vacío";
        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Correo eletrónico no valido";
        }

        if ( phone.length === 0 ) {
            errors.phone = "El campo está vacío";
        }else if(verifyContentNumbers(phone)) {
            errors.phone = "El campo no puede contener letras";
        }

        if (departament.length === 0) {
            errors.departament = "El campo está vacío";
        }

        if (city.length === 0) {
            errors.city = "El campo está vacío";
        }

        if (address.length === 0) {
            errors.address = "El campo está vacío";
        }

        if (date_birth !== null && date_birth.length === 0) {
            errors.date_birth = "El campo está vacío";
         
        }

        if (type_person !== null && type_person.length === 0) {
            errors.type_person = "El campo está vacío";
        }

    

        setErrors(errors);

        if (Object.keys(errors).length !== 0) {
            return false;
        }

        return true;
 
        /* if (type === 'address') {
            
        }else{

        } */

    }

    const verifyContentNumbers = (text) => {

        return /^[a-zA-Z\s]+$/.test(text);
    }

    const dateNow = () => {
        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1; // Se suma 1 porque los meses van de 0 a 11
        const año = fechaActual.getFullYear();
        const fechaFormateada = `${año}-${mes}-${dia}`;

        return fechaFormateada;
    }

    const closeSuccessDetail = () => {

        const cont_detail = document.querySelector('#detail-success');
        const trama = document.querySelector('.trama');

        cont_detail.classList.remove('show');
        trama.classList.remove('open-trama-styles');
        setTimeout( () => {
            cont_detail.classList.remove('open');

            trama.classList.remove('open-trama');
            
        }, 400);

        

    }

    const validateCoupon = async(e) => {

        e.preventDefault();

        let coupon_value = e.target.coupon.value;
        let errors = {};

        //Validaciones del campo
        if (coupon_value.length === 0) {
            errors.coupon = "El campo esta vacío";
        } 

        //API cupon
        const URL = 'https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Cupones_descuentos_1hora_Report?where%20=Estado%3D%3D%22Activo%22'; 
        const coupon_API = await fetch(URL);
        const data = await coupon_API.json();

        let coupon = '';

        //Validar que si esté el cupón en el sistema
        if (data !== null) {
            coupon = data.filter( coupon => coupon.Codigo_Descuento === coupon_value && coupon.Estado === "Activo" );
        }else{
            errors.coupon = "No hay cupones disponibles";
        }

        if (coupon !== null && coupon.length !== 0) {
            
            setDiscountPurchase(coupon[0]);

            //Se utilizar la funcion por cambio no instantaneo
            if (coupon[0] !== null) {
                let discount_percentage = parseInt(coupon[0].Porcentaje) / 100;
                let new_total = total - (total * discount_percentage);
                let discount_total = total * discount_percentage;
        
                setTotal(new_total);
                setTotalDiscount(discount_total);    
           }
        
            console.log("Console");
        }else{
            errors.coupon = "Cupón no disponible";
        }


        setErrors(errors);

    }

    const removeCoupon = () => {
       

        setTotal( total + totalDiscount );

        setTotalDiscount(null);
        setDiscountPurchase(null);
    }

   
    useEffect( () => {
        
        //Enviar pedido a la base de datos
        if ( formWompi && formWompi.length !== 0) {
       
            const URL_REMISION = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Remision_Report?where=Cliente%3D%3D${idCliente}`;
            fetch(URL_REMISION)
            .then(res => res.json())
            .then(data => {
    
                let zona_id = '';


             let zona = Array.isArray(data) ? data.filter( zona => {
    
                    zona_id = zona.Zona;
    
                    return zona !== null;
                }) : null;  /* parseInt(data[0].Zona.ID); */
    
                
                let products = [];
                            
                productsCart.map(product => {
                    let object = {
                            
                        Productos: product.ID,
                        Precio: product.precio,
                        Cantidad: product.quantity.length !== 0 ? product.quantity : 1,
                        IVA: product.precio * (parseInt(product.GrupoDeProductos.IVA1) /  100),
                        Orden_Id: "0",
                        Estado: "Activo",
                        Estado_traslado: "Activo"
                    };
    
                    products.push(object);
                });           
    
                
                //console.log(zona_id);
                const order_json = {
                    Fecha: dateNow(),
                    Aplicativo: "1hora",
                    Clientes: idCliente,
                    Zona: zona_id !== '' ? zona_id.ID.toString() : "",
                    Direccion: dataSend.Direccion,
                    Ciudad: dataSend.Ciudad,
                    Referencia: formWompi.reference,
                    Cupon_descuento: discountPurchase !== null ? discountPurchase.ID : '',
                    Total: total,
                    Subtotal: subtotal,
                    Iva_Total: iva,
                    Estado: "Pendiente",
                    Estado_traslado: "Pendiente",
                    Estado_De_Pago: "Pending",
                    Items: products,
                    Info: dataInfo,
                    Info_JSON: dataInfoJSON,
                    Fecha_de_pago: dateNow()
                } 
    
                //console.log(order_json);
    
                const config_json_order = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order_json)
                };
    
                const URl_ORDERS = 'https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Ordenes_1hora_Admin';
                    
                fetch(URl_ORDERS, config_json_order)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
    
                    setLoadSuccess(true);
                    localStorage.removeItem('product');
    
                    setTimeout( () => {
                        window.location.reload();
                    },3000);
                });
    
    
            });
    
                
                
         
        }

    }, [formWompi]);
    

    useEffect( () => {
        const getDepartaments= async() => {
            const cities_api = await fetch(URL_CITIES);

            const cities_data = await cities_api.json();
            setCities(cities_data);

            let list_departaments = [];
          
            cities_data.map(city => {

                /* let object = {
                    id: city.Codigo_Deapartamento,
                    nombre:city.Departamento

                } */

                list_departaments.push({id:city.Codigo_Deapartamento, nombre:city.Departamento});
                //list_cities.push(city.Departamento);
                
            });

            let list = new Set(list_departaments.map(item => JSON.stringify(item)));
            let new_list_departaments = Array.from(list).map(item => JSON.parse(item));

            setDepartaments(new_list_departaments);
        };

        getDepartaments();

        console.log(productsCart);
        //getClientsAPI();
    }, []);

    

  return (
    <>
        <div className="cart__card" id='form-resumen-compra'>
            <div className="cart__header-card">
                Resumen de Compra
            </div>
            <div className="cart__body-card">
                <div className="cart__cont-total">
                    <p>IVA: <span className="text-bold"> {formatNumber(iva, true)} </span></p> 
                    <p>Subtotal: <span className="text-bold"> {formatNumber(subtotal, true)} </span></p> 
                    <p>Descuento: <span className="text-bold" id='element-discount'> {totalDiscount && `-${formatNumber(totalDiscount, true)}`} </span></p>                    {/* <p>Costo de envío: <span className="text-bold"> $20.000 </span></p> */}
                    <p className="cart__total">Total:  <span>{formatNumber(total, true)} </span></p>
                </div>
                {productsCart && productsCart.length !== 0 && (
                    <>
                    <div className='cart__cont-desc'>
                        <p>Cupón de descuento </p>
                        <form onSubmit={validateCoupon}>
                            <input name='coupon' placeholder='Ingresa tú cupón' className='form-control' />
                            <input type='submit' value='Validar' className='btn btn-coupon' disabled={totalDiscount === null ? false : true} /> 
                        </form>
                        { errors && errors.coupon ? ( <span className='text-error'> { errors.coupon } </span> ) : '' }

                        { discountPurchase !== null ? ( <p className='text-coupon'> {discountPurchase.Codigo_Descuento} - {parseInt(discountPurchase.Porcentaje)}% <span className='icon-remove-coupon' onClick={removeCoupon}> X </span> </p> ) : "" }
                    </div>
                
                
                    <div className="cart__data-user">
                        <p>Ingresa los siguientes datos para continuar</p>
                        <form onSubmit={verifyUser}>
                            <div className='form__data-cart'>

                                <select className="form-control" name='type_document' id='type_document'>
                                    <option>Tipo</option>
                                    <option value="cc" selected>CC</option>
                                    <option value="nit">NIT</option>
                                    <option value="ce">CE</option>
                                    <option value="pasaporte">PPT</option>
                                </select>

                               
                                <input type="text" className="form-control" name='document_id' id='document_id' placeholder="Número de documento" max='11'/>
                                
                                
                                
                            </div>
                            <div className='text-center'>
                                <span className="text-error">{error}</span>
                            </div> 
                            <div className="cart__cont-next">
                                <button type='submit' className="btn btn-blue">Continuar</button>
                                <div className='load load-send'> 
                                    <div className='loader'></div>
                                </div>
                             </div>
                                
                        </form>


                        
                    </div>
                    
                        
                    </>
                )}
            </div>
        </div>

        <div className="cart__card" id='form-datos-envio'>
            <div className="cart__header-card">
                Datos de envío 
                <div class='cart__card-return-form' onClick={returnFormSummary}>
                    <i class="fa-solid fa-arrow-left-long"></i>
                </div>
            </div>
            <div className="cart__body-card">
                <p>Ingresa o actualiza tu información de contacto y la dirección donde quieres recibir tu envío</p>
                
                <form onSubmit={dataUser !== null ? orders : registerClient}>
                    <div className='block-form'> 
                        <div>
                            <input type='text' className='form-control' placeholder='Nombre *' name='nombre' defaultValue={dataUser !== null ? dataUser.Nombre : ''} disabled={enableRegister ? false : true}/>
                            { errors && errors.name ? ( <span className='text-error'> { errors.name } </span> ) : ''}
                            
                        </div>
                        <div>
                            <input type='text' className='form-control' placeholder='Apellido *' name='apellido' defaultValue={dataUser !== null ? dataUser.Primer_Apellido + ' ' + dataUser.Segundo_Apellido : ""} disabled={enableRegister ? false : true}/>
                            { errors && errors.last_name ? ( <span className='text-error'> { errors.last_name } </span> ) : ''}
                        </div>
                    </div>  
                    <div>
                        <input type='text' className='form-control' placeholder='Correo Electrónico *' name='correo' defaultValue={dataUser !== null ? dataUser.Correo : ''} disabled={enableRegister ? false : true}/>
                        { errors && errors.email ? ( <span className='text-error'> { errors.email } </span> ) : ''}

                    </div>
                    <div>
                        <input type='text' className='form-control' placeholder='Teléfono *' name='telefono' defaultValue={dataUser !== null ? dataUser.Celular : ''} disabled={enableRegister ? false : true}/>
                        { errors && errors.phone ? ( <span className='text-error'> { errors.phone } </span> ) : ''}

                    </div>
                
                    <div className='block-form'>
                        <div>

                            <select className='form-control' name='departamento' onChange={getCities}>
                                <option value=''>Departamento *</option>
                                { departaments && departaments.length !== 0 && (
                                    departaments.map( departament => {
                                        return(
                                            <option value={departament.id} selected={dataUser !== null && dataUser.Departamento1.Codigo_Deapartamento === departament.id ? 'selected' : '' }>{departament.nombre}</option>
                                        )
                                    } )
                                )}
                            </select>
                            { errors && errors.departament ? ( <span className='text-error'> { errors.departament } </span> ) : ''}

                        </div>
                        
                        <div>
                            <select className='form-control' name='ciudad'>
                                <option value=''>Ciudad *</option>
                                { citiesDep && citiesDep.length !== 0 && (
                                    citiesDep.map( city => {
                                        return(
                                            <option value={city.Codigo_Municipio} selected={dataUser !== null && dataUser.Municipio.Codigo_Municipio === city.Codigo_Municipio ? 'selected' : '' }  >{city.Municipio}</option>
                                        )
                                    } )
                                )}
                                
                            </select>
                            { errors && errors.city ? ( <span className='text-error'> { errors.city } </span> ) : ''}

                        </div>

                    </div>
                    <div>
                        <input type='text' className='form-control' placeholder='Dirección *' name='direccion' defaultValue={dataUser !== null ? dataUser.Direccion : ''} />
                        { errors && errors.address ? ( <span className='text-error'> { errors.address } </span> ) : ''}

                    </div>

                    { enableRegister && (
                        <>
                        <div>
                            <input type='date' className='form-control' name='fecha_nacimiento'/>
                            { errors && errors.date_birth ? ( <span className='text-error'> { errors.date_birth } </span> ) : ''}

                        </div>
                        <div>
                            <select className='form-control' name='tipo_persona'>
                                <option selected value=''>Tipo de persona *</option>
                                <option value='persona natural - regimen simplificado'>Natural</option>
                                <option value='persona juridica - regimen comun'>Jurídica</option>
                                
                            </select>
                            { errors && errors.type_person ? ( <span className='text-error'> { errors.type_person } </span> ) : ''}
                        </div>  
                        </>
                    ) }
                    <div className="cart__cont-next">
                    <button type='submit' className="btn btn-blue">Pedir</button>
                    </div>
                </form>
                
            </div>
        </div>

        <div className='detail' id='detail-success'>

            <div className="cart__header-img">
                <img src="./img/Logo_1Hora 1 blanco.png" alt=""/>
            </div>

            <div className="cart__close-cart" id="close-cart" onClick={closeSuccessDetail}>
                <i className="fa-solid fa-xmark"></i>
            </div>

            <div className='container detail__container'>
             
                {loadSuccess ? (
                    <div className='row'>
                        <div className='col col-100 center-block'>
                            <div className='detail__cont-success'>
                                <i class="fa-regular fa-circle-check"></i>
                            </div>
                        </div>
                        <div className='col col-100 center-block'>
                            <p>¡Su pedido se ha realizado correctamente!</p>
                        </div>
                    </div>
                ):(
                    <div className='load-success'> 
                        <div className='loader'></div>
                    </div>
                )}
                
            </div>
        </div>

       


    </>
  )
}
