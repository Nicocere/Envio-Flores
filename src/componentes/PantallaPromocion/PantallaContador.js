import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import style from './pantallasPromocionales.module.css';

const PantallaPromocionContador = ({ validoHasta }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const difference = +new Date(validoHasta) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  const renderTimeValue = (value) => {
    return (
      <motion.span
        className={style.timeValue}
        key={value}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
    );
  };

  return (
    <div className={style.countdown}>
      <div className={style.timeBox}>
        {renderTimeValue(timeLeft.days)}
        <span className={style.timeLabel}>días</span>
      </div>
      <div className={style.timeBox}>
        {renderTimeValue(timeLeft.hours)}
        <span className={style.timeLabel}>horas</span>
      </div>
      <div className={style.timeBox}>
        {renderTimeValue(timeLeft.minutes)}
        <span className={style.timeLabel}>minutos</span>
      </div>
      <div className={style.timeBox}>
        {renderTimeValue(timeLeft.seconds)}
        <span className={style.timeLabel}>segundos</span>
      </div>
    </div>
  );
};

export default PantallaPromocionContador;