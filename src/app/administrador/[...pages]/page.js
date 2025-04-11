"use client"

import { use } from 'react';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import { Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const ItemListContainer = dynamic(() => import('@/componentes/ItemListContainer/ItemListContainer'), { ssr: false });
const VerVentas = dynamic(() => import('@/admin/componentes/Ventas/Ventas'), { ssr: false });
const AddProds = dynamic(() => import('@/admin/componentes/Productos/addProds'), { ssr: false });
const EditProds = dynamic(() => import('@/admin/componentes/Productos/editProds'), { ssr: false });
const MassiveEdition = dynamic(() => import('@/admin/componentes/Productos/MassiveEdition'), { ssr: false });
const EditAdicionales = dynamic(() => import('@/admin/componentes/ProdsAdicionales/editAdicionales'), { ssr: false });
const AddAdicionales = dynamic(() => import('@/admin/componentes/ProdsAdicionales/Adicionales'), { ssr: false });
const CategoriesAdmin = dynamic(() => import('@/admin/componentes/Categorias/Categorias'), { ssr: false });
const AddBanners = dynamic(() => import('@/admin/componentes/Banners/addBanners'), { ssr: false });
const EditBanners = dynamic(() => import('@/admin/componentes/Banners/editBanners'), { ssr: false });
const EditCosts = dynamic(() => import('@/admin/componentes/Costos/editCosts'), { ssr: false });
const AddDirections = dynamic(() => import('@/admin/componentes/Direcciones/addDirections'), { ssr: false });
const SeeOrders = dynamic(() => import('@/admin/componentes/Ordenes/seeOrders'), { ssr: false });
const Promociones = dynamic(() => import('@/admin/componentes/Promociones/Promociones'), { ssr: false });
const PantallasPromocionales = dynamic(() => import('@/admin/componentes/PantallasPromocionales/PantallasPromocionales'), { ssr: false });


import style from './admin.module.css';

export default function Administrador(props) {

    const params = use(props.params);
    const searchParams = use(props.searchParams);
    const [adminRoute, productId, paramId] = params.pages;
    let selectedProducts = searchParams.selectedProducts;
    if (selectedProducts) selectedProducts = JSON.parse(selectedProducts)

    return (
        <div className={style.adminPage}>

            {
                adminRoute === 'add-prods' && <AddProds />
            }

            {
                adminRoute === 'editProds' && <EditProds productId={productId} />
            }

            {
                adminRoute === 'massiveEdition' && <MassiveEdition selectedProducts={selectedProducts} />
            }

            {
                adminRoute === 'adicionales' && <AddAdicionales />
            }

            {
                adminRoute === 'editAdicionales' && <EditAdicionales productId={productId} />
            }

            {
                adminRoute === 'banners' && <AddBanners />
            }
 {
    (adminRoute === 'edit' && productId === 'banners') && <EditBanners bannerId={paramId} />

 }


            {
                adminRoute === 'categorias' && <CategoriesAdmin />
            }

            {
                adminRoute === 'costos' && <EditCosts />
            }

            {
                adminRoute === 'directions' && <AddDirections />
            }
            {
                adminRoute === 'orders' && <SeeOrders />
            }
            {
                adminRoute === 'ventas' && <VerVentas />
            }

            {
                adminRoute === 'promociones' && <Promociones />
            }

            {
                adminRoute === 'pantallas-promocionales' && <PantallasPromocionales />
            }


        </div>
    )
}