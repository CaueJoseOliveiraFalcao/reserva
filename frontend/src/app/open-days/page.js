"use client";

import { useRouter } from "next/navigation";
import { useRestaurantAuth } from "../../../hooks/TokenAuth";
import { useEffect, useState } from "react";
import RestaurantHeader from "@/components/RestaurantHeader";
import {styles} from './open-days.module.css';
import api from '@/lib/api';

export default function Page() {
    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState(new Object);
    const router = useRouter();
    useEffect(() => {
        const user = localStorage.getItem("user");
        const convetted = JSON.parse(user);
        const userId = convetted.id
        console.log(userId);
        getDays(userId);
        if (authenticated === false){
            router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);

    const getDays = async (userId) => {
        const token = localStorage.getItem("token");
        try{
            const response = await api.get('/days/get-user-days' , userId , {
                headers : {
                    Authorization : `Bearer ${token}`,
                },
            })
                alert("Alterações dsalvas!");
        }catch(error) {
            console.log(error);
        }
    }
    const handleSubmit = async () => {
        const token = localStorage.getItem("token")
        const userId = user.id;
        console.log(days);
        try{
            const response = await api.post('/restaurant/change-open-days' , {days , userId} , {
                headers : {
                    Authorization : `Bearer ${token}`,
                },
            })
                alert("Alterações dsalvas!");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.reload();
        }catch(error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <RestaurantHeader />

            <div className="flex justify-center items-center mt-10">
                <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                    <h2 className="text-xl text-black font-bold mb-4 text-center">Dias de Funcionamento</h2>
                    <table className="w-full border-collapse border rounded-lg border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="p-2 border">Dia</th>
                                <th className="p-2 border">Inicio</th>
                                <th className="p-2 border">Fim</th>
                                <th className="p-2 border">Stauts</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
   
                        </tbody>
                    </table>
                    <button
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );

}