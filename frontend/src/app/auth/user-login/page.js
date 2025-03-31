'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {styles} from './user-login.module.css'

export default function LoginCliente() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [allInputIsValid , setIsvalid] = useState(false)
  const router = useRouter();

  const allValuesAreTrue = () => {
    setIsvalid(Object.values(form).every(value => value.trim() !== ''));
  }
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTimeout(allValuesAreTrue, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = form;
    try {
      const response = await api.post('/users/login', {
        email: data.email,
        password: data.senha
      });


      const user = response.data[0];
      const token = response.data[1];
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));

      router.push('/dashboard/user')
    } catch (error) { 
      alert(error.response?.data?.error || 'Erro ao registrar.');
    }
  };

  return (
    <div className='h-screen w-full flex  bg-amber-900 flex-col'>

      <div className='w-full flex justify-center items-center'>
        <form className='d-flex lg:w-1/3 md:w-2/3 w-full mt-20  flex flex-col bg-white text-black p-4 rounded-2xl' onSubmit={handleSubmit}>
        <h1 className='text-center text-2xl mt-2 mb-6'>Login</h1>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} required />
          <button className={`p-3 mt-4 mb-1  w-2/3 m-auto rounded-2xl cursor-pointer ${allInputIsValid ?'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`} type="submit">Entrar</button>
          <a className='text-center text-black' href='/auth/user-register'>Não tenho uma conta</a>
        </form>
      </div>
    </div>
  );
}
