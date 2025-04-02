// Page.js
'use client'
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../../../../hooks/TokenAuth';
import { useEffect } from 'react';
import ClientHeader from '@/components/ClientHeader';

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

    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
            <ClientHeader/>
            <main className='min-h-screen text-black flex flex-col items-center'>
                <p>Ola {user.name}</p>
                <p>Cpf {user.cpf}</p>

            </main>
        </div>
    );
}
