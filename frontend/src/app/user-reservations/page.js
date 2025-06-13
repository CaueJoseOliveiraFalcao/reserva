'use client'
import { useRouter } from 'next/navigation';
import  { useUserAuth } from '../../../hooks/TokenAuth';
import { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import { QRCodeCanvas } from 'qrcode.react';

import api from '@/lib/api';

import Image from 'next/image';
import ClientHeader from '@/components/ClientHeader';
export default function Page(){
        const authenticated = useUserAuth();
        const [open, setOpen] = useState(false)
        const [qrValue , setQr] = useState();
        const router = useRouter();
        const [reservations  , setReservations] = useState([]);
    useEffect(() => {
        if (authenticated === false){
            router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);
    const getReservations = async () => {
        const user = localStorage.getItem('user');
        const userconv = JSON.parse(user);
        const userId = userconv.id
        try {
            const response = await api.post("/reservations/show-user-reservations" , {userId : userId});
            setReservations(response.data);

        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        getReservations();
    },[])
    const openModal = (qr) => {
        setOpen(true);
        setQr(qr);
        alert(qr);
    }
    return(
        <div className="text-black ">
            <ClientHeader/>
            <h1 className="p-4 text-2xl font-bold mb-4">Suas reservas</h1>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {reservations.length === 0 ? (
                    <p className="col-span-full">Nenhuma reserva encontrada.</p>
                ) : (
                    reservations.map((reserva, index) => (
                        <div key={index} className="bg-white border rounded-lg shadow p-4">
                            <Image
                                width={`400`}
                                height={`400`}
                                src={reserva.restaurant?.profile}
                                alt={reserva.restaurant?.name || 'Restaurante'}
                                className=" h-60 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-lg font-semibold">{reserva.restaurant?.name}</h2>
                            <p><strong>Data:</strong> {new Date(reserva.date).toLocaleString('pt-BR', {
                                        timeZone : 'UTC',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        weekday : `long`,
                                    })} {new Date(reserva.date) < new Date() ? ' (expirado)' : ''}</p>
                            
                            <p><strong>Horário:</strong> {new Date(reserva.date).toLocaleString('pt-BR', {
                                        timeZone : 'UTC',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}</p>
                            <p><strong>Numero da Mesa:</strong>{reserva.table_info.table_number}</p>
                            <button onClick={(e) => openModal(reserva.qrCode)} type="button" className=" mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Acessar Qr Code</button>
                        </div>
                    ))
                )}
            </div>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-full overflow-y-auto">
                <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white  shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-center justify-center">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle as="h3" className="text-center font-semibold text-gray-900">
                            Apresente sua reserva
                        </DialogTitle>
                        <div className="mt-2">
                            <QRCodeCanvas value={qrValue} size={170} />
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        type="button"
                        data-autofocus
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Sair
                    </button>
                    </div>
                </DialogPanel>
                </div>
            </div>
            </Dialog>
        </div>
    )
}