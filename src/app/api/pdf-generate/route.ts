import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storageServer } from '@/utils/firebaseServer';

// 🔹 Función para generar PDF usando pdf-lib
export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const { products, datosComprador, datosEnvio, retiraEnLocal } = body;


    try {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();

        // Agregar una página al PDF con tamaño A4 (595 x 842 puntos)
        const page = pdfDoc.addPage([595, 842]);

        // Establecer una fuente estándar
        // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);


        // Definir las posiciones para agregar texto
        const fontSize = 12;
        const lineHeight = 15;

        // Escribir el encabezado del documento
        page.drawText('Detalle de Compra', { x: 50, y: 800, font, size: 18 });

        // Datos de envío
        page.drawText('Datos del Envío:', { x: 50, y: 720, font, size: fontSize, color: rgb(0, 0, 0) });
        if (retiraEnLocal) {
            page.drawText('Retira en local', { x: 50, y: 700, font, size: fontSize });
            page.drawText(`Fecha de Retiro: -- ${datosEnvio?.fecha || 'No especificado'}`, { x: 50, y: 685, font, size: fontSize });
            page.drawText(`Horario de Retiro: -- ${datosEnvio?.horario || 'No especificado'}`, { x: 50, y: 670, font, size: fontSize });
            page.drawText(`Comprador: -- ${datosComprador?.nombreComprador} ${datosComprador?.apellidoComprador}`, { x: 50, y: 655, font, size: fontSize });

        } else {
            page.drawText(`Fecha de Entrega: -- ${datosEnvio?.fecha || 'No especificado'}`, { x: 50, y: 700, font, size: fontSize });

            page.drawText(`SERVICIO PREMIUM: -- ${datosEnvio?.servicioPremium ? ' SI' : ' NO'}`, { x: 50, y: 685, font, size: fontSize });

            page.drawText(`Horario de Entrega: -- ${datosEnvio?.horario || 'No especificado'}`, { x: 50, y: 670, font, size: fontSize });
            page.drawText(`Dirección: -- ${datosEnvio?.calle} ${datosEnvio?.altura} ${datosEnvio?.piso || ''}`, { x: 50, y: 655, font, size: fontSize });
            page.drawText(`Localidad: -- ${datosEnvio?.localidad?.name || 'No especificada'}`, { x: 50, y: 640, font, size: fontSize });

            page.drawText(`Destinatario: -- ${datosEnvio?.nombreDestinatario} ${datosEnvio?.apellidoDestinatario}`, { x: 50, y: 625, font, size: fontSize });
        }

        // Productos comprados
        page.drawText('Productos Comprados:', { x: 50, y: 595, font, size: fontSize, color: rgb(0, 0, 0) });
        let yOffset = 580;
        products?.forEach((product: { name: any; size: any; quantity: any; precio: any; }) => {
            page.drawText(`${product.name} (${product.size}) - Cantidad: ${product.quantity} - cod: ${product.precio}`, {
                x: 50,
                y: yOffset,
                font,
                size: fontSize,
            });
            yOffset -= lineHeight;
        });

        // Firma y aclaración
        page.drawText('Firma:', { x: 50, y: yOffset - 20, font, size: fontSize });
        page.drawLine({ start: { x: 50, y: yOffset - 30 }, end: { x: 200, y: yOffset - 30 }, color: rgb(0, 0, 0) });

        page.drawText('Aclaración:', { x: 50, y: yOffset - 50, font, size: fontSize });
        page.drawLine({ start: { x: 50, y: yOffset - 60 }, end: { x: 200, y: yOffset - 60 }, color: rgb(0, 0, 0) });

        // Dedicatoria con ajuste de texto
        if (datosEnvio?.dedicatoria && datosEnvio.dedicatoria.trim() !== '') {
            const dedicatoriaFontSize = 12;
            const dedicatoriaLineHeight = 18;
            const pageWidth = 595;
            const startX = 50 + (pageWidth / 2); // Comenzar en la mitad derecha
            const maxWidth = (pageWidth / 2) - 70; // Ancho disponible para texto en la mitad derecha
            let startY = 300; // Posición vertical inicial

            // Normalizar la dedicatoria: reemplazar saltos de línea con espacios y eliminar caracteres no compatibles
            let dedicatoria = datosEnvio.dedicatoria
                .replace(/\r\n|\r|\n/g, ' ') // Reemplazar todos los saltos de línea con espacios
                // .replace(/[^\x20-\x7E]/g, '') // Eliminar caracteres no ASCII imprimibles
                .trim();

            // Dividir la dedicatoria en palabras
            const palabras = dedicatoria.split(' ').filter((p: string | any[]) => p.length > 0); // Eliminar espacios vacíos
            let lineaActual = '';
            let posY = startY;

            // Construir línea por línea respetando el ancho máximo
            for (let i = 0; i < palabras.length; i++) {
                const palabra = palabras[i];
                const posibleLinea = lineaActual ? `${lineaActual} ${palabra}` : palabra;

                // Verificar si la línea posible se ajusta al ancho máximo
                try {
                    const textWidth = font.widthOfTextAtSize(posibleLinea, dedicatoriaFontSize);

                    if (textWidth <= maxWidth) {
                        lineaActual = posibleLinea;
                    } else {
                        // Dibujar la línea actual y comenzar una nueva
                        page.drawText(lineaActual, {
                            x: startX,
                            y: posY,
                            font,
                            size: dedicatoriaFontSize,
                            color: rgb(0, 0, 0)
                        });
                        posY -= dedicatoriaLineHeight;
                        lineaActual = palabra;

                        // Verificar si hemos llegado al límite inferior de la página
                        if (posY < 100) {
                            break; // Detener el proceso si nos acercamos demasiado al borde inferior
                        }
                    }
                } catch (error) {
                    // Si ocurre un error con alguna palabra, la omitimos y continuamos
                    console.warn('Error al procesar palabra en dedicatoria:', error);
                    continue;
                }
            }

            // Dibujar la última línea
            if (lineaActual) {
                try {
                    page.drawText(lineaActual, {
                        x: startX,
                        y: posY,
                        font,
                        size: dedicatoriaFontSize,
                        color: rgb(0, 0, 0)
                    });
                } catch (error) {
                    console.warn('Error al dibujar última línea de dedicatoria:', error);
                }
            }
        }

        // Generar el PDF en formato bytes
        const pdfBytes = await pdfDoc.save();

        // Subir el PDF generado a Firebase Storage
        const fileName = `pdfs-envio-flores/mp_compra_${datosComprador?.nombreComprador}_${datosComprador?.email}_${new Date().toISOString()}.pdf`;
        const storageRef = ref(storageServer, fileName);
        await uploadBytes(storageRef, pdfBytes, { contentType: 'application/pdf' });

        // Obtener la URL de descarga del PDF
        const pdfURL = await getDownloadURL(storageRef);

        return NextResponse.json({ pdfURL, status: 'success' });
    } catch (error) {
        console.error('Error generando PDF:', error);
        return NextResponse.json({ error: 'Error generando PDF', status: 'error' }, { status: 500 });
    }
}
