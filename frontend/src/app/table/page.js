
'use client'
import RestaurantHeader from "@/components/RestaurantHeader";
import { useRestaurantAuth } from "../../../hooks/TokenAuth";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";


export default function Page (){
    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState(new Object);
    useEffect(() => {
        const user = localStorage.getItem("user");
        const convetted = JSON.parse(user);
        setUser(convetted);
        fetchUserProducts(convetted.id);
      }, []);
    const fetchUserProducts = async (userId) => {
        const token = localStorage.getItem('token');
        try {
          const response = await api.get('/tables/get-all-tables-restaurant', { params: { userId } ,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Products:', response.data);
          return response.data;
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          throw error;
        }
      };
    const router = useRouter();
    useEffect(() => {
        if (authenticated === false){
                router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);


    return(
        <div className=" w-full flex justify-center items-center flex-col">
            <RestaurantHeader/>
            <main className='w-full md:w-3/4 lg:w-2/4 p-5 mt-10 flex flex-col items-center rounded-md text-black' style={{backgroundColor : '#F2F2F2' , fontFamily : "fantasy"}}>

            </main>
        </div>
    )
}