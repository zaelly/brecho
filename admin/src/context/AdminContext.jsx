import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export const AdminContext = createContext(null);

const AdminContextProvider = (props) =>{
    const url = import.meta.env.VITE_API_URL;
    const [allproducts, setAllProducts] = useState([]);
    const [profileDetail, setProfileDetail] = useState({
        name: '',
        image: '',
        email: 'email',
        new_password: '',
        shopDescription: '',
        produtos_vendidos: 0,
        stars: 0,
        gateways: [],
    });

    const fetchProfile = async () => {
        const res = await fetch(`${url}/api/sellers/getsellerprofile`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'auth-token-seller': localStorage.getItem("auth-token"),
        },
        });
        const data = await res.json();

        if (data.success) {
        const sellerId = data.data._id;
        setProfileDetail(prev => ({
            ...prev,
            id: data.data._id,
            name: data.data.name,
            email: data.data.email,
            shopDescription: data.data.shopDescription,
            image: data.data.image,
            produtos_vendidos: data.data.produtos_vendidos,
            stars: data.data.stars,
            gateways: data.data.gateways || [],
        }));
        localStorage.setItem("seller-id", sellerId);
        localStorage.setItem(`seller-image-${sellerId}`, data.data.image);
        } else {
        toast.error(data.errors || "Erro ao buscar perfil");
        }
    };
    
    const fetchInfo = async ()=>{
        const response = await 
        fetch(`${url}/api/products/seller/allproducts`, {
        headers: {
        'auth-token-seller': localStorage.getItem('auth-token')
        }
    })
        const data = await response.json();    
        setAllProducts(data);
    }

    const remove_product = async(id) => {
        await fetch(`${url}/api/products/seller/removeproduct`, {
        method: 'POST',
        headers: {
            Accept:'application/json',
            'Content-Type':'application/json',
            'auth-token-seller': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ id: id })
        });
        await fetchInfo();
    };


    useEffect(()=>{
        fetchInfo();
    },[])

    const contextValue = {
        fetchProfile, setProfileDetail, remove_product, url, allproducts, profileDetail, fetchInfo, setAllProducts, 
    }
    return(
        <AdminContext.Provider value={contextValue}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider