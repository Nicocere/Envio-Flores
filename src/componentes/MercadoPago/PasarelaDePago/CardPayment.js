/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useContext, useEffect, useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { CardPayment } from '@mercadopago/sdk-react';

import { FadeLoader } from "react-spinners";
import React from 'react';
import { CookieContext, useCookies } from '../../../context/CookieContext';
import { useRouter } from 'next/navigation';
import localforage from 'localforage';

initMercadoPago(process.env.NEXT_PUBLIC_MP_EF_PUBLIC_KEY_LIVE_TEST, {
  locale: 'es-AR'
});

const CardPaymentMP = ({ nombreDestinatario, apellidoDestinatario, phoneDestinatario, mailComprador,
  localidad, precioLocalidad, calle, altura, piso, dedicatoria, nombreComprador, phoneComprador, apellidoComprador, fechaEnvio,
  horarioEnvio, servicioPremium, envioPremium, title, retiraEnLocal,
  quantity, products , total}) => {

    const { CartID, UserID } = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingMessage, setProcessingMessage] = useState('Procesando el pago, por favor espere...');
  const [isProcessingBackend, setIsProcessingBackend] = useState(false);
    const navigate = useRouter();

  const items = products.map((prod) => ({
    id: prod.id,
    title: prod.name,
    description: prod.descr,
    quantity: quantity,
    unit_price: Number(prod.precio), // Aquí se establece el precio individual de cada producto
  }));

  const initialization = {
    amount: Number(total),
    payer: {
      email: mailComprador,
    },
    installments: 1,  // Puedes ajustar esto según tus necesidades

  }

  const customization = {
    visual: {
      style: {
        customVariables: {
          textPrimaryColor: "white",
          textSecondaryColor: "white",
          inputBackgroundColor: "#5f5f5fc7", // Gris claro
          formBackgroundColor: "#650000", // 
          baseColor: "red", // Rojo oscuro
          baseColorFirstVariant: "darkred", // Rojo oscuro
          baseColorSecondVariant: "darkgreen", // Verde oscuro
          successColor: "darkgreen", // Verde oscuro
          outlinePrimaryColor: "darkgreen",
          formPadding: "",
          errorColor: "red", // Rojo
          inputFocusedBorderWidth: "1px solid darkgreen", // Verde oscuro cuando enfocado
          inputFocusedBoxShadow: "0 0 5px darkgreen", // Sombra verde oscuro cuando enfocado
          inputErrorFocusedBoxShadow: "0 0 5px red", // Sombra roja cuando hay un error

        }
      }
    },
    paymentMethods: {
      maxInstallments: 1,
    }
  }


  // Obtener el precio total de tu envío
  let shippingCost;
  let shippingTitle
  if (servicioPremium) {
    shippingCost = precioLocalidad + envioPremium; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
    shippingTitle = `Producto: ${title} + Servicio Premium`;
  } else {
    shippingTitle = `Producto: ${title} + Costo de Envío`;
    shippingCost = precioLocalidad; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
  }

  // Añadir el costo de envío como un ítem adicional

  // Definir onSubmit aquí fuera de useEffect
  const onSubmit = async (formData, payMethod) => {
    setIsLoading(true);
    setIsProcessingBackend(true);

    console.log('onSubmit', payMethod, formData);
    setProcessingMessage('Procesando el pago, por favor espere...');

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
      bodyMP.retiraEnLocal = false
      bodyMP.datosEnvio = {
        nombreDestinatario: nombreDestinatario,
        apellidoDestinatario: apellidoDestinatario,
        phoneDestinatario: phoneDestinatario,
        fecha: fechaEnvio,
        horario: horarioEnvio,
        localidad: localidad,
        precio_envio: precioLocalidad,
        calle: calle,
        altura: altura,
        piso: piso,
        dedicatoria: dedicatoria,
        products: items,
        totalPrice: Number(total),
        servicioPremium: servicioPremium,
        envioPremium: envioPremium,
      };
    }

    const data = {
      ...bodyMP, formData, payMethod, // Incluye formData y payMethod en el cuerpo de la solicitud
      // Aquí puedes agregar cualquier otro dato que necesites enviar al backend
    };

    await localforage.setItem('shoppingCart', data);


    try {
      // const response = await axios.post('https://envioflores.com/mercadopago/tarjetas/process_payment',
      const response = await fetch('http://localhost:3000/api/mercadopago/tarjetas/process_payment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MP_EF_PUBLIC_KEY_LIVE_TEST}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      const responseData = await response.json();
      
      setIsProcessingBackend(false); // Deja de mostrar el mensaje de procesamiento
      
      // Verifica si la respuesta tiene el status approved
      if (responseData.status === 'approved') {
        // Elimina el carrito del localStorage si la compra es aprobada
        // localStorage.removeItem('c');

        const dataAproved = { 
          ...responseData, ...data
        }

        await localforage.setItem('shoppingCart', dataAproved);

    
        // Redirige al usuario a la URL proporcionada por la API
        navigate.push('/compras/tarjetas/confirmacion')
      } else {
        console.error('La respuesta de la API no indica un pago aprobado.');
        setErrorMessage('Hubo un error al procesar la compra, inténtelo de nuevo.');
      }
    } catch (error) {
      setIsProcessingBackend(false); // Deja de mostrar el mensaje de procesamiento
      console.log('Error:', error);
      try {
        if (window.cardPaymentBrickController) {
          window.cardPaymentBrickController.unmount();
        }
      } catch (unmountError) {
        console.error('Error al desmontar el componente:', unmountError);
      }
      setErrorMessage('Hubo un error al procesar la compra, inténtelo de nuevo.');
    } finally {
      setIsLoading(false); // Independientemente del resultado, deja de mostrar el spinner de carga inicial
    }
  };


  const onError = async (error) => {
    console.log('Hubo un error al procesar la compra', error);
    try {
      if (window.cardPaymentBrickController) {
        window.cardPaymentBrickController.unmount();
      }
    } catch (unmountError) {
      console.error('Error al desmontar el componente:', unmountError);
    }
    setErrorMessage('Hubo un error al procesar la compra, inténtelo de nuevo.');
  };

  const onReady = async () => {
    setIsLoading(false)
  };


  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <p className="loadMP">Cargando...</p>
          <FadeLoader loading={isLoading} className="fadeLoader" color="#035b0e" />
        </div>
      )}

      {isProcessingBackend && (
        <div className="spinner-container">
          <p className="loadMP">{processingMessage}</p>
          <FadeLoader loading={isProcessingBackend} className="fadeLoader" color="#035b0e" />
        </div>
      )}


      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}

      {!isProcessingBackend && (
        <div id="cardPaymentBrick_container">
          <CardPayment
            customization={customization}
            initialization={initialization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
            
          />
        </div>
      )}

    </div>
  );
};

export default CardPaymentMP;