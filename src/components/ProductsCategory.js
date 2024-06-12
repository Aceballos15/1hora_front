import React, { useEffect, useState } from 'react'
import { formatNumber } from '../helpers/formatNumbers.js';
import { Products } from './Products.js';
import { addProductCart } from '../helpers/addProductsCart.js';

export const ProductsCategory = ({ discountPurchase, setTotalDiscount, category = '', productsCart, setProductsCart, setSubtotal, setTotal, products, setProducts, setIva, currentPage, setCurrentPage, setProductDetail}) => {
    
    let URL_BASE = category !== '' ? "https://zoho.accsolutions.tech/API/v1/Productos_1_hora?where=Marca.Marca%3D%221hora%22%26%26Tipo.Nombre%3D%22" + category + "%22" : "https://zoho.accsolutions.tech/API/v1/Productos_1_hora";

    
     
    const total_products = products.length;
    const [productsForPage, setProductsForPage] = useState(12);

    const pageNumbers = [];
    const lastIndex = currentPage * productsForPage;
    const firstIndex = lastIndex - productsForPage; 

    //Paginación
    for (let i = 1; i <= Math.ceil(total_products / productsForPage); i++) {
       pageNumbers.push(i);
         
    }

    const onPreviusPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const onNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const OnSpecificPage = (n) => {
        setCurrentPage(n);
    }

  //Agregar productos al carrito
    const addProduct = async(e,id) => {

        addProductCart(e, id, URL_BASE, setProductsCart, setTotal, setSubtotal, setIva, discountPurchase, setTotalDiscount);
    }

    const openProductDetail = (product) => {

        const cont_detail = document.querySelector('#detail-product');
        const trama = document.querySelector('.trama');

        trama.classList.add('open-trama');
        cont_detail.classList.add('open');
        setTimeout( () => {
            trama.classList.add('open-trama-styles');
            cont_detail.classList.add('show');
            
        }, 300);

        setProductDetail(product);

    }

    const closeAlert = () => {

        const alert = document.querySelector('.alert');
        const progress = document.querySelector('.alert-progress');

        alert.classList.remove('active');
        progress.classList.remove('active'); 
    }




    // Paginación
   // const page 

  return (
    <>
        {products && products.length !== 0 &&(
            
            products.map( product => {
                return(
                    <div className="col col-33 col-mb-50" key={product.id}>
                        <article className="products__card-product">
                            <div className="products__card-img">
                                <img src={product.Imagen_publica.url} alt=""/>
                            </div>
                            <div className="products__card-description">
                                <span className="products__type">{product.GrupoDeProductos.Description}</span>
                                <h3 className="products__title">{product.Referencia}</h3>
                                
                                <div className="products__cont-price-cart">
                                    <div className="products__cont-price">
                                        {/* Cambiar para mas adelante el precio del producto */}
                                        <span className="products__price">{formatNumber(product.Precio_Mayorista, true) } COP</span>
                                        {/* <span className="products__price-before">$79.900 COP</span> */}
                                    </div>
                                    
                                </div>

                                
                            </div>

                            {/* <div className="products__discounts">
                                <span>-37% OFF</span>
                            </div> */}

                            <div className="products__options">
                                {/* <button className="btn btn-blue">Comprar</button> */}
                                <div className="products__options-product" onClick={() => openProductDetail(product)}>
                                     <img src="./img/icon-details.svg" alt="" />
                                </div>
                                <div className="products__options-product option-add-product" id={product.ID} onClick={productsCart !== null && productsCart.find(item => item.ID === product.ID) ? null : (e) => addProduct(e,product.ID) }>
                                    {productsCart !== null && productsCart.find(item => item.ID === product.ID) ? (
                                    <i class="fa-solid fa-check"></i>
                                    ) : (
                                        <>
                                         <div className='load-add-cart display-none'>
                                            <div className='loader'></div>
                                        </div>
                                        <img src="./img/cart-product.png" alt="" />
                                        </>
                                    
                                    ) }    
                                </div>
                            </div>

                        </article>
                    </div>
                )
            }).slice(firstIndex, lastIndex)
        )}

        <div className='col col-100'>
            <nav aria-label="pagination-products">
                <ul className="pagination">
                    <li className="page-item">
                        {currentPage !== 1 ? (
                            <a className="page-link" onClick={onPreviusPage} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                            
                        ) : ''}
                    </li>
                        {pageNumbers.map(noPage => {
                            return(
                                <li className="page-item" key={noPage}>
                                    <a className={`page-link ${noPage === currentPage ? 'active' : ''}`} onClick={() => OnSpecificPage(noPage)}>{noPage}</a>
                                </li>
                            )
                        })}
                       
                        
                    <li className="page-item">
                        { currentPage < pageNumbers.length ? (
                            <a className={`page-link`}  onClick={onNextPage} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        ): ''}
                    </li>
                </ul>
            </nav>
        </div>
        

        <div className='alert'>
            <div className='alert-content'>
                <i class="fa-solid fa-circle-check blue"></i>
             
                <div className='alert-description'>
                  
                        <span className='text-bold'>Agregado al carrito</span>
                       
                                       
                    
                </div>
                <div className='alert-close' onClick={closeAlert}>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div className='alert-progress'></div>
        </div>
    </>
  )
}
