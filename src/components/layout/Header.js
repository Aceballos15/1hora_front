import React, { useEffect, useState } from 'react'
import { formatNumber } from '../../helpers/formatNumbers.js';

export const Header = ({total, products, setProducts, setCurrentPage}) => {

    //const [searchProduct, setSearchProduct] = useState('');
    const [listProducts, setListProducts] = useState([]);

  // Abrir la sección del carrito 
  const openCart = () => {

    const cart = document.querySelector("#cart");
    const trama = document.querySelector(".trama");

    cart.classList.add("open-cart");
    trama.classList.add("open-trama");

    setTimeout(() => {
        trama.classList.add("open-trama-styles");
    },100)
  

} 

const searchProducts = (e) => {

    setCurrentPage(1);

    let search_product = e.target.value.toLowerCase();
        
        if (search_product !== '' && search_product.length !== 0) {

            let new_products_data = [];

            listProducts.map( product => {
                
                let product_reference = product.Referencia.toLowerCase();
                let product_characteristics = product.Caracteristicas ? product.Caracteristicas.toLowerCase() : '';
                let product_category = product.GrupoDeProductos.Description.toLowerCase();
                
                if (product_reference.includes(search_product) || product_characteristics.includes(search_product) || product_category.includes(search_product)) {
                    new_products_data.push(product);
                }
            });

            setProducts(new_products_data);
        }else{
            setProducts(listProducts);
        }
    
} 



useEffect( () => {   

    const getProductsAPI = async() => {

        const URL_BASE = "https://zoho.accsolutions.tech/API/v1/Productos_1_hora?where=Marca.Marca%3D%221hora%22";
        const products_api = await fetch(URL_BASE);
        const {data} = await products_api.json();
        
        setProducts(await data);
        setListProducts(await data);
    
    }

    getProductsAPI();
    
}, []);

return (
        <>
            <header className='header-ppal'>
                <div className="header">
                    <div className="header__container container">
                        <div className="header__logo">
                            <a href="/">
                                <img src="./img/Logo_1Hora 1.png" alt="" />
                            </a>
                        </div>
                        <nav className="header__nav">
                            <button className="btn btn-search">
                                <img src="./img/search.png" alt="" />
                            </button>
                            <input type="search" placeholder="Filtrar por producto" id="search-product" onChange={(e) => searchProducts(e)} />
                            
                        </nav>
                        <div className="header__cart" onClick={openCart}>
                            <div className="btn btn-cart" id="btn-cart">
                                <img src="./img/cart.png" alt="" />
                            </div>
                            <div className="header__text-cart">
                                <span>Tu carrito</span>
                                <span className="header__price-cart">{formatNumber(total, true)} COP</span>
                            </div>
                        </div>
                        
                    </div>

                </div>
                <div className='header-mb'>
                    <nav className="header__nav">
                        <button className="btn btn-search">
                            <img src="./img/search.png" alt="" />
                        </button>
                        <input type="search" placeholder="Filtrar por producto" id="search-product" onChange={(e) => searchProducts(e)} />
                        
                    </nav>
                </div>
            
            </header>
        </>
    )
}
