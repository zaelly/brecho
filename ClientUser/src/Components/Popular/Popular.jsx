import './Popular.css'
import Item from '../Item/Item'
import { useState } from 'react'
import { useEffect } from 'react';

const Popular = () => {

  const [popularProducts, setData_product] = useState([]);
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  
  useEffect(()=>{
    fetch(`${url}/api/products/popularinwomen`)
    .then((response)=>response.json())
    .then((data)=>setData_product(data));
    console.log(popularProducts)
  },[])

  return (
    <div className='popular'>
        <h1>PARA MULHERES</h1>
        <hr />
        <div className="popular-item">
            {popularProducts.map((item, i)=>{ 
                return <Item key={i} 
                    id={item._id} 
                    name={item.name} 
                    image={item.image} 
                    current_price={item.current_price}
                    new_price={item.new_price}
                    old_price={item.old_price}
                />
            })}
        </div>
    </div>
  )
}

export default Popular