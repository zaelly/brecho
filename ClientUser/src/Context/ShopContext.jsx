import { createContext, useState, useEffect, useMemo } from "react";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

    const [cartItem, setCartItems] = useState({});
    const [all_product, setAll_products] = useState([]);
    const [review, setReview] = useState({})

    useEffect(()=>{
        fetch('http://localhost:4000/api/products/allproducts')
            .then((response)=>response.json())
            .then((data)=>setAll_products(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/api/cart/getcart',{
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
            fetch('http://localhost:4000/api/cart/addtocart',{
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

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]: prev[itemId] - 1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/api/cart/removefromcart',{
                method: 'POST',
                headers: {
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json' 
                },
                body:JSON.stringify({"itemId":itemId}),
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

        for(const item in cartItem){
            const qntd = cartItem[item]            

            if (qntd > 0) {                        
                const itemInfo = all_product.find((product) => product._id === item);
                if (!itemInfo) continue;

                const price = itemInfo.inOffer ? itemInfo.new_price : itemInfo.current_price;
                totalAmount += price * qntd;
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

    const groupedCart = Object.entries(cartItem).reduce((acc, [key, quantity]) => {
        if (quantity <= 0) return acc;

        const [itemId, size] = key.split("_");
        if (!acc[itemId]) acc[itemId] = { sizes: [], quantity: 0 };

        acc[itemId].sizes.push(size);
        acc[itemId].quantity += quantity;
        return acc;
    }, {});
 
    const contextValue = {totalCartItems, groupedCart, getTotalCartAmount, all_product, review, cartItem, addToCart, removeFromCart};
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
