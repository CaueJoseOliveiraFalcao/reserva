"use client"
import ClientHeader from "@/components/ClientHeader";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Page(){
      const [timeLeft, setTimeLeft] = useState(300); // 5 minutos em segundos
      const router = useRouter();
        useEffect(() => {
            if (timeLeft <= 0) return;

            const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // limpar o intervalo
        }, [timeLeft]);

        // Converte segundos para formato MM:SS
        const formatTime = (seconds) => {
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };
        const SubmitReservation = () => {
            alert('Pagamento Realizado');
            router.push('/user-reservations');
        }
    return (
        <div>
            <ClientHeader/>

        <div className="min-h-screen text-black bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Pagamento da Reserva</h1>
                <form className="space-y-4">
                <div className="flex justify-center items-center">
                   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJgiYusr3xvjwvq0Me--mCxGUfnIdvdWa_0g&s"/>
                </div>
                <div>
                </div>
                <div>
                    <h1 className="text-2xl">TOTAL : 5,00 R$ </h1>
                    <h1 className="text-3xl my-3">Tempo Restante: {formatTime(timeLeft)}</h1>
                </div>
                <button onClick={() => SubmitReservation()} type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Ja Paguei
                </button>
                </form>
                <p className="text-sm text-gray-500 mt-4 text-center">
                O pagamento deve ser processado e confirmado em até 10 segundos.
                </p>
            </div>
            </div>
        </div>
    )
}