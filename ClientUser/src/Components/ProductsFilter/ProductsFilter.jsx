import './ProductsFilter.css'
import Item from '../Item/Item'
import { useLocation } from 'react-router-dom';

const ProductsFilter = () => {
  const location = useLocation();
  const products = location.state?.result || [];

  return (
    <div className="filterList">          
      <p className='result'><span>{products.length}</span> Resultado!</p>
      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className='products'>
          {products.map((item, i)=>{ 
            return ( 
              <Item key={i} 
                  id={item._id} 
                  name={item.name} 
                  image={item.image} 
                  current_price={item.current_price}
                  new_price={item.new_price}
                  old_price={item.old_price}
              />
            )
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsFilter;
