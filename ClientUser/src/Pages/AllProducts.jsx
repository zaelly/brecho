import './css/AllProducts.css'
import { useContext} from 'react'
import './css/Category.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'


const AllProducts = () => {

  const {all_product} = useContext(ShopContext);

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
        Mostrando <span>{all_product?.length || 0}</span> produtos
      </p>
    </div>

    <div className="shopcategory-products">
      <div className="itens">
        {all_product.map((item, i) => (
          <Item
              key={i}
              id={item._id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              current_price={item.current_price}
              old_price={item.old_price}
            />
        ))}
      </div>
    </div>
  </div>
);
};

export default AllProducts