// Page.js
'use client'
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../../../../hooks/TokenAuth';
import { useEffect , useState } from 'react';
import ClientHeader from '@/components/ClientHeader';
import api from '@/lib/api';

export default function Page() {
    const authenticated = useUserAuth();
    const router = useRouter();
    const [Restaurants , setRestaurants] = useState([]);
    useEffect(() => {
        if (authenticated === false) {
            router.push('/auth/user-login');
        }
    }, [authenticated, router]);


    useEffect(() => {
        const user = localStorage.getItem("user") ;
        const token = localStorage.getItem("token");

        if (user && token){
            const convert = JSON.parse(user) || null;
            const userId = convert.id || null;
            getStores(token , userId);
        }

    },[]);

    const getStores = async (token , userId) => {
        try{
            const response = await api.get("restaurant/allStores/" , {
                params : {userId},
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            setRestaurants(response.data);
        }catch(err){
            console.log(err)
        }
    }
    console.log(Restaurants);
    return (
        <div>
            <ClientHeader/>
<main className='min-h-screen text-black flex flex-col '>
    <h1 className="p-5 text-3xl mt-5">Restaurantes Disponíveis</h1>
    <section className="flex w-full flex-row p-5 gap-5">
        {Object.entries(Restaurants).map(([RestaurantsK, RestaurantsData]) => (
        <section key={RestaurantsK} >
            <div className="w-72 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                    <img style={{width : "288px" , height : "250px"}} src={RestaurantsData.profile_picture} alt="" />
                </a>
                <div className="p-5">
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {RestaurantsData.name}
                        </h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {RestaurantsData.address}
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Acessar Reservas
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    ))}
    </section>
    
</main>
        </div>
    );
}
