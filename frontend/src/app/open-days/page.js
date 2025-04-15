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
    const [days , setDays] = useState({
        Segunda  : {
            init : null,
            end : null,
            isTrue : false,
        },
        Terca  : {
            init : null,
            end : null,
            isTrue : false,
        },
        Quarta  : {
            init : null,
            end : null,
            isTrue : false,
        },
        Quinta  : {
            init : null,
            end : null,
            isTrue : false,
        },
        Sexta  : {
            init : null,
            end : null,
            isTrue : false,
        },
    })
    useEffect(() => {

        if (authenticated === false){
            router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);
    useEffect(() => {
        const user = localStorage.getItem("user");
        const convetted = JSON.parse(user);
        const userId = convetted.id
        console.log(userId);
        getDays(userId);
    },[])
    const getDays = async (userId) => {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
            return false;
        }

        try {
            const response = await api.get('/days/get-user-days', {
              params: { userId },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(response);
            const Array_days = response.data.restaurantOpeningDays;

            setDays((prevDays) => {
                const updatedDays = {...prevDays};

                Array_days.forEach(element => {
                    const day = element.day_of_week;

                    if(updatedDays[day]){
                        updatedDays[day] = {
                            init : element.open_time.slice(0,5),
                            end : element.close_time.slice(0,5),
                            isTrue : true
                        }
                    }
                    console.log(updatedDays[day])
                });

                return updatedDays; 
            })


          } catch (error) {
            console.error("Erro ao obter os dias:", error);
            if (error.response) {
              console.error("Status:", error.response.status);
              console.error("Dados:", error.response.data);
            }
          }
        };
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
    const handleInit = (dayName , init) => {
        setDays(prevDays => ({
            ...prevDays,
            [dayName] : {
                ...prevDays[dayName],
                init: init
        }
        }))
    }
    const handleEnd = (dayName , end) => {
        setDays(prevDays => ({
            ...prevDays,
            [dayName] : {
                ...prevDays[dayName],
                end: end
        }
        }))
    }
    console.log(days);
    return (
        <div className="min-h-screen bg-gray-100">
            <RestaurantHeader />

            <div className="flex justify-center items-center mt-10">
                <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                    <h2 className="text-xl text-black font-bold mb-4 text-center">Dias de Funcionamento</h2>
                    <form>
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
                            {Object.entries(days).map(([dayName, dayData]) => (
                                <tr key={dayName}>
                                <td className="p-2 border">{dayName}</td>
                                <td className="p-2 border"><input type="time" value={dayData.init || ''} onChange={(e) => handleInit(dayName , e.target.value)} ></input></td>
                                <td className="p-2 border"><input type="time" value={dayData.end || ''} onChange={(e) => handleEnd(dayName , e.target.value)} ></input></td>
                                <td className="p-2 border"><input checked={dayData.isTrue} type="checkbox"></input></td>
                                </tr>
                            ))}
                            </tbody>
                    </table>
                    </form>
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