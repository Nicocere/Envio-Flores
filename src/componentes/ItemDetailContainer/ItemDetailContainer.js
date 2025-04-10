import React, { useEffect, useState } from "react";
import ItemDetail from "../ItemDetail/ItemDetail";
import { useParams } from 'react-router-dom'
import { FadeLoader } from "react-spinners";
import axios from "axios";
import CheckoutStepper from "../ProgressBar/CheckoutStepper";
import { baseDeDatos } from "../../admin/FireBaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ItemDetailContainer = ({ activeStep, stepLabels }) => {

    const [item, setItem] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const { prodId } = useParams()

    useEffect(() => {

        async function fetchData() {
            try {
                // Referencia al documento específico por ID en la colección 'productos'
                const productRef = doc(baseDeDatos, 'productos', prodId);
                const productDoc = await getDoc(productRef);

                if (productDoc.exists()) {
                    const productData = {
                        ...productDoc.data(),
                    };
                    setItem(productData);
                    setIsLoading(false); // Actualiza el estado de isLoading después de obtener los datos
                } else {
                    console.log("El producto no existe en la base de datos.");
                    setIsLoading(false); // Actualiza el estado de isLoading incluso si el producto no existe
                }
            } catch (error) {
                console.log("No se pudo obtener la base de datos:", error);
                setIsLoading(false); // Actualiza el estado de isLoading en caso de error
            }
        }

        fetchData();
    }, [prodId]);


    return (
        <div key={item.id} className="prodDetailContainer">
                  <CheckoutStepper activeStep={1}  />
                  

            {isLoading ? (
                <>
                    <h2 className="loadDetailProd">Cargando Productos....</h2>
                    <FadeLoader color="white" />
                </>
            ) : (
                <>
                    <ItemDetail item={item} />
                </>
            )}

        </div>
    );

}

export default ItemDetailContainer