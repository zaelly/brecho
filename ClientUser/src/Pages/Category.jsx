import { useContext, useEffect, useState } from 'react'
import './css/Category.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'

const Category = (props) => {

  const {all_product} = useContext(ShopContext);

  const [product, setProduct] = useState([]);

  useEffect(()=>{
    if(all_product && all_product.length > 0){
      const filtered = all_product.filter(
        (product) => product.category === props.category
      );
      setProduct(filtered);
    }
  },[all_product, props.category]);

  return (
    <div className="category">
      <div className="banner">
        <div className="banner-right">
          <h1>COM 50% OFF</h1>
          <p><span>12</span>Horas <span>20</span>min restantes</p>
          <button>Confira</button>
        </div>
        <div className='banner-left'>
          <img src={props.banner} className='shopCategory-banner' alt="" />
        </div>
      </div>
      <div className="shopcategory-indexSort">
        <p>
          Mostrando <span>{product.length}</span> de <span>{all_product?.length || 0}</span> produtos
        </p>
      </div>
      <div className="shopcategory-products">
        <div className="itens">
          {all_product.map((item, i)=>{
            if(props.category === item.category){
              return <Item key={i} 
              id={item._id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price}
              current_price={item.current_price}
              old_price={item.old_price} />
            }else{
              return null;
            }
          })}
        </div>
      </div>
      <div className="shopcategory-loadmore">
        Descubra mais
      </div>
    </div>
  )
}

export default Category