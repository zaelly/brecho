import { createContext, useState, useEffect, useMemo } from "react";
export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    return {};
}

const ShopContextProvider = (props) => {

    const [cartItem, setCartItems] = useState(getDefaultCart());
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
            .then((data)=>setCartItems(data))
        }
    },[])

    const addToCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]: (prev[itemId] || 0) + 1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/api/cart/addtocart',{
                method: 'POST',
                headers: {
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json' 
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data))
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
            .then((data)=>console.log(data))
        }
    };

const getTotalCartAmount = () =>{
    let totalAmount = 0;

    for(const item in cartItem){
        const qntd = cartItem[item]            

        if (qntd > 0) {        
            let inOffer = all_product[6];
            const itemInfo = all_product.find((product) => product._id === item);
            if (!itemInfo) continue;

            const price = inOffer ? itemInfo.new_price : itemInfo.current_price;
            totalAmount += price * qntd;
        }
    }
    return totalAmount;
}

    const getTotalCartItems = useMemo(()=>{
        let totalItem = 0;
        for(const item in cartItem){        
            const quantity = Number(cartItem[item]);
            if(quantity > 0){
                totalItem += quantity
            }
        }
        return totalItem;
    },[cartItem])
 
    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, review, cartItem, addToCart, removeFromCart};

    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
