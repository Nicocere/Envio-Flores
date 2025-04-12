import axios from 'axios'
import { Wallet } from '@mercadopago/sdk-react'
import { useContext, useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react'
import { FadeLoader } from "react-spinners";
import React from 'react';
import { CookieContext, useCookies } from '../../context/CookieContext';

initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_EF_PUBLIC_KEY, {
  locale: 'es-AR'
});


const MercadoPagoButton = ({ nombreDestinatario, apellidoDestinatario, phoneDestinatario, mailComprador,
  localidad, precioLocalidad, calle, altura, piso, dedicatoria, nombreComprador, phoneComprador, apellidoComprador, fechaEnvio,
  horarioEnvio, servicioPremium, envioPremium, total,
  quantity, products, retiraEnLocal }) => {


  const [processingMessage, setProcessingMessage] = useState('Procesando el pago, por favor espere...');
  const [isProcessingBackend, setIsProcessingBackend] = useState(false);
  const { CartID, UserID } = useCookies();
  const [isLoading, setIsLoading] = useState(true);

  const items = products.map((prod) => ({
    id: prod.id,
    title: prod.name,
    quantity: quantity,
    unit_price: Number(prod.precio), // Aquí se establece el precio individual de cada producto
  }));

  const customization = {
    texts: {
      action: 'pay',
      valueProp: 'security_safety',
    },
    visual: {
      hideValueProp: false,
      buttonBackground: 'white', // default, black, blue, white
      valuePropColor: 'white', // grey, white
      buttonHeight: '48px', // min 48px - max free
      borderRadius: '4px',
      verticalPadding: '16px', // min 16px - max free
      horizontalPadding: '0px', // min 0px - max free
    },
    checkout: {
      theme: {
        elementsColor: '#4287F5', // color hex code
        headerColor: '#4287F5', // color hex code
      },
    },
  };

let bodyMP = {
    MercadoPago: true,
    createdAt: new Date(),
    products: products,
    item: items,
    CartID: CartID,
    datosComprador: 
        {
            UserID: UserID,
            nombreComprador: nombreComprador,
            apellidoComprador: apellidoComprador,
            email: mailComprador,
            tel_comprador: phoneComprador,
        },
    purpose: 'wallet_purchase',
};

if (retiraEnLocal) {
    bodyMP.retiraEnLocal = true;
    bodyMP.datosEnvio = 
        {
            products: products,
            dedicatoria: dedicatoria ? dedicatoria : 'Sin dedicatoria',
            totalPrice: Number(total),
        };
} else {
    bodyMP.retiraEnLocal = false;
    bodyMP.datosEnvio = 
        {
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
            products: products, 
            totalPrice: Number(total),
            servicioPremium: servicioPremium,
            envioPremium: envioPremium,
        };
}

  const onSubmit = async () => {

    setIsLoading(true)
    setIsProcessingBackend(true);
    setProcessingMessage('Procesando el pago, por favor espere...');

    try {
      const response = await axios.post('http://localhost:3000/api/mercadopago/payment',
      // const response = await axios.post('https://envio-flores.rj.r.appspot.com/mercadopago/payment',
        bodyMP,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MERCADOPAGO_EF_PUBLIC_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setIsProcessingBackend(false); // Deja de mostrar el mensaje de procesamiento

      // Si necesitas redireccionar al usuario a una URL proporcionada por Mercado Pago,
      // puedes hacerlo aquí:
      return response.data.preferenceId
    } catch (error) {
      console.log('Error al enviar la informacion a Mercado Pago:', error);
      setIsProcessingBackend(false); // Deja de mostrar el mensaje de procesamiento
    }
  };

  const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
    console.log("Hubo un error al ejecutar el servicio de Mercado Pago", error);
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
      
      {!isProcessingBackend && (
      <Wallet
        customization={customization}
        initialization={{ redirectMode: "modal" }}
        onSubmit={onSubmit}
        onReady={() => setIsLoading(false)} // <-- Desactivar el spinner cuando Brick esté listo
        onError={onError}
      />
  )}
    </div>
  )
};

export default MercadoPagoButton;
