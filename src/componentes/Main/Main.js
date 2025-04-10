import React from 'react'
import ItemDetailContainer from '../ItemDetailContainer/ItemDetailContainer';
import { Routes, Route } from 'react-router-dom'
import Cart from '../Cart/Cart';
import SuccessPage from '../MercadoPago/StatusPaymentsMP/SuccesPage';
import FailurePage from '../MercadoPago/StatusPaymentsMP/FailurePage';
import PendingPage from '../MercadoPago/StatusPaymentsMP/PendingPage';
import Home from '../Home/Home'
import Products from '../../pages/Products/Products';
import Ubicacion from '../Ubicacion/Ubicacion';
import ComoComprar from '../ComoComprar/comoComprar';
import RegistroUser from '../../admin/componentes/Login/Registro/registro.js'
import Login from '../../admin/componentes/Login/Session-Login/login';
import Admin from '../../admin/componentes/AdminSesion/sessionAdmin.js'
import AddProds from '../../admin/componentes/Productos/addProds';
import EditProds from '../../admin/componentes/Productos/editProds';
import EditCosts from '../../admin/componentes/Costos/editCosts.js';
import AddDirections from '../../admin/componentes/Direcciones/addDirections.js';
import SeeOrders from '../../admin/componentes/Ordenes/seeOrders.js';
import ScrollToTop from '../ScrollToTop/ScrollToTop.js';
import AddAdicionales from '../../admin/componentes/ProdsAdicionales/Adicionales.js';
import EditAdicionales from '../../admin/componentes/ProdsAdicionales/editAdicionales.js';
import AddBanners from '../../admin/componentes/Banners/addBanners.js';
import EditBanner from '../../admin/componentes/Banners/editBanners.js';
import { Helmet } from 'react-helmet';
import LocalidadPage from '../Directions/LocalidadPage.js';
import VerVentas from '../../admin/componentes/Ventas/Ventas.js';
import WhatsAppMobile from '../contactoWhatsApp/contactoWhatsAppMobile.js';
import UserSession from '../../admin/componentes/UserSesion/Session/UserSesion.js';
import UserSeeBuys from '../../admin/componentes/UserSesion/VerOrdenes/ordenesUser.js';
import ModificarPerfilUsuario from '../../admin/componentes/UserSesion/ModificarPerfil/ModificarPerfil.js';
import MassiveEdition from '../../admin/componentes/Productos/MassiveEdition.js';
import Ocasiones from '../../pages/Ocasiones/Ocasiones.js';
import Categories from '../../admin/componentes/Categorias/Categorias.js';
import Autenticacion from '../../admin/componentes/Autenticacion/Autenticacion.js';
import ModificarPerfilAdministrador from '../../admin/componentes/AdminSesion/ModificarPerfil/ModificarAdmin.js';
import MassiveEditDirections from '../../admin/componentes/Direcciones/MassiveEditDirections.js';
import CookiePolicy from '../Cookies/Cookies.js';

const Main = () => {

  return (
    <main className='main'>
      <Helmet>
        <title>Envio Flores - Venta y envio de arreglos florales, comestibles, chocolates , bebidas y demás
          a domicilio en el día
          a Gran Buenos Aires y Capital Federal</title>
        <meta name="description" content="Envio de flores, rosas, ramos, bombones, regalos 
                    a domicilio en Argentina. Venta online y telefónica. Pagos en efectivo y 
                    con tarjetas de crédito. Entrega inmediata. Delivery en el día en Buenos Aires. Envioflores.com" />
      </Helmet>
      <ScrollToTop />
      <WhatsAppMobile />
      
      <Routes>

    {/* Cookies */}
    <Route path="/cookies" element={<CookiePolicy />} />
        {/* Ecommerce */}
        <Route path='/' element={<Home />} />
        <Route path='/productos/' element={<Products />} />
        <Route path='/categoria/:categoryName' element={<Products />} />

        <Route path='/ocasiones/' element={<Ocasiones />} />
        <Route path='/ocasiones/:ocasionName' element={<Ocasiones />} />

        <Route path='/detail/:prodId' element={<ItemDetailContainer />} />
        <Route path="/cart" element={<Cart />} />

        {/* Zonas de envio */}
        <Route path="/envios" element={<LocalidadPage />} />
        <Route path="/envios/:localidad" element={<Products />} />

        {/* Datos */}
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/ayuda" element={<ComoComprar />} />

        {/* Administracion de Usuarios */}
        <Route path="/login" element={<Login />} />
        <Route path="/sigin" element={<RegistroUser />} />
        <Route path="/perfil" element={<UserSession />} />
        <Route path="/administrador" element={<Admin />} />
        <Route path="/administrador/modificar-perfil" element={<ModificarPerfilAdministrador />} />

        {/* Usuarios  */}
        <Route path='/user/buys' element={<Autenticacion> <UserSeeBuys/> </Autenticacion>}/>
        <Route path='/user/see/profile' element={<Autenticacion> <ModificarPerfilUsuario/> </Autenticacion>}/>

        {/* Productos y Adicionales */} 
        <Route path="/administrador/addProds" element={<Autenticacion> <AddProds /> </Autenticacion>} />
        <Route path="/administrador/editProds/:productId" element={<Autenticacion> <EditProds /> </Autenticacion>} />
        <Route path="/administrador/adicionales" element={<Autenticacion> <AddAdicionales /> </Autenticacion>} />
        <Route path="/administrador/adicionales/edit/:productId" element={<Autenticacion> <EditAdicionales /> </Autenticacion>} />
        <Route path="/administrador/massiveEdition" element={<Autenticacion> <MassiveEdition /> </Autenticacion>} />
        <Route path="/administrador/editMassiveDirections/" element={<Autenticacion> <MassiveEditDirections /> </Autenticacion>} />

        {/* Categorias */}
        <Route path="/administrador/categories" element={<Autenticacion> <Categories /> </Autenticacion>} />


        {/* Costos y Direcciones */}
        <Route path="/administrador/costs" element={<Autenticacion> <EditCosts /> </Autenticacion>} />
        <Route path="/administrador/directions" element={<Autenticacion> <AddDirections /> </Autenticacion>} />

        {/* Ordenes de compra y tickets */}
        <Route path="/administrador/orders" element={<Autenticacion> <SeeOrders /> </Autenticacion>} />

        {/* Banners */}
        <Route path="/administrador/banners/" element={<AddBanners />} />
        <Route path="/administrador/edit/banners/:bannerId" element={<Autenticacion> <EditBanner /> </Autenticacion>} />

        {/* Cantidad de ventas */}
        <Route path="/administrador/ventas" element={<Autenticacion> <VerVentas /> </Autenticacion>} />

        {/* Rutas para los resultados de MercadoPago */}
        <Route path="/cart/finish/:CartID/purchase" element={<SuccessPage />} />
        <Route path="/mercadopago/pago-fallido" element={<FailurePage />} />
        <Route path="/mercadopago/pago-pendiente" element={<PendingPage />} />

      </Routes>
    </main>
  );


};

export default Main