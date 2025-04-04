// useUserAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from '@/lib/api';
const useRestaurantAuth = () => {
    const [authenticated , setAuthenticated] = useState(null);
    const router = useRouter();

    useEffect(() =>{
        const localRes = localStorage.getItem("user");

        if (!localRes){
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            router.push('/auth/restaurant-login');
            setAuthenticated(false);
            return
        }

        const restaurant = JSON.parse(localRes)
        const restaurantcnpj = restaurant?.cnpj;
        if (restaurant.cpf){
            router.push('/auth/restaurant-login/')
        }
        if (restaurantcnpj){
            const token = localStorage.getItem("token")
            console.log(token);
            if (token){
                api.get('/restaurant/verify-restaurant-token' , {
                    headers : {
                        Authorization : `Bearer ${token}`,
                    },
                })
                .then(() => {
                    setAuthenticated(true);
                })
                .catch(() => {
                    setAuthenticated(false);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    router.push('/auth/restaurant-login'); 
                })}else{
                    setAuthenticated(false);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    router.push('/auth/restaurant-login/');
                }
            } else{
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/auth/restaurant-login/')
            }

    }, [router]);

    return authenticated;
}
const useUserAuth = () => {
    const [authenticated, setAuthenticated] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const localUser = localStorage.getItem("user");

        if (!localUser){
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            router.push('/auth/restaurant-login');
            setAuthenticated(false);
            return
        }
    
        const token = localStorage.getItem("token");
        const user = JSON.parse(localUser)
        if (user.cnpj){
            router.push('/auth/restaurant-login/')
        }
        const usecpf = user?.cpf;
        if (usecpf){
            if (token) {
                api.get('/users/verify-user-token', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    setAuthenticated(true);
                })
                .catch(() => {
                    setAuthenticated(false);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    router.push('/auth/user-login');
                });
            } else {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setAuthenticated(false);
                router.push('/auth/user-login');
            }
        }else{
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setAuthenticated(false);
            router.push('/auth/user-login/');
        }
        
    }, [router]);

    return authenticated;
};

export  {useUserAuth , useRestaurantAuth};
