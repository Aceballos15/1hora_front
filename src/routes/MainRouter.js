
import React, { useEffect, useState } from 'react'
import {BrowserRouter, Navigate, NavLink, Route, Routes} from "react-router-dom"
import { Products } from '../components/Products.js'
import { Header } from '../components/layout/Header.js'
import { Footer } from '../components/layout/Footer.js'
import { Cart } from '../components/Cart.js'
import { ProductsCategory } from '../components/ProductsCategory.js'
import { DetailProducts } from '../components/DetailProducts.js'

export const MainRouter = () => {   

    //const URL_BASE_GROUP = "https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/GrupoDeProductos_Report?where=ID%3D1889220000051935384";
    const URL_BASE = "https://zoho.accsolutions.tech/API/v1/Productos_1_hora?where=Marca.Marca%3D%221hora%22";

    const [productsCart, setProductsCart] = useState(null);
    const [iva, setIva] = useState("");
    const [subtotal, setSubtotal] = useState("");
    const [total, setTotal] = useState("");
    const [totalDiscount, setTotalDiscount] = useState(null); 
    const [discountPurchase, setDiscountPurchase] = useState(null);

    const [groupProducts, setGroupProducts] = useState([]);
    const [products, setProducts] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);
    const [productDetail, setProductDetail] = useState("");


    //Cargar los productos de 1 hora desde la API
    useEffect( () => {
        const getGroupProductsAPI = async() => {

            const load = document.querySelector('.load-display');

            const group_products_api = await fetch(URL_BASE);
    
            const group_products_data = await group_products_api.json();

            let categories = [];
            group_products_data.data.map(group => {
                categories.push(group.Tipo.Nombre);
            });

            categories = [...new Set(categories)];
            setGroupProducts(categories);

            await load.classList.add('opacity');
            await setTimeout( () => {
                load.classList.add('hide');
            },300);

        }
   
        getGroupProductsAPI();

        const getProductsAPI = async() => {

            try {
                const products_api = await fetch(URL_BASE);
    
                const products_data = await products_api.json();
                
                const order_products = products_data.data.sort( (a, b) => {
                    if (a.Promosion === 'Si' && b.Promosion !== 'Si') return -1;
                    if (a.Promosion !== 'Si' && b.Promosion === 'Si') return 1;
                    return 0;
                  } );
                setProducts(await order_products);    
                
            } catch (error) {
                console.log("Error al traer los productos - error: " + error);
            }
        }

        getProductsAPI();

    },[]);


    return (
      <BrowserRouter>
  
          <Header total={total} products={products} setProducts={setProducts} setCurrentPage={setCurrentPage}/>
  
          <main>
              <Routes>
                  <Route path='/' element={<Products  groupProducts={groupProducts} setCurrentPage={setCurrentPage} />} >
                        <Route path='/' element={<ProductsCategory discountPurchase={discountPurchase} setTotalDiscount={setTotalDiscount} productsCart={productsCart} setProductsCart={setProductsCart} setIva={setIva} setSubtotal={setSubtotal} setTotal={setTotal} search="true" products={products} setProducts={setProducts} currentPage={currentPage} setCurrentPage={setCurrentPage} setProductDetail={setProductDetail}/>}/>
                        { groupProducts && groupProducts.length !== 0 && (
                            groupProducts.map( group => {
                                let new_products = [];
                                
                                products.map(product => {
                                    if (product.Tipo.Nombre === group) {
                                        new_products.push(product);
                                    }
                                });

                                return (
                                    <>
                                        <Route path={group} element={<ProductsCategory discountPurchase={discountPurchase} setTotalDiscount={setTotalDiscount} category={group} productsCart={productsCart} setProductsCart={setProductsCart} setIva={setIva} setSubtotal={setSubtotal} setTotal={setTotal}  products={new_products} setProducts={setProducts} currentPage={currentPage} setCurrentPage={setCurrentPage} setProductDetail={setProductDetail}/>} />
                                    </>
                                )
                            } )
                        ) }   
                    </Route>
              </Routes>
          </main>

          <Footer />
          <Cart discountPurchase={discountPurchase} setDiscountPurchase={setDiscountPurchase} totalDiscount={totalDiscount} setTotalDiscount={setTotalDiscount} productsCart={productsCart} setProductsCart={setProductsCart} iva={iva} setIva={setIva} subtotal={subtotal} setSubtotal={setSubtotal} total={total} setTotal={setTotal} />
          <DetailProducts discountPurchase={discountPurchase} setTotalDiscount={setTotalDiscount} productsCart={productsCart} productDetail={productDetail} setProductsCart={setProductsCart} setIva={setIva} setSubtotal={setSubtotal} setTotal={setTotal}/>

      </BrowserRouter>
  
         
    )
}
