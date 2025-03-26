'use client'
import { useRouter } from 'next/navigation';
import  { useRestaurantAuth } from '../../../../hooks/TokenAuth';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Page() {

    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState('');
    const router = useRouter();
    const [profileShow , setProfile] = useState('');

    const [formData, setFormData] = useState({
        userName: '',
        address: '',
        phone: '',
        profile: null
      });

    const handleChange  = (event) => {
        const {name , value} = event.target

        setFormData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    }
    const handleFIleChange  = (event) => {
        const file = event.target.files[0]
        console.log(file);
        setFormData((prevData) => ({
            ...prevData,
            profile : file
        }));
    }
    useEffect(() => {
        if (authenticated === false){
            router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);

    useEffect(() => {
        const localUser = localStorage.getItem('user')

        if (localUser) {
            const objUser = JSON.parse(localUser);

            setProfile(objUser.profile_picture);

            setUser(objUser);
            setFormData({
                userName : objUser.name,
                address : objUser.address,
                phone : objUser.phone,
                profile : objUser.profile
            })

        }
    }, [])
    const Send = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const userId  = user.id;
        const data = new FormData();
        data.append('userId' , userId);
        data.append('userName', formData.userName);
        data.append('address', formData.address);
        data.append('phone', formData.phone);
        if (formData.profile) {
            data.append('profile', formData.profile); // Adiciona o arquivo ao FormData
        }
    
        try {
            const response = await api.post('/restaurant/change-profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.reload();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    return (
        <div>
            <h1 className='text-center text-3xl mt-5 mb-5'>PERFIL DO RESTAURANTE</h1>
            <div>
                <form onSubmit={Send} encType="multipart/form-data" className='flex flex-col justify-center items-center black'>
                    <label>Foto de Perfil Atual</label>
                    <img width={200} 
                            src={profileShow ? profileShow : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'}
                            alt="Foto de Perfil"
                            ></img>
                    <input className='bg-blue-500 text-white' type='file' accept="image/*" onChange={handleFIleChange}/>
                    <label>Nome Do Restaurante</label>
                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
                    <label>Endereço</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                    <label>Telefone</label>
                    <input type="phone" name="phone" value={formData.phone} onChange={handleChange} />

                    <input type='submit' value={'Salvar Alterações'}/>
                </form>
            </div>
        </div>
    );
}