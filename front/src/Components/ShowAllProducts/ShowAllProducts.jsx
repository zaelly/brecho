import './ShowAllProducts.css'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import Item from '../Item/Item'
import { useState } from 'react'
import { useEffect } from 'react'

const ShowAllProducts = () => {
    const [all_product, setAll_products] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
            .then((response)=>response.json())
            .then((data)=>setAll_products(data))

    }, [])

  return (
    <div className='showAll-products-container'>
       <div className="banner">
        <div className="banner-right">
          <h1>ACHADINHOS REVERTO</h1>
          <button>Aproveite!</button>
        </div>
        <div className='banner-left'>
          <img className='shopCategory-banner' alt="" />
        </div>
      </div>
        <div className="shopcategory-indexSort">
            <p>
            Mostrando <span>{all_product.length}</span> de <span>{all_product.length}</span> produtos
            </p>
        </div>
         <div className="itens">
          {all_product.map((item, i)=>{
              return <Item key={i} 
              id={item._id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price}
              old_price={item.old_price}
              category={item.category} />
            }
          )}
        </div>
        <div className="shopcategory-loadmore">
            Descubra mais
        </div>
    </div>
  )
}

export default ShowAllProducts