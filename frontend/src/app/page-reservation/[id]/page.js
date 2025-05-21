'use client'
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useEffect } from "react";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import jsxRuntime from "react/jsx-runtime";

export default function Reservation({params}){
    const router = useRouter();
    const avaliableDays = {};
    const {id} = use(params);
    const restaurant_id = id;

    const [serverSideDays , setServerDays] = useState([]);
    const amanha = new Date();
    for (let index = 1; index < 7; index++) {
        amanha.setDate(amanha.getDate() + 1)
        const day = amanha.getDate();
        const month = amanha.getMonth();
        const year = amanha.getFullYear();
        const weekName = amanha.toLocaleDateString('pt-BR', { weekday: 'long' });
        const weekLower = weekName.slice(` `)[0].toUpperCase() + weekName.slice(1);
        const weekFirst = weekLower.split(`-`)[0];
        const weekNormalized = weekFirst
        .normalize("NFD")                    // Decompõe os caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "")    // Remove os diacríticos (acentos)
        .replace(/ç/g, "c")                 // Substitui "ç" por "c")
        avaliableDays[weekNormalized] = {day : day ,month:month , year : year};
    }

    useEffect(() => {
        getDays(restaurant_id);
        sortValues();
    },[])

    function timeToMinutes(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
    const sortValues = () => {
        const final_array = {}
        console.log(avaliableDays);
        serverSideDays.forEach(serverD => {
            console.log(serverD);
            Object.keys(avaliableDays).forEach(clientD => {
                let Disponible_Hours = []
                if (serverD.day_of_week == clientD){
                    let open_time_init = timeToMinutes(serverD.open_time);
                    let close_time = timeToMinutes(serverD.close_time);
                    for ( open_time_init; open_time_init < close_time;) {
                        const time = minutesToTime(open_time_init);
                        Disponible_Hours.push(time);
                        open_time_init += 60;
                    }
                    const put = avaliableDays[clientD];
                    final_array[serverD.day_of_week] = {
                        name_week : serverD.day_of_week ,
                        day : put.day , 
                        month : put.month , 
                        year : put.year ,
                        hours : Disponible_Hours,
                        begin : serverD.open_time,
                        end : serverD.close_time,
                     }
                }
                console.log(final_array);
            })
        });
    }
    sortValues();
    const getDays = async (userId) => {
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

        const jooj = `ola` 

    return (
        <div className="text-black">
            <p>Ola minion {restaurant_id}</p>
            <p>NOME DO RESTAURANTE</p>

            <div>
                <h1>Sabado</h1>
                <button>12:00</button>
                <button>13:00</button>
                <button>14:00</button>
                <button>15:00</button>
                <button>16:00</button>
            </div>
        </div>
    )
}