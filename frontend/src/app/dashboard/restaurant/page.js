'use client'
import { useRouter } from 'next/navigation';
import  { useRestaurantAuth } from '../../../../hooks/TokenAuth';
import { useEffect, useState } from 'react';

export default function Page() {
    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState('');
    const router = useRouter();
    useEffect(() => {
        if (authenticated === false){
            router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);

    useEffect(() => {
        const localUser = localStorage.getItem('user')

        if (localUser) {
            const objUser = JSON.parse(localUser);
            setUser(objUser);
        }
    }, [])

    return (
        <div>
            <h1>DASHBOARD usuario = {user.name} cnpj = {user.cnpj}</h1>
        </div>
    );
}
