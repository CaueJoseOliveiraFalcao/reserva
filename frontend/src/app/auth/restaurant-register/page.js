'use client';
import { useState , useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {styles} from './restaurant-register.module.css'
import FormDiv from '@/components/FormDiv';

export default function RegistroRestaurante() {
  const [form, setForm] = useState({ name: '', cnpj: '', email: '', senha: '', phone: '', address: '', time : 60});
  const [allInputIsValid , setIsvalid] = useState(false)
  const [autoClose , setAutoClose] = useState(false)
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
      const response = await api.post('/restaurant/signup', {
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        password: data.senha,
        phone: data.phone,
        address: data.address,
        time : data.time,
        auto_close_time_permanence: Boolean(autoClose),
      });
      const user = response.data[0];
      const token = response.data[1];
      console.log(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
      router.push('/dashboard/restaurant/');

    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao registrar.');
    }
  };

  return (
    <FormDiv>
      <form className='d-flex lg:w-2/4 md:w-2/3 w-full mt-10  flex flex-col bg-white text-black p-4 rounded-2xl' onSubmit={handleSubmit}>
      <h1 className='text-center text-2xl mt-6 mb-6'>Registro de Restaurante</h1>
          <label>Nome</label>
          <input name="name" placeholder="digite seu nome" value={form.name} onChange={handleChange} required />
          <label>Cnpj</label>
          <input name="cnpj" placeholder="insira seu cpf" value={form.cnpj} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" placeholder="digite seu email" value={form.email} onChange={handleChange} required />
          <label>Senha</label>
          <input name="senha" type="password" placeholder="crie uma senha" value={form.senha} onChange={handleChange} required />
          <label>Telefone</label>
          <input name="phone" placeholder="insira seu telefone" value={form.phone} onChange={handleChange} required />
          <label>Endereço</label>
          <input name="address" placeholder="digite seu endereço" value={form.address} onChange={handleChange} required />
          <label>Tempo de Permanencia do Cliente(minutos)</label>
          <input name="time" placeholder="tempo que o cliente provavelmente vai passar" value={form.time} onChange={handleChange} required />
          <label>Fechar Mesa Automaticamente ? </label>
          <input type='checkbox' name="auto_close" value={autoClose} onChange={(e) => setAutoClose(e.target.value)} required />
          <button className={`p-3 mt-4 mb-1  w-2/3 m-auto rounded-2xl cursor-pointer`}   style={{ 
            backgroundColor: allInputIsValid ? "#EB637E" : "#F4F4F4", 
            color: allInputIsValid ? "white" : "gray" 
          }}  type="submit">Salvar</button>
          <a className='text-center  text-black' href='/auth/restaurant-login'>REGISTRO RESTAURANTE</a>
        </form>
    </FormDiv>
  );
}
