import { baseDeDatosServer } from "@/utils/firebaseServer";
import { collection, getDocs } from "firebase/firestore";
import localforage from "localforage";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.PRODS_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        const productsCollection = collection(baseDeDatosServer, 'productos');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        
        return NextResponse.json({productList});

        } catch (error) {
            console.error('Error al obtener los productos de Firebase:', error);
            return NextResponse.json({ error: 'Error al obtener los productos de Firebase' });
    };
}