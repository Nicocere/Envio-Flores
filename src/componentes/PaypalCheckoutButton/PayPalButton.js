"use client";
import React from 'react';
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import localforage from 'localforage';
import { useTheme } from '@/context/ThemeSwitchContext';

// const BACKEND_URL = "https://www.envioflores.com/api";
const BACKEND_URL = "http://localhost:3000/api";


const PayPalButton = ({ itemSelected, nombreDestinatario, apellidoDestinatario,
    phoneDestinatario, mailComprador, localidad, precioLocalidad, calle, altura, piso,
    dedicatoria, nombreComprador, phoneComprador, apellidoComprador, fechaEnvio, horarioEnvio,
    picture_url, precioArg, quantity, CartID, UserID, products, retiraEnLocal, envioPremium, servicioPremium, total }) => {

    const navigate = useRouter();
    const { dolar } = useContext(CartContext)
    const { isDarkMode } = useTheme();

    const FUNDING_SOURCES = [
        FUNDING.PAYPAL,
        FUNDING.PAYLATER,
        FUNDING.VENMO,
        FUNDING.CARD
    ];

    let envioDatos = {
        PayPal: true,
        CartID,
        createdAt: new Date(),
        datosComprador: {
            UserID: UserID,
            nombreComprador: nombreComprador,
            apellidoComprador: apellidoComprador,
            email: mailComprador,
            tel_comprador: phoneComprador,
        },
        datosEnvio: {
            dedicatoria: dedicatoria ? dedicatoria : 'Sin dedicatoria',
        },
        totalPrice: Number(total),
        dolar: Number(dolar),
        precioArg: Number(precioArg),
        products: products,
        quantity: quantity,
    };

    if (retiraEnLocal) {
        envioDatos.retiraEnLocal = true;
        envioDatos.datosEnvio =
        {
            fecha: fechaEnvio,
            horario: horarioEnvio,
            products: products,
            dedicatoria: dedicatoria ? dedicatoria : 'Sin dedicatoria',
            totalPrice: Number(total),
        };
    } else {
        envioDatos.retiraEnLocal = false
        envioDatos.datosEnvio = {
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
            imagenProd: picture_url,
            totalPrice: Number(total),
            servicioPremium: servicioPremium,
            envioPremium: envioPremium,
        };
    }


    return (
        <div className="paypal-checkout-container" style={{
            maxWidth: '450px',
            margin: '0 auto',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: isDarkMode ? '#1e1e1e' : 'rgb(255, 255, 255)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            width: '-webkit-fill-available'
        }}>
            {/* Información de valor y seguridad */}
            <div style={{
                marginBottom: '25px',
                textAlign: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px'
                }}>
                    <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                        alt="PayPal Logo"
                        style={{
                            height: '23px',
                            marginRight: '10px'
                        }}
                    />
                    <h3 style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#000',
                    }}>
                        Pago Seguro con PayPal
                    </h3>
                </div>

                <div style={{
                    backgroundColor: 'rgb(0 0 0 / 23%)',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px',
                    border: '1px solid rgba(0, 46, 130, 0.1)',
                }}>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        color: '#555'
                    }}>
                        <span>
                            {products?.length} {products?.length === 1 ? 'producto' : 'productos'}
                        </span>
                        <span>
                            {retiraEnLocal ? 'Retiro en local' : 'Envío a domicilio'}
                        </span>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    fontSize: '13px',
                    color: '#666'
                }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginRight: '15px'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4CAF50" viewBox="0 0 16 16" style={{ marginRight: '5px' }}>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                        </svg>
                        Pago seguro
                    </span>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4CAF50" viewBox="0 0 16 16" style={{ marginRight: '5px' }}>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                        </svg>
                        Proceso rápido
                    </span>
                </div>

                <p style={{
                    fontSize: '12px',
                    color: '#777',
                    margin: '0 0 15px 0',
                    lineHeight: '1.5'
                }}>
                    Pague de forma segura con su cuenta de PayPal o tarjeta bancaria.
                    <br />No necesita una cuenta PayPal para realizar el pago.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '10px'
                }}>
                    <img
                        src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppmcvdam.png"
                        alt="Métodos de pago aceptados"
                        style={{
                            maxWidth: '100%',
                            height: '30px'
                        }}
                    />
                </div>
            </div>

            {/* Línea divisoria */}
            <div style={{
                height: '1px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                margin: '0 -20px 20px',
            }}></div>

            {/* Instrucciones */}
            <p style={{
                fontSize: '14px',
                color: '#444',
                margin: '0 0 15px 0',
                textAlign: 'center',
                fontWeight: '500'
            }}>
                Seleccione un método de pago:
            </p>

            {/* Botones de PayPal */}
            <div className="paypal-buttons-container">
                {
                    FUNDING_SOURCES.map(fundingSource => {
                        return (
                            <PayPalButtons
                                fundingSource={fundingSource}
                                key={fundingSource}

                                style={{
                                    layout: 'vertical',
                                    shape: 'rect',
                                    color: 'white',
                                }}

                                createOrder={async () => {
                                    await localforage.setItem('shoppingCart', envioDatos);

                                    const response = await fetch(`${BACKEND_URL}/paypal/orders`, {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            item: itemSelected,
                                            price: Number(total)
                                        })
                                    });
                                    const details = await response.json();
                                    return details.id;
                                }}

                                onApprove={async (data, actions) => {

                                    try {
                                        const response = await fetch(`${BACKEND_URL}/paypal/capture`, {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                orderID: data.orderID
                                            })
                                        });
                                        const details = await response.json();

                                        if (details.status === "COMPLETED") {

                                            const order = {
                                                details,
                                                envioDatos
                                            }

                                            const response = await fetch(`${BACKEND_URL}/paypal/complete`, {
                                                method: "POST",
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(order)
                                            });

                                            if (response.ok) {

                                                const result = await response.json();

                                                if (result.success) {
                                                    // Obtener el carrito actual de localforage
                                                    const currentCart = await localforage.getItem('shoppingCart') || {};

                                                    // Añadir el número de orden al carrito
                                                    const updatedCart = {
                                                        ...currentCart,
                                                        orderNumber: result.orderNumber
                                                    };

                                                    // Guardar el carrito actualizado
                                                    await localforage.setItem('shoppingCart', updatedCart);

                                                    navigate.push(`/compras/paypal?order=${result.orderNumber}`);
                                                    
                                                }
                                                
                                                    // await localforage.removeItem('shoppingCart');
                                                    // await localforage.removeItem('cart');
                                                } else {
                                                    const error = await response.json();
                                                    navigate.push(`/compras/paypal?Error=true&ErrorDetail=${error}`);
                                                    console.error("Error en el proceso de finalización de pago:", error);
                                                }
                                            }

                                            // Three cases to handle:
                                            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                            //   (2) Other non-recoverable errors -> Show a failure message
                                            //   (3) Successful transaction -> Show confirmation or thank you message

                                            // This example reads a v2/checkout/orders capture response, propagated from the server
                                            // You could use a different API or structure for your 'orderData'
                                            const errorDetail = Array.isArray(details.details) && details.details[0];

                                            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                                                return actions.restart();
                                                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
                                            }

                                            if (errorDetail) {
                                                let msg = 'Sorry, your transaction could not be processed.';
                                                msg += errorDetail.description ? ' ' + errorDetail.description : '';
                                                msg += details.debug_id ? ' (' + details.debug_id + ')' : '';
                                                Swal.fire('Error', msg, 'error');
                                            }


                                        } catch (error) {
                                            console.error("no se pudo capturar la compra", error);
                                            // Handle the error or display an appropriate error message to the user
                                        }
                                    }}
                        />)
                    })
                }
            </div>

            {/* Política de privacidad y aviso legal */}
            <p style={{
                fontSize: '11px',
                color: '#888',
                margin: '15px 0 0 0',
                textAlign: 'center',
                lineHeight: '1.4'
            }}>
                Al realizar el pago, usted acepta nuestros <a href="#" style={{ color: '#002E82', textDecoration: 'none' }}>términos y condiciones</a> y nuestra <a href="#" style={{ color: '#002E82', textDecoration: 'none' }}>política de privacidad</a>.
            </p>
        </div>
    );
}

export default PayPalButton