'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {styles} from './user-register.module.css'
import FormDiv from '@/components/FormDiv';

export default function RegistroCliente() {
  const [form, setForm] = useState({ name: '', cpf: '', email: '', senha: '', phone: '' });
  const [allInputIsValid , setIsvalid] = useState(false)
  const router = useRouter();
  
  const allValuesAreTrue = () => {
    setIsvalid(Object.values(form).every(value => value.trim() !== ''));
  }
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token){
      router.push('/dashboard/user/');
    }
  },[])
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTimeout(allValuesAreTrue, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = form;
    try {
      const response = await api.post('/users/signup', {
        name : data.name,
        cpf : data.cpf,
        email: data.email,
        password : data.senha,
        phone : data.phone
      });
      localStorage.setItem
      alert('Cadastro realizado com sucesso!');
      const user = response.data[0];
      const token = response.data[1];
      localStorage.setItem('user' , JSON.stringify(user));

      localStorage.setItem('token' , JSON.stringify(token))

      console.log(localStorage.getItem('token'))

      router.push('/dashboard/user');
    } catch (error) { 
      alert(error.response?.data?.error || 'Erro ao registrar.');
    }
  };

  
  return (
    <FormDiv>
      <form className='d-flex lg:w-2/4 md:w-2/3 w-full mt-10  flex flex-col bg-white text-black p-4 rounded-2xl' onSubmit={handleSubmit}>
      <h1 className='text-center text-black text-2xl mt-2 mb-6'>Criar Conta</h1>
        <label>Nome</label>
        <input className='text-black' name="name" placeholder="digite seu nome" value={form.name} onChange={handleChange} required />
        <label>Cpf</label>
        <input name="cpf" placeholder="insira seu CPF" value={form.cpf} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" placeholder="digite seu email" value={form.email} onChange={handleChange} required />
        <label>Senha</label>
        <input name="senha" type="password" placeholder="crie uma senha" value={form.senha} onChange={handleChange} required />
        <label>Telefone</label>
        <input name="phone" placeholder="digite seu telefone" value={form.phone} onChange={handleChange} required />
        <button className={`p-3 mt-4 mb-1  w-2/3 m-auto rounded-2xl cursor-pointer`}   style={{ 
            backgroundColor: allInputIsValid ? "#EB637E" : "#F4F4F4", 
            color: allInputIsValid ? "white" : "gray" 
          }}  type="submit">Salvar</button>
        <a className='text-center text-black' href='/auth/user-login'>Ja tenho uma conta</a>
      </form>
    </FormDiv>
  );
}
