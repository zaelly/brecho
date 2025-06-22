import { useContext, useMemo } from 'react'
import './css/Category.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'

const Category = (props) => {

  const {all_product} = useContext(ShopContext);

  const filteredProducts = useMemo(()=>{
    if(!all_product || all_product.length === 0) return[]
    return all_product.filter((product)=>{
      if(props.category === 'Imperdiveis'){
        return product.new_price > 0;
      }
      return product.category === props.category;
    })
  },[all_product, props.category]);

  return (
    <div className="category">
      <div className="banner">
          <div className="banner-right">
            {props.category === 'Imperdiveis' ? (
              <>
                <h1>Produtos Imperdíveis</h1>
                <p>Com <span>DESCONTOS</span> imperdíveis <br/>aproveite <span>AGORA MESMO!</span></p>
              </>
            ) : (
              <>
                 <h1>Moda {props.category === 'kid' ? 'Kids' : props.category}</h1>
                <p>Venha conhecer e <span>aproveitar!</span></p>
              </>
            )}           
              <button>Confira</button>
          </div>
        <div className='banner-left'>
          <img src={props.banner} className='shopCategory-banner'/>
        </div>
      </div>
      <div className="shopcategory-indexSort">
        <p>
          Mostrando <span>{filteredProducts.length}</span> de {" "}<span>{all_product?.length || 0}</span> produtos
        </p>
      </div>
      <div className="shopcategory-products">
        <div className="itens">
          {filteredProducts.map((item) => (
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
      {all_product.length > 10 && (
        <div className="shopcategory-loadmore"> Descubra mais! </div>
      )}
    </div>
  )
}

export default Category