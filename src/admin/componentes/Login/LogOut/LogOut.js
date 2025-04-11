// useLogout.js
import { useRouter } from "next/navigation.js";
import { auth } from "../../../FireBaseConfig.js";


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
