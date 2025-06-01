// recebe os novos pedidos feitos pelos users para o seller
import {useState, useEffect} from 'react'
import './NewOrders.css'
import {Link} from 'react-router-dom'

const NewOrders = () => {
     const [allproducts, setAllProducts] = useState([]);
   
     const fetchInfo = async ()=>{
        const response = await fetch('http://localhost:4000/api/products/seller/allproducts', {
         headers: {
           'auth-token': localStorage.getItem('auth-token')
         }
       })
       const data = await response.json();
   
       console.log(data, "data");
       
       setAllProducts(data);
     }
   
   
     useEffect(()=>{
       fetchInfo();
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
        <div className="listproduct-format-main">
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
                <div className="productOrder listproduct-format">
                    <img src={order.image} alt="" className="listproduct-product-img" />
                    <p>{order.name} a</p>
                    <p>{order.size}dw</p>
                    <p>{order.unit}</p>
                    <p className='status'>{order.statusOrder}Em andamento</p>
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