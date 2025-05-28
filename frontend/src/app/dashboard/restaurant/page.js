'use client'
import { useRouter } from 'next/navigation';
import  { useRestaurantAuth } from '../../../../hooks/TokenAuth';
import { useEffect, useState } from 'react';
import RestaurantHeader from '@/components/RestaurantHeader';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import api from '@/lib/api';

export default function Page() {
    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState('');
    const [open, setOpen] = useState(false)

    const [clientName , setClientName] = useState();
    const [clientPhone , setClientPhone] = useState();
    const [reservationId , setReservationId] = useState();
    const router = useRouter();
    const [reservations , setReservations] = useState();
    const deleteReservation = async (reservation_id) => {
        try {
            const response = await api.post("/reservations/delete" , {reservation_id : reservation_id});
            alert(response.data.message);
            window.location.reload();
        }catch(err){
            console.log(err);
        }
    };
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
    const setModal = (clientName , clientPhone , reservationId) => {
        setClientName(clientName);
        setClientPhone(clientPhone);
        setReservationId(reservationId);
        setOpen(true);
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
                                <th className="px-4 py-2 border">Deletar Reserva</th>
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
                                    <td className="px-4 py-2 border"><a target="_blank" className={"underline text-blue-600 target:bla"} href={`https://wa.me/${res.client?.phone}`}>{res.client?.phone}</a></td>
                                    <td  className="px-4 py-2 border "><a className="p-2 cursor-pointer" onClick={(e) => setModal(res.client?.name , res.client?.phone , res.id)} >🗑️</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">Nenhuma reserva encontrada.</p>
            )}
        </div>
         <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                        <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                            Atencao 
                        </DialogTitle>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Contate o Cliente : {clientName} antes de deletar sua reserva
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex w-full justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white  hover:bg-gray-400 sm:ml-3 sm:w-auto"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        data-autofocus
                           
                        className="mt-3 inline-flex w-full border-green-500 justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-gray-900   hover:bg-green-400 sm:mt-0 sm:w-auto"
                    >
                        <a target="_blank" href={`https://wa.me/${clientPhone}`}>Whatsapp</a>
                    </button>
                    <button
                        type="button"
                        data-autofocus
                        onClick={() => deleteReservation(reservationId)}
                        className="mt-3 inline-flex w-full mr-3 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-gray-900  ring-1 ring-gray-300 ring-inset hover:bg-red-700 sm:mt-0 sm:w-auto"
                    >
                        Deletar
                    </button>
                    </div>
                </DialogPanel>
                </div>
            </div>
            </Dialog>
        </div>
    );
}
