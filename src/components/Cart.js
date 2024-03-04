import React, { useEffect, useState } from 'react'
import { formatNumber } from '../helpers/formatNumbers';

export const Cart = ({productsCart, setProductsCart, subtotal, setSubtotal, total, setTotal}) => {
    // const [listCart, setListCart] = useState([]);

    const URL_CLIENTS = "https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Clientes_Report";
    const URL_CITIES = "https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Municipio1";

    const [clients, setClients] = useState([]);
    const [alertSuccess, setAlertSuccess] = useState('');
    const [error, setError] = useState('');
    const [dataUser, setDataUser] = useState(null);
    const [enableRegister, setEnableRegister] = useState(false);
    const [cities, setCities] = useState('');
    const [departaments, setDepartaments] = useState('');

    const closeCart = () => {
        const cart = document.querySelector("#cart");
        const trama = document.querySelector(".trama");

        cart.classList.remove("open-cart");
        trama.classList.remove("open-trama-styles");
        

        setTimeout(() => {
            trama.classList.remove("open-trama");
        },400)
    }

    const getListCart = () => {
        let products_cart = JSON.parse(localStorage.getItem("product"));

        setProductsCart(products_cart);

        
    } 

    const deleteProductCart = (id) => {

        let new_products_cart = productsCart.filter( (product) => product.ID !== id );
        let total = 0;
        let subtotal = 0;
        
        setProductsCart(new_products_cart);
        localStorage.setItem('product', JSON.stringify(new_products_cart));

        new_products_cart.map(product => {
            total += product.precio;
            subtotal += product.precio;
        });

        setTotal(total);
        setSubtotal(subtotal);
           
    }

    const increaseQuantity = (e,id) => {

        /* let search_index_product = productsCart.findIndex( (product) => product.ID === id );
        let list_products = productsCart;
        list_products[search_index_product].quantity += 1;
        setProductsCart(list_products);
        console.log(list_products); */
        let subtotal = 0;
        let total = 0;

    
       let new_products_cart = productsCart.filter( (product) =>{
            if (product.ID === id) {
                product.quantity++;
                if (product.quantity > 0) {

                    product.precio = parseInt(product.Precio_Mayorista) * product.quantity;
                }
            }

            subtotal += product.precio;
            total += product.precio;
        return product.ID !== null;
       });


       setSubtotal(subtotal);
       setTotal(total);
        setProductsCart(new_products_cart);
        localStorage.setItem('product', JSON.stringify(new_products_cart));
       

    }

    const reduceQuantity = (e,id) => {

        let subtotal = 0;
        let total = 0;

        let new_products_cart = productsCart.filter( (product) =>{
            if (product.ID === id && product.quantity > 1) {
                product.quantity--;
                product.precio = parseInt(product.Precio_Mayorista) * product.quantity;
                
            }
        
            subtotal += product.precio;
            total += product.precio;

        return product.ID !== null;
       });
        
        setSubtotal(subtotal);
        setTotal(total);
        setProductsCart(new_products_cart);
        localStorage.setItem('product', JSON.stringify(new_products_cart));
    }

    const modifyQuantity = (e, id) => {
        let subtotal = 0;
        let total = 0;
        let input_value = e.target.value;

        let new_products_cart = productsCart.filter( (product) => {

            if (product.ID === id) {
                product.quantity = input_value;
                
                if (product.quantity > 0) {
                    
                    product.precio = parseInt(product.Precio_Mayorista) * product.quantity;
                    
                }else if(product.quantity.length === 0){
                    
                    product.precio = parseInt(product.Precio_Mayorista);
                }
            }

            subtotal += product.precio;
            total += product.precio;
            
            return product.ID !== null;

        });

        setSubtotal(subtotal);
       setTotal(total);
        setProductsCart(new_products_cart);
        localStorage.setItem('product', JSON.stringify(new_products_cart));

    }

    const verifyUser = (e) => {
       

        e.preventDefault();
        let id = e.target.id.value;

        
        let exist = false;
        let errorMessage = '';

        let load = document.querySelector('.load');
        

        if ( id.length === 0 ) {
            errorMessage = 'Campo vacío, ingresa tu documento';
            console.log("vacio");
        }

        if (id.length > 11) {
            errorMessage = 'El campo no puede tener más de 11 dígitos';
            console.log("mayor");
        }

        setAlertSuccess(false);
    if (errorMessage.length === 0) {
        load.classList.add('show');
        fetch(URL_CLIENTS + `?where=Documento.contains(%22${id}%22)`)
        .then(response => response.json())
        .then(data => {

            
                
                if (data.length !== undefined) {
                    data.map(client => {
                        if (client.Documento === id) {
                            exist = true;
                            setDataUser(client);
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
                }else{
                 
                    let form_send = document.querySelector('#form-datos-envio');
                    let form_resumen = document.querySelector('#form-resumen-compra');
                    
                    form_send.classList.add('show');
                    form_resumen.classList.add('hide');

                    setEnableRegister(true);
                    setDataUser(null);
                }
    
                const alert = document.querySelector('.alert');
                const progress = document.querySelector('.alert-progress');
        
                alert.classList.add('active');
                progress.classList.add('active');
        
                setTimeout( () => {
                    alert.classList.remove('active');  
                    progress.classList.remove('active');         
                }, 4000)

                setError('');

                
        

            load.classList.remove('show');
        }).catch(error => {
                setAlertSuccess(false);
                
                console.log(error);
        });

       
        }

        setError(errorMessage);
    }
    
    /* const getClientsAPI = async(id) => {
        const clients_api = await fetch(URL_CLIENTS + `?where=Documento.contains(%22${id}%22)`);

        const clients_data = await clients_api.json();
        
        setClients(await clients_data);    

        console.log(URL_CLIENTS);
    } */



    const closeAlert = () => {

        const alert = document.querySelector('.alert');
        const progress = document.querySelector('.alert-progress');

        alert.classList.remove('active');
        progress.classList.remove('active'); 
    }

    const returnFormSummary = () => {
        let form_send = document.querySelector('#form-datos-envio');
                    let form_resumen = document.querySelector('#form-resumen-compra');

        form_send.classList.remove('show');
        form_resumen.classList.remove('hide');
    }

    const orders = (e) => {

    }   

    const registerClient = (e) => {
        e.preventDefault();

        const data = e.target;
        let tipo_persona = '';
        

        const newClient = {
            Documento: 0,
            Nombre: data.Nombre.value,
            Primer_Apellido: data.Primer_Apellido.value,
            //Segundo_Apellido: data.Segundo_Apellido.value,
            Correo: data.correo.value,
            Celular: data.telefono.value,
            Direccion: data.direccion.value,
            Retenedor: 'No',
            Fecha_de_Nacimiento: data.fecha_nacimiento.value,
            Acepta_que_la_factura_sea_enviada_por_medios_electr_nicos: 'Si',
            Regimen: data.tipo_persona.value,
            Estado: 'Activo',
            Cupo: 0,
            Tipo: 'Detal',
            Dias: 0,

        }
        console.log(e.target.nombre);

    }

    useEffect( () => {
        getListCart();

        let total = 0;
        let subtotal = 0;
        let products_cart = localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];

        products_cart.map( product => {
            subtotal += product.precio; 
            total += product.precio; 
        });
        
        setSubtotal(subtotal);
        setTotal(total);


        const getDepartaments= async() => {
            const cities_api = await fetch(URL_CITIES);

            const cities_data = await cities_api.json();
            //setCities(cities_data);

            let list_cities = [];
            cities_data.map(city => {
                list_cities.push(city.Departamento);
                console.log(city.Departamento);
            });

            setDepartaments([...new Set(list_cities)]);
            
        };

        getDepartaments();
        //getClientsAPI();
    }, []);


    return (
    <>
        <div className="cart" id="cart">

            <div className="cart__header-img">
                <img src="./img/Logo_1Hora 1 blanco.png" alt=""/>
            </div>

            <div className="cart__close-cart" id="close-cart" onClick={closeCart}>
                <i className="fa-solid fa-xmark"></i>
            </div>

            <div className="container cart__container">
                <div className="row">
                    <div className="col col-100">
                        <h3 className="title">Carrito de Compras</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-66">
                        <table className="table cart__table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Total</th>
                                    <th className="cart__delete-all-text">Eliminar todo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsCart && productsCart.length !== 0 ? (
                                    productsCart.map(product => {
                                    
                                        return (

                                            <tr key={product.id} id={product.ID}>
                                                <td className="cart__data" >
                                                    <div className="cart__img">
                                                        <img src={product.Imagen_publica.url} alt=""/>
                                                    </div>
                                                    <div className="cart__information">
                                                        <span className="cart__name-product">{product.Referencia}</span>
                                                        <span className="cart__category">{product.GrupoDeProductos.Description}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cart__quantity">

                                                        <div className="cart__operation cart__minus" id="minus" onClick={(e) => reduceQuantity(e,product.ID)}>
                                                            <i className="fa-solid fa-minus"></i>
                                                        </div>

                                                        <input type="text" className="cart__input-quantity" id="quantity" onChange={(e) => modifyQuantity(e,product.ID)} value={product.quantity} />

                                                        <div className="cart__operation cart__plus" id="plus" onClick={(e) => increaseQuantity(e,product.ID)}>
                                                            <i className="fa-solid fa-plus"></i>

                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">{formatNumber(product.precio, true)}</td>
                                                <td className="text-center "> 
                                                    <div className="cart__delete" id={product.ID} onClick={ () => deleteProductCart(product.ID) }>
                                                        <i className="fa-solid fa-xmark"></i> 
                                                    </div>
                                                </td>
                                            </tr>

                                        )
                                    })
                                ) : ( 
                                    <tr>
                                        <td colspan="4" className='text-center'>El carrito esta vacío</td>
                                    </tr> 
                                )}
                                
                            
                            </tbody>

                        </table>
                    </div>
                         
                    <div className="col col-33 position-relative">
                        <div className="cart__card" id='form-resumen-compra'>
                            <div className="cart__header-card">
                                Resumen de Compra
                            </div>
                            <div className="cart__body-card">
                                <div className="cart__cont-total">
                                    <p>Subtotal: <span className="text-bold"> {formatNumber(subtotal, true)} </span></p> 
                                    {/* <p>Costo de envío: <span className="text-bold"> $20.000 </span></p> */}
                                    <p className="cart__total">Total:  <span>{formatNumber(total, true)} </span></p>
                                </div>

                                <div className="cart__methods">
                                    <p className="text-center">Puedes usar cualquiera de los siguientes medios de pago</p>
                                    <div className="cart__payment-types">
                                        <span> <img src="./img/payment-pages/bancolombia.png" alt=""/> Bancolombia </span>
                                        <span> <img src="./img/payment-pages/tarjetacredito.png" alt=""/> Tarjeta de Crédito/Débito </span>
                                        <span> <img src="./img/payment-pages/pse.png" alt=""/> PSE </span>

                                    </div>
                                </div>
                                {productsCart && productsCart.length !== 0 && (
                                    <>
                                    <div className="cart__data-user">
                                        <p>Ingresa los siguientes datos para continuar</p>
                                        <form onSubmit={verifyUser}>
                                            <div className='form__data-cart'>

                                                <select className="form-control" name='type_document'>
                                                    <option value="">Tipo</option>
                                                    <option value="">C.C</option>
                                                    <option value="">T.I</option>
                                                </select>

                                                <div className='text-center'>
                                                    <input type="text" className="form-control" name='id' placeholder="Número de documento" max='11'/>
                                                    <span className="text-error">{error}</span>
                                                </div>
                                                
                                            </div>

                                            <div className="cart__cont-next">
                                                <button type='submit' className="btn btn-blue">Continuar</button>
                                                <div className='load'> 
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
                                        <input type='text' className='form-control' placeholder='Nombre' name='nombre' defaultValue={dataUser !== null ? dataUser.Nombre : ''} />
                                        <input type='text' className='form-control' placeholder='Apellido' name='apellido' defaultValue={dataUser !== null ? dataUser.Primer_Apellido + ' ' + dataUser.Segundo_Apellido : ""} />
                                    </div>  
                                    <input type='text' className='form-control' placeholder='Correo Electrónico' name='correo' defaultValue={dataUser !== null ? dataUser.Correo : ''} />
                                    <input type='text' className='form-control' placeholder='Teléfono' name='telefono' defaultValue={dataUser !== null ? dataUser.Celular : ''} />
                                
                                    <div className='block-form'>
                                        <select className='form-control' name='departamento' disabled>
                                            <option>Departamento</option>
                                            { departaments && departaments.length !== 0 && (
                                                cities.map( departament => {
                                                    return(
                                                        <option value={departament}>{departament}</option>
                                                    )
                                                } )
                                            )}
                                        </select>

                                        <select className='form-control' name='Ciudad'>
                                            <option>Ciudad</option>
                                            { cities && cities.length !== 0 && (
                                                cities.map( city => {
                                                    return(
                                                        <option value={city.ID}>{city.Municipio}</option>
                                                    )
                                                } )
                                            )}
                                            
                                        </select>

                                    </div>
                                    <input type='text' className='form-control' placeholder='Dirección' name='direccion' defaultValue={dataUser !== null ? dataUser.Direccion : ''} />
                                    { enableRegister && (
                                        <>
                                            <input type='date' className='form-control' name='fecha_nacimiento'/>
                                            
                                            <select className='form-control' name='tipo_persona'>
                                                <option selected>Tipo de persona</option>
                                                <option value='persona natural - regimen simplificado'>Natural</option>
                                                <option value='persona juridica - regimen comun'>Jurídica</option>
                                                
                                            </select>
                                        </>
                                    ) }
                                    <div className="cart__cont-next">
                                    <button type='submit' className="btn btn-blue">Pagar</button>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div className='alert'>
            <div className='alert-content'>
                {alertSuccess === true ? (<i class="fa-solid fa-circle-check blue"></i>) : ''}
                {alertSuccess === false ? (<i class="fa-solid fa-triangle-exclamation orange"></i>) : ''}
                <div className='alert-description'>
                    {alertSuccess === true ? ( 
                        <>
                            <span className='text-bold'>Enviado</span>
                            <span>El usuario ya existe en nuestra base de datos</span>
                        </>
                     ) : ''}

                     {alertSuccess === false ? (
                        
                        <>
                            <span className='text-bold'>Error</span>
                            <span>El usuario no existe en nuestra base de datos</span>
                        </>
                     ): ''}
                    {/* <span className='text-bold'>Enviado</span>
                    <span>Usuario verificado en la base de datos</span> */}
                </div>
                <div className='alert-close' onClick={closeAlert}>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div className='alert-progress'></div>
        </div>

       
        
        <div className="trama"></div>
    </>
    )
}
