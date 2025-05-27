'use client'
import { useRouter } from 'next/navigation';
import  { useRestaurantAuth } from '../../../../hooks/TokenAuth';
import { useEffect, useState } from 'react';
import RestaurantHeader from '@/components/RestaurantHeader';
import api from '@/lib/api';

export default function Page() {
    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState('');
    const router = useRouter();
    const [reservations , setReservations] = useState();
    const getReservations = async (restaurant_id) => {
        try {
            const response = await api.post("/reservations/show" , {restaurant_id : restaurant_id});
            response.data.forEach(element => {
                console.log(element)
            });
            setReservations(response.data);
        }catch(err){
            console.log(err);
        }
    }
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
            getReservations(objUser.id);
        }
    }, [])

    return (
        <div>
            <RestaurantHeader/>
                <h1 className="text-black text-center my-7 text-2xl" >Painel de Controle de Reservas</h1>
        <div className="p-6">
            {reservations ? (
                <div className="overflow-x-auto flex flex-col justify-center text-black">
                    <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2 border">Data</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Mesa</th>
                                <th className="px-4 py-2 border">Capacidade</th>
                                <th className="px-4 py-2 border">Cliente</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">  {new Date(res.date).toLocaleString('pt-BR', {
                                        timeZone : 'UTC',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        weekday : `long`,
                                    })}</td>
                                    <td className="px-4 py-2 border">{res.status}</td>
                                    <td className="px-4 py-2 border">{res.table_info?.table_number}</td>
                                    <td className="px-4 py-2 border">{res.table_info?.table_capacity}</td>
                                    <td className="px-4 py-2 border">{res.client?.name}</td>
                                    <td className="px-4 py-2 border">{res.client?.email}</td>
                                    <td className="px-4 py-2 border">{res.client?.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">Nenhuma reserva encontrada.</p>
            )}
        </div>
        </div>
    );
}
