'use client'
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useEffect } from "react";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

export default function Reservation({params}){
    const router = useRouter();
    const avaliableDays = {};
    const {id} = use(params);
    const restaurant_id = id;

    const [serverSideDays , setServerDays] = useState([]);
    console.log(id);
    const amanha = new Date();
    for (let index = 1; index < 7; index++) {
        amanha.setDate(amanha.getDate() + 1)
        const day = amanha.getDate();
        const year = amanha.getFullYear();
        const weekName = amanha.toLocaleDateString('pt-BR', { weekday: 'long' });
        avaliableDays[weekName] = {day : day , year : year};
    }



    useEffect(() => {
        getDays(restaurant_id);
    },[])

    const getDays = async (userId) => {
        console.log(userId);
        try {
            const response = await api.get('/days/get-user-days-free', {
              params: { userId },
            });
            const Array_days = response.data.restaurantOpeningDays;

            setServerDays(Array_days);
            }catch (error) {
            console.error("Erro ao obter os dias:", error);
            if (error.response) {
              console.error("Status:", error.response.status);
              console.error("Dados:", error.response.data);
            }
          }
        };
        console.log(serverSideDays);
    return (
        <div className="text-black">
            <p>Ola minion {restaurant_id}</p>
            <p>NOME DO RESTAURANTE</p>
            <button>Escolher data</button>
            <button>12:00</button>
            <button>12:00</button>
        </div>
    )
}