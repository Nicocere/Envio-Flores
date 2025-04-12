"use client";

import React from 'react';
import style from './comoComprar.module.css'
import Directions from '../Directions/Directions';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeSwitchContext';
import Head from 'next/head';

// Iconos
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BsCashCoin, BsPaypal } from 'react-icons/bs';
import { SiMercadopago, SiWesternunion } from 'react-icons/si';

function ComoComprar() {
  const emailPaypal = "paypal@regalosflores.com.ar";
  const { precioEnvioPremium } = useCart();
  const { isDarkMode } = useTheme();

  // Funciones scroll animado para los enlaces internos
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -100; // Ajuste para asegurar que quede visible completo
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={`${style.divAyudaCompras} ${isDarkMode ? style.darkMode : ''}`}>
    
      
      <div className={style.headerContainer}>
        <h1 className={style.mainTitle}>GUÍA DE COMPRA</h1>
        <p className={style.subtitle}>Todo lo que necesitas saber para realizar tu pedido</p>
      </div>

      <div className={style.container}>
        {/* Tabla de contenidos */}
        <div className={style.contentTable}>
          <div className={style.contentCard}>
            <h2 className={style.contentTitle}>Índice</h2>
            <div className={style.navLinks}>
              <button className={style.navButton} onClick={() => scrollToSection('proceso')}>
                <ShoppingBagIcon className={style.icon} />
                <span>Proceso de compra</span>
              </button>
              <button className={style.navButton} onClick={() => scrollToSection('pago')}>
                <PaymentIcon className={style.icon} />
                <span>Formas de pago</span>
              </button>
              <button className={style.navButton} onClick={() => scrollToSection('envio')}>
                <LocalShippingIcon className={style.icon} />
                <span>Políticas de envío</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sección 1: Proceso de compra */}
        <section id="proceso" className={style.section}>
          <div className={style.sectionCard}>
            <div className={style.sectionHeader}>
              <ShoppingBagIcon className={style.sectionIcon} />
              <h2 className={style.sectionTitle}>Proceso de compra</h2>
            </div>

            <div className={style.processSteps}>
              <div className={style.step}>
                <div className={style.stepNumber}>1</div>
                <div className={style.stepContent}>
                  <h3 className={style.stepTitle}>Elija la zona de envío</h3>
                  <p>Seleccione su área para ver los productos disponibles para esa región.</p>
                </div>
              </div>

              <div className={style.step}>
                <div className={style.stepNumber}>2</div>
                <div className={style.stepContent}>
                  <h3 className={style.stepTitle}>Seleccione productos</h3>
                  <p>Navegue por las categorías y productos, haga clic en "Ver opciones" o en la imagen para obtener más detalles.</p>
                </div>
              </div>

              <div className={style.step}>
                <div className={style.stepNumber}>3</div>
                <div className={style.stepContent}>
                  <h3 className={style.stepTitle}>Añada al carrito</h3>
                  <p>Agregue el producto al carrito para continuar con el proceso de compra.</p>
                </div>
              </div>

              <div className={style.step}>
                <div className={style.stepNumber}>4</div>
                <div className={style.stepContent}>
                  <h3 className={style.stepTitle}>Complete el formulario</h3>
                  <p>Ingrese los datos del destinatario, dirección, fecha y horario de entrega, dedicatoria, información de pago y sus datos como comprador.</p>
                </div>
              </div>

              <div className={style.step}>
                <div className={style.stepNumber}>5</div>
                <div className={style.stepContent}>
                  <h3 className={style.stepTitle}>Confirmación</h3>
                  <p>Recibirá un email confirmando su compra con su número de pedido. Puede responder ese email si necesita realizar algún cambio.</p>
                </div>
              </div>
            </div>

            <div className={style.securityNote}>
              <div className={style.securityIcon}>🔒</div>
              <p>Toda la información proporcionada viaja en un <strong>servidor seguro (SSL)</strong>, lo que garantiza que sus datos están encriptados y protegidos contra accesos no autorizados.</p>
            </div>
          </div>
        </section>

        {/* Sección 2: Formas de pago */}
        <section id="pago" className={style.section}>
          <div className={style.sectionCard}>
            <div className={style.sectionHeader}>
              <PaymentIcon className={style.sectionIcon} />
              <h2 className={style.sectionTitle}>Formas de pago</h2>
            </div>

            <div className={style.paymentMethods}>
              <div className={style.paymentGroup}>
                <h3 className={style.paymentGroupTitle}>
                  <PublicIcon className={style.paymentIcon} />
                  Desde cualquier parte del mundo
                </h3>
                
                <div className={style.paymentMethod}>
                  <CreditCardIcon className={style.methodIcon} />
                  <div className={style.methodDetails}>
                    <h4>Tarjetas de Crédito</h4>
                    <p>Aceptamos Visa, American Express, Mastercard y Cabal.</p>
                  </div>
                </div>
                
                <div className={style.paymentMethod}>
                  <BsPaypal className={style.methodIcon} />
                  <div className={style.methodDetails}>
                    <h4>PayPal</h4>
                    <p>Realice una transferencia a: <strong>{emailPaypal}</strong></p>
                  </div>
                </div>
                
                <div className={style.paymentMethod}>
                  <SiWesternunion className={style.methodIcon} />
                  <div className={style.methodDetails}>
                    <h4>Western Union</h4>
                    <p>Una vez realizada la compra recibirá los datos para efectuar el pago.</p>
                  </div>
                </div>
              </div>

              <div className={style.paymentGroup}>
                <h3 className={style.paymentGroupTitle}>
                  <LocationOnIcon className={style.paymentIcon} />
                  Si está en Argentina
                </h3>
                
                <div className={style.paymentMethod}>
                <SiMercadopago  className={style.methodIcon} />
                <div className={style.methodDetails}>
                    <h4>Transferencia o depósito bancario</h4>
                    <p>Mediante MercadoPago con cuenta. Recibirá instrucciones por email.</p>
                  </div>
                </div>
              </div>

              <div className={style.paymentGroup}>
                <h3 className={style.paymentGroupTitle}>
                  <LocationOnIcon className={style.paymentIcon} />
                  En Capital Federal (Buenos Aires)
                </h3>
                
                <div className={style.paymentMethod}>
                  <SiMercadopago  className={style.methodIcon} />
                  <div className={style.methodDetails}>
                    <h4>Mercado Pago</h4>
                    <p>Puede pagar en efectivo, tarjeta de crédito o débito. Recibirá instrucciones por email.</p>
                  </div>
                </div>

                <div className={style.paymentMethod}>
                  <BsCashCoin className={style.methodIcon} />
                  <div className={style.methodDetails}>
                    <h4>Efectivo</h4>
                    <p>Visite nuestro local en Av. Cramer 1915 (CABA - Belgrano). Reserve previamente.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={style.paymentNote}>
              <p>Sea cual fuese la forma de pago que elija, el sistema siempre lo guiará para realizar e informar el pago correctamente.</p>
            </div>
          </div>
        </section>

        {/* Sección 3: Políticas de envío */}
        <section id="envio" className={style.section}>
          <div className={style.sectionCard}>
            <div className={style.sectionHeader}>
              <LocalShippingIcon className={style.sectionIcon} />
              <h2 className={style.sectionTitle}>Políticas de envío</h2>
            </div>

            <div className={style.shippingFAQ}>
              <div className={style.faqItem}>
                <div className={style.faqQuestion}>
                  <HelpOutlineIcon className={style.questionIcon} />
                  <h3>¿Existe un cargo de envío?</h3>
                </div>
                <div className={style.faqAnswer}>
                  <p>Para visualizar el costo de envío en <strong>Capital Federal (ciudad de Buenos Aires)</strong> y <strong>Gran Buenos Aires</strong>, el cargo varía según el partido. Seleccione a continuación su localidad:</p>
                  
                  <div className={style.directionsContainer}>
                    <Directions comoComprar={true} />
                  </div>
                  
                  <p className={style.premiumNote}>
                    Si eliges el Servicio Premium, se adicionarán AR$ {precioEnvioPremium} por entrega en horario puntual.
                  </p>
                </div>
              </div>

              <div className={style.faqItem}>
                <div className={style.faqQuestion}>
                  <AccessTimeIcon className={style.questionIcon} />
                  <h3>¿Qué días se realizan entregas y en qué horarios?</h3>
                </div>
                <div className={style.faqAnswer}>
                  <p>En <strong>Capital Federal y Gran Buenos Aires</strong>, entregamos:</p>
                  <ul className={style.deliveryTimes}>
                    <li>Lunes a sábados: 8 a 20 hs</li>
                    <li>Domingos: 9 a 13 hs</li>
                  </ul>
                  <p>Las entregas se realizan en franjas horarias de 4 horas (ejemplo: 10 a 14 hs).</p>
                  <p>Si necesitas que el pedido se entregue en un horario puntual, puedes elegir el <strong>Servicio Premium</strong> con un costo adicional de AR$ 1990.00. Esto te permitirá definir un horario de entrega con un margen de tolerancia de +/- 15 minutos.</p>
                </div>
              </div>

              <div className={style.faqItem}>
                <div className={style.faqQuestion}>
                  <HelpOutlineIcon className={style.questionIcon} />
                  <h3>¿Es necesario realizar la compra con anticipación?</h3>
                </div>
                <div className={style.faqAnswer}>
                  <p>Para garantizar la disponibilidad del producto y poder coordinar la entrega, recomendamos realizar y abonar la compra con al menos 24hs de anticipación. Sin embargo, aceptamos pedidos para el mismo día, siempre que se hagan antes de las 15 pm. En ese caso, consulta la disponibilidad del producto deseado.</p>
                </div>
              </div>

              <div className={style.faqItem}>
                <div className={style.faqQuestion}>
                  <HelpOutlineIcon className={style.questionIcon} />
                  <h3>¿Qué pasa si el destinatario no se encuentra?</h3>
                </div>
                <div className={style.faqAnswer}>
                  <p>Si el destinatario no está disponible, intentamos dejar el pedido con un familiar, encargado de seguridad o vecino. De no encontrar a alguien que lo reciba, intentaremos comunicarnos con el destinatario. Si no logramos contactarlo, el pedido volverá a nuestra florería y nos pondremos en contacto contigo. Para una segunda entrega, deberás abonar un cargo adicional, cuyo valor estará determinado por la distancia y la disponibilidad de nuestros vehículos.</p>
                </div>
              </div>
            </div>

            <div className={style.internationalShipping}>
              <div className={style.internationalHeader}>
                <PublicIcon className={style.internationalIcon} />
                <h3 className={style.internationalTitle}>Pedidos Internacionales</h3>
              </div>
              
              <p className={style.internationalText}>
                <strong>Envio Flores</strong> cuenta con acuerdos directos con florerías de diversos países, como España, Inglaterra, Italia, Estados Unidos, Canadá, entre otros, permitiendo gestionar, <u>sin intermediarios y con precios reducidos para nuestros clientes</u>, envíos de arreglos florales.
              </p>
              
              <p className={style.internationalText}>
                Si deseas enviar flores a otro país, envíanos una consulta indicando el país y ciudad de destino. Nuestro equipo te proporcionará toda la información sobre precios, productos y condiciones.
              </p>
              
              <div className={style.internationalNote}>
                <WhatsAppIcon className={style.whatsappIcon} />
                <div>
                  <p>Los pedidos internacionales requieren al menos 24 hs de anticipación y se gestionan únicamente por teléfono, de lunes a viernes de 10 a 17 hs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ComoComprar;
