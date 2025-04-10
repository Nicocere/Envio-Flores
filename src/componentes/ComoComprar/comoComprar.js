import React, { useContext } from 'react';
import style from './comoComprar.module.css'
import Directions from '../Directions/Directions';
import { Helmet } from 'react-helmet';
import { CartContext } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeSwitchContext';


function ComoComprar() {
  // Puedes colocar cualquier lógica JavaScript aquí si la necesitas en el futuro
  const emailPaypal = "paypal@regalosflores.com.ar";  // Reemplazado el script para el email
  const {precioEnvioPremium} =  useContext(CartContext);
  const { isDarkMode } = useTheme();

  return (
    <div className={style.divAyudaCompras}>
                     <Helmet>
                    <title>Cómo Comprar en Envio Flores? - Venta y envio de arreglos florales, comestibles, chocolates , bebidas y demás 
                    a domicilio en el día
                     a Gran Buenos Aires y Capital Federal</title>
                     <meta name="robots" content="index, follow" />
                    <meta name="description" content="Envio de flores, rosas, ramos, bombones, regalos 
                    a domicilio en Argentina. Venta online y telefónica. Pagos en efectivo y 
                    con tarjetas de crédito. Entrega inmediata. Delivery en el día en Buenos Aires. Envioflores.com" />
                </Helmet> 
        <h1 style={{color: !isDarkMode ? '#670000' : 'white', margin:'30px 0'}}>AYUDA PARA COMPRAR</h1>
        <div className="container2">
          <div className={style.divLinksAyuda}>

          
            <a className={style.linkAyuda} href="#proceso">1. Cómo es el proceso de compra?</a><br />
            <a className={style.linkAyuda} href="#pago">2. Formas de pago</a><br />
            <a className={style.linkAyuda} href="#envio">3. Políticas de envío</a>
         
          </div>

          <div id="proceso" className={style.divProceso}>
            <h3 className={style.proceso}>Sobre el proceso de compra</h3>
            <p>El proceso de compra en Envio Flores es realmente sencillo. En ning&uacute;n momento le solicitaremos que se registre en el sitio ni tendr&aacute; que recordar una molesta contrase&ntilde;a.</p>
            <p>1. Comience eligiendo la zona de env&iacute;o: as&iacute; podr&aacute; ver las categor&iacute;as y productos disponibles para esa regi&oacute;n. Luego puede ir recorriendo los distintos productos.</p>
            <p>2. Cuando encuentre alguno de su agrado, pulse &ldquo;Ver opciones &rdquo; o haga click sobre la imagen del producto y luego &quot;Agregar al carrito&quot;.</p>
            <p>3. Una vez dentro del carro de compras, podr&aacute; completar el formulario de compra.</p>
            <p>4. En el formulario de compra se le solicitar&aacute;n los datos del env&iacute;o (datos del destinatario, direcci&oacute;n, d&iacute;a y horario de entrega, dedicatoria, datos para el pago, datos del comprador, etc). Es muy importante que nos provea un n&uacute;mero de tel&eacute;fono del destinatario, para poder comunicarnos con &eacute;l/ella frente a cualquier eventualidad.</p>
            <p>5. Una vez completados todos los datos necesarios, le llegar&aacute; un e-mail confirmando la compra. En ese e-mail recibir&aacute; su n&uacute;mero de pedido, con el cual podr&aacute; realizar cualquier consulta a nuestro servicio de atenci&oacute;n al cliente. Si alg&uacute;n dato del e-mail de confirmaci&oacute;n llegase a ser err&oacute;neo, puede responder el mensaje para realizar cambios y aclaraciones.</p>
            <p><strong>Recuerde que estar&aacute; proporcionando los datos dentro de un servidor seguro (SSL), lo que garantiza que la informaci&oacute;n se encripta con una llave de seguridad, no pudiendo podr&aacute; ser interferida y ni vista por terceros</strong>,</p>
          </div>


          <div id="pago" className={style.divPago}>

            <h3 className={style.proceso} >Formas de Pago</h3>
            <p><strong>Desde cualquier parte del mundo puede abonar con: </strong></p>
            <p>
              - <strong>Tarjetas de Crédito</strong> (Visa, American Express, Mastercard y Cabal).
              - <strong>Paypal</strong>: Realice una transferencia a la siguiente cuenta: {emailPaypal}
              <strong>Western Union</strong>: Una vez hecha la compra usted recibir&aacute; un e-mail con los datos para que efect&uacute;e el pago y de c&oacute;mo debe informarlo.</p>

            <p><strong>Si usted se encuentra en Argentina: </strong></p>
            <p>- Tambi&eacute;n puede hacer una <strong>transferencia o dep&oacute;sito bancario</strong> en mediante MercadoPago con cuenta. Una vez hecha la compra usted recibir&aacute; un e-mail con los datos para que efect&uacute;e el pago y de c&oacute;mo debe informarlo.</p>

            <p><strong>Y si se encuentra en Capital Federal (Buenos Aires)</strong></p>
            <p>- Se puede acercar a abonar en <strong>efectivo</strong> en nuestro local que queda en Av.Cramer 1915 (CABA - Belgrano). Previamente debe reservar el pedido por tel&eacute;fono o la web.</p>
            <p >Sea cual fuese la forma de pago que usted elija, el sistema siempre lo guiar&aacute; para realizar e informar el pago.
            </p>
          </div>

          <div id="envio" className={style.divPago}>

            <h3 className={style.proceso} >Políticas de envíos</h3>


            <div>
              <p><strong>¿Existe un cargo de envío?</strong></p>
              <p>Para visualizar el costo de envio en <strong>Capital Federal (ciudad de Buenos Aires)</strong> y <strong>Gran Buenos Aires</strong>, 
              el cargo varía según el partido.
              Seleccione a continuacion su localidad.</p>
               <div className={style.directions}>
                <Directions comoComprar={true} />
              
                </div>  

                Si eliges el Servicio Premium, se adicionarán AR$ {precioEnvioPremium} por entrega en horario puntual.
              <p><strong className={style.divPago}>¿Qué días se realizan entregas y en qué horarios?</strong></p>
              <p>- En <strong>Capital Federal y Gran Buenos Aires</strong>, entregamos de lunes a sábados de 8 a 20 hs, y los domingos de 9 a 13 hs. Las entregas se realizan en franjas horarias de 4 horas (ejemplo: 10 a 14 hs).
               Si necesitas que el pedido se entregue en un horario puntual, puedes elegir el <strong>Servicio Premium</strong> 
               con un costo adicional de AR$ 1990.00. 
               Esto te permitirá definir un horario de entrega con un margen de tolerancia de +/- 15 minutos. 
               </p>

              <p><strong className={style.divPago} >¿Es necesario realizar la compra con anticipación?</strong></p>
              <p>Para garantizar la disponibilidad del producto y poder coordinar la entrega, recomendamos realizar y abonar la compra con al menos 24hs de anticipación. Sin embargo, aceptamos pedidos para el mismo día, siempre que se hagan antes de las 15 pm. En ese caso, consulta la disponibilidad del producto deseado.</p>

              <p><strong className={style.divPago}>¿Qué pasa si el destinatario no se encuentra?</strong></p>
              <p>Si el destinatario no está disponible, intentamos dejar el pedido con un familiar, encargado de seguridad o vecino. De no encontrar a alguien que lo reciba, intentaremos comunicarnos con el destinatario. Si no logramos contactarlo, el pedido volverá a nuestra florería y nos pondremos en contacto contigo. Para una segunda entrega, deberás abonar un cargo adicional, cuyo valor estará determinado por la distancia y la disponibilidad de nuestros vehículos.</p>

              <h3 className={style.divPago} >Pedidos Internacionales</h3>
              <p><strong>Envio Flores</strong> cuenta con acuerdos directos con florerías
               de diversos países, como España, Inglaterra, Italia, Estados Unidos, Canadá, 
               entre otros, permitiendo gestionar, <u>sin intermediarios y con precios reducidos para nuestros clientes</u>, 
               envíos de arreglos florales. Si deseas enviar flores a otro país, envíanos una consulta indicando 
               el país y ciudad de destino. Nuestro equipo te proporcionará toda la información sobre precios, 
               productos y condiciones. Los pedidos internacionales requieren al menos 24 hs de anticipación y 
               se gestionan únicamente por teléfono, de lunes a viernes de 10 a 17 hs.</p>
            </div>

          </div>
        
      </div>
    </div>
  );
}

export default ComoComprar;
