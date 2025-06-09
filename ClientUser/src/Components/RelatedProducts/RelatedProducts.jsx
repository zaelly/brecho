import './RelatedProducts.css'
import data_product from '../Assets/data'
import Item from '../Item/Item'

const RelatedProucts = () => {
  return (
    <div className='RelatedProucts'>
        <h1>Produtos Relacionados</h1>
        <hr />
        <div className="relatedProducts-item">
            {data_product.map((item, i)=>{
                return <Item key={i} 
                id={item._id} 
                name={item.name} 
                image={item.image} 
                current_price={item.current_price}
                new_price={item.new_price}
                old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default RelatedProucts