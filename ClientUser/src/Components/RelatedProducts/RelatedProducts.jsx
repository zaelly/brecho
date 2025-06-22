import './RelatedProducts.css'
import  { ShopContext }  from '../../Context/ShopContext'
import Item from '../Item/Item'
import { useContext} from 'react'

const RelatedProucts = () => {
 const {all_product} = useContext(ShopContext);
 
  return (
    <div className='RelatedProucts'>
        <h1>Produtos Relacionados</h1>
        <hr />
        <div className="relatedProducts-item">
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
  )
}

export default RelatedProucts