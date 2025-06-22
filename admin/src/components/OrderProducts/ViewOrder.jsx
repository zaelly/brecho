import './ViewOrder.css'
import { useEffect, useState } from 'react';

const ViewOrder = () => {
    const [productDetails, setProductDetails] = useState({
        name:"",
        image:"",
        unit: "",
        size: "",
        id: ""
    })
    const [btn_order, setBtn_order] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetails, setOrder] = useState({
        name: '',
        cpf: '',
        adress: '',
        dateOrder: '',
        paymentForm: '',
        statusOrder: '',
        toReceive: '',
        orderId: ''
    });

    const save_order = async () => {
        setIsLoading(true); // Start loading

        await fetch('http://localhost:4000/api/order/updateOrder', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token-seller': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({
            orderId: orderDetails.orderId,
            fieldsToUpdate: {
                statusOrder: orderDetails.statusOrder
            }
        }),
        })
        .then((resp) => resp.json())
        .then((data) => {
            data.success ? successHandle() : alert('Alteração de pedido falhou!');
        })
        .finally(() => setIsLoading(false)); // Stop loading
    };

    const fetchInfo = async ()=>{
        const response = await fetch('http://localhost:4000/api/products/order/allorders', {
        headers: {
        'auth-token-seller': localStorage.getItem('auth-token')
        }
    })
    const data = await response.json();
    
    setAllProducts(data);
    }

    const successHandle = () => {
        alert('Pedido Editado!');
        fetchOrder();
    };

    const handleChange = (e) => {
        setOrder({ ...orderDetails, [e.target.name]: e.target.value });
    };

    const fetchOrder = async () => {
        const res = await fetch("http://localhost:4000/api/order/getOrder", {
        method: "GET",
        headers: {
            'auth-token-seller': localStorage.getItem("auth-token"),
        },
        });
        const data = await res.json();
        if (data.success) {
            const order = data.order;
            setOrder({
                name: order.name,
                cpf: order.cpf,
                adress: order.adress || '',
                orderId: order._id,
                paymentForm: order.paymentForm,
                dateOrder: order.dateOrder,
                statusOrder: order.statusOrder,
                toReceive: order.toReceive
            });
        } else {
            alert(data.errors || "Erro ao buscar alterar pedido");
        }
    };
  
    useEffect(()=>{
       fetchInfo();
        fetchOrder();
        const sellerId = localStorage.getItem('seller-id');
        if (sellerId) {
            setProductDetails(prev => ({ ...prev, sellerId }));
        }
    },[])

    const getPaymentMethodName = (code) => {
        const map = {
            1: "Dinheiro",
            2: "Cartão",
            3: "PIX"
        };
        return map[code] || "Nenhum";
    };

  return (
    <div className='ViewOrder'>
        <div className="item-field-infos">
            <h5>Dados do Produto</h5>
            <hr/>
            <div className="item">
                <div className="infos">
                    <div className="orderListInfos">
                        <p>Nome / Título:</p>
                        <span>{productDetails.name}</span>
                    </div>
                    <div className="orderListInfos">
                        <p>Quantidade:</p>
                        <span>{productDetails.unit}</span>
                    </div>
                    <div className="orderListInfos">
                       <p>Tamanho:</p>  
                       <span>{productDetails.size}</span>
                    </div>
                    <div className="orderListInfos">
                        <p>Id produto:</p> 
                        <span>{productDetails.id}</span> 
                    </div>
                </div>
                <div className="img-product">
                    <img src={productDetails.image} alt="" className='imgView-content' />
                </div>
            </div>
        </div>
        <div className="item-field-infos">
            <h5>Dados do Destinatário</h5>
            <hr/>
            <div className="infos">
                <div className='orderListInfos'>
                    <p>Nome do Destinatário:</p>
                    <span>{orderDetails.name}</span>
                </div>
                <div className='orderListInfos'>
                    <p>Endereço de Entrega:</p>
                    <span>{orderDetails.adress}</span>
                </div>
                <div className='orderListInfos'>
                    <p>CPF:</p>
                    <span>{orderDetails.cpf}</span>
                </div>
            </div>
        </div>
        <div className="orderDetails">
            <h5>Detalhes do Pedido</h5>
            <hr/>
            <div className="infos">
                <div className='orderListInfos'>
                    <p>Data da Compra: </p>
                    <span>{orderDetails.dateOrder}</span>
                </div>
                <div className='orderListInfos'>
                    <p>Forma de Pagamento:</p>
                    <span>{getPaymentMethodName(orderDetails.paymentForm)}</span>
                </div>
                <div className='orderListInfos'>
                    <p>Valor à receber:</p>
                    <p className='warning'>Valor só será recebido após 
                        confirmação de entrega do pedido pelo cliente!</p>
                    <span>{Number(orderDetails.toReceive).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
            </div>
            <div className="status-order orderListInfos">
                <label htmlFor="status">Status do Pedido:</label>
                <select value={orderDetails.statusOrder} onChange={handleChange} name="status" className='add-product-selector'>
                    {/* caso o pedido tenha sido finalizado ou cancelado ele vai travar nessa opção */}
                    <option value="1">Processando</option>
                    <option value="2">Em andamento</option>
                    <option value="3">Sendo preparado</option>
                    <option value="4">Enviado</option>
                    <option value="5">Finalizado</option>
                </select>
            </div>
        </div>
        <div className="btn-order">
            <button
                onClick={() => {
                    if (btn_order && !isLoading) {
                    save_order();
                    }
                    setBtn_order(!btn_order);
                }}
                disabled={isLoading} // Disable the button while saving
                >
                {isLoading ? 'Salvando...' : btn_order ? 'Salvar' : 'Editar'}
            </button>
        </div>
    </div>
  )
}

export default ViewOrder