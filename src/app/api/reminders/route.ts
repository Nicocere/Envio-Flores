import { NextResponse, type NextRequest } from "next/server";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { deleteDoc, doc as docRef } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import nodemailer from 'nodemailer';
import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Configurar nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

// Función para generar el HTML del email
function generateEmailHTML(recordatorio: any) {
    const productosHTML = !recordatorio?.productos?.length 
        ? `<div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <p style="color: #2f1a0f; font-size: 16px;">¡Ops... no tenemos ningún producto guardado por ti, pero no te preocupes!</p>
            <p style="color: #666;">Puedes visitar nuestra tienda y elegir el regalo perfecto.</p>
            <a href="https://www.floreriasargentinas.com" style="display: inline-block; padding: 10px 20px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Visitar tienda</a>
           </div>`
        : recordatorio?.productos.map((producto: any) => `
            <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                <img src="${producto.opciones[0].img}" alt="${producto.nombre}" style="width: 200px; height: auto; border-radius: 8px;">
                <h3 style="color: #d4af37; margin: 10px 0;">${producto.nombre}</h3>
                <p style="color: #666;">${producto.descr}</p>
                <a href="https://www.floreriasargentinas.com/detail/${producto.id}" style="display: inline-block; padding: 10px 20px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">¡Comprar!</a>
            </div>
        `).join('');

    return `
    <div style="font-family: Arial, sans-serif; color: #2f1a0f; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fcf5f0;">
        <h1 style="color: #d4af37; text-align: center; margin-bottom: 30px;">¡Hola ${recordatorio?.nombreUser}!</h1>

    <h2 style="color: #d4af37; max-width: 35ch; text-align: center; margin-bottom:30px; padding:10px;border:1px solid #d4af37;border-radius:20px;justify-self: center;">¡En dos días es el momento de sorprender con tu regalo especial!</h2>

        <p style="color: #2f1a0f;">Este es un recordatorio de que en dos días es el evento <strong>${recordatorio?.nombre}</strong> que programaste con nosotros.</p>
        
        <p style="color: #2f1a0f;">A continuación, te recordamos los detalles de tu evento:</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px; color: #2f1a0f;">
                <h3 style="color: #2f1a0f;">Detalles del Recordatorio:</h3>
                <p><strong>Evento:</strong> ${recordatorio?.nombre}</p>
                <p><strong>Fecha:</strong> ${format(recordatorio?.fecha.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                <p><strong>Tipo:</strong> ${recordatorio?.tipo}</p>
                ${recordatorio?.notas ? `<p><strong>Notas:</strong> ${recordatorio?.notas}</p>` : ''}
            </div>

            <div style="margin-top: 30px;">
                <h2 style="color: #2f1a0f;">Productos Seleccionados:</h2>
                ${productosHTML}
            </div>

            ${recordatorio?.direccion ? `
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-top: 20px;">
                    <h3 style="color: #2f1a0f;">Dirección de Entrega:</h3>
                    <p>${recordatorio?.direccion.nombre}</p>
                    <p>${recordatorio?.direccion.direccion}</p>
                    ${recordatorio?.direccion.telefono ? `<p>Teléfono: ${recordatorio?.direccion.telefono}</p>` : ''}
                </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #2f1a0f; color: white; border-radius: 10px;">
            <p style="color: #f5f5f5;">¡Gracias por confiar en Florerías Argentinas para tus momentos especiales!</p>
            <p style="color: #d4af37;">¡No olvides realizar tu pedido para que llegue a tiempo!</p>
        
            </div>
                <div style="background-color: #f9f9f9; padding: 10px; text-align: center; margin:30px 10px; border-radius: 2px;">
                                <p style="margin: 0; color: #D4af37;"><em>Equipo Florerías Argentinas</em></p>
                            </div>
        </div>
    `;
}

// Función para generar el HTML del email
function generateLastEmailHTML(recordatorio: any) {
    const productosHTML = !recordatorio?.productos?.length 
        ? `<div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <p style="color: #2f1a0f; font-size: 16px;">¡Ops... no tenemos ningún producto guardado por ti, pero no te preocupes!</p>
            <p style="color: #666;">Puedes visitar nuestra tienda y elegir el regalo perfecto.</p>
            <a href="https://www.floreriasargentinas.com" style="display: inline-block; padding: 10px 20px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Visitar tienda</a>
           </div>`
        : recordatorio?.productos.map((producto: any) => `
            <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                <img src="${producto.opciones[0].img}" alt="${producto.nombre}" style="width: 200px; height: auto; border-radius: 8px;">
                <h3 style="color: #d4af37; margin: 10px 0;">${producto.nombre}</h3>
                <p style="color: #666;">${producto.descr}</p>
                <a href="https://www.floreriasargentinas.com/detail/${producto.id}" style="display: inline-block; padding: 10px 20px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">¡Comprar!</a>
            </div>
        `).join('');

    return `
    <div style="font-family: Arial, sans-serif; color: #2f1a0f; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fcf5f0;">
        <h1 style="color: #d4af37; text-align: center; margin-bottom: 30px;">¡Hola ${recordatorio?.nombreUser}!</h1>

    <h2 style="color: #d4af37; max-width: 35ch; text-align: center; margin-bottom:30px; padding:10px;border:1px solid #d4af37;border-radius:20px;justify-self: center;">¡Mañana es el momento de sorprender con tu regalo especial!</h2>

        <p style="color: #2f1a0f;">Este es un recordatorio de que en 1 día es el evento <strong>${recordatorio?.nombre}</strong> que programaste con nosotros.</p>
        
        <p style="color: #2f1a0f;">A continuación, te recordamos los detalles de tu evento:</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px; color: #2f1a0f;">
                <h3 style="color: #2f1a0f;">Detalles del Recordatorio:</h3>
                <p><strong>Evento:</strong> ${recordatorio?.nombre}</p>
                <p><strong>Fecha:</strong> ${format(recordatorio?.fecha.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                <p><strong>Tipo:</strong> ${recordatorio?.tipo}</p>
                ${recordatorio?.notas ? `<p><strong>Notas:</strong> ${recordatorio?.notas}</p>` : ''}
            </div>

            <div style="margin-top: 30px;">
                <h2 style="color: #2f1a0f;">Productos Seleccionados:</h2>
                ${productosHTML}
            </div>

            ${recordatorio?.direccion ? `
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-top: 20px;">
                    <h3 style="color: #2f1a0f;">Dirección de Entrega:</h3>
                    <p>${recordatorio?.direccion.nombre}</p>
                    <p>${recordatorio?.direccion.direccion}</p>
                    ${recordatorio?.direccion.telefono ? `<p>Teléfono: ${recordatorio?.direccion.telefono}</p>` : ''}
                </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #2f1a0f; color: white; border-radius: 10px;">
            <p style="color: #f5f5f5;">¡Gracias por confiar en Florerías Argentinas para tus momentos especiales!</p>
            <p style="color: #d4af37;">¡No olvides realizar tu pedido para que llegue a tiempo!</p>
        
            </div>
                <div style="background-color: #f9f9f9; padding: 10px; text-align: center; margin:30px 10px; border-radius: 2px;">
                                <p style="margin: 0; color: #D4af37;"><em>Equipo Florerías Argentinas</em></p>
                            </div>
        </div>
    `;
}


export async function GET(request: NextRequest) {

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        const recordatoriosRef = collection(baseDeDatos, 'recordatorios');
        const recordatoriosSnap = await getDocs(query(recordatoriosRef, where('status', '==', 'activo')));
        
        const notificacionesEnviadas = [];
        const errores = [];
        const recordatoriosEliminados = [];

        for (const doc of recordatoriosSnap.docs) {
            const recordatorio = doc.data();
            const fechaRecordatorio = recordatorio?.fecha.toDate();
            const diferenciaDias = differenceInDays(
                fechaRecordatorio,
                new Date()
            );

            if (diferenciaDias <= 0) {
                try {
                    await deleteDoc(docRef(baseDeDatos, 'recordatorios', doc.id));
                    recordatoriosEliminados.push({
                        id: doc.id,
                        nombre: recordatorio?.nombre,
                        fecha: format(fechaRecordatorio, "dd 'de' MMMM 'de' yyyy", { locale: es })
                    });
                } catch (error) {
                    errores.push({
                        id: doc.id,
                        error: `Error al eliminar recordatorio: ${error}`
                    });
                }
                continue; 
            }

            if (diferenciaDias === 2) {
                try {
                    await transporter.sendMail({
                        from: process.env.GMAIL_USER,
                        to: recordatorio?.email,
                        subject: `¡Recordatorio: ${recordatorio?.nombre} en 2 días!`,
                        html: generateEmailHTML(recordatorio),
                    });
                    notificacionesEnviadas.push({
                        id: doc.id,
                        nombre: recordatorio?.nombre,
                        email: recordatorio?.email
                    });
                } catch (error) {
                    errores.push({
                        id: doc.id,
                        error: error
                    });
                }
            } else if (diferenciaDias === 1) {
                try {
                    await transporter.sendMail({
                        from: process.env.GMAIL_USER,
                        to: recordatorio?.email,
                        subject: `¡Recordatorio: Tu evento ${recordatorio?.nombre} es mañana!`,
                        html: generateLastEmailHTML(recordatorio),
                    });
                    notificacionesEnviadas.push({
                        id: doc.id,
                        nombre: recordatorio?.nombre,
                        email: recordatorio?.email
                    });
                } catch (error) {
                    errores.push({
                        id: doc.id,
                        error: error
                    });
                }
            }
        }

        return NextResponse.json({
            mensaje: "Proceso completado",
            fecha: new Date(),
            notificacionesEnviadas,
            recordatoriosEliminados,
            errores,
            totalEnviados: notificacionesEnviadas.length,
            totalEliminados: recordatoriosEliminados.length,
            totalErrores: errores.length
        });

    } catch (error) {
        console.error('Error en el proceso:', error);
        return new Response('Error interno del servidor', { status: 500 });
    }
}