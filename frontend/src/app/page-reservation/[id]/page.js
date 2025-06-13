'use client'
import ClientHeader from "@/components/ClientHeader";
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
    let DbReservations = [];
    const [mTables,setTables] = useState([]);
    const [final_array , setFinal] = useState([]);
    const [serverSideDays , setServerDays] = useState([]);
    const amanha = new Date();
    const [mesaSelecionada, setMesaSelecionada] = useState(null);


    const [showModal, setShowModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);


    function timeToMinutes(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
    const getReservations = async () => {
        try {
            const response = await api.post("/reservations/show" , {restaurant_id : restaurant_id});
           return response.data
        }catch(err){
            console.log(err);
        }
    }
const sortValues = async  () => {
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
    const arrayu = {};
    serverSideDays.forEach(serverD => {
        Object.keys(avaliableDays).forEach(clientD => {
            if (serverD.day_of_week == clientD) {
                let Disponible_Hours = [];

                let open_time_init = timeToMinutes(serverD.open_time);
                let close_time = timeToMinutes(serverD.close_time);

                while (open_time_init < close_time) {

    
                    const time = minutesToTime(open_time_init);
                    Disponible_Hours.push(time);
                    open_time_init += 60;
                }

                const put = avaliableDays[clientD];

                arrayu[serverD.day_of_week] = {
                    name_week: serverD.day_of_week,
                    day: put.day,
                    month: put.month,
                    year: put.year,
                    hours: Disponible_Hours,
                    begin: serverD.open_time,
                    end: serverD.close_time,
                };
            }
        });
    });

    return Object.values(arrayu); // transforma o objeto em array
};

    const getDays = async (userId) => {
        try {
            const response = await api.get('/days/get-user-days-free', {
              params: { userId },
            });
            const Array_days = response.data.restaurantOpeningDays;

            setServerDays(Array_days); // ✅

            }catch (error) {
            console.error("Erro ao obter os dias:", error);
            if (error.response) {
              console.error("Status:", error.response.status);
              console.error("Dados:", error.response.data);
            }
          }
        };
        const getTables = async (userId) => {
        const token = localStorage.getItem('token');
        try {
          const response = await api.get('/tables/get-all-tables-restaurant', { params: { userId } ,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return  response.data
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          throw error;
        }
      };

        const jooj = `ola` 
        useEffect(() => {
            getDays(restaurant_id); // carrega os dias
        }, []);
        useEffect(() => {
                getTables(restaurant_id);
            
        }, []);

        useEffect(() => {
        if (serverSideDays.length > 0) {
            const fetchAndSort = async () => {
            const sorted = await sortValues();

            // Caso sortValues não retorne o array, ajuste para retornar
            sorted.sort((a, b) => {
                const dateA = new Date(a.year, a.month, a.day);
                const dateB = new Date(b.year, b.month, b.day);
                return dateA - dateB;
            });

            setFinal(sorted);
            };

            fetchAndSort();
        }
        }, [serverSideDays]);


        const final_Sort = async (dia , hora) => {
            let SendArray = new Object;
            const user = localStorage.getItem("user");
            const convveted = JSON.parse(user)
            const userId = convveted.id;
            const restaurant_id = serverSideDays[0].restaurant_id;
            const [hours, minutes] = hora.split(':').map(Number);
            const date_reservation = new Date(Date.UTC(dia.year, dia.month, dia.day, hours, minutes));
            const begin = hora;
            const status = "pendente"
            const endHour = String(hours + 1).padStart(2, '0');
            const end = `${endHour}:${String(minutes).padStart(2, '0')}`;
            SendArray = {
                client_id : userId,
                restaurant_id : restaurant_id,
                date_reservation : date_reservation,
                begin : begin,
                status : status,
                end : end,
            };
            const tables = await getTables(restaurant_id);
            const dbReservations = await getReservations();
            console.log(date_reservation);
            dbReservations.forEach(element => {
                const date = new Date(element.date);
                const utcHour =date.getUTCHours();
                const partes = hora.split(":");       // ["09", "00"]
                const horaInteira = parseInt(partes[0]); // 9
                const tableid = element.table;
                console.log(element);
                if (horaInteira == utcHour && dia.day == date.getUTCDate()){
                    console.log(tables , parseInt(tableid));
                    tables.forEach(element => {
                        if (element.id == tableid){
                            const index = tables.findIndex(element => element.id == tableid);
                                if (index !== -1) {
                                tables.splice(index, 1); 
                            }
                        }
                    });
                }
            });

            setTables(tables);
            console.log(tables);
                setSelectedReservation(SendArray);
                setShowModal(true);

        }
        const handleSubmitReservation = async () => {
            if (!selectedReservation || !mesaSelecionada) {
                alert("Selecione uma mesa.");
                return;
            }
            const token = localStorage.getItem("token");

            const dataToSend = {
                ...selectedReservation,
                table_id: mesaSelecionada,
            };

            try {
                const response = await api.post('/reservations/create', dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                });

                if (response.status === 201 || response.status === 200) {
                alert("Reserva realizada com sucesso!");
                setShowModal(false);
                router.push('/reservation-pay');
                } else {
                alert("Erro ao fazer reserva.");
                }
            } catch (error) {
                console.log(error.response.data.message);
                alert(error.response.data.message);
            }
        };


    return (
        <div className="text-black">
            <ClientHeader className="text-white"/>
            <p className="text-center text-2xl my-4" >Escolha a Data da Reserva</p>
            <p></p>

            <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {final_array && final_array.map((dia, index) => (
                    <div key={index} className="p-4 border shadow rounded-xl bg-white">
                    <div className="text-center mb-4">
                        <h2  className="text-xl font-bold">{dia.name_week}</h2>
                        <p className="text-3xl">{dia.day}</p>
                        <p className="text-sm text-gray-500">de {dia.month}/{dia.year}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {dia.hours.map((hora, i) => (
                        <button
                            onClick={() => final_Sort(dia, hora)}
                            key={i}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded transition"
                        >
                            {hora}
                        </button>
                        ))}
                    </div>
                    </div>
                ))}
                {showModal && selectedReservation && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Confirmar Reserva</h2>
                    <p><strong>Data:</strong> {selectedReservation.date_reservation.toLocaleDateString()}</p>
                    <p><strong>Início:</strong> {selectedReservation.begin}</p>
                    <p><strong>Fim:</strong> {selectedReservation.end}</p>

                    <div className="my-6">
                    {mTables.map((mesa) => (
                        <label
                        key={mesa.id}
                        className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border border-gray-300 hover:border-gray-500 transition"
                        >
                        <input
                            type="checkbox"
                            checked={mesaSelecionada === mesa.id}
                            onChange={() =>
                            setMesaSelecionada(mesaSelecionada === mesa.id ? null : mesa.id)
                            }
                            className="hidden"
                        />
                        <span
                            className={`w-5 h-5 flex items-center justify-center border-2 rounded ${
                            mesaSelecionada === mesa.id
                                ? "bg-green-500 border-green-600"
                                : "border-gray-400"
                            }`}
                        >
                            {mesaSelecionada === mesa.id && (
                            <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            )}
                        </span>
                        <span>Mesa {mesa.table_number} ({mesa.table_capacity} lugares)</span>
                        </label>
                    ))}
                    </div>
                                        <div className="mt-4 flex justify-between">
                        <button
                        onClick={() => setShowModal(false) }
                        className="bg-gray-300 px-4 py-2 rounded"
                        >
                        Cancelar
                        </button>
                        <button
                        onClick={() => handleSubmitReservation()}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                        Confirmar
                        </button>
                    </div>
                    </div>
                </div>
                )}
                </div>
            </div>
        </div>
    )
}