import React from 'react';

import { PayPalButtons, PayPalScriptProvider, FUNDING } from "@paypal/react-paypal-js";
import { useContext } from "react";
import { CartContext, useCart } from "../../context/CartContext";
import Swal from "sweetalert2";
import axios from "axios";
import { CookieContext, useCookies } from '../../context/CookieContext';

const BACKEND_URL = "https://envio-flores.rj.r.appspot.com";
// const BACKEND_URL = "http://localhost:8080";


const PayPalButton = ({ itemSelected, nombreDestinatario, apellidoDestinatario,
    phoneDestinatario, mailComprador, localidad, precioLocalidad, calle, altura, piso,
    dedicatoria, nombreComprador, phoneComprador, apellidoComprador, fechaEnvio, horarioEnvio, 
    description, picture_url,precioArg, category_id, quantity, unit_price, id, size, products, retiraEnLocal, envioPremium, servicioPremium, total }) => {

    const { dolar  } = useCart();
    const { CartID, UserID } = useCookies();

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
        priceDolar: Number(total),
        dolar: Number(dolar),
        precioArg: Number(precioArg),
        products: products,
    };
    
    if (retiraEnLocal) {
        envioDatos.retiraEnLocal = true;
        envioDatos.quantity = quantity;
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
            totalPrice: total,
            servicioPremium: servicioPremium,
            envioPremium: envioPremium,
        };
    }

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

                                const response = await fetch(`${BACKEND_URL}/paypal/orders`, {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        item: itemSelected,
                                        price: total
                                    })
                                });
                                const details = await response.json();
                                return details.id;
                            }}

                            onApprove={async (data, actions) => {
                                try {
                                    // const response = await fetch(`http://localhost:8080/paypal/orders/${data.orderID}/capture`, {
                                    const response = await fetch(`${BACKEND_URL}/paypal/orders/${data.orderID}/capture`, {
                                        method: "POST"
                                    });
                                    const details = await response.json();

                                    if (details.status === "COMPLETED") {

                                        const order = {
                                            details,
                                            envioDatos
                                        }
                                        // const completeOrder = await axios.post(`http://localhost:8080/paypal/orders/complete`, order)

                                        await axios.post(`${BACKEND_URL}/paypal/orders/complete`, order)
                                            .then(response => {
                                                window.location.href = response.data.redirectURL;
                                            })
                                            .catch(error => {
                                                window.location.href = `https://envioflores.com/cart?PagoPayPalExistoso=true&Error=true&ErrorDetail=${error}`;
                                                console.error("Error en el proceso de finalización de pago:", error);
                                            });
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