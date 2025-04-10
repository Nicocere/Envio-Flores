import React from 'react';
import { Link, useLocation } from 'react-router-dom';




function SuccessPage() {

    // useLocation te permite acceder a la ubicación actual del objeto.
    const location = useLocation();

    // La cadena de búsqueda es el parte de la URL que viene después del '?'.
    // Puedes convertirla en un objeto para acceder a los valores más fácilmente.
    const searchParams = new URLSearchParams(location.search);
  
    // Ahora puedes acceder a los valores de la cadena de búsqueda.
    // Supongamos que tienes un valor de búsqueda llamado 'payment_id' y 'status'.
    // Puedes acceder a ellos así:
    const paymentId = searchParams.get('id');
    const status = searchParams.get('status');

  return (
    <div className='compraFinalizada'>
      <h1>Compra Exitosa</h1>
      <p>El ID del pago es: <strong className='idCompra'> {paymentId}</strong> </p>
      <p>El estado del pago es: {status}</p>
      <p>Tu compra ha sido procesada correctamente. ¡Gracias por tu pedido!</p>

      <h5>Puedes ir al <Link to="/" className='cart-home'>Inicio</Link>{' '} para buscar y agregar algún producto </h5>
    </div>
  );
}

export default SuccessPage;
