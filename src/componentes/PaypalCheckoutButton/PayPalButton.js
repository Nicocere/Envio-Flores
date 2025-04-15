"use client";
import React from 'react';
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import localforage from 'localforage';

// const BACKEND_URL = "https://www.envioflores.com/api";
const BACKEND_URL = "http://localhost:3000/api";


const PayPalButton = ({ itemSelected, nombreDestinatario, apellidoDestinatario,
    phoneDestinatario, mailComprador, localidad, precioLocalidad, calle, altura, piso,
    dedicatoria, nombreComprador, phoneComprador, apellidoComprador, fechaEnvio, horarioEnvio,
    picture_url, precioArg, quantity, CartID, UserID, products, retiraEnLocal, envioPremium, servicioPremium, total }) => {

    const navigate = useRouter();
    const { dolar } = useContext(CartContext)

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
    console.log(envioDatos)

    return (
        <div className="App">
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
                                            navigate.push(`/compras/paypal?PagoPayPalExistoso=true`);
                                            // await localforage.removeItem('shoppingCart');
                                            // await localforage.removeItem('cart');
                                        } else {
                                            const error = await response.json();
                                            navigate.push(`/cart?PagoPayPalExistoso=true&Error=true&ErrorDetail=${error}`);
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
    );
}

export default PayPalButton