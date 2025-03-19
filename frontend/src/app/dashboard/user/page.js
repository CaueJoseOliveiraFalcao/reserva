// Page.js
'use client'
import { useRouter } from 'next/navigation';
import useUserAuth from '../../../../hooks/TokenAuth';
import { useEffect } from 'react';

export default function Page() {
    const authenticated = useUserAuth();
    const router = useRouter();

    useEffect(() => {
        console.log(authenticated);
        if (authenticated === false) {
            router.push('/auth/user-login'); // Redireciona para login se não autenticado
        }
    }, [authenticated, router]);

    if (authenticated === null) {
        return <p>Carregando...</p>; // Mostra uma tela de carregamento enquanto verifica o token
    }

    const user = localStorage.getItem('user')
    return (
        <div>
            <h1>DASHBOARD {user}</h1>
        </div>
    );
}
