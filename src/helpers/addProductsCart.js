import { addDiscountPurchase } from "./addDiscountPurchase.js";

export const addProductCart = async(e,id, URL_BASE, setProductsCart, setTotal, setSubtotal, setIva, discountPurchase, setTotalDiscount) => {

    //Mostrar cargando y ocultar el icono del carrito
    const item_add_product = e.target.id.length !== 0 ? e.target : e.target.parentNode;
    console.log(item_add_product);

    await setTimeout( () => {
        item_add_product.children[0].classList.remove('display-none');
        item_add_product.children[1].classList.add('display-none');
    }, 300);
    
    
    //Llamado de la API por su ID
    let URL_API = URL_BASE + '?where=ID=' + id;
    let product_api = await fetch(URL_API);
    let {data} = await product_api.json();

    let total = 0;
    let subtotal = 0;
    let iva = 0;

    
//Lista de productos en carrito en el localstorage
    let listCart = JSON.parse(localStorage.getItem('product'));

    data[0].quantity = 1;
    data[0].precio = parseInt(data[0].Precio_Mayorista);

     //  Verifica e inserta si el listado de productos en el carrito ya existe
    if (Array.isArray(listCart)) {
        

        let search_product = listCart.find(product => product.ID === id);

        if (!search_product) {

            listCart.push(data[0]);

            localStorage.setItem('product', JSON.stringify(listCart));
            setProductsCart(listCart);
        }

        listCart.map( product => {

            let iva_decimal = parseInt(product.GrupoDeProductos.IVA1) / 100;
            console.log(iva_decimal);
            subtotal += product.precio - (iva_decimal * product.precio);
            total += product.precio;
            iva += iva_decimal * product.precio;
        });


    }else{
        localStorage.setItem('product', JSON.stringify([data[0]]));
        setProductsCart([data]);

        let iva_decimal = parseInt(data.GrupoDeProductos.IVA1) / 100;

        subtotal += data.precio - (iva_decimal * data.precio);
        total += data.precio;
        iva += iva_decimal * data.precio;

    }

    const alert = document.querySelector('.alert');
    const progress = document.querySelector('.alert-progress');

    alert.classList.add('active');
    progress.classList.add('active');

    setTimeout( () => {
        alert.classList.remove('active');  
        progress.classList.remove('active');         
    }, 4000)
 
    setTotal(total);
    setSubtotal(subtotal);
    setIva(iva);

    addDiscountPurchase(total, discountPurchase, setTotal, setTotalDiscount);
} 