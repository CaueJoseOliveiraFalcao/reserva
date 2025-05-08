'use client'
import { useRouter } from 'next/navigation';
import  { useRestaurantAuth } from '../../../../hooks/TokenAuth';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import RestaurantHeader from '@/components/RestaurantHeader';

export default function Page() {

    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState('');
    const router = useRouter();
    const [profileShow , setProfile] = useState('');
    const [defaultTimePermanence, setDefaultTimePermanence] = useState(60);
const [autoCloseTimePermanence, setAutoCloseTimePermanence] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        address: '',
        phone: '',
        profile: null,
        defaultTimePermanence: 60,
        autoCloseTimePermanence: false
    });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "autoCloseTimePermanence" ? Boolean(value) : value
        }));
    };
    
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
                profile : objUser.profile,
                autoCloseTimePermanence : objUser.auto_close_time_permanence,
                defaultTimePermanence : objUser.default_time_permanence,
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
        data.append("defaultTimePermanence", formData.defaultTimePermanence);
        data.append("autoCloseTimePermanence", formData.autoCloseTimePermanence);

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
        <div className='flex justify-center  items-center flex-col'>
            <RestaurantHeader/>
            <main className='w-full md:w-3/4 lg:w-2/4 p-5 mt-10 flex flex-col items-center rounded-md text-black' style={{backgroundColor : '#F2F2F2' , fontFamily : "fantasy"}}>
                <h1 className='text-center text-3xl mt-5 mb-5'>PERFIL DO RESTAURANTE</h1>
            <div>
            <form 
            onSubmit={Send} 
            encType="multipart/form-data" 
            className="flex flex-col justify-center items-center p-6 rounded-lg  w-full max-w-md"
        >
            <label className="text-lg font-semibold mb-2">Foto de Perfil Atual</label>
            <img 
                width={200} 
                className="rounded-full mb-4"
                src={profileShow ? profileShow : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'}
                alt="Foto de Perfil"
            />
            <input 
                className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer mb-4" 
                type="file" 
                accept="image/*" 
                onChange={handleFIleChange}
            />

            <label className="text-lg font-semibold mb-2">Nome Do Restaurante</label>
            <input 
                type="text" 
                name="userName" 
                value={formData.userName} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <label className="text-lg font-semibold mb-2">Endereço</label>
            <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <label className="text-lg font-semibold mb-2">Telefone</label>
            <input 
                type="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <label className="text-lg font-semibold mb-2">Tempo de Permanência (minutos)</label>
            <input 
                type="number" 
                name="defaultTimePermanence" 
                value={formData.defaultTimePermanence} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <label className="text-lg font-semibold mb-2">Fechamento Automático?</label>
            <select 
                name="autoCloseTimePermanence" 
                value={formData.autoCloseTimePermanence} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            >
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
            </select>
            <input 
                type="submit" 
                value="Salvar Alterações" 
                className="bg-green-500 text-white py-2 px-6 rounded-md cursor-pointer hover:bg-green-600 transition-all"
            />
        </form>

            </div>
            </main>


        </div>
    );
}