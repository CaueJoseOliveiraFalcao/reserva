'use client'

import RestaurantHeader from '@/components/RestaurantHeader';
import { useState } from 'react';
import api from '@/lib/api'; // você esqueceu de importar isso no código que mandou

export default function Page() {
  const [entrada, setEntrada] = useState(''); 

  const send = async (e) => {
    e.preventDefault();
    const vrestaurant = localStorage.getItem('user');
    const restaurant = JSON.parse(vrestaurant);
    const restaurantId = restaurant.id;

    try {
      const response = await api.post("/reservations/validate-entry", {
        restaurantId: restaurantId,
        code: entrada,
      });
      alert(response.data.message);
    } catch (err) {
      alert(err.response.data.message);
      setEntrada(``);
      // ou uma notificação de erro aqui
    }
  };

  return (
    <div>
      <RestaurantHeader />
      <div className="h-full flex flex-col items-center justify-center text-black px-4">
        <form onSubmit={send} className="w-full max-w-3xl">
          <label htmlFor="entrada" className="block text-center text-5xl my-7 text-gray-700">
            Validar entrada
          </label>
          <input
            type="text"
            id="entrada"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Digite o código da reserva..."
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 text-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
