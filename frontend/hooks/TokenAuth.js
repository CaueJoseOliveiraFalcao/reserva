// useUserAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from '@/lib/api';

const useUserAuth = () => {
    const [authenticated, setAuthenticated] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.get('/users/verify-user-token', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setAuthenticated(true); // O token é válido
            })
            .catch(() => {
                setAuthenticated(false); // Se o token for inválido
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/auth/user-login'); // Redireciona para login
            });
        } else {
            setAuthenticated(false); // Se não houver token
            router.push('/auth/user-login'); // Redireciona para login
        }
    }, [router]);

    return authenticated;
};

export default useUserAuth;
