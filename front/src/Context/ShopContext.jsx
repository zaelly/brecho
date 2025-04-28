import React, { createContext, useEffect, useState } from "react";
import all_products from "../Components/Assets/all_products";
export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart = {};

    all_products.forEach((product) =>{
        cart[product.id] = 0;
    });
    return cart;
}

const ShopContextProvider = (props) => {

    const [cartItem, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        console.log('Cart atualizado:', cartItem);
    }, [cartItem]); 

       const addToCart = (itemId) => {
        // swal({
        //     title: "Atenção",
        //     text: "Produto adicionado com sucesso!",
        //     icon: "success",
        //     timer: 1500,
        //     button: false,
        // }).then(() => {
            setCartItems((prev) => {
                const updatedCart = {
                    ...prev,
                    [itemId]: (prev[itemId] || 0) + 1,  
                };
                return updatedCart;
            });
        // })
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = {
                ...prev,
                [itemId]: prev[itemId] - 1,  
            };
            return updatedCart;
        });
    };

    const getTotalCartAmount = () =>{
        let totalAmount = 0;

        for(const item in cartItem){
            if(cartItem[item] > 0){
                let itemInfo = all_products.find(
                    (product)=>product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItem[item]
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
    const contextValue = {getTotalCartItems, getTotalCartAmount, all_products, cartItem, addToCart, removeFromCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
