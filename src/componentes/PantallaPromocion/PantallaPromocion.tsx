import React, { useState, useEffect } from 'react';
import { iconos } from '@/admin/componentes/PantallasPromocionales/PantallasPromocionales'; // Asegúrate de exportar iconos desde PantallasPromocionales
import style from './pantallasPromocionales.module.css';
import { collection, addDoc } from 'firebase/firestore';
import localforage from 'localforage';
import Swal from 'sweetalert2';
import PantallaPromocionContador from './PantallaContador';
import IconoPromocion from './IconoPromocion';
import { baseDeDatosServer } from '@/utils/firebaseServer';

interface PantallaPromocionProps {
  nombre: string;
  descripcion: string;
  validoDesde: string;
  validoHasta: string;
  background: string;
  icono: keyof typeof iconos;
  efecto: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const PantallaPromocion: React.FC<PantallaPromocionProps> = ({
  nombre,
  descripcion,
  validoHasta,
  background,
  icono,
  efecto,
}) => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [emailRegistrado, setEmailRegistrado] = useState('');
  const [showPromotion, setShowPromotion] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      const emailForage = await localforage.getItem('emailPromocion');
      setEmailRegistrado(emailForage as string);

      if (emailForage) {
        setShowPromotion(false);
      } else { 
        setShowPromotion(true);
      }
    }
    fetchEmail();
  }, []);

  const renderIcon = (iconName: keyof typeof iconos) => {
    return iconos[iconName] || null;
  };

  const renderEfecto = () => {
    const particles = Array.from({ length: 50 }).map((_, index) => (
      <div key={index} className={style.particle} style={{
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 10 + 5}s`,
        animationDelay: `${Math.random() * 5}s`
      }} />
    ));

    switch (efecto) {
      case 'snow':
        return <div className={style.snow}>{particles}</div>;
      case 'hearts':
        return <div className={style.hearts}>{particles}</div>;
      case 'spiders':
        return <div className={style.spiders}>{particles}</div>;
      default:
        return null;
    }
  };

  const handleEmailSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: 'Por favor, ingrese un correo electrónico válido',
      });
      return;
    }
  
    if (email) {
      try {
        await addDoc(collection(baseDeDatosServer, 'email-promociones'), { email });
        await localforage.setItem('emailPromocion', email);
        setTimeout(() => {
          localforage.removeItem('emailPromocion');
        }, 1800000); // 30 minutos en milisegundos
        Swal.fire({
          icon: 'success',
          text: 'Tu email ha sido guardado correctamente',
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 2000,
          iconColor: '#670000',
          customClass: {
            htmlContainer: style.swalContainer,
            popup: style.swalPopup,
            title: style.swalTitle,
            container: style.swalContainer,
          },
        });
        setShowEmailInput(false);
        setEmail('');
        setShowConfirmation(true);
        setEmailRegistrado(email);
      } catch (error) {
        console.error('Error guardando el email: ', error);
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: 'Ocurrió un error guardando tu email, por favor intenta de nuevo',
        });
      }
    }
  };

  const handleCancelPromotion = () => {
    setShowPromotion(false);
  }



  return (
    <div className={style.container}>
      {emailRegistrado ? (
      <IconoPromocion />
      ) : (
        showPromotion && (
          <div className={style.preview} style={{ background }}>
            {!showConfirmation ? (
              <>
                <h2>{nombre}</h2>
                <div className={style.iconos}>
                  <p>{renderIcon(icono)} {descripcion} {renderIcon(icono)}</p>
                </div>
                <small>Promoción válida hasta el {validoHasta}</small>
                <PantallaPromocionContador validoHasta={validoHasta} />
                <div className={style.buttons}>
                  {showEmailInput ? (
                    <div className={style.emailForm}>
                      <input
                        type="email"
                        placeholder="Ingrese su email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={style.emailInput}
                      />
                      <button type="button" onClick={handleEmailSubmit}>Enviar</button>
                    </div>
                  ) : (
                    <>
                      <button type="button" onClick={() => setShowEmailInput(true)}>Quiero el descuento</button>
                    </>
                  )}
                  <button type="button" onClick={handleCancelPromotion} className={style.btnDismiss}>No lo quiero aún</button>
                </div>
                <small style={{ fontSize: 'x-small', position: 'absolute', bottom: '0' }}>
                  Al suscribirte, aceptas recibir mensajes de marketing automatizados a este correo electronico. Cancela la promoción para darte de baja.
                </small>
              </>
            ) : (
              <div className={style.confirmation}>
                <h2>¡Listo!</h2>
                <p>Gracias por suscribirte.</p>
                <small>Usa el mismo correo para aplicar tu promoción.</small>
                <button className={style.btnDismiss} type="button" onClick={() => setShowPromotion(false)}>
                  Cerrar
                </button>
              </div>
            )}
            {renderEfecto()}
          </div>
        )
       )}
    </div>
  );
};

export default PantallaPromocion;