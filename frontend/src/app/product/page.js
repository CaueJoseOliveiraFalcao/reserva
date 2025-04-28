
'use client'
import RestaurantHeader from "@/components/RestaurantHeader";
import { useRestaurantAuth } from "../../../hooks/TokenAuth";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";


export default function Page (){
    const authenticated = useRestaurantAuth();
    const [user , setUser] = useState(new Object);
    const [ProductName , setName] = useState('');
    const [ProductDescription , setDescription] = useState('');
    const [ProductValue , setValue] = useState(0);

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
                alert('usuario Criado');
                window.location.reload();
            });

        }catch(error){
            alert(error.response.data.message);
        }
    }
    console.log(products);
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
                                <td className="p-2 border text-center cursor-pointer">✏️</td>
                                <td className="p-2 border text-center cursor-pointer ">🗑️</td>
                                </tr>
                            ))}
                            </tbody>
                    </table>
                    </div>
                    </div>
            </main>
        </div>
    )
}