// Page.js
'use client'
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../../../../hooks/TokenAuth';
import { useEffect } from 'react';

export default function Page() {
    const authenticated = useUserAuth();
    const router = useRouter();

    useEffect(() => {
        if (authenticated === false) {
            router.push('/auth/user-login');
        }
    }, [authenticated, router]);

    if (authenticated === null) {
        return <p>Carregando...</p>;  
    }

    const user = localStorage.getItem('user')
    return (
        <div>
            <h1>DASHBOARD {user}</h1>
        </div>
    );
}
