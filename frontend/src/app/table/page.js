
'use client'
import RestaurantHeader from "@/components/RestaurantHeader";
import { useRestaurantAuth } from "../../../hooks/TokenAuth";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import api from "@/lib/api";


export default function Page (){
    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState(new Object);
    const [Tables , setTables] = useState([]);
    const [open, setOpen] = useState(false);
    const [TableCapacity , setTableCapacity] = useState(0);
    const [TableNumber , setTableNumber] = useState(0);
    const [EditTableNumber , setEditTableNumber] = useState(0);
    const [EditTableCapacity , setEditTableCapacity] = useState(0);
    const [EditTableId , setEditTableId] = useState(0);
    const router = useRouter();

    const createPopUpEdit = (product) => {
      setEditTableCapacity(product.table_capacity);
      setEditTableId(product.id);
      setEditTableNumber(product.table_number);
      setOpen(true);
  }
    useEffect(() => {
        const user = localStorage.getItem("user");
        const convetted = JSON.parse(user);
        setUser(convetted);
        fetchUserTables(convetted.id);
      }, []);
    const fetchUserTables = async (userId) => {
        const token = localStorage.getItem('token');
        try {
          const response = await api.get('/tables/get-all-tables-restaurant', { params: { userId } ,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTables(response.data);
          return response.data;
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          throw error;
        }
      };
    const createTable = async (e) => {
      e.preventDefault();
      try {
        const response = await api.post('/tables/create-table', {
          restaurant_id: 1,
          table_number: TableNumber,
          table_capacity: TableCapacity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Mesa criada com sucesso');
        window.location.reload();
      } catch (error) {
        alert('Mesa ja existente');
      }
    };
    const EditTable = async (e) => {
      e.preventDefault();
      const user  = localStorage.getItem('user');
      const converted = JSON.parse(user);
      const restaurant_id = converted.id;
      try {
        const response = await api.post('/tables/edit-table', {
          restaurant_id: restaurant_id,
          table_id: EditTableId,
          table_number: EditTableNumber,
          table_capacity: EditTableCapacity
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
);
    
        alert('Mesa editada com sucesso');
        window.location.reload();
      } catch (error) {
        console.error('Erro ao atualizar a mesa:', error.response?.data || error.message);
      }
    };
    const DeleteTable = async (tableId) => {
      const user  = localStorage.getItem('user');
      const converted = JSON.parse(user);
      const restaurant_id = converted.id;
      try {
        const response = await api.post('/tables/remove-table', {
          restaurant_id: restaurant_id,
          table_id: tableId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Mesa Deletada com sucesso');
        window.location.reload();
      } catch (error) {
        alert('Mesa ja existente');
      }
    };

    console.log(Tables);
    useEffect(() => {
        if (authenticated === false){
                router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);
    return(
        <div className=" w-full flex justify-center items-center flex-col">
            <RestaurantHeader/>
            <main className='w-full md:w-3/4 lg:w-2/4 p-5 mt-10 flex flex-col items-center rounded-md text-black' style={{backgroundColor : '#F2F2F2' , fontFamily : "fantasy"}}>
            <h1 className="text-3xl font-bold mb-5">Criar Mesas</h1>
            <form
              onSubmit={createTable} 
              encType="multipart/form-data" 
              className="flex flex-col justify-center items-center p-6 rounded-lg  w-full"
          >
              <label className="text-lg font-semibold mb-2">Numero da Mesa</label>
              <input 
                  type="number" 
                  name="table_number" 
                  value={TableNumber} 
                  onChange={(e) => setTableNumber(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <label className="text-lg font-semibold mb-2">Capacidade da Mesa</label>
              <input 
                  type="number" 
                  name="table_capacity"
                  value={TableCapacity}
                  onChange={(e) => setTableCapacity(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input 
                  type="submit" 
                  value="Salvar Alterações" 
                  className="bg-green-500 text-white py-2 px-6 rounded-md cursor-pointer hover:bg-green-600 transition-all"
              />
          </form>
        </main>
        <div className="flex justify-center items-center mt-10 flex-col">
            <h1 className="text-4xl">Mesas Do Restaurant</h1>
                <div className="bg-white shadow-lg m-10 rounded-lg p-6 w-full">

                    <table className="w-full border-collapse  border rounded-lg border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="p-2 border">Numero</th>
                                <th className="p-2 border">Caoacidade</th>
                                <th className="p-2 border">Editar</th>
                                <th className="p-2 border">Deletar</th>
                            </tr>
                        </thead>

                            <tbody className="text-black">
                            {Tables.map((tables) => (
                                <tr key={tables.id}>
                                <td className="p-2 border">{tables.table_number}</td>
                                <td className="p-2 border">{tables.table_capacity}</td>
                                <td onClick={() => createPopUpEdit(tables)} className="p-2 border text-center cursor-pointer">✏️</td>
                                <td onClick={() => DeleteTable(tables.id)} className="p-2 border text-center cursor-pointer ">🗑️</td>
                                </tr>
                            ))}
                            </tbody>
                    </table>
                    </div>
                    </div>
          <section>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <DialogTitle as="h1"  className=" text-3xl font-semibold text-gray-900">
                                Editar Mesa : {EditTableNumber}
                            </DialogTitle>
                            <div className="mt-2">
                                <form onSubmit={(e) =>EditTable(e)}>
                                    <label className="text-lg text-black font-semibold mb-2">Numero da mesa</label>
                                    <input 
                                        type="number" 
                                        name="table_number"
                                        value={EditTableNumber}
                                        required
                                        onChange={(e) => setEditTableNumber(e.target.value)} 
                                        className="w-full text-black p-2 border border-gray-300 rounded-md mb-4"
                                    />
                                    <label className="text-lg text-black font-semibold mb-2">Capacidade da Mesa</label>
                                    <input 
                                        type="number" 
                                        name="table_capacity" 
                                        value={EditTableCapacity} 
                                        onChange={(e) => setEditTableCapacity(e.target.value)} 
                                        className="w-full p-2 text-black border border-gray-300 rounded-md mb-4"
                                    />
                                    <button
                                            type="button"
                                            data-autofocus
                                            onClick={() => setOpen(false)}
                                            className="mt-3 mr-5 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                    </button>
                                    <input 
                                        type="submit" 
                                        value="Salvar Alterações" 
                                        className="bg-green-500 text-white py-2 px-6 rounded-md cursor-pointer hover:bg-green-600 transition-all"
                                    />
                                </form>
                            </div>
                            </div>
                        </div>
                        </div>
                    </DialogPanel>
                    </div>
                </div>
            </Dialog>
            </section>
        </div>
    )
}