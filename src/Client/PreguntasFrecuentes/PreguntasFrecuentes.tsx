"use client"

import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeSwitchContext';
import styles from './preguntasFrecuentes.module.css';
import { 
  LocalFlorist, Search, KeyboardArrowDown,
  ShoppingCart, LocalShipping, CreditCard, Help, ArrowBack, ArrowForward
} from '@mui/icons-material';
import Link from 'next/link';


// Interfaces para TypeScript
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Category {
  name: string;
  icon: ReactElement;
  label: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  category: string;
}

interface CategoryTabProps {
  icon: ReactElement;
  name: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

interface ScrollButtonState {
  top: boolean;
  bottom: boolean;
}

// Componente para mostrar cada pregunta y respuesta
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen, category }) => {
  return (
    <motion.div
      className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
      initial={false}
      onClick={toggleOpen}
    >
      <div className={styles.questionContainer}>
        <motion.div className={styles.questionWrapper}>
          <h3 className={styles.question}>{question}</h3>
          <motion.div 
            className={styles.iconContainer}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <KeyboardArrowDown className={styles.arrowIcon} />
          </motion.div>
        </motion.div>
        <span className={styles.categoryTag}>{category}</span>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={styles.answerContainer}
            initial={{ height: 0,  }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0,  }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className={styles.answer} dangerouslySetInnerHTML={{ __html: answer }}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Componente para mostrar las categorías
const CategoryTab: React.FC<CategoryTabProps> = ({ icon, name, isActive, onClick, count }) => {
  return (
    <motion.div 
      className={`${styles.categoryTab} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span className={styles.categoryName}>{name}</span>
      <span className={styles.categoryCount}>{count}</span>
    </motion.div>
  );
};

// Componente principal de Preguntas Frecuentes
const PreguntasFrecuentes: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('todas');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [visibleFAQs, setVisibleFAQs] = useState<FAQ[]>([]);
  const [showScrollButton, setShowScrollButton] = useState<ScrollButtonState>({ top: false, bottom: true });
  const faqsContainerRef = useRef<HTMLDivElement>(null);
  
  // Base de datos de preguntas frecuentes organizadas por categorías
  const faqData: FAQ[] = [
    {
      id: 1,
      question: "¿Cómo puedo realizar un seguimiento de mi pedido?",
      answer: "Puedes seguir tu pedido entrando a tu cuenta y visitando la sección de <strong>'Mis pedidos'</strong>. También te enviaremos actualizaciones por email sobre el estado de tu envío con un número de seguimiento. Si tienes dudas adicionales, contáctanos directamente con tu número de pedido.",
      category: "envios"
    },
    {
      id: 2,
      question: "¿Cuál es el tiempo estimado de entrega?",
      answer: "En <strong>Envío Flores</strong> tenemos los siguientes tiempos de entrega:<br><br>• <strong>Para Capital Federal:</strong> Entre 2-4 horas en pedidos estándar y agenda para fecha específica.<br>• <strong>Para Gran Buenos Aires:</strong> Entregas en el mismo día para pedidos realizados antes de las 13:00 hs.<br>• <strong>Envíos al interior:</strong> Consulta tiempos según la localidad.<br><br>Recuerda que puedes elegir nuestro servicio Premium para solicitar una hora específica de entrega.",
      category: "envios"
    },
    {
      id: 3,
      question: "¿Se entregan flores los fines de semana y feriados?",
      answer: "¡Sí! Realizamos entregas los 365 días del año, incluidos fines de semana y feriados. Sin embargo, te recomendamos realizar tu pedido con anticipación para estas fechas especiales ya que suele haber una alta demanda.<br><br>Para días festivos importantes como San Valentín, Día de la Madre, etc., sugerimos hacer el pedido con al menos 3-5 días de anticipación.",
      category: "envios"
    },
    {
      id: 4,
      question: "¿Puedo cambiar la fecha de entrega una vez realizado el pedido?",
      answer: "Sí, es posible modificar la fecha de entrega siempre que nos avises con al menos 24 horas de anticipación a la fecha programada inicialmente.<br><br>Para solicitar este cambio, deberás contactar a nuestro equipo de atención al cliente por WhatsApp al <strong>+54 9 11 6542-1003</strong> o por email a <strong>ventas@aflorar.com.ar</strong> indicando tu número de pedido y la nueva fecha deseada.",
      category: "envios"
    },
    {
      id: 5,
      question: "¿Qué métodos de pago aceptan?",
      answer: "En Envío Flores aceptamos múltiples formas de pago:<br><br>• <strong>Tarjetas de crédito/débito</strong> (Visa, MasterCard, American Express)<br>• <strong>MercadoPago</strong> (todas las opciones disponibles en la plataforma)<br>• <strong>PayPal</strong> (para pagos internacionales)<br>• <strong>Transferencia bancaria</strong><br><br>Todos nuestros métodos de pago son seguros y cuentan con protección de datos.",
      category: "pagos"
    },
    {
      id: 6,
      question: "¿Los precios incluyen IVA?",
      answer: "Sí, todos los precios mostrados en nuestra web ya incluyen IVA. El precio que ves es el precio final que pagarás, sin sorpresas ni costos adicionales ocultos.<br><br>El único cargo extra que podría aplicarse es el costo de envío, el cual se calcula automáticamente durante el proceso de compra según la dirección de entrega.",
      category: "pagos"
    },
    {
      id: 7,
      question: "¿Ofrecen factura para empresas?",
      answer: "Sí, emitimos facturas tipo A para empresas. Durante el proceso de compra, selecciona la opción 'Necesito factura A' e ingresa los datos fiscales correspondientes de tu empresa (CUIT, razón social y domicilio fiscal).<br><br>La factura será enviada por correo electrónico una vez que se complete el pago.",
      category: "pagos"
    },
    {
      id: 8,
      question: "¿Qué sucede si hay un problema con mi pago?",
      answer: "Si experimentas algún problema con tu pago, no te preocupes. Puedes contactarnos inmediatamente por:<br><br>• <strong>WhatsApp:</strong> +54 9 11 6542-1003<br>• <strong>Email:</strong> ventas@aflorar.com.ar<br>• <strong>Teléfono:</strong> 4788-9185<br><br>Nuestro equipo verificará la situación y te ayudará a completar tu compra por un medio alternativo si es necesario.",
      category: "pagos"
    },
    {
      id: 9,
      question: "¿Las flores se parecen a las de la foto?",
      answer: "En Envío Flores nos esforzamos para que los arreglos entregados sean lo más similar posible a las imágenes que ves en nuestra web. Sin embargo, al trabajar con productos naturales, pueden existir ligeras variaciones en color, tamaño o forma de las flores según la temporada y disponibilidad.<br><br>Cuando una flor específica no está disponible, nuestros floristas la reemplazarán por otra similar que mantenga la estética y valor del arreglo original.",
      category: "productos"
    },
    {
      id: 10,
      question: "¿Qué hago si las flores no están frescas?",
      answer: "La satisfacción de nuestros clientes es nuestra prioridad. Si las flores recibidas no están frescas o presentan algún problema de calidad, contáctanos dentro de las 24 horas posteriores a la entrega con fotos del arreglo.<br><br>Evaluaremos tu caso y, según corresponda, realizaremos el reemplazo del arreglo sin costo adicional o te ofreceremos otras soluciones satisfactorias.",
      category: "productos"
    },
    {
      id: 11,
      question: "¿Ofrecen ramos personalizados?",
      answer: "¡Sí! En Envío Flores puedes solicitar arreglos personalizados según tus preferencias y presupuesto. Para hacer un pedido personalizado:<br><br>1. Contáctanos por WhatsApp al +54 9 11 6542-1003<br>2. Describe el tipo de arreglo que deseas, flores preferidas, colores, tamaño y ocasión<br>3. Nuestro equipo te enviará opciones y presupuestos<br>4. Una vez aprobado, podrás realizar el pago y programar la entrega",
      category: "productos"
    },
    {
      id: 12,
      question: "¿Qué flores son mejores para regalar en cada ocasión?",
      answer: "Aquí te dejamos algunas recomendaciones según la ocasión:<br><br>• <strong>Amor/Romántico:</strong> Rosas rojas, tulipanes rosados, lirios<br>• <strong>Cumpleaños:</strong> Gerberas coloridas, girasoles, rosas de colores variados<br>• <strong>Aniversario:</strong> Rosas blancas, lirios, orquídeas<br>• <strong>Condolencias:</strong> Lirios blancos, crisantemos blancos, rosas blancas<br>• <strong>Agradecimiento:</strong> Tulipanes, margaritas, iris<br>• <strong>Recuperación/Hospital:</strong> Rosas amarillas, girasoles (consulta antes si el hospital permite flores)",
      category: "productos"
    },
    {
      id: 13,
      question: "¿Cómo puedo cuidar mis flores para que duren más tiempo?",
      answer: "Para maximizar la duración de tus flores:<br><br>1. <strong>Agua fresca:</strong> Cambia el agua cada 2-3 días<br>2. <strong>Corta los tallos:</strong> Recorta 1-2 cm de los tallos en diagonal cada vez que cambies el agua<br>3. <strong>Retira hojas sumergidas:</strong> Evita que las hojas toquen el agua para prevenir bacterias<br>4. <strong>Usa el conservante:</strong> Agrega el sobre de conservante que viene con tus flores<br>5. <strong>Ubicación adecuada:</strong> Mantén las flores lejos del sol directo, fuentes de calor, y frutas (que liberan etileno acelerando la maduración)",
      category: "cuidados"
    },
    {
      id: 14,
      question: "¿Las plantas de interior necesitan cuidados especiales?",
      answer: "Cada planta tiene requisitos específicos, pero aquí hay consejos generales:<br><br>• <strong>Luz:</strong> La mayoría de plantas de interior necesitan luz indirecta brillante<br>• <strong>Riego:</strong> Es mejor regar menos que en exceso; verifica que la capa superior del sustrato esté seca antes de regar nuevamente<br>• <strong>Humedad:</strong> Muchas plantas tropicales agradecen un ambiente húmedo<br>• <strong>Temperatura:</strong> Evita cambios bruscos y corrientes de aire<br><br>Con cada planta enviamos una tarjeta con instrucciones específicas de cuidado.",
      category: "cuidados"
    },
    {
      id: 15,
      question: "¿Puedo cancelar o modificar mi pedido?",
      answer: "Puedes cancelar o modificar tu pedido si nos contactas con al menos 24 horas de antelación a la fecha de entrega programada. Para hacerlo:<br><br>• Envía un email a ventas@aflorar.com.ar con tu número de pedido<br>• Llámanos al 4788-9185<br>• Contáctanos por WhatsApp al +54 9 11 6542-1003<br><br>Si el pedido ya está en proceso de preparación o entrega, las modificaciones podrían no ser posibles o podrían aplicarse cargos adicionales.",
      category: "pedidos"
    },
    {
      id: 16,
      question: "¿Qué hago si la persona no se encuentra en el domicilio al momento de la entrega?",
      answer: "Si no hay nadie para recibir el pedido:<br><br>1. Nuestro repartidor intentará contactar al destinatario por teléfono<br>2. Si no hay respuesta, intentaremos dejar el arreglo con algún vecino o en recepción (edificios)<br>3. Si lo anterior no es posible, te contactaremos para reprogramar la entrega<br><br>Para evitar estos inconvenientes, asegúrate de proporcionar un número de teléfono válido del destinatario y confirmar que estará disponible para recibir el envío.",
      category: "envios"
    },
    {
      id: 17,
      question: "¿Entregan en todo el país?",
      answer: "Sí, Envío Flores realiza entregas en toda Argentina. Contamos con:<br><br>• <strong>Entrega directa propia:</strong> En Capital Federal y Gran Buenos Aires<br>• <strong>Red de floristas asociados:</strong> Para entregas en el interior del país<br><br>Los tiempos de entrega y disponibilidad pueden variar según la localidad. Durante el proceso de compra podrás verificar si tu código postal está dentro de nuestra área de cobertura.",
      category: "envios"
    },
    {
      id: 18,
      question: "¿Realizan envíos internacionales?",
      answer: "Actualmente realizamos envíos a:<br><br>• <strong>Uruguay</strong><br>• <strong>Chile</strong><br>• <strong>Paraguay</strong><br>• <strong>Brasil</strong> (principales ciudades)<br><br>Para envíos internacionales, es necesario hacer la solicitud con al menos 3-5 días de anticipación. Los precios y disponibilidad pueden variar. Contáctanos directamente para coordinar envíos internacionales a ventas@aflorar.com.ar.",
      category: "envios"
    },
    {
      id: 19,
      question: "¿Entregan en fechas especiales como San Valentín o Día de la Madre?",
      answer: "Sí, realizamos entregas en fechas especiales, pero te recomendamos hacer tu pedido con anticipación (al menos 5-7 días antes) ya que son fechas de alta demanda.<br><br>Para estas ocasiones especiales ampliamos nuestro equipo de repartidores, pero los horarios específicos de entrega pueden tener mayor margen debido al alto volumen de pedidos.",
      category: "envios"
    },
    {
      id: 20,
      question: "¿Puedo incluir una tarjeta o mensaje personalizado con mi envío?",
      answer: "¡Por supuesto! Todos nuestros envíos incluyen una tarjeta de regalo donde puedes escribir tu mensaje personalizado sin costo adicional. Durante el proceso de compra encontrarás un campo específico para incluir tu dedicatoria.<br><br>El mensaje puede contener hasta 300 caracteres. Si deseas una tarjeta de regalo especial o más grande, contamos con opciones premium que puedes agregar a tu compra.",
      category: "pedidos"
    },
  ];
  
  // Agrupar preguntas por categoría
  const categories: Category[] = [
    { name: 'todas', icon: <Help />, label: 'Todas las preguntas' },
    { name: 'envios', icon: <LocalShipping />, label: 'Envíos y entregas' },
    { name: 'productos', icon: <LocalFlorist />, label: 'Nuestros productos' },
    { name: 'pagos', icon: <CreditCard />, label: 'Pagos y facturación' },
    { name: 'cuidados', icon: <LocalFlorist fontSize="small" />, label: 'Cuidado de flores' },
    { name: 'pedidos', icon: <ShoppingCart />, label: 'Pedidos y modificaciones' },
  ];

  // Contar la cantidad de preguntas por categoría
  const getCategoryCount = (categoryName: string): number => {
    if (categoryName === 'todas') return faqData.length;
    return faqData.filter(item => item.category === categoryName).length;
  };

  // Filtrar preguntas según búsqueda y categoría seleccionada
  useEffect(() => {
    let filtered = [...faqData];
    
    // Filtrar por categoría
    if (activeCategory !== 'todas') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setVisibleFAQs(filtered);
  }, [searchTerm, activeCategory]);

  // Función para manejar la apertura y cierre de preguntas
  const toggleQuestion = (id: number): void => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  // Función para manejar el cambio de categoría
  const handleCategoryChange = (category: string): void => {
    setActiveCategory(category);
    setOpenQuestionId(null);
  };

  // Manejar el scroll dentro del contenedor de FAQs
  const handleScroll = (): void => {
    if (faqsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = faqsContainerRef.current;
      
      setShowScrollButton({
        top: scrollTop > 50,
        bottom: scrollTop + clientHeight < scrollHeight - 50
      });
    }
  };

  // Funciones para scroll arriba/abajo
  const scrollTop = (): void => {
    if (faqsContainerRef.current) {
      faqsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const scrollBottom = (): void => {
    if (faqsContainerRef.current) {
      faqsContainerRef.current.scrollTo({ 
        top: faqsContainerRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // Efecto para manejar eventos de scroll
  useEffect(() => {
    const container = faqsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Inicializa el contenido visible
  useEffect(() => {
    setVisibleFAQs(faqData);
  }, []);

  return (
    <div className={`${styles.pageContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
      <motion.div 
        className={styles.heroSection}
        initial={{  y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Preguntas Frecuentes</h1>
          <p className={styles.heroSubtitle}>Encuentra respuestas a las dudas más comunes sobre nuestro servicio</p>
          
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar una pregunta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              ref={searchInputRef}
            />
            {searchTerm && (
              <button 
                type="button"
                className={styles.clearButton}
                onClick={() => {
                  setSearchTerm('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.flowerDecoration}>
          <div className={styles.flower1}></div>
          <div className={styles.flower2}></div>
          <div className={styles.flower3}></div>
        </div>
      </motion.div>

      <div className={styles.contentContainer}>
        <div className={styles.categoriesSection}>
          {categories.map((category) => (
            <CategoryTab
              key={category.name}
              icon={category.icon}
              name={category.label}
              count={getCategoryCount(category.name)}
              isActive={activeCategory === category.name}
              onClick={() => handleCategoryChange(category.name)}
            />
          ))}
        </div>

        <div className={styles.faqsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {categories.find(c => c.name === activeCategory)?.label || 'Todas las preguntas'}
              {searchTerm && ` - Resultados para "${searchTerm}"`}
            </h2>
            {visibleFAQs.length > 0 ? (
              <span className={styles.resultCount}>{visibleFAQs.length} resultados</span>
            ) : null}
          </div>

          <div className={styles.faqsContainer} ref={faqsContainerRef}>
            {visibleFAQs.length > 0 ? (
              <motion.div className={styles.faqsList}>
                <AnimatePresence>
                  {visibleFAQs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{  y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{  y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FAQItem
                        question={faq.question}
                        answer={faq.answer}
                        category={categories.find(c => c.name === faq.category)?.label || faq.category}
                        isOpen={openQuestionId === faq.id}
                        toggleOpen={() => toggleQuestion(faq.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                className={styles.noResults}
                initial={{  }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.noResultsIcon}>
                  <Search fontSize="large" />
                </div>
                <h3>No encontramos resultados</h3>
                <p>Intenta con otra búsqueda o categoría</p>
                <button 
                  type="button"
                  className={styles.resetButton}
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('todas');
                  }}
                >
                  Mostrar todas las preguntas
                </button>
              </motion.div>
            )}
          </div>

          <div className={styles.scrollButtons}>
            {showScrollButton.top && (
              <button 
                type="button"
                className={`${styles.scrollButton} ${styles.scrollTop}`}
                onClick={scrollTop}
                aria-label="Scroll al inicio"
              >
                <ArrowBack />
              </button>
            )}
            {showScrollButton.bottom && (
              <button 
                type="button"
                className={`${styles.scrollButton} ${styles.scrollBottom}`}
                onClick={scrollBottom}
                aria-label="Scroll al final"
              >
                <ArrowForward />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.needMoreHelpSection}>
        <div className={styles.helpContent}>
          <h2>¿Todavía tienes dudas?</h2>
          <p>Nuestro equipo de atención al cliente está listo para ayudarte</p>
          
          <div className={styles.contactOptions}>
            <Link href="/contacto" className={styles.contactOption}>
              <div className={styles.contactIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <div className={styles.contactInfo}>
                <h3>Chat en vivo</h3>
                <p>Habla con nuestro equipo</p>
              </div>
            </Link>
            
            <Link href="/contacto" className={styles.contactOption}>
              <div className={styles.contactIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className={styles.contactInfo}>
                <h3>Llámanos</h3>
                <p>4788-9185</p>
              </div>
            </Link>
            
            <Link href="mailto:ventas@aflorar.com.ar" className={styles.contactOption}>
              <div className={styles.contactIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className={styles.contactInfo}>
                <h3>Envíanos un email</h3>
                <p>ventas@aflorar.com.ar</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;