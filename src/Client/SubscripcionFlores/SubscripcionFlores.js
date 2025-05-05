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
  CheckCircle,
  Favorite,
  EmojiEmotions,
  RecyclingOutlined,
  HomeWork
} from '@mui/icons-material';
import style from './SubscripcionFlores.module.css';
import Link from 'next/link';
import Image from 'next/image';

const SubscripcionComponent = () => {
  const { isDarkMode } = useTheme();

  const benefits = [
    { icon: <LocalFlorist />, text: 'Flores frescas de temporada en cada entrega' },
    { icon: <Schedule />, text: 'Entregas puntuales los jueves para alegrar tu semana' },
    { icon: <Business />, text: 'Diseños exclusivos artísticos seleccionados para ti' },
    { icon: <CalendarMonth />, text: 'Comienza el primer jueves del mes, sin complicaciones' },
  ];

  const reasons = [
    { icon: <Favorite />, text: 'Estudios demuestran que las flores reducen el estrés y mejoran el estado de ánimo' },
    { icon: <EmojiEmotions />, text: 'Transforma tu espacio con la elegancia y frescura natural que solo las flores pueden brindar' },
    { icon: <RecyclingOutlined />, text: 'Renovación constante: disfruta de diferentes variedades según la temporada' },
    { icon: <HomeWork />, text: 'Ideal para hogares y empresas que desean crear ambientes acogedores y profesionales' },
  ]

  return (
    <div className={`${style.container}`}>
      <div className={`${style.divContainer} ${isDarkMode ? style.dark : style.light}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={style.header}
        >
          <h1>Suscripción de Flores Premium</h1>
          <p className={style.tagline}>Transforma tu mundo con la magia de flores frescas cada semana</p>
          <p className={style.subTagline}>Una experiencia sensorial que renueva tus espacios y emociones</p>
        </motion.div>

        <motion.div 
          className={style.valueProposition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <h2>¿Por qué suscribirte a nuestro servicio floral?</h2>
          <div className={style.reasonsGrid}>
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className={style.reasonCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                {reason.icon}
                <p>{reason.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.section 
          className={style.plansSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={style.sectionTitle}>Elige el plan perfecto para ti</h2>
          <p className={style.sectionSubtitle}>Flexibilidad que se adapta a tus preferencias y estilo de vida</p>
          
          <div className={style.planCards}>
            <Link href="/subscripcion-flores/semanal" className={style.linkCard}>
              <motion.div
                className={style.planCard}
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <div className={style.planBadge}>Más Popular</div>
                <Image width={500} height={250} src="/imagenes/subscripcion/flores-semanales-para-empresas.png" alt="Suscripción Semanal" />
                <div className={style.planInfo}>
                  <h3>Plan Semanal Premium</h3>
                  <p className={style.planDescription}>Renueva tu espacio cada semana con arreglos exclusivos</p>
                  <p className={style.planDetails}>4 entregas exclusivas mensualmente</p>
                  <div className={style.planFeatures}>
                    <span><CheckCircle className={style.checkIcon} /> Máxima frescura garantizada</span>
                    <span><CheckCircle className={style.checkIcon} /> Mayor variedad de flores</span>
                    <span><CheckCircle className={style.checkIcon} /> Descuento por frecuencia</span>
                  </div>
                  <div className={style.planCta}>
                    <span>Ver detalles</span>
                    <ArrowForward />
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/subscripcion-flores/quincenal" className={style.linkCard}>
              <motion.div
                className={style.planCard}
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Image width={500} height={250} src="/imagenes/subscripcion/flores-quincenal-para-empresas.png" alt="Suscripción Quincenal" />
                <div className={style.planInfo}>
                  <h3>Plan Quincenal Select</h3>
                  <p className={style.planDescription}>El balance perfecto entre frecuencia y presupuesto</p>
                  <p className={style.planDetails}>2 entregas exclusivas mensualmente</p>
                  <div className={style.planFeatures}>
                    <span><CheckCircle className={style.checkIcon} /> Arreglos más elaborados</span>
                    <span><CheckCircle className={style.checkIcon} /> Flores de larga duración</span>
                    <span><CheckCircle className={style.checkIcon} /> Flexibilidad de entrega</span>
                  </div>
                  <div className={style.planCta}>
                    <span>Ver detalles</span>
                    <ArrowForward />
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.section>

        <motion.section 
          className={style.testimonialsSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Lo que nuestros suscriptores dicen</h2>
          <div className={style.testimonials}>
            <motion.div 
              className={style.testimonialCard}
              whileHover={{ scale: 1.03 }}
            >
              <div className={style.testimonialContent}>
                <p>"Recibir flores semanalmente ha transformado mi hogar. Cada jueves es como un pequeño regalo que me doy a mí misma."</p>
                <h4>Marta S.</h4>
                <p className={style.testimonialType}>Suscripción Personal</p>
              </div>
            </motion.div>
            <motion.div 
              className={style.testimonialCard}
              whileHover={{ scale: 1.03 }}
            >
              <div className={style.testimonialContent}>
                <p>"Nuestros clientes siempre comentan sobre la belleza de los arreglos en nuestra recepción. Una inversión que mejora la imagen de nuestro negocio."</p>
                <h4>Carlos R.</h4>
                <p className={style.testimonialType}>Suscripción Empresarial</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className={style.infoSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2>La experiencia floral definitiva</h2>
          <p className={style.infoDescription}>Descubre cómo funciona nuestro servicio premium de entrega regular</p>
          <div className={style.benefits}>
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={style.benefitCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              >
                {benefit.icon}
                <p>{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className={style.detailsSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Detalles del Servicio Premium</h2>
          <div className={style.detailsContent}>
            <p className={style.highlightedText}>Un arreglo floral artístico cuatro o dos veces al mes directamente hasta la puerta de tu hogar u oficina.</p>
            
            <p>Esta suscripción es el regalo perfecto para hacerte feliz durante todo el mes, o para sorprender a esa persona especial con un detalle que se renueva constantemente. También es ideal para empresas, hoteles y servicios que buscan mantener espacios elegantes y acogedores.</p>
            
            <p>Cada semana, nuestros floristas expertos seleccionan una paleta de colores diferente para crear bouquets únicos con las flores más frescas y de mejor calidad disponibles en el mercado. Cada entrega es una nueva obra de arte floral que transformará tu espacio.</p>
            
            <div className={style.businessSection}>
              <h3>Para empresas y servicios:</h3>
              <p>Ofrecemos diseños especialmente pensados para:</p>
              <ul className={style.businessList}>
                <li><CheckCircle /> Recepciones que impresionen a tus clientes desde el primer momento</li>
                <li><CheckCircle /> Salas de espera que transmitan calidez y profesionalismo</li>
                <li><CheckCircle /> Restaurantes que busquen ese toque de distinción en cada mesa</li>
                <li><CheckCircle /> Habitaciones de hotel que sorprendan a tus huéspedes con detalles exclusivos</li>
              </ul>
              <p className={style.businessCta}>Nuestros arreglos realzan la imagen profesional de tu negocio y crean un ambiente acogedor que tus clientes recordarán.</p>
            </div>
            
            <h3>Con cada entrega recibirás:</h3>
            <ul>
              <li><CheckCircle /> Arreglos florales artísticos diseñados por expertos con flores selectas de temporada</li>
              <li><CheckCircle /> Empaque premium sostenible en papel de alta calidad y caja protectora</li>
              <li><CheckCircle /> Tarjeta de cuidados específicos para maximizar la vida de tus flores</li>
              <li><CheckCircle /> Entrega garantizada los jueves, para que puedas disfrutar tus flores todo el fin de semana</li>
              <li><CheckCircle /> Fotografía previa del arreglo que recibirás, enviada a tu móvil</li>
            </ul>
          </div>
        </motion.section>

        <motion.section 
          className={style.policySection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Información Importante</h2>
          <div className={style.policyContent}>
            <h3>Nuestra Política de Suscripción</h3>
            <p className={style.policyHighlight}>Diseñada para brindarte la mejor experiencia, sin preocupaciones ni complicaciones.</p>
            <p>Toda membresía comenzará el primer jueves de cada mes. La suscripción se renovará automáticamente cada mes hasta que decidas cancelarla, sin compromisos a largo plazo.</p>
            
            <ul className={style.policyList}>
              <li><CheckCircle /> Flexibilidad total: puedes cancelar en cualquier momento antes de tu próxima entrega</li>
              <li><CheckCircle /> Puntualidad garantizada: las entregas se realizan los jueves entre las 9:00 y 18:00 hs</li>
              <li><CheckCircle /> Cambios sencillos: debes notificar modificaciones de dirección con 48hs de anticipación</li>
              <li><CheckCircle /> Variedad asegurada: las flores pueden variar según disponibilidad de temporada, siempre manteniendo la calidad premium</li>
              <li><CheckCircle /> Satisfacción garantizada: garantizamos la frescura de nuestras flores por más de 5 días</li>
              <li><CheckCircle /> Servicio personalizado: puedes solicitar preferencias de color o estilo para tus arreglos</li>
              <li><CheckCircle /> Pausas disponibles: suspende temporalmente tu suscripción durante vacaciones</li>
            </ul>
          </div>
        </motion.section>

        <motion.div 
          className={style.ctaSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Comienza tu experiencia floral hoy</h2>
          <p>Da el primer paso hacia un espacio más hermoso y una vida con más color</p>
          <div className={style.ctaButtons}>
            <Link href="/subscripcion-flores/semanal" className={style.primaryButton}>
              Plan Semanal Premium
            </Link>
            <Link href="/subscripcion-flores/quincenal" className={style.secondaryButton}>
              Plan Quincenal Select
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscripcionComponent;