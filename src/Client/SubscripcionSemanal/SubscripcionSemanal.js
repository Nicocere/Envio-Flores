"use client";

import React, { useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeSwitchContext';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import {
  LocalFlorist,
  Schedule,
  Business,
  Home,
  CalendarMonth,
  LocationOn,
  CheckCircle,
  Email,
  Person,
  Phone,
  BusinessCenter,
  DateRange,
  EventAvailable
} from '@mui/icons-material';
import { ZoomIn, Close } from '@mui/icons-material';
import style from './SubscripcionSemanal.module.css';
import { CircularProgress } from '@mui/material';
import { format, addMonths, addDays, getDay } from 'date-fns';
import Swal from 'sweetalert2';
import Image from 'next/image';

const SubscripcionComponent = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'empresa',
    address: '',
    schedule: 'jueves',
    preferences: '',
    empresa: '',
    horarioPreferido: '10:00-13:00'
  });

  const benefits = [
    { icon: <LocalFlorist />, text: 'Flores frescas semanales' },
    { icon: <Schedule />, text: 'Entregas programadas' },
    { icon: <Business />, text: 'Ideal para empresas' },
    { icon: <Home />, text: 'Perfecto para hogares' },
    { icon: <EventAvailable />, text: 'Renovación automática' },
    { icon: <DateRange />, text: 'Flexibilidad de horarios' }
  ];


  const calculateNextDeliveries = () => {
    const deliveries = [];
    let nextDelivery = new Date();

    // Encontrar el próximo jueves
    while (getDay(nextDelivery) !== 4) { // 4 = Jueves
      nextDelivery = addDays(nextDelivery, 1);
    }

    // Calcular los 4 jueves del mes
    for (let i = 0; i < 4; i++) {
      deliveries.push(format(nextDelivery, 'dd/MM/yyyy'));
      nextDelivery = addDays(nextDelivery, 7); // Avanzar al siguiente jueves
    }

    return deliveries;
  };


  const formatWhatsAppMessage = (data) => {
    const message = `
  ¡Hola Envio Flores! 🌸
  
  Me inscribí en el Plan Semanal de Flores. Estos son mis datos:
  
  📋 *Datos Personales*
  - Nombre: ${data.name}
  - Email: ${data.email}
  - Teléfono: ${data.phone}
  - Dirección: ${data.address}
  
  🌺 *Detalles de Suscripción*
  - Tipo: ${data.type === 'personal' ? 'Personal' : 'Empresa'}
  ${data.type === 'empresa' ? `- Empresa: ${data.empresa}\n` : ''}
  - Horario preferido: ${data.horarioPreferido}
  - Preferencias: ${data.preferences || 'Sin preferencias especiales'}
  
  📅 *Información de Entregas*
  - Inicio: ${new Date(data.fechaInicio).toLocaleDateString()}
  - Próximas entregas: ${data.proximasEntregas.join(', ')}
  - Presupuesto mensual
  
  ¡Gracias por confiar en nosotros! 🌹
  `;
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startDate = new Date();
      const endDate = addMonths(startDate, 1);
      const deliveryDates = calculateNextDeliveries();

      const subscriptionData = {
        ...formData,
        fechaInicio: startDate.toISOString(),
        fechaFin: endDate.toISOString(),
        fechaCreacion: new Date().toISOString(),
        proximasEntregas: deliveryDates,
        estado: 'activa',
        renovaciones: 0,
        entregasRealizadas: 0,
        entregasPendientes: 4,
        metodoPago: 'pendiente',
        ultimaRenovacion: null,
        proximaRenovacion: endDate.toISOString(),
        historialEntregas: []
      };

      // Mostrar SweetAlert2 de confirmación
      const result = await Swal.fire({
        title: '¿Confirmar Suscripción Semanal?',
        html: `
          <div style="text-align: left">
            <h3>Datos Personales:</h3>
            <small><strong>Nombre:</strong> ${subscriptionData.name}</small>
            <small><strong>Email:</strong> ${subscriptionData.email}</small>
            <small><strong>Teléfono:</strong> ${subscriptionData.phone}</small>
            <small><strong>Dirección:</strong> ${subscriptionData.address}</small>
            
            <h3>Detalles de Suscripción:</h3>
            <small><strong>Tipo:</strong> ${subscriptionData.type === 'personal' ? 'Personal' : 'Empresa'}</small>
            ${subscriptionData.type === 'empresa' ? `<small><strong>Empresa:</strong> ${subscriptionData.empresa}</small>` : ''}
            <small><strong>Horario preferido:</strong> ${subscriptionData.horarioPreferido}</small>
            <small><strong>Próximas entregas:</strong> ${deliveryDates.join(', ')}</small>
          </div>
        `,
        customClass: {
          title: style.swalTitle,
          content: style.swalContent,
          htmlContainer: style.swalHtmlContainer,
          confirmButton: style.swalConfirmButton,
          cancelButton: style.swalCancelButton
        },
        position: 'bottom',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#670000',
        cancelButtonColor: '#A6855D ',
        background: isDarkMode ? '#f5e9d7' : '#1c0a01f0',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        // Guardar en Firebase
        await addDoc(collection(baseDeDatos, 'subscripcion-semanal'), subscriptionData);
        setSuccess(true);

        // Enviar mensaje por WhatsApp
        const whatsappMessage = formatWhatsAppMessage(subscriptionData);
        const whatsappUrl = `https://wa.me/5491165421003?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');

        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: 'empresa',
          address: '',
          schedule: 'jueves',
          preferences: '',
          empresa: '',
          horarioPreferido: '10:00-13:00'
        });

        // Mostrar mensaje de éxito
        Swal.fire({
          title: '¡Suscripción Exitosa!',
          text: 'Te redirigiremos a WhatsApp para finalizar el proceso',
          icon: 'success',
          confirmButtonColor: '#670000'
        });

        setTimeout(() => setSuccess(false), 5000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Error al procesar la suscripción. Por favor, intente nuevamente.');
      console.error('Error:', err);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al procesar tu suscripción. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#670000'
      });
    } finally {
      setLoading(false);
    }
  };


  const scrollToForm = () => {
    if (formRef.current) {
      const formTop = formRef.current.offsetTop;
      const offset = window.innerHeight / 4; // Ajusta este valor para cambiar la posición

      window.scrollTo({
        top: formTop - offset,
        behavior: 'smooth'
      });
    }
  };


  return (
    <div className={`${style.container} ${!isDarkMode ? style.dark : style.light}`}>

      <motion.section className={style.infoSection}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={style.sectionTitle}
        >
          <span className={style.subtitle}> Descubre Nuestros Planes de Suscripción
            de Flores frescas directamente a tu puerta</span>
        </motion.h2>

        <div className={style.subscriptionPlans}>
          <motion.div
            className={style.planCard}
            whileHover={{ scale: 1.01, boxShadow: "0 20px 30px rgba(212, 175, 55, 0.2)" }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className={style.planHeader}>
              <LocalFlorist className={style.planIcon} />
              <h3>Plan Premium Mensual</h3>
              <h4>
                <Schedule className={style.scheduleIcon} />
                Entrega Semanal Garantizada
              </h4>
            </div>

            <div
              className={`${style.imageContainer} ${isExpanded ? style.expanded : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Image
                width={500}
                height={250}
                src="/imagenes/subscripcion/flores-semanales-para-empresas.jpg"
                alt="Suscripción Quincenal"
                className={style.planImage}
                priority
              />
              {!isExpanded && (
                <ZoomIn className={style.expandIcon} />
              )}
              {isExpanded && (
                <Close className={style.expandIcon} />
              )}
            </div>


            <ul className={style.benefitsList}>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <CheckCircle className={style.checkIcon} />
                <span>4 entregas mensuales personalizadas</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <LocalFlorist className={style.checkIcon} />
                <span>12 flores premium por entrega</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Business className={style.checkIcon} />
                <span>Diseños exclusivos de temporada</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <CalendarMonth className={style.checkIcon} />
                <span>Envío premium incluido</span>
              </motion.li>
            </ul>

            <motion.button
              className={style.subscribeButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToForm}
            >
              Comenzar Suscripción
            </motion.button>
          </motion.div>
        </div>
      </motion.section>


      <section className={style.benefitsSection}>
        <h2>Beneficios de la Suscripción</h2>
        <div className={style.benefitsGrid}>
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
      </section>


      <motion.form
        className={style.subscriptionForm}
        ref={formRef}
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Comienza tu suscripción Semanal</h2>
        <div className={style.formGrid}>
          <div className={style.inputGroup}>
            <Person />
            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <Email />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <Phone />
            <input
              type="tel"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <LocationOn />
            <input
              type="text"
              placeholder="Dirección de entrega"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <LocalFlorist />
            <textarea
              placeholder="Preferencias de flores o notas especiales"
              value={formData.preferences}
              onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
            />
          </div>

          <div className={style.inputGroup}>
            <BusinessCenter />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="empresa">Empresa</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {formData.type === 'empresa' && (
            <div className={style.inputGroup}>
              <Business />
              <input
                type="text"
                placeholder="Nombre de la empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                required
              />
            </div>
          )}

          <div className={style.inputGroup}>
            <Schedule />
            <select
              value={formData.horarioPreferido}
              onChange={(e) => setFormData({ ...formData, horarioPreferido: e.target.value })}
              required
            >
              <option value="10:00-13:00">10:00 - 13:00</option>
              <option value="13:00-16:00">13:00 - 16:00</option>
            </select>
          </div>
        </div>

        <div className={style.formActions}>
          <motion.button
            type="submit"
            className={style.submitButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Suscribirse'}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className={style.error}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className={style.success}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ¡Suscripción realizada con éxito! Te hemos enviado un correo con los detalles.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>


      <section className={style.policiesSection}>
        <h2>Políticas y Términos</h2>
        <div className={style.policiesGrid}>
          <div className={style.policyCard}>
            <h3>Política de Cancelación</h3>
            <p>Puedes cancelar tu suscripción en cualquier momento a través de tu cuenta o contactando con nuestro servicio al cliente. La cancelación será efectiva al final del período actual. No se realizan reembolsos por períodos parciales. Si cancelas antes de tu primera entrega, te reembolsaremos el monto completo.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Política de Entrega</h3>
            <p>Las entregas se realizan los días acordados en el horario seleccionado. En caso de no encontrarse en el domicilio, realizaremos un segundo intento el mismo día. Si la segunda entrega no es exitosa, se coordinará una nueva entrega para el siguiente día hábil. Notifícanos con 48 horas de anticipación para cambios en la dirección de entrega. Todas nuestras entregas están aseguradas y son realizadas por personal capacitado.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Garantía de Frescura</h3>
            <p>Garantizamos la frescura de nuestras flores por un mínimo de 5 días con los cuidados adecuados. Cada entrega incluye instrucciones detalladas de cuidado y mantenimiento. Si no estás satisfecho con la calidad de las flores, contáctanos dentro de las 24 horas posteriores a la entrega y reemplazaremos el arreglo sin costo adicional. Nuestras flores son seleccionadas diariamente de los mejores proveedores locales.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Modificaciones y Pausas</h3>
            <p>Puedes pausar tu suscripción hasta por 4 semanas consecutivas sin perder los beneficios de tu plan. Las modificaciones en la frecuencia o composición de los arreglos pueden realizarse con 5 días de anticipación a tu próxima entrega. Mantén tu suscripción por 3 meses consecutivos y obtén un arreglo especial de regalo.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscripcionComponent;