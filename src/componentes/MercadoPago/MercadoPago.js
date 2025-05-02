"use client";

import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { FadeLoader } from "react-spinners";
import React from 'react';
import { useCookies } from '../../context/CookieContext';
import { useTheme } from '@/context/ThemeSwitchContext';
import localforage from 'localforage';
// Eliminamos la importación no utilizada de useRouter

// Inicializar MercadoPago
initMercadoPago(process.env.NEXT_PUBLIC_MP_EF_PUBLIC_KEY, {
  locale: 'es-AR',
});

const MercadoPagoButton = ({
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
  total,
  quantity,
  products,
  retiraEnLocal
}) => {

  // Estados
  const [preferenceId, setPreferenceId] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('Preparando tu pago...');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { CartID, UserID } = useCookies();
  const { isDarkMode } = useTheme();
  
  // Mapeo de productos
  const items = products.map((prod) => ({
    id: prod.id,
    title: prod.name,
    quantity: quantity,
    unit_price: Number(prod.precio),
  }));

  // Mantener estructura original de bodyMP
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
    purpose: 'wallet_purchase',
  };

  if (retiraEnLocal) {
    bodyMP.retiraEnLocal = true;
    bodyMP.datosEnvio = {
      products: products,
      dedicatoria: dedicatoria ? dedicatoria : 'Sin dedicatoria',
      totalPrice: Number(total),
      fecha: fechaEnvio,
      horario: horarioEnvio,
    };
  } else {
    bodyMP.retiraEnLocal = false;
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
      products: products,
      totalPrice: Number(total),
      servicioPremium: servicioPremium,
      envioPremium: envioPremium,
    };
  }

  // Crear preferenceId
  const createPreference = async () => {
    setIsLoading(true);
    setProcessingMessage('Conectando con MercadoPago...');
    setError(null);

    try {
      // Guardar el bodyMP en localforage
      await localforage.setItem('shoppingCart', bodyMP);
      // Determinar URL según entorno
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

      const response = await fetch(`${baseUrl}/api/mercadopago/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyMP),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      setProcessingMessage('Preferencia creada, preparando opciones de pago...');
      setPreferenceId(data.preferenceId);
      setShowPaymentForm(true);
    } catch (error) {
      setError('No pudimos conectar con MercadoPago. Por favor, inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar proceso de pago
  const handleStartPayment = () => {
    setShowPaymentForm(false);
    createPreference();
  };

  return (
    <div className="mercadopago-container">
      {/* Mensaje de error si ocurre */}
      {error && (
        <div className="mp-error-container">
          <p className="mp-error-message">{error}</p>
          <button
            className="mp-retry-button"
            onClick={() => {
              setError(null);
              setShowPaymentForm(false);
              setPreferenceId(null);
              setIsLoading(false);
              setProcessingMessage('Preparando tu pago...');
              // createPreference();
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Spinner mientras carga */}
      {isLoading && (
        <div className="mp-spinner-container">
          <FadeLoader color={isDarkMode ? "#ff4d4d" : "#a70000"} loading={isLoading} />
          <p className="mp-loading-message">{processingMessage}</p>
          <p className="mp-loading-submessage">Esto puede tardar unos segundos...</p>
          <button
            className="mp-retry-button"
            onClick={() => {
              setError(null);
              setShowPaymentForm(false);
              setPreferenceId(null);
              setIsLoading(false);
              setProcessingMessage('Preparando tu pago...');
            }}
          >
            Cancelar pago
          </button>
        </div>
      )}

      {/* Botón para iniciar el pago cuando no está cargando ni mostrando el formulario */}
      {!isLoading && !showPaymentForm && !error && (
        <div className="mp-start-container">
          <div className="mp-payment-info">
            <div className="mp-payment-header">
              <h3 className="mp-payment-title">Pagar con MercadoPago</h3>
              <p className="mp-payment-subtitle">Paga de forma segura con o sin cuenta de MercadoPago</p>
            </div>

            <div className="mp-payment-details">
              <div className="mp-payment-amount">
                <span className="mp-amount-label">Total a pagar:</span>
                <span className="mp-amount-value">${Number(total).toFixed(2)}</span>
              </div>

              <div className="mp-payment-methods-info">
                <div className="mp-method-item">
                  <span className="mp-method-icon">💳</span>
                  <span className="mp-method-text">Tarjetas de crédito/débito - No necesitas cuenta</span>
                </div>
                <div className="mp-method-item">
                  <span className="mp-method-icon">🏦</span>
                  <span className="mp-method-text">Transferencia bancaria - No necesitas cuenta</span>
                </div>
                <div className="mp-method-item">
                  <span className="mp-method-icon">💰</span>
                  <span className="mp-method-text">Pago en efectivo - No necesitas cuenta</span>
                </div>
                <div className="mp-method-item">
                  <span className="mp-method-icon">👤</span>
                  <span className="mp-method-text">Cuenta de MercadoPago - Si ya tienes una</span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="mp-start-button"
            onClick={handleStartPayment}
          >
            Iniciar pago
          </button>
        </div>
      )}

      {/* Wallet de MercadoPago cuando showPaymentForm es true */}
      {showPaymentForm && preferenceId && !isLoading && !error && (
        <div className="mp-form-container">
          <div className="mp-form-header">
            <h3 className="mp-form-title">Selecciona tu método de pago</h3>
            <p className="mp-form-subtitle">Puedes pagar con o sin cuenta de MercadoPago</p>
          </div>

          <Wallet 
            initialization={{ 
              preferenceId: preferenceId,
              redirectMode: "modal" 
            }} 
            customization={{
              texts: {
                action: 'Pagar',
                valueProp: 'Pago seguro con o sin cuenta de MercadoPago'
              },
              visual: {
                buttonBackground: isDarkMode ? '#ff4d4d' : '#a70000',
                buttonHeight: '48px',
                borderRadius: '8px',
              }
            }}
            onError={(error) => {
              setError('Ocurrió un error al procesar el pago. Por favor, inténtalo nuevamente. Error: ' + error.message);
              setIsLoading(false);
            }}
          />

          {
            error && (
              <button
              className="mp-retry-button"
              onClick={() => {
                setError(null);
                setShowPaymentForm(false);
                setPreferenceId(null);
                setIsLoading(false);
                setProcessingMessage('Preparando tu pago...');
              }}
            >
              Cancelar pago
            </button>
            )
          }

          <div className="mp-form-footer">
            <p className="mp-security-text">🔒 Tus datos están protegidos con encriptación de 256 bits</p>
            <p className="mp-security-text">ℹ️ Puedes pagar con tarjeta, transferencia o efectivo sin tener cuenta de MercadoPago</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .mercadopago-container {
          font-family: "Nexa", sans-serif;
          border-radius: var(--radius-md, 12px);
          padding: 1.5rem;
          background-color: ${isDarkMode ? '#1e1e1e' : '#ffffff'};
          box-shadow: ${isDarkMode ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(0, 0, 0, 0.1)'};
          margin: 1.5rem 0;
          max-width: 600px;
          width: 100%;
          transition: all 0.3s ease;
          border: ${isDarkMode ? '1px solid #333' : '1px solid #eaeaea'};
        }

        .mp-error-container {
          background-color: ${isDarkMode ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255, 0, 0, 0.05)'};
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .mp-error-message {
          color: ${isDarkMode ? '#ff6b6b' : '#d32f2f'};
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .mp-retry-button {
          background-color: ${isDarkMode ? '#ff4d4d' : '#a70000'};
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .mp-retry-button:hover {
          background-color: ${isDarkMode ? '#ff6b6b' : '#800000'};
          transform: translateY(-2px);
        }

        .mp-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
        }

        .mp-loading-message {
          margin-top: 1.5rem;
          color: ${isDarkMode ? '#e0e0e0' : '#333333'};
          font-size: 1rem;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .mp-start-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mp-payment-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mp-payment-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .mp-payment-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          margin-bottom: 0.25rem;
        }

        .mp-payment-subtitle {
          font-size: 0.9rem;
          color: ${isDarkMode ? '#b0b0b0' : '#666666'};
        }

        .mp-payment-details {
          border: ${isDarkMode ? '1px solid #444' : '1px solid #eaeaea'};
          border-radius: 10px;
          padding: 1.25rem;
          background-color: ${isDarkMode ? '#2d2d2d' : '#f9f9f9'};
        }

        .mp-payment-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: ${isDarkMode ? '1px solid #444' : '1px solid #eaeaea'};
        }

        .mp-amount-label {
          font-weight: 500;
          color: ${isDarkMode ? '#cccccc' : '#666666'};
        }

        .mp-amount-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: ${isDarkMode ? '#ffffff' : '#333333'};
        }

        .mp-payment-methods-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mp-method-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: ${isDarkMode ? '#cccccc' : '#666666'};
        }

        .mp-method-icon {
          font-size: 1.25rem;
        }

        .mp-method-text {
          font-size: 0.9rem;
        }

        .mp-start-button {
          background-color: ${isDarkMode ? '#ff4d4d' : '#a70000'};
          color: white;
          border: none;
          padding: 0.9rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          text-align: center;
          width: 100%;
        }

        .mp-start-button:hover {
          background-color: ${isDarkMode ? '#ff6b6b' : '#800000'};
          transform: translateY(-2px);
          box-shadow: ${isDarkMode ? '0 6px 16px rgba(255, 77, 77, 0.3)' : '0 6px 16px rgba(167, 0, 0, 0.2)'};
        }

        .mp-form-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mp-form-header {
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .mp-form-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          margin-bottom: 0.25rem;
        }

        .mp-form-subtitle {
          font-size: 0.9rem;
          color: ${isDarkMode ? '#b0b0b0' : '#666666'};
        }

        .mp-form-footer {
          text-align: center;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mp-security-text {
          font-size: 0.85rem;
          color: ${isDarkMode ? '#999999' : '#888888'};
        }

        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }

        @media (max-width: 600px) {
          .mercadopago-container {
            padding: 1rem;
            margin: 1rem 0;
          }

          .mp-payment-title, .mp-form-title {
            font-size: 1.1rem;
          }

          .mp-payment-subtitle, .mp-form-subtitle {
            font-size: 0.85rem;
          }

          .mp-start-button {
            padding: 0.8rem 1rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MercadoPagoButton;