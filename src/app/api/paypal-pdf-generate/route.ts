import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storageServer } from '@/utils/firebaseServer';
import { readFile } from 'fs/promises';
import path from 'path';
import fontkit from '@pdf-lib/fontkit';

// Definir interfaces para los tipos de datos
interface Product {
    name: string;
    size: string;
    quantity: number;
    precio: string | number;
}

interface DatosComprador {
    nombreComprador: string;
    apellidoComprador: string;
    email: string;
    tel_comprador: string;
}

interface DatosEnvio {
    fecha?: string;
    horario?: string;
    dedicatoria?: string;
    nombreDestinatario?: string;
    apellidoDestinatario?: string;
    calle?: string;
    altura?: string;
    piso?: string;
    localidad?: { name: string };
    products?: Product[];
    servicioPremium?: boolean;
    envioPremium?: number;
    totalPrice?: number;
}

interface EnvioDatos {
    PayPal: boolean;
    datosComprador: DatosComprador;
    datosEnvio: DatosEnvio;
    products: Product[];
    retiraEnLocal: boolean;
}

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    // Extraer datos desde la estructura correcta
    const envioDatos: EnvioDatos = body.envioDatos;
    const { products, datosComprador, datosEnvio, retiraEnLocal } = envioDatos;

    try {
        // Cargar la fuente Noto Sans desde el sistema de archivos 
        const fontPath = path.join(process.cwd(), 'public', 'assets', 'fonts', 'noto-sans.ttf');
        const emojiFontPath = path.join(process.cwd(), 'public', 'assets', 'fonts', 'NotoEmoji-Regular.ttf');
        const fontBuffer = await readFile(fontPath);
        const emojiFontBuffer = await readFile(emojiFontPath);
        const fontBytes = new Uint8Array(fontBuffer);
        const emojiFontBytes = new Uint8Array(emojiFontBuffer);

        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);
        // Agregar una página al PDF con tamaño A4 (595 x 842 puntos)
        const page = pdfDoc.addPage([595, 842]);

        // Incrustar la fuente Noto Sans y Noto Emoji
        const font = await pdfDoc.embedFont(fontBytes, { subset: false });
        const emojiFont = await pdfDoc.embedFont(emojiFontBytes, { subset: false });

        // Definir las posiciones para agregar texto
        const fontSize = 12;
        const fontSizeText = 10;
        const fontSizeTitle = 18;
        const lineHeight = 15;


                console.log("DEBUG INFORMACION:", datosEnvio?.dedicatoria);


                
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
        products?.forEach((product: Product) => {
            page.drawText(`${product.name} (${product.size}) - Cantidad: ${product.quantity} - cod: ${product.precio}`, {
                x: 50,
                y: yOffset,
                font,
                size: fontSizeText,
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

            // Normalizar la dedicatoria: reemplazar saltos de línea con espacios
            let dedicatoria = datosEnvio.dedicatoria
                .replace(/\r\n|\r|\n/g, ' ')
                .trim();

            // Utilidad para detectar emojis y símbolos fuera del BMP
            function splitTextAndEmojis(str: string) {
                // Regex para emojis y símbolos fuera del BMP
                const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF\u2764\uFE0F])/g;
                let result: { text: string, isEmoji: boolean }[] = [];
                let lastIndex = 0;
                let match;
                while ((match = emojiRegex.exec(str)) !== null) {
                    if (match.index > lastIndex) {
                        result.push({ text: str.slice(lastIndex, match.index), isEmoji: false });
                    }
                    result.push({ text: match[0], isEmoji: true });
                    lastIndex = match.index + match[0].length;
                }
                if (lastIndex < str.length) {
                    result.push({ text: str.slice(lastIndex), isEmoji: false });
                }
                return result;
            }

            // Dividir la dedicatoria en palabras
            const palabras = dedicatoria.split(' ').filter(p => p.length > 0);
            let lineaActual: { text: string, isEmoji: boolean }[] = [];
            let posY = startY;

            for (let i = 0; i < palabras.length; i++) {
                const palabra = palabras[i];
                const fragmentos = splitTextAndEmojis(palabra);
                const posibleLinea = lineaActual.concat({ text: ' ', isEmoji: false }, ...fragmentos).filter((f, idx) => !(i === 0 && idx === 0 && f.text === ' '));
                // Calcular ancho de la línea
                let width = 0;
                for (const frag of posibleLinea) {
                    if (frag.isEmoji) {
                        width += emojiFont.widthOfTextAtSize(frag.text, dedicatoriaFontSize);
                    } else {
                        width += font.widthOfTextAtSize(frag.text, dedicatoriaFontSize);
                    }
                }
                if (width <= maxWidth) {
                    lineaActual = posibleLinea;
                } else {
                    // Dibujar la línea actual
                    let x = startX;
                    for (const frag of lineaActual) {
                        if (!frag.text) continue;
                        const usedFont = frag.isEmoji ? emojiFont : font;
                        page.drawText(frag.text, {
                            x,
                            y: posY,
                            font: usedFont,
                            size: dedicatoriaFontSize,
                            color: rgb(0, 0, 0)
                        });
                        x += usedFont.widthOfTextAtSize(frag.text, dedicatoriaFontSize);
                    }
                    posY -= dedicatoriaLineHeight;
                    lineaActual = fragmentos;
                    // Verificar si hemos llegado al límite inferior de la página
                    if (posY < 100) break;
                }
            }
            // Dibujar la última línea
            if (lineaActual.length > 0) {
                let x = startX;
                for (const frag of lineaActual) {
                    if (!frag.text) continue;
                    const usedFont = frag.isEmoji ? emojiFont : font;
                    page.drawText(frag.text, {
                        x,
                        y: posY,
                        font: usedFont,
                        size: dedicatoriaFontSize,
                        color: rgb(0, 0, 0)
                    });
                    x += usedFont.widthOfTextAtSize(frag.text, dedicatoriaFontSize);
                }
            }
        }

        // Generar el PDF en formato bytes
        const pdfBytes = await pdfDoc.save();

        // Subir el PDF generado a Firebase Storage
        const fileName = `pdfs-envio-flores/paypal_compra_${datosComprador?.nombreComprador}_${new Date().toISOString()}.pdf`;
        const storageRef = ref(storageServer, fileName);
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