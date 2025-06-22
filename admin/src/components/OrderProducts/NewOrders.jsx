// recebe os novos pedidos feitos pelos users para o seller
import {useState, useEffect} from 'react'
import './NewOrders.css'
import {Link} from 'react-router-dom'

const NewOrders = () => {
     const [allproducts, setAllProducts] = useState([]);
   
     const fetchOrder = async ()=>{
        const response = await fetch(
          'http://localhost:4000/api/order/seller/allorders', {
         headers: {
           'auth-token-seller': localStorage.getItem('auth-token')
         }
       })
       const data = await response.json();
          
       setAllProducts(data);
     }
   
   
     useEffect(()=>{
       fetchOrder();
     },[])
   
  return (
    <div className="newOrderproduct">
        {/* mostra o produto e 
        todos os detalhes do produto
        se foi e se tem:
        - pago
        - endereço 
        - tamanho
        - status de pacote
        - status de produto*/}
        <h1>Pedidos</h1>
        <div className="listproduct-format-main-order">
            <p>Pedido</p>
            <p>Título</p>
            <p>Tamanho</p>
            <p>Qtd.</p>
            <p>Situação</p>
            <p>View</p>
        </div>
        <div className="listNewOrders">
            <hr />
            {allproducts.map((order)=>(
                <div className="productOrder listproduct-format-order">
                    <img src={order.image} alt="" className="listproduct-product-img" />
                    <p>{order.name}</p>
                    <p>{order.size}</p>
                    <p>{order.unit}</p>
                    <p className='status'>{order.statusOrder}</p>
                    <Link to={'/admin/viewOrder'}>
                        <button className='viewBtn'>
                            <i class="fa-solid fa-folder-open"></i>
                        </button>
                    </Link>
                </div>
            ))}
            <hr />
        </div>
    </div>
  )
}

export default NewOrders