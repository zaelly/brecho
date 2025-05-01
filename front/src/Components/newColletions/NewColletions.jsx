import './NewColletions.css'
import Item from '../Item/Item'
import { useState, useEffect } from 'react'

const NewColletions = () => {

  const [new_colletions, setNew_collection] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:4000/newcollections')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data))
  },[])
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