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
  EventAvailable,
  CardGiftcard,
  ColorLens,
  EmojiNature,
  Spa
} from '@mui/icons-material';
import { ZoomIn, Close } from '@mui/icons-material';

import style from './SubscripcionQuincenal.module.css';
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
    { icon: <LocalFlorist />, text: 'Flores premium seleccionadas por expertos floristas' },
    { icon: <Schedule />, text: 'Entregas puntuales cada dos semanas directamente a tu puerta' },
    { icon: <Business />, text: 'Realza la imagen de tu empresa con arreglos exclusivos' },
    { icon: <Home />, text: 'Transforma tu hogar con el arte y la frescura natural' },
    { icon: <EventAvailable />, text: 'Renovación automática sin preocupaciones' },
    { icon: <DateRange />, text: 'Flexibilidad para cambiar fechas y preferencias' },
    { icon: <CardGiftcard />, text: 'Sorprende a tus seres queridos con un regalo que se renueva' },
    { icon: <ColorLens />, text: 'Paletas de colores exclusivas según la temporada' }
  ];

  const calculateNextDeliveries = () => {
    const deliveries = [];
    let nextDelivery = new Date();

    // Encontrar el próximo jueves
    while (getDay(nextDelivery) !== 4) { // 4 = Jueves
      nextDelivery = addDays(nextDelivery, 1);
    }

    // Primera entrega (próximo jueves)
    deliveries.push(format(nextDelivery, 'dd/MM/yyyy'));

    // Segunda entrega (jueves en 2 semanas)
    let secondDelivery = addDays(nextDelivery, 14); // Saltar 2 semanas
    deliveries.push(format(secondDelivery, 'dd/MM/yyyy'));

    return deliveries;
  };


  const formatWhatsAppMessage = (data) => {
    const message = `
  ¡Hola Envio Flores! 🌸
  
  Me inscribí en el Plan Quincenal de Flores Premium. Estos son mis datos:
  
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
  
  ¡Estoy entusiasmado/a por comenzar mi experiencia floral! 🌹
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
        entregasPendientes: 2,
        metodoPago: 'pendiente',
        ultimaRenovacion: null,
        proximaRenovacion: endDate.toISOString(),
        historialEntregas: []
      };

      // Mostrar SweetAlert2 de confirmación
      const result = await Swal.fire({
        title: '¿Confirmar tu Suscripción Quincenal Premium?',
        html: `
          <div style="text-align: left">
            <h3>Datos Personales:</h3>
            <small><strong>Nombre:</strong> ${subscriptionData.name}</small><br>
            <small><strong>Email:</strong> ${subscriptionData.email}</small><br>
            <small><strong>Teléfono:</strong> ${subscriptionData.phone}</small><br>
            <small><strong>Dirección:</strong> ${subscriptionData.address}</small><br>
            
            <h3>Detalles de Suscripción:</h3>
            <small><strong>Tipo:</strong> ${subscriptionData.type === 'personal' ? 'Personal' : 'Empresa'}</small><br>
            ${subscriptionData.type === 'empresa' ? `<small><strong>Empresa:</strong> ${subscriptionData.empresa}</small><br>` : ''}
            <small><strong>Horario preferido:</strong> ${subscriptionData.horarioPreferido}</small><br>
            <small><strong>Próximas entregas:</strong> ${deliveryDates.join(', ')}</small><br>
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
        confirmButtonText: 'Sí, quiero comenzar mi experiencia floral',
        cancelButtonText: 'Revisar mis datos',
        confirmButtonColor: '#670000',
        cancelButtonColor: '#A6855D',
        background: isDarkMode ? '#222222' : '#FFFFFF',
        reverseButtons: true,
        backdrop: `rgba(103, 0, 0, 0.4)`
      });

      if (result.isConfirmed) {
        // Guardar en Firebase
        await addDoc(collection(baseDeDatos, 'subscripcion-quincenal'), subscriptionData);
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
          title: '¡Felicidades por tu Suscripción Premium!',
          text: 'Prepárate para transformar tus espacios con nuestra experiencia floral exclusiva. Te redirigiremos a WhatsApp para finalizar el proceso.',
          icon: 'success',
          confirmButtonColor: '#670000',
          background: isDarkMode ? '#222222' : '#FFFFFF',
          iconColor: '#670000'
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
        confirmButtonColor: '#670000',
        background: isDarkMode ? '#222222' : '#FFFFFF'
      });
    } finally {
      setLoading(false);
    }
  };


  const scrollToForm = () => {
    if (formRef.current) {
      const formTop = formRef.current.offsetTop;
      const offset = window.innerHeight / 4;

      window.scrollTo({
        top: formTop - offset,
        behavior: 'smooth'
      });
    }
  };


  return (
    <div className={`${style.container} ${isDarkMode ? style.dark : style.light}`}>
      <motion.div
        className={style.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={style.heroContent}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Transforma tu mundo con la magia de las flores
          </motion.h1>
          <motion.p 
            className={style.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Una experiencia quincenal que renueva tus espacios y emociones
          </motion.p>
          <motion.button 
            className={style.heroCta}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToForm}
          >
            Comenzar mi experiencia floral
          </motion.button>
        </div>
      </motion.div>

      <motion.section className={style.infoSection}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={style.sectionTitle}
        >
          <span className={style.subtitle}>Plan Quincenal Select Premium</span>
        </motion.h2>
        <motion.p 
          className={style.sectionDescription}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Dos veces al mes, recibirás en tu puerta arreglos florales exclusivos diseñados por nuestros expertos floristas, utilizando las flores más frescas y hermosas de la temporada.
        </motion.p>

        <div className={style.subscriptionPlans}>
          <motion.div
            className={style.planCard}
            whileHover={{ scale: 1.01, boxShadow: "0 20px 30px rgba(212, 175, 55, 0.2)" }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className={style.planHeader}>
              <LocalFlorist className={style.planIcon} />
              <h3>Plan Select Quincenal</h3>
              <h4>
                <Schedule className={style.scheduleIcon} />
                Entrega Quincenal Premium Garantizada
              </h4>
            </div>

            <div
              className={`${style.imageContainer} ${isExpanded ? style.expanded : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Image
                width={500}
                height={250}
                src="/imagenes/subscripcion/flores-quincenal-para-empresas.png"
                alt="Suscripción Quincenal Premium de Flores"
                className={style.planImage}
                priority
              />
              {isExpanded && (
                <small className={style.overlayText}>Arreglo floral de temporada - Diseño exclusivo</small>
              )}
              {!isExpanded && (
                <div className={style.imageOverlay}>
                  <ZoomIn className={style.expandIcon} />
                  <span>Ampliar imagen</span>
                </div>
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
                <span>2 entregas mensuales de arreglos exclusivos</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <EmojiNature className={style.checkIcon} />
                <span>Flores premium de máxima frescura y duración</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Spa className={style.checkIcon} />
                <span>Diseños artísticos exclusivos de temporada</span>
              </motion.li>
              <motion.li
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <CalendarMonth className={style.checkIcon} />
                <span>Envío premium incluido en CABA y GBA</span>
              </motion.li>
            </ul>

            <div className={style.planHighlights}>
              <div className={style.highlight}>
                <span className={style.highlightValue}>14+</span>
                <span className={style.highlightLabel}>Días de frescura garantizada</span>
              </div>
              <div className={style.highlight}>
                <span className={style.highlightValue}>100%</span>
                <span className={style.highlightLabel}>Satisfacción garantizada</span>
              </div>
              <div className={style.highlight}>
                <span className={style.highlightValue}>15+</span>
                <span className={style.highlightLabel}>Años de experiencia</span>
              </div>
            </div>

            <motion.button
              className={style.subscribeButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToForm}
            >
              Comenzar mi suscripción
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <section className={style.benefitsSection}>
        <h2>Beneficios exclusivos de nuestra suscripción premium</h2>
        <p className={style.benefitsDescription}>
          Diseñada para brindarte una experiencia floral inigualable que transforma tus espacios y eleva tu bienestar.
        </p>
        <div className={style.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={style.benefitCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, boxShadow: "0 12px 24px rgba(103, 0, 0, 0.15)" }}
            >
              {benefit.icon}
              <p>{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={style.useCasesSection}>
        <h2>Perfecto para cada ocasión</h2>
        <div className={style.useCasesGrid}>
          <motion.div 
            className={style.useCase}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Business className={style.useCaseIcon} />
            <h3>Para empresas</h3>
            <p>Crea espacios profesionales que impresionen a tus clientes y mejoren el ambiente laboral. Ideal para recepciones, salas de reuniones y oficinas ejecutivas.</p>
          </motion.div>
          <motion.div 
            className={style.useCase}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Home className={style.useCaseIcon} />
            <h3>Para hogares</h3>
            <p>Transforma tu espacio personal con la frescura y belleza natural de las flores. Un detalle de autoregalo que renovará constantemente la energía de tu hogar.</p>
          </motion.div>
          <motion.div 
            className={style.useCase}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardGiftcard className={style.useCaseIcon} />
            <h3>Como regalo</h3>
            <p>Sorprende a esa persona especial con un obsequio que se renueva quincenalmente. Una experiencia emotiva que perdura en el tiempo y refuerza vínculos afectivos.</p>
          </motion.div>
        </div>
      </section>

      <section className={style.testimonialsSection}>
        <h2>Lo que dicen nuestros suscriptores</h2>
        <div className={style.testimonialCards}>
          <motion.div 
            className={style.testimonialCard}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className={style.testimonialQuote}>"</div>
            <p>Recibir flores quincenalmente ha transformado completamente mi hogar. Cada entrega es una nueva sorpresa que alegra mi espacio. La calidad de las flores y su duración superan cualquier expectativa.</p>
            <div className={style.testimonialAuthor}>
              <span className={style.authorName}>Carolina M.</span>
              <span className={style.authorType}>Suscripción Personal — 8 meses</span>
            </div>
          </motion.div>
          
          <motion.div 
            className={style.testimonialCard}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className={style.testimonialQuote}>"</div>
            <p>La recepción de nuestra clínica dental se ha transformado con estos arreglos. Nuestros pacientes constantemente elogian las flores y preguntan dónde las conseguimos. Una inversión que ha mejorado notablemente la experiencia de nuestros clientes.</p>
            <div className={style.testimonialAuthor}>
              <span className={style.authorName}>Dr. Martín L.</span>
              <span className={style.authorType}>Suscripción Empresarial — 12 meses</span>
            </div>
          </motion.div>
          
          <motion.div 
            className={style.testimonialCard}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className={style.testimonialQuote}>"</div>
            <p>Le regalé esta suscripción a mi madre por su cumpleaños y ha sido el regalo más apreciado que le he dado. Cada dos semanas recibe un nuevo arreglo que la llena de alegría. El servicio es impecable y las flores son realmente espectaculares.</p>
            <div className={style.testimonialAuthor}>
              <span className={style.authorName}>Laura S.</span>
              <span className={style.authorType}>Suscripción Regalo — 6 meses</span>
            </div>
          </motion.div>
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
        <h2>Comienza tu experiencia floral premium</h2>
        <p className={style.formDescription}>Completa tus datos para iniciar tu suscripción quincenal y transformar tus espacios con la belleza y frescura de nuestras flores seleccionadas.</p>
        
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
              placeholder="Teléfono de contacto"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <LocationOn />
            <input
              type="text"
              placeholder="Dirección de entrega completa"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <LocalFlorist />
            <textarea
              placeholder="Preferencias de flores, colores o estilos (opcional)"
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
              <option value="empresa">Suscripción para Empresa</option>
              <option value="personal">Suscripción Personal</option>
              <option value="regalo">Suscripción como Regalo</option>
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
              <option value="16:00-19:00">Tarde-Noche (16:00 - 19:00)</option>
            </select>
          </div>
        </div>

        <div className={style.formGarantee}>
          <CheckCircle className={style.garanteeIcon} />
          <p>Garantía de satisfacción: si no estás completamente satisfecho/a con tu primera entrega, te devolvemos el 100% de tu dinero.</p>
        </div>

        <div className={style.formActions}>
          <motion.button
            type="submit"
            className={style.submitButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Suscribirme ahora'}
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
              ¡Felicidades! Tu suscripción ha sido procesada con éxito. Te hemos enviado un correo con todos los detalles.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      <section className={style.faqSection}>
        <h2>Preguntas frecuentes</h2>
        <div className={style.faqGrid}>
          <div className={style.faqItem}>
            <h3>¿Cómo funciona exactamente la suscripción quincenal?</h3>
            <p>Cada dos semanas, recibirás en tu domicilio u oficina un arreglo floral premium diseñado por nuestros expertos floristas. Las entregas se realizan los jueves en el horario que seleccionaste, permitiéndote disfrutar de flores frescas durante todo el año.</p>
          </div>
          <div className={style.faqItem}>
            <h3>¿Puedo especificar qué tipo de flores deseo recibir?</h3>
            <p>Absolutamente. En el formulario de suscripción puedes indicar tus preferencias de flores, colores o estilos. Nuestros floristas considerarán tus preferencias al crear cada arreglo, siempre utilizando las flores más frescas y hermosas disponibles en cada temporada.</p>
          </div>
          <div className={style.faqItem}>
            <h3>¿Qué sucede si no estoy en casa al momento de la entrega?</h3>
            <p>Realizamos dos intentos de entrega el mismo día. Si no podemos completar la entrega, nos comunicaremos contigo para coordinar una nueva fecha. Recomendamos dejar instrucciones específicas en el campo de preferencias si hay consideraciones especiales para la entrega.</p>
          </div>
          <div className={style.faqItem}>
            <h3>¿Cuánto tiempo duran las flores?</h3>
            <p>Garantizamos una frescura mínima de 14 días con los cuidados adecuados, que explicamos detalladamente en una tarjeta incluida con cada entrega. Nuestras flores son seleccionadas por su calidad y longevidad, asegurando que disfrutes de su belleza por el máximo tiempo posible.</p>
          </div>
        </div>
      </section>

      <section className={style.policiesSection}>
        <h2>Políticas y Términos</h2>
        <div className={style.policiesGrid}>
          <div className={style.policyCard}>
            <h3>Política de Cancelación</h3>
            <p>Puedes cancelar tu suscripción en cualquier momento contactando con nuestro servicio al cliente. La cancelación será efectiva al final del período actual. Si cancelas antes de tu primera entrega, te reembolsaremos el monto completo sin preguntas ni complicaciones.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Política de Entrega</h3>
            <p>Las entregas se realizan los jueves en el horario seleccionado. Notifícanos con 48 horas de anticipación para cambios en la dirección de entrega. Todas nuestras entregas son realizadas por personal capacitado y cada arreglo es protegido cuidadosamente para preservar su perfección durante el transporte.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Garantía de Frescura</h3>
            <p>Garantizamos la frescura de nuestras flores por un mínimo de 14 días con los cuidados adecuados. Si no estás satisfecho con la calidad, contáctanos dentro de las 24 horas y reemplazaremos el arreglo sin costo adicional. Nuestro compromiso es tu completa satisfacción.</p>
          </div>
          <div className={style.policyCard}>
            <h3>Modificaciones y Pausas</h3>
            <p>Puedes pausar tu suscripción hasta por 4 semanas sin perder beneficios. Las modificaciones pueden realizarse con 5 días de anticipación. Mantén tu suscripción por 3 meses consecutivos y recibirás un arreglo especial de regalo como agradecimiento por tu fidelidad.</p>
          </div>
        </div>
      </section>

      <section className={style.ctaSection}>
        <h2>Transforma tus espacios con la belleza de las flores</h2>
        <p>Una suscripción que renueva tu entorno y alegra tus días cada dos semanas</p>
        <motion.button
          className={style.ctaButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToForm}
        >
          Comenzar mi experiencia floral
        </motion.button>
      </section>
    </div>
  );
};

export default SubscripcionComponent;