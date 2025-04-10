import React from 'react'
import ItemListContainer from '../../componentes/ItemListContainer/ItemListContainer';
import Categories from '../../componentes/Categories/Categories';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Categorization from '../../componentes/Categories/Categorizacion';
import CheckoutStepper from '../../componentes/ProgressBar/CheckoutStepper';
import CategoriesOcasiones from '../../componentes/CategoriesOcasiones/OcasionesCategories';


const Ocasiones = () => {
    const { localidad } = useParams();

    return (

        <>
        <CheckoutStepper activeStep={0}  />


        <div>
            <Categorization />
            <div className='products'>


                {
                    localidad ?
                    <Helmet>
                            <title> Envios a {localidad} - Envio Flores y venta de arreglos florales, comestibles y más
                                a domicilio en el día a Gran Buenos Aires y Capital Federal</title>
                            <meta name="description" content={`Envio de flores a domicilio a ${localidad}, envio de rosas, ramos, bombones, regalos 
                    .Venta online y telefónica. Pagos en efectivo y 
                    con tarjetas de crédito. Entrega inmediata. Delivery en el día en Buenos Aires ${localidad}. Envioflores.com`} />
                        </Helmet>

                        :
                        <Helmet>
                            <title> Productos Envio Flores - Venta y envio de arreglos florales, comestibles, chocolates , bebidas y demás
                                a domicilio en el día
                                a Gran Buenos Aires y Capital Federal</title>
                            <meta name="description" content="Envio de flores, rosas, ramos, bombones, regalos 
                    a domicilio en Argentina. Venta online y telefónica. Pagos en efectivo y 
                    con tarjetas de crédito. Entrega inmediata. Delivery en el día en Buenos Aires. Envioflores.com" />
                        </Helmet>
                }



                <div className="products-content" >
                    <CategoriesOcasiones />
                    <div className="products-list-container" >
                        <ItemListContainer />
                    </div>
                </div>
            </div>
        </div>
                    </>
    );


};

export default Ocasiones