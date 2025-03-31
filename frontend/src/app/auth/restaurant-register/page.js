'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {styles} from './restaurant-register.module.css'

export default function RegistroRestaurante() {
  const [form, setForm] = useState({ name: '', cnpj: '', email: '', senha: '', phone: '', address: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = form;
    try {
      const response = await api.post('/restaurant/signup', {
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        password: data.senha,
        phone: data.phone,
        address: data.address
      });

      alert('Cadastro realizado com sucesso!');

      const user = response.data[0];
      const token = response.data[1];

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));

      console.log(localStorage.getItem('token'));

      router.push('/dashboard/restaurant');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao registrar.');
    }
  };

  return (
    <div>
      <h1 className='text-center text-2xl mt-6 mb-6'>Registro de Restaurante</h1>
      <a className='text-center m-auto text-black' href='/auth/restaurant-login'>REGISTRO RESTAURANTE</a>
      <div className='w-full flex justify-center items-center'>
        <form className='d-flex w-1/3 flex flex-col' onSubmit={handleSubmit}>
          <label>Nome</label>
          <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
          <input name="cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} required />
          <input name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} required />
          <input name="address" placeholder="Endereço" value={form.address} onChange={handleChange} required />
          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}
