import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { storage } from '../../../admin/FireBaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// Interfaces
interface Product {
    name: string;
    size: string;
    precio: string | number;
    quantity: number;
}

interface DatosComprador {
    nombreComprador: string;
    email: string;
}

interface DatosEnvio {
    fecha?: string;
    horario?: string;
    nombreDestinatario?: string;
    apellidoDestinatario?: string;
    calle?: string;
    altura?: string;
    piso?: string;
    localidad?: {
        name: string;
    };
    dedicatoria?: string;
}

interface RequestBody {
    products: Product[];
    datosComprador: DatosComprador;
    datosEnvio: DatosEnvio;
    retiraEnLocal: boolean;
}

export async function POST(request: Request): Promise<NextResponse> {
    const body: RequestBody = await request.json();
    const { products, datosComprador, datosEnvio, retiraEnLocal } = body;

    try {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();

        // Agregar una página al PDF con tamaño A4 (595 x 842 puntos)
        const page = pdfDoc.addPage([595, 842]);

        // Establecer una fuente estándar
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Definir las posiciones para agregar texto
        const fontSize = 12;
        const lineHeight = 15;

        // Escribir el encabezado del documento
        page.drawText('Detalle de Compra', { x: 50, y: 800, font, size: 18 });

        // Datos de envío
        page.drawText('Datos del Envío:', { x: 50, y: 720, font, size: fontSize, color: rgb(0, 0, 0) });
        if (retiraEnLocal) {
            page.drawText('Retira en local', { x: 50, y: 700, font, size: fontSize });
        } else {
            page.drawText(`Fecha de Entrega: ${datosEnvio.fecha || 'No especificado'}`, { x: 50, y: 685, font, size: fontSize });
            page.drawText(`Horario: ${datosEnvio.horario || 'No especificado'}`, { x: 50, y: 670, font, size: fontSize });
            page.drawText(`Destinatario: ${datosEnvio.nombreDestinatario} ${datosEnvio.apellidoDestinatario}`, { x: 50, y: 655, font, size: fontSize });
            page.drawText(`Dirección: ${datosEnvio.calle} ${datosEnvio.altura} ${datosEnvio.piso || ''}`, { x: 50, y: 640, font, size: fontSize });
            page.drawText(`Localidad: ${datosEnvio.localidad?.name || 'No especificada'}`, { x: 50, y: 625, font, size: fontSize });
        }

        // Productos comprados
        page.drawText('Productos Comprados:', { x: 50, y: 595, font, size: fontSize, color: rgb(0, 0, 0) });
        let yOffset = 580;
        products.forEach((product) => {
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

        // Dedicatoria
        page.drawText(datosEnvio.dedicatoria || '', { x: 350, y: 250, font, size: 18, color: rgb(0, 0, 0) });

        // Generar el PDF en formato bytes
        const pdfBytes = await pdfDoc.save();

        // Subir el PDF generado a Firebase Storage
        const fileName = `pdfs-floreriasargentinas/paypal_compra_${datosComprador.nombreComprador}_${new Date().toISOString()}.pdf`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, pdfBytes, { contentType: 'application/pdf' });

        // Obtener la URL de descarga del PDF
        const pdfURL = await getDownloadURL(storageRef);

        return NextResponse.json({ pdfURL, status: 'success' });
    } catch (error) {
        console.error('Error generando PDF:', error);
        return NextResponse.json({ 
            error: 'Error generando PDF',
            status: 'partial_success',
            message: 'La compra se procesó pero hubo un error generando el PDF'
        }, { status: 200 });
    }
}