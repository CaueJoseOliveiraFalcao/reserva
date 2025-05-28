'use client'

import RestaurantHeader from '@/components/RestaurantHeader';
import { useState } from 'react';

export default function ValidarEntradaForm() {
  const [entrada, setEntrada] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Entrada: ${entrada}`);

  };

  return (
    <div>
        <RestaurantHeader/>
        <div className="h-full flex flex-col items-center justify-center text-black  px-4">
            
        <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            <label htmlFor="entrada" className="block text-center text-5xl my-7 text-gray-700 ">
            Validar entrada
            </label>
            <input
            type="text"
            id="entrada"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Digite algo..."
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
