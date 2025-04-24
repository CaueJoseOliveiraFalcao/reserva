'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {styles} from './restaurant-login.module.css'
import FormDiv from '@/components/FormDiv';

export default function LoginRestaurant() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [allInputIsValid , setIsvalid] = useState(false)
  const router = useRouter();
  const allValuesAreTrue = () => {
    setIsvalid(Object.values(form).every(value => value.trim() !== ''));
  }
  setTimeout(allValuesAreTrue, 0);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTimeout(allValuesAreTrue, 0);
  };
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token){
      router.push('/dashboard/restaurant/');
    }
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = form;
    try {
      const response = await api.post('/restaurant/login', {
        email: data.email,
        password: data.senha
      });

      const user = response.data[0];
      const token = response.data[1];
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));

      alert('Login realizado com sucesso!');
      router.push('/dashboard/restaurant');
    } catch (error) { 
      alert(error.response?.data?.error || 'Erro ao registrar.');
    }
  };

  return (
    <FormDiv>
      <form className='d-flex lg:w-2/4 md:w-2/3 w-full mt-10  flex flex-col bg-white text-black p-4 rounded-2xl' onSubmit={handleSubmit}>
          <h1 className='text-center text-2xl mt-6 mb-6'>Login de Restaurante</h1>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} required />
          <button className={`p-3 mt-4 mb-1  w-2/3 m-auto rounded-2xl cursor-pointer`}   style={{ 
            backgroundColor: allInputIsValid ? "#EB637E" : "#F4F4F4", 
            color: allInputIsValid ? "white" : "gray" 
          }}  type="submit">Salvar</button>
          <a className='text-center  text-black' href='/auth/restaurant-register'>REGISTRO RESTAURANTE</a>
        </form>
   </FormDiv>
  );
}
