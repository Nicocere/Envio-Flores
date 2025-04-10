// useLogout.js
import { auth } from "../../../FireBaseConfig.js";
import { useNavigate } from "react-router-dom";

function useLogout() {
    const navigate = useNavigate();

    function logout() {
        auth.signOut()
            .then(() => {
                navigate('/'); 
            })
            .catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
    }

    return logout;
}

export default useLogout;
