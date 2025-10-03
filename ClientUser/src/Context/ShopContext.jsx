import { createContext, useState, useEffect, useMemo } from "react";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

    const [cartItem, setCartItems] = useState({});
    const [all_product, setAll_products] = useState([]);
    const [review, setReview] = useState({})
    const url = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        fetch(`${url}/api/products/allproducts`)
            .then((response)=>response.json())
            .then((data)=>setAll_products(data))

        if(localStorage.getItem('auth-token')){
            fetch(`${url}/api/cart/getcart`,{
                method: 'POST',
                headers: {
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({}),
            })
            .then((response)=>response.json())
            .then((data)=>{
                if(data.cart){
                    const newCart = {};
                    Object.entries(data.cart).forEach(([itemId, sizesObj]) => {
                        if (typeof sizesObj === 'object') {
                            Object.entries(sizesObj).forEach(([size, qty]) => {
                                newCart[`${itemId}_${size}`] = qty;
                            });
                        } else {
                            newCart[itemId] = sizesObj;
                        }
                    });
                    setCartItems(newCart);
                } else {
                    setCartItems({})
                }
            })    
        }
    },[])

    const addToCart = (itemId, size) => {
        if(!size) {
            toast.warn("Selecione um tamanho primeiro!");
            return;
        }
        
        const key = `${itemId}_${size}`;
        setCartItems(prev => ({
            ...prev,
            [key]: (prev[key] || 0) + 1
        }));

        if(localStorage.getItem('auth-token')){
            fetch(`${url}/api/cart/addtocart`,{
                method: 'POST',
                headers: {
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json' 
                },
                body:JSON.stringify({itemId, size}),
            })
            .then((response)=>response.json())
            .then((data)=>{
                if(data.success){
                    toast.success("produto adicionado com sucesso!")
                }
            })
        }
    };

    const removeFromCart = (itemId, size) => {
        const key = `${itemId}_${size}`
        setCartItems(prev => ({
            ...prev,
            [key]: (prev[key] || 0) - 1
        }));        

        if(localStorage.getItem('auth-token')){
            fetch(`${url}/api/cart/removefromcart`,{
                method: 'POST',
                headers: {
                    Accept:'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json' 
                },
                body:JSON.stringify({itemId, size}),
            })
            .then((response)=>response.json())
            .then((data)=>{
                if(data.success){
                    toast.success("produto removido com sucesso!")
                }
            })
        }
    };

    const getTotalCartAmount = useMemo(()=>{
        let totalAmount = 0;

        for(const key in cartItem){
            const qtd = cartItem[key]
            if(qtd > 0){
                const [itemId, size] = key.split("_")

                const itemInfo = all_product.find(p => p._id === itemId)
                if (!itemInfo) continue;

                const price = itemInfo.inOffer ? itemInfo.new_price : itemInfo.current_price;
                totalAmount += price * qtd;
            }
        }
        return totalAmount;
    },[cartItem])

    const totalCartItems = useMemo(()=>{
        let totalItem = 0;
        for(const item in cartItem){
            const quantity = Number(cartItem[item]) || 0;
            if(quantity > 0){
                totalItem += quantity
            }
        }
        return totalItem;
    },[cartItem])

    const contextValue = {totalCartItems, getTotalCartAmount, all_product, review, cartItem, addToCart, removeFromCart};
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
