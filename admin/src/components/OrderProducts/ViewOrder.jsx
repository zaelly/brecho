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
        valuePayment: '',
        dateOrder: '',
        paymentForm: '',
        status: ''
    });

    const save_order = async () => {
        setIsLoading(true); // Start loading

        await fetch('http://localhost:4000/api/sellers/updateOrder', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify(profile),
        })
        .then((resp) => resp.json())
        .then((data) => {
            data.success ? successHandle() : alert('Alteração de pedido falhou!');
        })
        .finally(() => setIsLoading(false)); // Stop loading
    };

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

    const successHandle = () => {
        alert('Pedido Editado!');
        fetchOrder();
    };

    const handleChange = (e) => {
        setOrder({ ...orderDetails, [e.target.name]: e.target.value });
    };

    const fetchOrder = async () => {
        const res = await fetch("http://localhost:4000/api/sellers/getOrder", {
        method: "GET",
        headers: {
            'auth-token': localStorage.getItem("auth-token"),
        },
        });
        const data = await res.json();
        if (data.success) {
        const sellerId = data.data._id;
        setOrder(prev => ({
            ...prev,
            name: data.data.name,
            cfp: data.data.cpf,
            adress: data.data.adress || '',
            _id: data.data._id,
            valuePayment: data.data.valuePayment,
            paymentForm: data.data.paymentForm,
            dateOrder: data.data.dateOrder,
            status: data.data.status
        }));
        localStorage.setItem("seller-id", sellerId);
        } else {
        alert(data.errors || "Erro ao buscar alterar pedido");
        }
    };
  
    useEffect(()=>{
        fetchInfo();
        // relacionar esse pedido ao vendedor correto
        const sellerId = localStorage.getItem('seller-id');
        if (sellerId) {
        setProductDetails(prev => ({ ...prev, sellerId }));
        }
    },[productDetails.sellerId])
  return (
    <div className='ViewOrder'>
        <div className="item-field-infos">
            <h5>Dados do Produto</h5>
            <hr/>
            <div className="item">
                <div className="infos">
                    <p>Nome / Título:</p>
                    <p>Quantidade:</p>
                    <p>Tamanho:</p>  
                    <p>Id produto:</p>  
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
                <div>
                    <p>Nome do Destinatário:</p>
                    <span>{orderDetails.name}</span>
                </div>
                <div>
                    <p>Endereço de Entrega:</p>
                    <span>{orderDetails.adress}</span>
                </div>
                <div>
                    <p>CPF:</p>
                    <span>{orderDetails.cpf}</span>
                </div>
            </div>
        </div>
        <div className="orderDetails">
            <h5>Detalhes do Pedido</h5>
            <hr/>
            <div className="infos">
                <div>
                    <p>Data da Compra: </p>
                    <span>{orderDetails.dateOrder}</span>
                </div>
                <div>
                    <p>Forma de Pagamento:</p>
                    <span>{orderDetails.paymentForm}</span>
                </div>
                <div>
                    <p>Valor à receber:</p>
                    <p className='warning'>Valor só será recebido após 
                        confirmação de entrega do pedido pelo cliente!</p>
                    <span>{orderDetails.valuePayment}</span>
                </div>
            </div>
            
            <div className="status-order">
                <label htmlFor="status">Status do Pedido:</label>
                <select value={productDetails.status} onChange={handleChange} name="status" className='add-product-selector'>
                    {/* caso o pedido tenha sido finalizado ou cancelado ele vai travar nessa opção */}
                    <option value="1">Processando</option>
                    <option value="2">Em andamento</option>
                    <option value="3">Sendo preparado</option>
                    <option value="4">Enviado</option>
                    <option value="5">Finalizado</option>
                </select>
            </div>
        </div>
        <div className="btn">
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