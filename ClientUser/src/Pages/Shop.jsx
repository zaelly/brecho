import { useEffect, useState } from "react"
import Hero from "../Components/Hero/Hero"
import NewColletions from "../Components/newColletions/NewColletions"
import Offers from "../Components/Offers/Offers"
import Popular from "../Components/Popular/Popular"

const Shop = () => {

  const [hasWomanProducts, setHasWomanProducts] = useState(false);
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const womanProducts = ()=> {
    fetch(`${url}/api/products/popularinwomen`)
    .then((resp) => resp.json())
    .then((data)=>{
      console.log(data)
      if(data.length > 0 ){
        setHasWomanProducts(true);
      }
    })
  }

  useEffect(()=>{
    womanProducts();
  },[])

  return (
    <div>
      <Hero/>
      {hasWomanProducts && (
        <Popular/>
      )}
      <Offers/>
      <NewColletions/>
    </div>
  )
}

export default Shop