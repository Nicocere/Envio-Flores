import nodemailer from 'nodemailer';
import config from '@/utils/config'
import { NextResponse } from 'next/server';




export async function POST(request: Request) {

  const body = await request.json()

  const ticket = body.ticket
  const paymentId = body.paymentId

  const bodyData = body.body

  const { retiraEnLocal, datosComprador, CartID, products, item, MercadoPago, datosEnvio, createdAt } = bodyData

  const emailUser = datosComprador[0].email;
  const envio = datosEnvio[0];
  let pdf = {}

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmail_user,
      pass: config.gmail_password,
    },
  });

  //   Productos Comprados PDF
  const ticketProductsHTML = products.map((product: { img: any; name: any; precio: any; size: any; quantity: any; }, index: any) =>
    `
      <div style="display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: wrap;
      flex: 1;
      border: 1px solid silver;
      box-shadow: 1px 1px 0 1px silver;
      border-radius: 5px;">
      <img src="${product.img}" alt="${product.name}" width="100px" height="100px" style="margin-bottom: 10px;">

      <p style="font-family: 'Roboto', sans-serif;font-size: 1rem;margin-bottom: 5px;text-wrap: balance;">
          Producto: <strong>${product.name}</strong>
        </p>

        <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Precio: $ ${product.precio}</p>
        <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Tamaño : ${product.size}</p>
        <p style="font-family: 'Roboto', sans-serif;font-size: 1rem; margin-bottom: 5px;">Cantidad que compró: ${product.quantity}</p>

      </div>
    `,
  ).join('');

  // Confirmacion de compra para el Comprador
  const userMailOptions = {
    from: 'ENVIO FLORES',
    to: emailUser,
    subject: 'Has realizado una compra con Éxito!',
    html: `
        <h1>¡ Hola <strong style=" color: #670000; font-weight:600">
         ${datosComprador[0].nombreComprador} ${datosComprador[0].apellidoComprador} </strong>!</h1>
    
        <div style="margin: 5px;border: 1px solid #e6e6e6;box-shadow: 2px 2px 6px #9c9898;background: #fcf5f0fffba;color: black;">
            <h1 style="text-decoration-line: underline; text-align: center;" >Este es el Ticket de tu compra:</h1>
            <h4 style="color:black;">Este es ID de la compra que realizaste por MercadoPago: ${paymentId}</h4>
        <div style="padding: 10px;">
            <h3 style="font-family: 'Roboto', sans-serif; font-size: 1.2rem; margin-bottom: 5px;"> N° de Orden: ${ticket.order_number}</h3>
            <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Fecha de Compra: ${ticket.createdAt}</p>
            <p style="font-family: 'Roboto', sans-serif; font-size: 1.2rem; margin-bottom: 5px;"> Realizaste la compra meditante: <strong>MercadoPago</strong>.</p>

            <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
            <h2>Estos son los Productos que compraste:</h2>
            <div style="display: flex;justify-content: space-around;flex-direction: column;align-items: flex-start;">
              ${ticketProductsHTML}
            </div>
            
            <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
            
            <p style="font-family:'Roboto',sans-serif;font-size:1rem;background: linear-gradient(180deg,#00000038,transparent);
            margin-bottom:5px;padding: 10px;"> Precio total que de la compra + envio: 
            <strong style=" color: red; font-size:1.3rem"> $ ${ticket.amount} </strong></p>
            </div>
            </div>
            <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
            
            <div style="margin: 5px;border: 1px solid #e6e6e6;box-shadow: 2px 2px 6px #9c9898;background: #fcf5f0fffba;color: black;">

            ${retiraEnLocal ? `
            <h2 style="text-align: center;">Retiro en el Local</h2>
            <p style="text-align: center;">Usted seleccionó que desea retirar el producto por nuestro local. 
            Puede hacerlo de 7hs - 18hs por nuestro local en Av. Cramer 1915 ( Belgrano, CABA)</p>
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar" title="Ubicación"
            ></iframe>
        ` : `
                
           <h2 style="text-decoration-line: underline; text-align: center;" >DATOS DEL DESTINATARIO</h2>

           <p style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Nombre Destinatario:
           <strong> ${envio.nombreDestinatario} </strong> </p>
           <p  style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Apellido Destinatario:
           <strong> ${envio.apellidoDestinatario}</strong></p>
           <p  style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Telefono del Destinatario:
          <strong>${envio.phoneDestinatario}   </strong> </p>
    
           <hr style="width:40px; margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
           
           <h2 style="text-decoration-line: underline; text-align: center;">DATOS DEL ENVIO</h2>
           
           <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Calle destinatario:
           <strong>${envio.calle} </strong> </p>
           <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Altura:
           <strong>  ${envio.altura} </strong></p>
           <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Piso:
           <strong > ${envio.piso} </strong></p>
            <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Localidad:
            <strong>  ${envio.localidad.label} </strong></p>
            `

      }
   
        <div style="background: linear-gradient(180deg,#00000038,transparent);">
          <h1 style="background:#80808033;"> DEDICATORIA: </h1>
            <div style="background:#ffc0cb70; padding: 20px;  ">
              <h3 style="font-family: 'Roboto', sans-serif; margin-bottom: 5px;">${envio.dedicatoria}</h3>
            </div>
        </div>
            <hr style="width: 100px; margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
            <div style="background:none">
            <h1 style="background:#80808033;"> Gracias por confiar en nosotros! </h1>
              <div style="background:transparent; padding: 5px;  ">
                <img src='https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-envio-flores.png?alt=media&token=182d6496-4444-4a41-ab34-d8f0e571dc23' width='180px' height='150px'  alt='Logo envio flores'>
              </div>
          </div>
  </div> `,
  };


  // Confirmacion de compra para el Vendedor
  const sellerMailOptions = {
    from: 'ENVIO FLORES',
    to: `${config.gmail_user}`,
    subject: `Has realizado una venta! N°${ticket.order_number} en ENVIO FLORES`,
    html: `
        <h3>¡ El comprador se llama: <strong style=" color: red; font-weight:600">
         ${datosComprador[0].nombreComprador} ${datosComprador[0].apellidoComprador} </strong>!</h3>
    
        <div style="margin: 5px;border: 1px solid #e6e6e6;box-shadow: 2px 2px 6px #9c9898;background: #fcf5f0fffba;color: black;">
        <h1 style="text-decoration-line: underline; text-align: center;" >Este es el Ticket de la compra del usuario:</h1>
        <h4>ID de la compra: ${paymentId}</h4>
          <div style="padding: 10px;">
            <h3 style="font-family: 'Roboto', sans-serif; font-size: 1.2rem; margin-bottom: 5px;"> El N° de Orden es: ${ticket.order_number}</h3>
            <p style="font-family: 'Roboto', sans-serif; font-size: 1.1rem; margin-bottom: 5px;">Fecha que realizó la Compra :${ticket.createdAt}</p>
            <p style="font-family: 'Roboto', sans-serif; font-size: 1.2rem; margin-bottom: 5px;"> Realizó la compra meditante: <strong>MercadoPago</strong>.</p>
            <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">

            <h2>PRODUCTOS:</h2>
            <div style="display: flex; flex-direction: row;
            justify-content: space-around;
            align-items: center;">
              ${ticketProductsHTML}
            </div>
            <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
            <p style="font-family:'Roboto',sans-serif;font-size:1rem;background: linear-gradient(180deg,#00000038,transparent);
            margin-bottom:5px;padding: 10px;">Precio total que de la compra + envio: 
            <strong style=" color: red; font-size:1.3rem"> $${ticket.amount} </strong></p>
            </div>
            </div>
            <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
            
            <div style="margin: 5px;border: 1px solid #e6e6e6;box-shadow: 2px 2px 6px #9c9898;background: #fcf5f0fffba;color: black;">
            
            ${retiraEnLocal ? `
            <h2 style="text-align: center;">El comprador: ${datosComprador[0].nombreComprador} ${datosComprador[0].apellidoComprador} decidió retirarlo en el Local</h2>
           
          
        ` : `
                
           <h2 style="text-decoration-line: underline; text-align: center;" >DATOS DEL DESTINATARIO</h2>

           <p style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Nombre Destinatario:
           <strong> ${envio.nombreDestinatario} </strong> </p>
           <p  style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Apellido Destinatario:
           <strong> ${envio.apellidoDestinatario}</strong></p>
           <p  style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Telefono del Destinatario:
            <strong>${envio.phoneDestinatario}   </strong> </p>
    
           <hr style="width:80px; margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">
           
           <h2 style="text-decoration-line: underline; text-align: center;">DATOS DEL ENVIO</h2>
           
           <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Calle destinatario:
           <strong>${envio.calle} </strong> </p>
           <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Altura:
           <strong>  ${envio.altura} </strong></p>
           <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Piso:
           <strong > ${envio.piso} </strong></p>
            <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Localidad:
            <strong>  ${envio.localidad.label} </strong></p>
            <p style="font-family: 'Roboto', sans-serif; font-size: 1rem; margin-bottom: 5px;">Envio PREMIUM:
            <strong>  ${envio.servicioPremium ? 'SI' : 'NO'} , ${envio.servicioPremium ? `$${envio.precio_envio}` : ''} </strong></p>
            `
      }
        <div style="background: linear-gradient(180deg,#00000038,transparent);">
          <h1 style="background:#80808033;"> DEDICATORIA: </h1>
            <div style="background:#ffc0cb70; padding: 20px;  ">
              <h3 style="font-family: 'Roboto', sans-serif; margin-bottom: 5px;">${envio.dedicatoria ? envio.dedicatoria : 'El comprador No escribio ninguna dedicatoria.'}</h3>
            </div>
        </div>
            <hr style="width: 100px; margin-top: 10px; margin-bottom: 10px; border-top: 2.2px solid #8d2f57;">

                <h2 style="text-decoration-line: underline; text-align: center;" >DATOS DEL COMPRADOR</h2>
                
                <p style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Nombre comprador:
                <strong> ${datosComprador[0].nombreComprador} </strong> </p>
                <p  style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Apellido comprador:
                <strong> ${datosComprador[0].apellidoComprador}</strong></p>
                <p  style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Email del comprador:
                <strong>${datosComprador[0].email}   </strong> </p>
                <p  style="font-family: 'Roboto', sans-serif; font-size: .8rem; margin-bottom: 5px;">Telefono del comprador:
                <strong>${datosComprador[0].tel_comprador}   </strong> </p>
                
          <div>
              <p> 
                Haga click <a href="${pdf}">AQUÍ</a> para ver el Remito.
              </p>  
              
          </div>
      </div>  `,
  };

  await transporter.sendMail(userMailOptions);
  await transporter.sendMail(sellerMailOptions);


  return NextResponse.json('Emails enviados')


}