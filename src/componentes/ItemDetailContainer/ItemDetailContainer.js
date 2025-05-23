"use client"
import React, { useEffect, useState } from "react";
import ItemDetail from "../ItemDetail/ItemDetail";
import { FadeLoader } from "react-spinners";
import CheckoutStepper from "../ProgressBar/CheckoutStepper";
import { useProductsContext } from "@/context/ProductsContext";
import { useTheme } from "@/context/ThemeSwitchContext";


const ItemDetailContainer = ({ activeStep, stepLabels, prodId }) => {

    const [item, setItem] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {products} = useProductsContext();
    const {isDarkMode} =  useTheme();


    useEffect(() => {

        async function fetchData() {
            try {
                if (products) {

                    const product = products.find(p =>  p.id === prodId);
                    if (product) {
                        setItem(product);
                        setIsLoading(false); // Actualiza el estado de isLoading en caso de error

                    } else {
                        console.error(`Producto con ID ${prodId} no encontrado en localforage`);
                    }
                } else {
                    console.error('No se encontraron productos en localforage');
                }
            } catch (error) {
                console.log("No se pudo obtener la base de datos:", error);
                setIsLoading(false); // Actualiza el estado de isLoading en caso de error
            }
        }

        fetchData();
    }, [prodId, products]);


    return (
        <div key={item.id} className={`prodDetailContainer ${isDarkMode ? 'dark' : ''}`}>
                  <CheckoutStepper activeStep={1}  />
                  

            {isLoading ? (
                <>
                    <h2 className="loadDetailProd">Cargando Productos....</h2>
                    <FadeLoader color={isDarkMode ? 'white' : '#670000'} />
                </>
            ) : (
                <>
                    <ItemDetail item={item} prodId={prodId}/>
                </>
            )}

        </div>
    );

}

export default ItemDetailContainer