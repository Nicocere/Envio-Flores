'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import Link from 'next/link';
import styles from './pagosPendientes.module.css';
import localforage from 'localforage';

const PagoPendientePage = () => {
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPaymentData = async () => {
            try {
                const paymentData = await localforage.getItem('paymentInProcess');
                if (paymentData) {
                    setPayment(paymentData);
                }
            } catch (error) {
                console.error('Error al obtener los datos del pago:', error);
            } finally {
                setLoading(false);
            }
        };

        getPaymentData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <PulseLoader color="#D4AF37" />
                <p className={styles.loadingText}>Cargando estado del pago...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <h1 className={styles.title}>Estamos procesando tu pago y tu pedido, por favor, mientras revisa que toda la informacion sea correcta.
                </h1>

                <h3>Estado del Pago</h3>
                {payment ? (
                    <div>
                        <div className={styles.paymentInfo}>
                            <p className={styles.highlight}>
                                ID de Pago: {payment.id}
                            </p>
                            <p className={styles.text}>
                                Estado: <span className="font-semibold">{payment.status}</span>
                            </p>
                            <p className={styles.text}>
                                Detalle: <span className="font-semibold">{payment.status_detail}</span>
                            </p>
                            <p className={styles.text}>
                                Fecha: {new Date(payment.date_created).toLocaleString()}
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Información del Comprador</h2>
                            <p className={styles.text}>
                                Nombre: {payment.payer?.first_name} {payment.payer?.last_name}
                            </p>
                            <p className={styles.text}>
                                Email: {payment.payer?.email}
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Detalles del Pago</h2>
                            <p className={styles.text}>
                                Monto: ${payment.transaction_amount}
                            </p>
                            <p className={styles.text}>
                                Método de Pago: {payment.payment_method_id}
                            </p>
                        </div>

                        <div className={styles.buttonContainer}>
                            <p className={styles.text}>
                                Tu pago está siendo procesado. Te notificaremos cuando haya sido aprobado.
                            </p>
                            <Link href="/" className={styles.button}>
                                Volver al inicio
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className={styles.buttonContainer}>
                        <p className={styles.text}>
                            No se encontró información del pago
                        </p>
                        <Link href="/" className={styles.button}>
                            Volver al inicio
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PagoPendientePage;