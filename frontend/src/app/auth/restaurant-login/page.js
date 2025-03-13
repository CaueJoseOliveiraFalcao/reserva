'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {styles} from './restaurant-login.module.css'

export default function LoginRestaurant() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = form;
    try {
      const response = await api.post('/restaurant/login', {
        email: data.email,
        password: data.senha
      });

      alert('LOgado com sucesso!');

      const user = response.data[0];
      const token = response.data[1];
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));

      console.log(localStorage.getItem('token'));
    } catch (error) { 
      alert(error.response?.data?.error || 'Erro ao registrar.');
    }
  };

  return (
    <div>
      <h1 className='text-center text-2xl mt-6 mb-6'>Login de Restaurante</h1>
      <div className='w-full flex justify-center items-center'>
        <form className='d-flex w-1/3 flex flex-col' onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} required />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
