import { createContext, useState, useEffect } from "react";
export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    return {};
}

const ShopContextProvider = (props) => {

    const [cartItem, setCartItems] = useState(getDefaultCart());
    const [all_product, setAll_products] = useState([]);

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
            if(cartItem[item] > 0){

                let inOffer = all_product[6];

                if(inOffer){
                    let itemInfo = all_product.find(
                        (product)=>product._id === item);
                    totalAmount += itemInfo.new_price * cartItem[item]
                }else{
                    let itemInfo = all_product.find(
                        (product)=>product._id === item);
                    totalAmount += itemInfo.current_price * cartItem[item]
                }
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = ()=>{
        let totalItem = 0;

        for(const item in cartItem){
            if(cartItem[item] > 0){
                totalItem += cartItem[item]
            }
        }
        return totalItem;
    }
    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItem, addToCart, removeFromCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
