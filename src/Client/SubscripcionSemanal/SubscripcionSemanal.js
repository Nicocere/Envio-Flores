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
  LocationOn,
  CheckCircle,
  Email,
  Person,
  Phone,
  BusinessCenter,
  DateRange,
  EventAvailable,
  Brightness5,
  Loyalty,
  Redeem,
  ThumbUp
} from '@mui/icons-material';
import { ZoomIn, Close } from '@mui/icons-material';
import style from './SubscripcionSemanal.module.css';
import { CircularProgress } from '@mui/material';
import { format, addMonths, addDays, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
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
    { 
      icon: <LocalFlorist />, 
      text: 'Flores frescas premium seleccionadas diariamente por nuestros floristas expertos' 
    },
    { 
      icon: <Schedule />, 
      text: 'Entregas programadas con puntualidad exacta en el día y horario que prefieras' 
    },
    { 
      icon: <Business />, 
      text: 'Diseños exclusivos que transformarán tu espacio de trabajo y cautivarán a tus clientes' 
    },
    { 
      icon: <Home />, 
      text: 'Llena tu hogar de vida, color y fragancia cada semana con arreglos personalizados' 
    },
    { 
      icon: <EventAvailable />, 
      text: 'Renovación automática sin complicaciones, tú solo disfruta de la belleza floral' 
    },
    { 
      icon: <DateRange />, 
      text: 'Flexibilidad total: modifica, pausa o cancela cuando lo necesites sin compromisos' 
    },
    { 
      icon: <Brightness5 />, 
      text: 'Garantía de frescura extendida por 5 días o reemplazamos tu arreglo sin costo' 
    },
    { 
      icon: <Loyalty />, 
      text: '15% de descuento exclusivo en pedidos especiales para suscriptores premium' 
    }
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
      deliveries.push(format(nextDelivery, 'dd/MM/yyyy', { locale: es }));
      nextDelivery = addDays(nextDelivery, 7); // Avanzar al siguiente jueves
    }

    return deliveries;
  };

  const formatWhatsAppMessage = (data) => {
    const message = `
  ¡Hola Envio Flores! 🌸
  
  Me inscribí en el Plan Semanal Premium de Flores. Estos son mis datos:
  
  📋 *Datos Personales*
  - Nombre: ${data.name}
  - Email: ${data.email}
  - Teléfono: ${data.phone}
  - Dirección: ${data.address}
  
  🌺 *Detalles de Suscripción*
  - Tipo: ${data.type === 'personal' ? 'Personal' : 'Empresarial'}
  ${data.type === 'empresa' ? `- Empresa: ${data.empresa}\n` : ''}
  - Horario preferido: ${data.horarioPreferido}
  - Preferencias: ${data.preferences || 'Sin preferencias especiales'}
  
  📅 *Información de Entregas*
  - Inicio: ${new Date(data.fechaInicio).toLocaleDateString('es-ES')}
  - Próximas entregas: ${data.proximasEntregas.join(', ')}
  
  ¡Muchas gracias por hacer mi vida más colorida y fragante cada semana! 🌹
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
        title: '¿Confirmar tu Suscripción Semanal Premium?',
        html: `
          <div style="text-align: left">
            <h3>Datos Personales:</h3>
            <p><strong>Nombre:</strong> ${subscriptionData.name}</p>
            <p><strong>Email:</strong> ${subscriptionData.email}</p>
            <p><strong>Teléfono:</strong> ${subscriptionData.phone}</p>
            <p><strong>Dirección:</strong> ${subscriptionData.address}</p>
            
            <h3>Detalles de Suscripción:</h3>
            <p><strong>Tipo:</strong> ${subscriptionData.type === 'personal' ? 'Personal' : 'Empresarial'}</p>
            ${subscriptionData.type === 'empresa' ? `<p><strong>Empresa:</strong> ${subscriptionData.empresa}</p>` : ''}
            <p><strong>Horario preferido:</strong> ${subscriptionData.horarioPreferido}</p>
            <p><strong>Próximas entregas:</strong> ${deliveryDates.join(', ')}</p>
          </div>
        `,
        customClass: {
          title: style.swalTitle,
          content: style.swalContent,
          htmlContainer: style.swalHtmlContainer,
          confirmButton: style.swalConfirmButton,
          cancelButton: style.swalCancelButton
        },
        position: 'center',
        showCancelButton: true,
        confirmButtonText: 'Sí, quiero flores cada semana',
        cancelButtonText: 'Revisar mis datos',
        confirmButtonColor: '#670000',
        cancelButtonColor: '#A6855D',
        background: isDarkMode ? '#1c0a01f0' : '#f5e9d7',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        // Guardar en Firebase
        await addDoc(collection(baseDeDatos, 'subscripcion-semanal'), subscriptionData);
        setSuccess(true);

        // Enviar mensaje por WhatsApp
        const whatsappMessage = formatWhatsAppMessage(subscriptionData);
        const whatsappUrl = `https://wa.me/5491165421003?text=${whatsappMessage}`;
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: '¡Suscripción Exitosa!',
          html: `
            <p>¡Felicidades! Tu vida estará llena de flores frescas cada semana.</p>
            <p>Te redirigiremos a WhatsApp para finalizar el proceso y coordinar los detalles de tu primera entrega.</p>
            <p class="swal-small">Nuestro equipo de expertos te contactará en breve para personalizar tu experiencia floral.</p>
          `,
          icon: 'success',
          confirmButtonColor: '#670000',
          confirmButtonText: 'Continuar a WhatsApp'
        }).then(() => {
          window.open(whatsappUrl, '_blank');
        });

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
    <div className={`${style.container} ${isDarkMode ? style.dark : style.light}`}>

      <motion.section className={style.infoSection}>

        <div className={style.sectionTitle}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={style.title}
        >
          Cada Semana, Una Nueva Historia
          <span className={style.subtitle}>
            Sumérgete en el lujo de recibir arreglos exclusivos con flores frescas de temporada,
            cuidadosamente seleccionadas por nuestros maestros floristas para convertir tu espacio en un santuario de elegancia natural
          </span>
        </motion.h1>

        <motion.button 
          className={style.subscribeButton}
          onClick={scrollToForm}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Comenzar ahora
        </motion.button>

    </div>

        <motion.div 
          className={style.featuredImageContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Image
            src="/imagenes/subscripcion/flores-semanales-para-empresas.png"
            alt="Flores frescas semanales - Envío Flores"
            width={1200}
            height={600}
            priority
            className={style.featuredImage}
          />
          <div className={style.imageOverlay}>
            <p className={style.imageCaption}>
              Transforma tu espacio cada semana con nuestros arreglos exclusivos
            </p>
          </div>
        </motion.div>

        <div className={style.valueProposition}>
          <h3>Eleva tu espacio a un nivel superior</h3>
          <p>Con nuestra suscripción semanal premium, cada entrega es una nueva experiencia que conecta con la naturaleza y sus ciclos. Seleccionamos las flores más frescas, combinamos colores y texturas, y creamos arreglos que iluminan espacios y alegran corazones.</p>
        </div>

        <div className={style.subscriptionPlans}>
          <motion.div
            className={style.planCard}
            whileHover={{ scale: 1.01, boxShadow: "0 20px 30px rgba(212, 175, 55, 0.2)" }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className={style.planHeader}>
              <LocalFlorist className={style.planIcon} />
              <h3>Plan Premium Semanal</h3>
              <h4>
                <Schedule className={style.scheduleIcon} />
                Belleza floral garantizada, cada semana
              </h4>
            </div>

            <div
              className={`${style.imageContainer} ${isExpanded ? style.expanded : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Image
                width={500}
                height={250}
                src="/imagenes/subscripcion/flores-semanales-para-empresas.png"
                alt="Suscripción Semanal - Arreglos florales premium"
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

            <div className={style.priceTag}>
              <span className={style.priceAmount}>Plan Premium</span>
              <span className={style.priceInterval}>4 entregas mensuales</span>
            </div>

            <ul className={style.benefitsList}>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <CheckCircle className={style.checkIcon} />
                <span>4 entregas mensuales con diseños exclusivos</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <LocalFlorist className={style.checkIcon} />
                <span>12-15 flores premium por entrega según temporada</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Business className={style.checkIcon} />
                <span>Arreglos exclusivos adaptados a tu espacio</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Redeem className={style.checkIcon} />
                <span>Envío premium incluido y garantía de frescura</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ThumbUp className={style.checkIcon} />
                <span>Atención personalizada y asesoramiento exclusivo</span>
              </motion.li>
            </ul>

            <motion.button
              className={style.subscribeButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToForm}
            >
              Comenzar Mi Suscripción Ahora
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <div className={style.testimonialSection}>
        <h2>Lo que dicen nuestros clientes</h2>
        <div className={style.testimonialContainer}>
          <div className={style.testimonialCard}>
            <div className={style.testimonialContent}>
              <p>"Las flores cada semana han transformado mi recepción. Nuestros clientes siempre comentan lo hermosas que son y el ambiente agradable que crean."</p>
              <div className={style.testimonialAuthor}>
                <p className={style.authorName}>María González</p>
                <p className={style.authorTitle}>Gerente de Marketing</p>
              </div>
            </div>
          </div>
          <div className={style.testimonialCard}>
            <div className={style.testimonialContent}>
              <p>"El servicio es impecable. Las flores siempre están frescas, los arreglos son creativos y la entrega puntual sin falta. Recomiendo totalmente."</p>
              <div className={style.testimonialAuthor}>
                <p className={style.authorName}>Carlos Mendoza</p>
                <p className={style.authorTitle}>Director Ejecutivo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className={style.benefitsSection}>
        <h2>Beneficios Exclusivos de Nuestra Suscripción</h2>
        <div className={style.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={style.benefitCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
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
        viewport={{ once: true }}
      >
        <h2>Comienza tu experiencia floral semanal</h2>
        <p className={style.formIntro}>Completa el formulario a continuación y comienza a disfrutar de la belleza natural en tu espacio cada semana. Nuestro equipo se pondrá en contacto contigo para personalizar tu experiencia.</p>
        
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
              <option value="empresa">Empresarial</option>
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
              <option value="10:00-13:00">Mañana (10:00 - 13:00)</option>
              <option value="13:00-16:00">Tarde (13:00 - 16:00)</option>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Suscribirme Ahora'}
          </motion.button>
        </div>

        <p className={style.formDisclaimer}>Al suscribirte, aceptas nuestros términos y condiciones. Tu información será tratada con confidencialidad según nuestra política de privacidad.</p>

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
              ¡Suscripción realizada con éxito! En breve recibirás tu primera entrega de flores frescas.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      <section className={style.policiesSection}>
        <h2>Nuestro Compromiso Contigo</h2>
        <div className={style.policiesGrid}>
          <div className={style.policyCard}>
            <h3>Política de Garantía Total</h3>
            <p>Tu satisfacción es nuestra prioridad absoluta. Puedes cancelar tu suscripción cuando lo desees, sin preguntas ni complicaciones. La cancelación será efectiva al final del período actual. Si decides cancelar antes de tu primera entrega, te reembolsaremos el monto completo. ¡Queremos que estés 100% feliz con nuestro servicio!</p>
          </div>
          <div className={style.policyCard}>
            <h3>Entregas Puntuales y Precisas</h3>
            <p>Nuestras entregas se realizan los días acordados en el horario que elijas. Si no te encuentras en el domicilio, realizamos un segundo intento el mismo día o coordinamos una nueva entrega que se adapte perfectamente a tu agenda. Todas nuestras entregas son realizadas por personal especializado y capacitado en el manejo y cuidado de flores premium.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Garantía de Frescura Extendida</h3>
            <p>Garantizamos la frescura de nuestras flores por un mínimo de 5 días con los cuidados adecuados. Cada entrega incluye instrucciones personalizadas de cuidado para maximizar la vida de tus flores. Si no estás satisfecho con la calidad, contáctanos dentro de las 24 horas y reemplazaremos tu arreglo sin costo adicional. Seleccionamos diariamente las mejores flores de productores locales certificados.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Flexibilidad a Tu Medida</h3>
            <p>Puedes modificar tu suscripción en cualquier momento según tus necesidades. ¿Vas de vacaciones? Pausa tu servicio hasta por 4 semanas consecutivas sin perder beneficios ni antigüedad. Las modificaciones en la frecuencia o composición pueden realizarse con 5 días de anticipación. Como agradecimiento a tu fidelidad, después de 3 meses recibirás un arreglo especial de regalo con nuestras flores más exclusivas.</p>
          </div>
        </div>
      </section>

      <div className={style.ctaSection}>
        <h2>Transforma tu espacio cada semana</h2>
        <p>Únete a nuestra comunidad de amantes de las flores y descubre cómo un arreglo floral semanal puede cambiar completamente la energía y belleza de tu entorno.</p>
        <motion.button 
          onClick={scrollToForm}
          className={style.ctaButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Comenzar ahora
        </motion.button>
      </div>
    </div>
  );
};

export default SubscripcionComponent;