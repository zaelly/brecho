import './css/AllProducts.css'
import { useContext, useEffect, useState } from 'react'
import './css/Category.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'


const ShopOffers = (props) => {

  const {all_product} = useContext(ShopContext);

  const [product, setProduct] = useState([]);

  useEffect(()=>{
    if(Array.isArray(all_product)){
      const filtered = all_product.filter(
        (product) => product.inOffer === props.inOffer
      );
      setProduct(filtered);
    }
  },[all_product, props.inOffer]);

  return (
    <div className='all-products'>
    {/* Banner opcional */}
    <div className="banner">
      <div className="banner-right">
        {/* Pode colocar imagem ou texto aqui */}
      </div>
    </div>

    <div className="shopcategory-indexSort">
    <p>
        Mostrando <span>{product.length}</span> produto(s).
    </p>
    </div>

    <div className="shopcategory-products">
      <div className="itens">
        {product.map((item, i) => (
          <Item
            key={i}
            id={item._id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  </div>
);
};

export default ShopOffers