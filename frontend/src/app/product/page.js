
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
    const [ProductName , setName] = useState('');
    const [ProductDescription , setDescription] = useState('');
    const [ProductValue , setValue] = useState(0);
    const [open, setOpen] = useState(false);

    const [EditId , setEditId] = useState(0);
    const [EditName , setEditName] = useState('');
    const [EditDescription , setEditDescription] = useState('');
    const [EditValue , setEditValue] = useState('');

    const [products , setProducts] = useState([]);
    const router = useRouter();
    useEffect(() => {
        if (authenticated === false){
                router.push('/auth/restaurant-login')
        }
    }, [authenticated , router]);

    useEffect(() => {
        const Luser = localStorage.getItem("user");
        const convertedUser = JSON.parse(Luser);
        const userId = convertedUser.id;
        const token = localStorage.getItem("token");
        getProducts(userId , token);


    },[]);

    const getProducts = async (userId , token) =>{
        try {
            const response = await api.get('/product/get-store-products' , {
                params : {userId},
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            setProducts(response.data);

        }catch(err){
            console.log(err);
        }

    }
    const deleteProduct = async (productId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await api.post('/product/remove-product' , {productId} ,
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
            ).then(() => {
                alert('Produto deletado');
                window.location.reload();
            });
        }catch(err){
            console.log(err);
        }

    }
    const createProduct = async (e) => {
        e.preventDefault();
        const Luser = localStorage.getItem("user");
        const convertedUser = JSON.parse(Luser);
        const userId = convertedUser.id;
        const token = localStorage.getItem("token");
        console.log(token);
        try {
            const response = await api.post('/product/create-product', 
                {userId , ProductName , ProductDescription , ProductValue},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                }
            ).then(() => {
                alert('Produto criado');
                window.location.reload();
            });

        }catch(error){
            alert(error.response.data.message);
        }
    }
    const createPopUpEdit = (product) => {
        setEditId(product.id);
        setEditName(product.name);
        setEditValue(product.price);
        setEditDescription(product.description);
        setOpen(true);
    }
    const EditProduct = async (e) => {
        e.preventDefault(e);

        const token = localStorage.getItem('token');

        try {
            const response = await api.post('/product/edit-product' , 
                {EditId , EditName , EditValue , EditDescription},
                {headers : {
                    Authorization : `Bearer ${token}`
                }}
            ).then(() => {
                alert('edicao feita');
                window.location.reload();
            })
        }catch(err){
            console.log(err);
        }

    }
    return(
        <div className=" w-full flex justify-center items-center flex-col">
            <RestaurantHeader/>
            <main className='w-full md:w-3/4 lg:w-2/4 p-5 mt-10 flex flex-col items-center rounded-md text-black' style={{backgroundColor : '#F2F2F2' , fontFamily : "fantasy"}}>
            <h1 className="text-4xl">Criar Produto</h1>

            <form 
            onSubmit={createProduct}
            className="flex flex-col justify-center items-center p-6 rounded-lg  w-full max-w-md"
            >
                <label className="text-lg font-semibold mb-2">Nome Do Produto</label>
                <input 
                    type="text" 
                    name="name" 
                    value={ProductName} 
                    required
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />

                <label className="text-lg font-semibold mb-2">Descricao</label>
                <input 
                    type="text" 
                    name="address" 
                    value={ProductDescription} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />

                <label className="text-lg font-semibold mb-2">Preco</label>
                <input 
                    type="number" 
                    name="price" 
                    required
                    value={ProductValue} 
                    onChange={(e) => setValue(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />

                <input 
                    type="submit" 
                    value="Salvar Alterações" 
                    className="bg-green-500 text-white py-2 px-6 rounded-md cursor-pointer hover:bg-green-600 transition-all"
                />
            </form>


            <div className="flex justify-center items-center mt-10 flex-col">
            <h1 className="text-4xl">Produtos</h1>
                <div className="bg-white shadow-lg m-10 rounded-lg p-6 w-full">

                    <table className="w-full border-collapse  border rounded-lg border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="p-2 border">Nome</th>
                                <th className="p-2 border">Valor</th>
                                <th className="p-2 border">Editar</th>
                                <th className="p-2 border">Deletar</th>
                            </tr>
                        </thead>

                            <tbody className="text-black">
                            {products.map((product) => (
                                <tr key={product.id}>
                                <td className="p-2 border">{product.name}</td>
                                <td className="p-2 border">{product.price}</td>
                                <td onClick={() => createPopUpEdit(product)} className="p-2 border text-center cursor-pointer">✏️</td>
                                <td onClick={() => deleteProduct(product.id)} className="p-2 border text-center cursor-pointer ">🗑️</td>
                                </tr>
                            ))}
                            </tbody>
                    </table>
                    </div>
                    </div>
            </main>
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
                                Editar Produto : {EditName}
                            </DialogTitle>
                            <div className="mt-2">
                                <form onSubmit={(e) =>EditProduct(e)}>
                                    <label className="text-lg text-black font-semibold mb-2">Nome Do Produto</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={EditName} 
                                        required
                                        onChange={(e) => setEditName(e.target.value)} 
                                        className="w-full text-black p-2 border border-gray-300 rounded-md mb-4"
                                    />

                                    <label className="text-lg text-black font-semibold mb-2">Descricao</label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        value={EditDescription} 
                                        onChange={(e) => setEditDescription(e.target.value)} 
                                        className="w-full p-2 text-black border border-gray-300 rounded-md mb-4"
                                    />

                                    <label className="text-lg text-black font-semibold mb-2">Preco</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        required
                                        value={EditValue} 
                                        onChange={(e) => setEditValue(e.target.value)} 
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