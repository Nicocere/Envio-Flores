import { useState, useRef, useEffect } from 'react';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { FadeLoader } from "react-spinners";
import React from 'react';
import { useCookies } from '../../../context/CookieContext';
import { useTheme } from '../../../context/ThemeSwitchContext';
import { useRouter } from 'next/navigation';
import localforage from 'localforage';
import styles from './cardPayment.module.css';
import { Lock, CreditCard, CheckCircle, AlertCircle, Shield, Info, Calendar, Clock } from 'react-feather';
import Image from 'next/image';

// Inicialización de MercadoPago con la clave pública
initMercadoPago(process.env.NEXT_PUBLIC_MP_EF_PUBLIC_KEY_LIVE_TEST, {
  locale: 'es-AR'
});

const CardPaymentMP = ({ 
  nombreDestinatario, 
  apellidoDestinatario, 
  phoneDestinatario, 
  mailComprador,
  localidad, 
  precioLocalidad, 
  calle, 
  altura, 
  piso, 
  dedicatoria, 
  nombreComprador, 
  phoneComprador, 
  apellidoComprador, 
  fechaEnvio,
  horarioEnvio, 
  servicioPremium, 
  envioPremium, 
  title, 
  retiraEnLocal,
  quantity, 
  products, 
  total
}) => {
  // Referencias y contexto
  const containerRef = useRef(null);
  const { CartID, UserID } = useCookies();
  const { isDarkMode } = useTheme();
  const navigate = useRouter();
  
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingMessage, setProcessingMessage] = useState('Procesando el pago, por favor espere...');
  const [isProcessingBackend, setIsProcessingBackend] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success', 'error'
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  // Mapea los productos para el formato requerido por MercadoPago
  const items = products.map((prod) => ({
    id: prod.id,
    title: prod.name,
    description: prod.descr,
    quantity: quantity,
    unit_price: Number(prod.precio),
  }));

  // Configuración de inicialización para MercadoPago
  const initialization = {
    amount: Number(total),
    payer: {
      email: mailComprador,
    },
    installments: 1,
  };

  // Personalización visual del componente de MercadoPago según el modo oscuro/claro
  const customization = {
    visual: {
      style: {
        customVariables: isDarkMode ? {
          textPrimaryColor: "#ffffff",
          textSecondaryColor: "#e0e0e0",
          inputBackgroundColor: "#3c3c3c",
          formBackgroundColor: "#262626",
          baseColor: "#ff5252",
          baseColorFirstVariant: "#b71c1c",
          baseColorSecondVariant: "#66bb6a",
          successColor: "#4caf50",
          outlinePrimaryColor: "#66bb6a",
          formPadding: "",
          errorColor: "#ff5252",
          inputFocusedBorderWidth: "1px solid #66bb6a",
          inputFocusedBoxShadow: "0 0 5px rgba(102, 187, 106, 0.5)",
          inputErrorFocusedBoxShadow: "0 0 5px rgba(255, 82, 82, 0.5)",
        } : {
          textPrimaryColor: "white",
          textSecondaryColor: "white",
          inputBackgroundColor: "#5f5f5fc7",
          formBackgroundColor: "#650000",
          baseColor: "red",
          baseColorFirstVariant: "darkred",
          baseColorSecondVariant: "darkgreen",
          successColor: "darkgreen",
          outlinePrimaryColor: "darkgreen",
          formPadding: "",
          errorColor: "red",
          inputFocusedBorderWidth: "1px solid darkgreen",
          inputFocusedBoxShadow: "0 0 5px darkgreen",
          inputErrorFocusedBoxShadow: "0 0 5px red",
        }
      }
    },
    paymentMethods: {
      maxInstallments: 1,
    }
  };

  // Determinar título y costo de envío
  const shippingTitle = servicioPremium 
    ? `Producto: ${title} + Servicio Premium` 
    : `Producto: ${title} + Costo de Envío`;

  // useEffect para asegurar que el contenedor esté disponible antes de montar el componente
  useEffect(() => {
    // Establecer un tiempo de espera para detectar si hay problemas de montaje
    const timeoutId = setTimeout(() => {
      if (isLoading && containerRef.current) {
        // Intentar forzar una re-renderización si el componente tarda mucho en cargar
        setIsLoading(true);
        console.log('Forzando recarga del componente de pago');
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      // Limpiar el controlador al desmontar
      try {
        if (window.cardPaymentBrickController) {
          window.cardPaymentBrickController.unmount();
        }
      } catch (error) {
        console.error('Error al desmontar el controlador:', error);
      }
    };
  }, []);

  // Manejar el envío del formulario de pago
  const onSubmit = async (formData, payMethod) => {
    setIsLoading(true);
    setIsProcessingBackend(true);
    setPaymentStatus('processing');
    setProcessingMessage('Procesando el pago, por favor espere...');

    // Preparar datos para el backend
    let bodyMP = {
      MercadoPago: true,
      createdAt: new Date(),
      products: products,
      item: items,
      CartID: CartID,
      datosComprador: {
        UserID: UserID,
        nombreComprador: nombreComprador,
        apellidoComprador: apellidoComprador,
        email: mailComprador,
        tel_comprador: phoneComprador,
      },
      mp_data: {
        data: {
          formData,
          payMethod,
          description: shippingTitle
        }
      }
    };

    // Configurar datos adicionales según tipo de entrega
    if (retiraEnLocal) {
      bodyMP.retiraEnLocal = true;
      bodyMP.datosEnvio = {
        dedicatoria: dedicatoria ? dedicatoria : 'Sin dedicatoria',
        products: items,
        totalPrice: Number(total),
        fecha: fechaEnvio,
        horario: horarioEnvio,
      };
    } else {
      bodyMP.retiraEnLocal = false;
      bodyMP.datosEnvio = {
        nombreDestinatario,
        apellidoDestinatario,
        phoneDestinatario,
        fecha: fechaEnvio,
        horario: horarioEnvio,
        localidad,
        precio_envio: precioLocalidad,
        calle,
        altura,
        piso,
        dedicatoria,
        products: items,
        totalPrice: Number(total),
        servicioPremium,
        envioPremium,
      };
    }

    const data = {
      ...bodyMP, formData, payMethod
    };

    // Guardar datos en almacenamiento local
    await localforage.setItem('shoppingCart', data);

    try {
      // Simulamos progreso de procesamiento
      setProcessingMessage('Validando información de tarjeta...');
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingMessage('Contactando al banco emisor...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingMessage('Procesando transacción...');
      
      // Envío de datos al servidor
      const response = await fetch('/api/mercadopago/tarjetas/process_payment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MP_EF_PUBLIC_KEY_LIVE_TEST}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      const responseData = await response.json();
      
      setIsProcessingBackend(false);
      
      // Verificar estado de la respuesta
      if (responseData.status === 'approved') {
        setPaymentStatus('success');
        setProcessingMessage('¡Pago aprobado! Redirigiendo...');
        
        const dataAproved = { 
          ...responseData, ...data
        };

        await localforage.setItem('shoppingCart', dataAproved);
        
        // Esperar un momento para mostrar el mensaje de éxito antes de redirigir
        setTimeout(() => {
          navigate.push('/compras/tarjetas/confirmacion');
        }, 1500);
      } else {
        setPaymentStatus('error');
        console.error('La respuesta de la API no indica un pago aprobado:', responseData);
        setErrorMessage(
          responseData.error_message || 
          'Hubo un problema al procesar tu pago. Por favor, verifica los datos de tu tarjeta e inténtalo de nuevo.'
        );
      }
    } catch (error) {
      setIsProcessingBackend(false);
      setPaymentStatus('error');
      console.log('Error:', error);
      
      try {
        if (window.cardPaymentBrickController) {
          window.cardPaymentBrickController.unmount();
        }
      } catch (unmountError) {
        console.error('Error al desmontar el componente:', unmountError);
      }
      
      setErrorMessage('Ocurrió un error al comunicarse con el servidor de pagos. Por favor, inténtalo de nuevo en unos momentos o contacta a nuestro equipo de soporte.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar errores en el componente de MercadoPago
  const onError = async (error) => {
    console.log('Error en el componente de MercadoPago:', error);
    setPaymentStatus('error');
    
    try {
      if (window.cardPaymentBrickController) {
        window.cardPaymentBrickController.unmount();
      }
    } catch (unmountError) {
      console.error('Error al desmontar el componente:', unmountError);
    }
    
    setErrorMessage('Ha ocurrido un problema con el procesador de pagos. Por favor, verifica los datos de tu tarjeta o inténtalo con otro método de pago.');
  };

  // Manejar cuando el componente está listo
  const onReady = async () => {
    setIsLoading(false);
  };

  // Formatear fecha de envío para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  return (
    <div className={`${styles.cardPaymentContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Encabezado del formulario de pago */}
      <div className={styles.paymentHeader}>
        <div className={styles.securityBadge}>
          <Shield size={18} />
          <span>Pago Seguro con Encriptación SSL</span>
        </div>
        <h2 className={styles.paymentTitle}>Finalizar Compra</h2>
        <div className={styles.paymentSummary}>
          <div className={styles.orderSummaryHeader}>
            <h3>Resumen del pedido</h3>
            <button 
              className={styles.infoButton}
              onClick={() => setShowPaymentInfo(!showPaymentInfo)}
              aria-label="Ver detalles del pedido"
            >
              <Info size={18} />
            </button>
          </div>

          {showPaymentInfo && (
            <div className={styles.orderDetails}>
              <div className={styles.orderGroup}>
                <div className={styles.orderLine}>
                  <span>Productos:</span>
                  <span>${products.reduce((sum, prod) => sum + Number(prod.precio), 0)}</span>
                </div>
                {!retiraEnLocal && (
                  <div className={styles.orderLine}>
                    <span>Envío:</span>
                    <span>${precioLocalidad}</span>
                  </div>
                )}
                {servicioPremium && (
                  <div className={styles.orderLine}>
                    <span>Servicio Premium:</span>
                    <span>${envioPremium}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.deliveryInfo}>
                <div className={styles.deliveryDetail}>
                  <Calendar size={14} />
                  <span>Fecha de entrega: {formatDate(fechaEnvio)}</span>
                </div>
                <div className={styles.deliveryDetail}>
                  <Clock size={14} />
                  <span>Horario: {horarioEnvio}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className={styles.totalAmount}>
            <span>Total a pagar:</span>
            <span className={styles.totalPrice}>${total}</span>
          </div>
        </div>
      </div>

      {/* Estado de carga inicial */}
      {isLoading && (
        <div className={styles.spinnerContainer}>
          <p className={styles.loadingText}>Preparando formulario de pago seguro...</p>
          <FadeLoader loading={isLoading} color={isDarkMode ? "#ff5252" : "#8b0000"} />
          <p className={styles.loadingHint}>Esto puede tomar unos segundos</p>
        </div>
      )}

      {/* Estado de procesamiento del pago */}
      {isProcessingBackend && (
        <div className={styles.processingContainer}>
          <div className={styles.processingContent}>
            <FadeLoader loading={isProcessingBackend} color={isDarkMode ? "#ff5252" : "#8b0000"} />
            <p className={styles.processingMessage}>{processingMessage}</p>
            <div className={styles.processingSteps}>
              <div className={`${styles.processingStep} ${processingMessage.includes('Validando') ? styles.active : ''}`}>
                <CreditCard size={16} />
                <span>Validación</span>
              </div>
              <div className={`${styles.processingStep} ${processingMessage.includes('Contactando') ? styles.active : ''}`}>
                <CreditCard size={16} />
                <span>Autorización</span>
              </div>
              <div className={`${styles.processingStep} ${processingMessage.includes('Procesando') ? styles.active : ''}`}>
                <CreditCard size={16} />
                <span>Procesamiento</span>
              </div>
              <div className={`${styles.processingStep} ${paymentStatus === 'success' ? styles.active : ''}`}>
                <CheckCircle size={16} />
                <span>Completado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar mensajes de error si existen */}
      {errorMessage && (
        <div className={styles.errorContainer}>
          <AlertCircle size={20} />
          <p>{errorMessage}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {/* El contenedor del componente de MercadoPago */}
      {!isProcessingBackend && !errorMessage && (
        <div 
          id="cardPaymentBrick_container" 
          ref={containerRef}
          className={styles.mercadoPagoContainer}
        >
          <CardPayment
            customization={customization}
            initialization={initialization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
          />
        </div>
      )}

      {/* Información adicional sobre seguridad */}
      <div className={styles.securityInfo}>
        <div className={styles.securityItem}>
          <Lock size={16} />
          <span>Conexión segura SSL</span>
        </div>
        <div className={styles.securityItem}>
          <CreditCard size={16} />
          <span>Datos encriptados</span>
        </div>
        <div className={styles.securityItem}>
          <Shield size={16} />
          <span>Protección antifraude</span>
        </div>
      </div>

      {/* Logo e información de procesamiento de pagos */}
      <div className={styles.paymentProviderInfo}>
        <p>Procesado por</p>
        <Image 
          src="/assets/mp-icon.png" 
          alt="MercadoPago" 
          width={100}
          height={100}
          className={styles.mpLogo}
        />
        <p className={styles.paymentAssurance}>
          Envío de Flores no almacena información de tu tarjeta
        </p>
      </div>
    </div>
  );
};

export default CardPaymentMP;