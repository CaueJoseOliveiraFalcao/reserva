'use client'
import { useRouter } from "next/navigation";
import { use } from "react";
import { useEffect } from "react";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

export default function Reservation({params}){
    const router = useRouter();
    const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
    ];

    const hoje = new Date();
    

    const diaSemanaHoje = hoje.getDay();

    const DomingoDaSemana = new Date(hoje);
    DomingoDaSemana.setDate(hoje.getDate() - diaSemanaHoje);

    console.log(DomingoDaSemana);

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        const covertedUser = JSON.parse(rawUser);
        const client_id = covertedUser.id

    },[])
    const {restaurant_id} = use(params);
    console.log(restaurant_id);
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