import React, { useEffect, useState, useRef } from "react";
import { Paper, Typography, useMediaQuery, Container, Grid, Box } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { BsFlower1, BsCalendarCheck, BsCreditCard2Front } from "react-icons/bs";
import { FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import style from './informacion.module.css';

// Componente animado para elementos que entran en el viewport
const AnimatedSection = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  // Configuración de animaciones según dirección
  const variants = {
    up: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    left: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    right: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.6, delay: delay }}
    >
      {children}
    </motion.div>
  );
};

const Informacion = () => {
  const isSmallScreen = useMediaQuery('(max-width:650px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');
  const [device, setDevice] = useState('PC');

  // Detectar dispositivo para ajustes específicos
  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
      setDevice('Android');
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setDevice('iOS');
    } else {
      setDevice('PC');
    }
  }, []);

  // Pasos del proceso simplificados para mejor experiencia
  const steps = [
    {
      icon: <BsFlower1 className={style.stepIcon} />,
      title: "ELIGE TUS FLORES",
      description: "Selecciona entre nuestra exclusiva colección de arreglos florales de temporada."
    },
    {
      icon: <BsCalendarCheck className={style.stepIcon} />,
      title: "PERSONALIZA TU ENVÍO",
      description: "Elige la fecha ideal y añade un mensaje personal para sorprender a esa persona especial."
    },
    {
      icon: <BsCreditCard2Front className={style.stepIcon} />,
      title: "PAGO SEGURO",
      description: "Realiza tu pago con total seguridad a través de nuestros métodos verificados."
    }
  ];

  // Empresas asociadas con datos estructurados
  const empresas = [
    {
      name: "Aflorar",
      image: "/assets/imagenes/empresas-asociadas/Aflorar.png",
      url: "https://www.aflorar.com.ar/"
    },
    {
      name: "Florerias Argentinas",
      image: "/assets/imagenes/empresas-asociadas/FloreriasArgentinas.png",
      url: "https://floreriasargentinas.vercel.app/"
    },
    {
      name: "Flores Express",
      image: "/assets/imagenes/empresas-asociadas/FloresExpress.png",
      url: "https://www.floresexpress.com.ar/"
    },
    {
      name: "Regalos Flores",
      image: "/assets/imagenes/empresas-asociadas/RegalosFlores.png",
      url: "https://www.regalosflores.com.ar/"
    }
  ];

  return (
    <Container maxWidth="xl" className={style.containerMain}>
      <Paper 
        elevation={0} 
        className={style.infoPaper}
        sx={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/assets/imagenes/fondosHome/fondo-info.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: device === 'iOS' ? 'initial' : 'fixed',
        }}
      >
        <div className={style.contentWrapper}>
          {/* Header section with main value proposition */}
          <section className={style.heroSection}>
            <AnimatedSection>
              <Typography variant="h1" component="h1" className={style.mainTitle}>
                ¿Por qué elegir <span>Envio Flores</span>?
              </Typography>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className={style.titleDecoration}>
                <div className={style.line}></div>
                <FaLeaf className={style.leafIcon} />
                <div className={style.line}></div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <Typography variant="h5" component="h2" className={style.mainDescription}>
                Somos la florería online número uno en Argentina, con expertos floristas que crean arreglos únicos para cada ocasión especial.
              </Typography>
            </AnimatedSection>
          </section>

          {/* About us with enhanced content */}
          <section className={style.aboutSection}>
            <AnimatedSection direction="left">
              <div className={style.aboutContent}>
                <Typography variant="body1" className={style.aboutText}>
                  Contamos con un equipo de floristas profesionales con amplia experiencia en el rubro, que se esforzarán al
                  máximo para cumplir con tus expectativas y sorprender a esa persona tan especial para ti.
                </Typography>
                
                <Typography variant="body1" className={style.aboutText}>
                  Realiza tu pedido de flores online en tres simples pasos, y entregaremos tus flores a domicilio
                  en donde nos indiques. Puedes elegir la fecha y el horario de entrega luego de agregar un producto a tu carrito.
                </Typography>
                
                <Box className={style.contactPrompt}>
                  <FaMapMarkerAlt className={style.mapMarker} />
                  <h6 className={style.contactText}>
                    Entregas en CABA y alrededores. Ante cualquier duda no dudes en comunicarte con nosotros.
                  </h6>
                </Box>
              </div>
            </AnimatedSection>
          </section>

          {/* Process steps with modern cards */}
          <section className={style.processSection}>
            <AnimatedSection>
              <Typography variant="h3" className={style.sectionTitle}>
                Cómo funciona
              </Typography>
              <div className={style.titleUnderline}></div>
            </AnimatedSection>
            
            <Grid 
              container 
              spacing={isMediumScreen ? 2 : 4} 
              className={style.stepsContainer}
              alignItems="stretch"
            >
              {steps.map((step, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={4} 
                  key={index} 
                  className={style.gridItem}
                >
                  <AnimatedSection delay={0.2 * index}>
                    <div className={style.stepCard}>
                      <div className={style.stepIconContainer}>
                        {step.icon}
                      </div>
                      <Typography variant="h6" className={style.stepTitle}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" className={style.stepDescription}>
                        {step.description}
                      </Typography>
                      <div className={style.stepCardFooter}>
                        <div className={style.stepNumber}>{index + 1}</div>
                      </div>
                    </div>
                  </AnimatedSection>
                </Grid>
              ))}
            </Grid>
          </section>

          {/* Separator with animation */}
          <div className={style.separator}>
            <AnimatedSection>
              <div className={style.separatorInner}>
                <div className={style.separatorLine}></div>
                <div className={style.separatorIcon}>
                  <BsFlower1 />
                </div>
                <div className={style.separatorLine}></div>
              </div>
            </AnimatedSection>
          </div>

          {/* Partners section with modern grid */}
          <section className={style.partnersSection}>
            <AnimatedSection>
              <Typography variant="h3" className={style.sectionTitle}>
                Empresas Asociadas
              </Typography>
              <div className={style.titleUnderline}></div>
            </AnimatedSection>
            
            <Grid container spacing={isSmallScreen ? 2 : 3} className={style.partnersGrid}>
              {empresas.map((empresa, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <AnimatedSection delay={0.1 * index}>
                    <div className={style.partnerCard}>
                      <Typography variant="h6" className={style.partnerName}>
                        {empresa.name}
                      </Typography>
                      <a 
                        href={empresa.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={style.partnerLink}
                      >
                        <div className={style.imageContainer}>
                          <img 
                            src={empresa.image} 
                            alt={`Logo de ${empresa.name}`} 
                            className={style.partnerImage}
                          />
                          <div className={style.imageOverlay}>
                            <span>Visitar</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </AnimatedSection>
                </Grid>
              ))}
            </Grid>
          </section>
          
          {/* Final CTA section */}
          <section className={style.ctaSection}>
            <AnimatedSection>
              <div className={style.ctaContent}>
                <Typography variant="h4" className={style.ctaTitle}>
                  Listos para sorprender a alguien especial
                </Typography>
                <Typography variant="body1" className={style.ctaText}>
                  Nuestros arreglos florales están diseñados para transmitir los sentimientos más sinceros
                </Typography>
                <a href="/productos" className={style.ctaButton}>
                  Ver catálogo
                </a>
              </div>
            </AnimatedSection>
          </section>
          
        </div>
      </Paper>
    </Container>
  );
};

export default Informacion;