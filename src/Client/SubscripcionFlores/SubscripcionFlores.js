"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeSwitchContext';
import { motion } from 'framer-motion';
import {
  LocalFlorist,
  Schedule,
  Business,
  CalendarMonth,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';
import style from './SubscripcionFlores.module.css';
import Link from 'next/link';
import Image from 'next/image';

const SubscripcionComponent = () => {
  const { isDarkMode } = useTheme();

  const benefits = [
    { icon: <LocalFlorist />, text: 'Flores frescas por cada entrega' },
    { icon: <Schedule />, text: 'Entregas puntuales los jueves' },
    { icon: <Business />, text: 'Diseños exclusivos cada semana' },
    { icon: <CalendarMonth />, text: 'Inicia el primer jueves del mes' },
  ];

  return (
    <div className={`${style.container}`}>
      <div className={`${style.divContainer} ${!isDarkMode ? style.dark : style.light}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={style.header}
        >
          <h1>Suscripción de Flores Premium</h1>
          <p>Descubre la magia de recibir flores frescas directamente en tu puerta</p>
        </motion.div>

        <motion.section className={style.plansSection}>
          <div className={style.planCards}>
            <Link href="/subscripcion-flores/semanal" className={style.linkCard}>
              <motion.div
                className={style.planCard}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Image width={500} height={250} src="/imagenes/subscripcion/flores-semanales-para-empresas.jpg" alt="Suscripción Semanal" />
                <div className={style.planInfo}>
                  <h3>Plan Semanal Premium</h3>
                  <p>4 entregas exclusivas mensualmente</p>
                  <ArrowForward />
                </div>
              </motion.div>
            </Link>

            <Link href="/subscripcion-flores/quincenal" className={style.linkCard}>
              <motion.div
                className={style.planCard}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Image width={500} height={250} src="/imagenes/subscripcion/flores-semanales-para-empresas.jpg" alt="Suscripción Quincenal" />
                <div className={style.planInfo}>
                  <h3>Plan Quincenal Select</h3>
                  <p>2 entregas exclusivas mensualmente</p>
                  <ArrowForward />
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.section>

        <motion.section className={style.infoSection}></motion.section>

        <motion.section className={style.infoSection}>
          <h2>¿Cómo funciona?</h2>
          <div className={style.benefits}>
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={style.benefitCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {benefit.icon}
                <p>{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className={style.detailsSection}>
          <h2>Detalles del Servicio</h2>
          <div className={style.detailsContent}>
            <p>Un arreglo floral cuatro o dos veces al mes hasta la puerta de tu hogar.</p>
            <p>Esta suscripción es el regalo perfecto para hacerte feliz por un mes entero a ti o para regalar a cualquier persona. También es ideal para empresas, hoteles y servicios que buscan mantener espacios elegantes. Cada semana seleccionaremos una paleta de colores diferente para crear bouquets con las flores más lindas y frescas disponibles.</p>
            <p>Para empresas y servicios: Ofrecemos diseños especiales para recepciones, salas de espera, restaurantes y habitaciones de hotel. Nuestros arreglos realzan la imagen profesional de tu negocio y crean un ambiente acogedor para tus clientes.</p>
            <h3>Recibirás a tu puerta:</h3>
            <ul>
              <li><CheckCircle /> Arreglos florales artísticos con flores selectas de temporada</li>
              <li><CheckCircle /> Empaque premium en papel y caja</li>
              <li><CheckCircle /> Entrega garantizada los jueves</li>
            </ul>
          </div>
        </motion.section>

        <motion.section className={style.policySection}>
          <h2>Información Importante</h2>
          <div className={style.policyContent}>
            <h3>Política de Suscripción</h3>
            <p>Toda membresía comenzará el primer jueves de cada mes. La suscripción se renovará automáticamente cada mes hasta que decidas cancelarla.</p>
            <ul>
              <li><CheckCircle /> Puedes cancelar en cualquier momento antes de tu próxima entrega</li>
              <li><CheckCircle /> Las entregas se realizan los jueves entre las 9:00 y 18:00 hs</li>
              <li><CheckCircle /> Debes notificar cambios de dirección con 48hs de anticipación</li>
              <li><CheckCircle /> Las flores pueden variar según disponibilidad de temporada</li>
              <li><CheckCircle /> Garantizamos la frescura de nuestras flores por más de 5 días</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default SubscripcionComponent;