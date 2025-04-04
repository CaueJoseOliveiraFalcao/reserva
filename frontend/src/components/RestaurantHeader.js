import { useRouter } from "next/navigation";
export default function RestaurantHeader(){
    const router = useRouter();
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push('/auth/restaurant-login');
    };
    return(
        <header style={{backgroundColor : '#6E1013'}} className=" w-full flex justify-between items-center h-24 p-1">
            <div className="flex items-center h-full">
            <a href="/dashboard/restaurant/">
                <img  width='200px'src="/logo2.png"/>
            </a>
            </div>
            <div>
                <a onClick={logout} className="p-3 cursor-pointer hover:opacity-95 text-xl rounded-md mr-3" style={{backgroundColor : "#E84A69" }}>Logout</a>
                <a href="/profile/restaurant" className="p-3 cursor-pointer text-xl hover:opacity-95 rounded-md"style={{backgroundColor : "white" , color : '#E84A69' }}>Perfil</a>
                <a href="/open-days/"  className="p-3 cursor-pointer hover:opacity-95 text-xl rounded-md ml-3" style={{backgroundColor : "#E84A69" }}>Dias Abertos</a>
            </div>
        </header>
    )
}