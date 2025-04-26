import React, {  useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Alert, styled, useMediaQuery } from '@mui/material';
import { Check, LocalFlorist } from '@mui/icons-material';
import {  useCookies } from '../../context/CookieContext';
import { useTheme } from '../../context/ThemeSwitchContext';
import './checkout.css';

// Pasos simplificados y claros para el proceso de checkout
const steps = [
  'Seleccionar producto', 
  'Personalizar', 
  'Revisar carrito', 
  'Datos de envío', 
  'Pago'
];

// Descripciones detalladas para cada paso (solo visibles en pantallas medianas y grandes)
const stepsDescription = [
  'Elige el regalo perfecto', 
  'Personaliza y añade complementos', 
  'Revisa tu selección', 
  'Indica dónde entregamos', 
  'Finaliza tu compra de forma segura'
];

// Etiquetas para pasos completados
const stepsDone = [
  'Producto seleccionado', 
  'Personalización completada', 
  'Carrito verificado', 
  'Envío confirmado', 
  'Pago completado'
];

const CheckoutStepper = ({ activeStep, cartEmpty }) => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMobileScreen = useMediaQuery('(max-width:480px)');
  const [customLabels, setCustomLabels] = useState([...steps]);
  const { acceptedCookies } = useCookies();
  const { isDarkMode } = useTheme();

  // Actualizar etiquetas de pasos completados
  useEffect(() => {
    if (activeStep > 0) {
      const updatedLabels = [...steps];
      for (let i = 0; i < activeStep; i++) {
        updatedLabels[i] = stepsDone[i];
      }
      setCustomLabels(updatedLabels);
    }
  }, [activeStep]);

  // Componentes estilizados con Material UI
  const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
    '& .MuiStepLabel-label': {
      fontSize: isMobileScreen ? '0.7rem' : isSmallScreen ? '0.8rem' : '0.9rem',
      fontWeight: 500,
      fontFamily: '"Nexa", sans-serif',
      transition: 'all 0.3s ease',
      whiteSpace: isMobileScreen ? 'nowrap' : 'normal',
      overflow: isMobileScreen ? 'hidden' : 'visible',
      textOverflow: isMobileScreen ? 'ellipsis' : 'clip',
      maxWidth: isMobileScreen ? '75px' : 'none',
    },
    '& .MuiStepLabel-active': {
      color: isDarkMode ? '#fcfcfc' : '#a00303',
      fontWeight: 600,
    },
    '& .MuiStepLabel-completed': {
      color: isDarkMode ? '#90caf9' : '#035b0e',
    },
    '& .MuiStepLabel-label.Mui-completed': {
      color: isDarkMode ? '#90caf9' : '#035b0e',
    },
    '& .MuiStepIcon-text': {
      fill: isDarkMode ? '#000' : '#fff',
      fontWeight: 600,
      fontSize: '0.75rem',
    },
    '& .MuiSvgIcon-root': {
      width: isMobileScreen ? '1.5rem' : '2rem',
      height: isMobileScreen ? '1.5rem' : '2rem',
      transition: 'all 0.3s ease',
    },
    '& .MuiSvgIcon-root.MuiStepIcon-root.Mui-active': {
      color: isDarkMode ? '#ff6b6b' : '#a00303',
      filter: isDarkMode ? 'brightness(1.2)' : 'none',
      transform: 'scale(1.1)',
    },
    '& .MuiSvgIcon-root.MuiStepIcon-root.Mui-completed': {
      color: isDarkMode ? '#51cf66' : '#035b0e',
    },
  }));

  const CustomStepper = styled(Stepper)(({ theme }) => ({
    padding: isMobileScreen ? '12px 0' : isSmallScreen ? '16px 8px' : '20px 16px',
    background: isDarkMode ? 'rgba(18, 18, 18, 0.7)' : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: isDarkMode 
      ? '0 4px 20px rgba(0, 0, 0, 0.25)' 
      : '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    margin: isMobileScreen ? '30px 0 15px' : '40px 0 20px',
    overflow: 'hidden',
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(0, 0, 0, 0.05)',
  }));

  // Manejo de estados de error
  if (!acceptedCookies) {
    return (
      <div className="checkout-alert-container">
        <Alert 
          severity="warning" 
          className={`checkout-alert ${isDarkMode ? 'dark' : ''}`}
          icon={<LocalFlorist />}
        >
          <span className="alert-title">Cookies necesarias</span>
          <p className="alert-message">
            Para brindarte la mejor experiencia de compra, necesitamos que aceptes las cookies.
          </p>
        </Alert>
      </div>
    );
  }

  if (cartEmpty) {
    return (
      <div className="checkout-alert-container">
        <Alert 
          severity="info" 
          className={`checkout-alert ${isDarkMode ? 'dark' : ''}`}
          icon={<LocalFlorist />}
        >
          <span className="alert-title">Tu carrito está vacío</span>
          <p className="alert-message">
            Agrega algún producto especial para continuar con tu compra.
          </p>
        </Alert>
      </div>
    );
  }

  // Renderizar el stepper con los pasos correspondientes
  return (
    <div className={`checkout-stepper-container ${isDarkMode ? 'dark' : ''}`}>
      <CustomStepper 
        activeStep={activeStep} 
        alternativeLabel
        className={`custom-stepper ${isMobileScreen ? 'mobile' : ''}`}
      >
        {customLabels.map((label, index) => (
          <Step key={index} className={`
            step-item 
            ${activeStep === index ? 'active-step' : ''} 
            ${activeStep > index ? 'completed-step' : ''}
          `}>
            <CustomStepLabel 
              StepIconComponent={activeStep > index ? CheckIcon : null}
              className="step-label"
            >
              <div className="step-content">
                <span className={activeStep > index ? 'completed-step-title': activeStep === index ? 'active-step-title' : "step-title"}>{label}</span>
                {!isMobileScreen && (
                  <span className={`
                    step-description 
                    ${activeStep === index ? 'active-description' : ''}
                  `}>
                    {stepsDescription[index]}
                  </span>
                )}
              </div>
            </CustomStepLabel>
          </Step>
        ))}
      </CustomStepper>
      
      {isMobileScreen && activeStep >= 0 && (
        <div className="mobile-step-detail">
          <span className="mobile-step-number">
            Paso {activeStep + 1} de {steps.length}
          </span>
          <p className="mobile-step-description">
            {stepsDescription[activeStep]}
          </p>
        </div>
      )}
    </div>
  );
};

// Componente de icono de check personalizado
const CheckIcon = (props) => {
  return (
    <div className="check-icon-container">
      <Check className="check-icon" fontSize='small'/>
    </div>
  );
};

export default CheckoutStepper;