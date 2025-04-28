import './NewColletions.css'
import new_colletions from '../Assets/new_colletions'
import Item from '../Item/Item'

const NewColletions = () => {
  return (
    <div className='new-colletions'>
        <h1>NOVAS COLEÇÕES</h1>
        <hr />
        <div className="colletions">
            {new_colletions.map((item, i)=>{
                  return <Item key={i} 
                  id={item.id} 
                  name={item.name} 
                  image={item.image} 
                  new_price={item.new_price}
                  old_price={item.old_price}
              />
            })}
        </div>
    </div>
  )
}

export default NewColletions