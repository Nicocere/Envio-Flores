// useLogout.js
"use client"
import { auth } from "@/admin/FireBaseConfig";
import { useRouter } from 'next/navigation';


function useLogout() {
    const navigate = useRouter();

    function logout() {
        auth.signOut()
            .then(() => {
                navigate.push('/'); 
            })
            .catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
    }

    return logout;
}

export default useLogout;
