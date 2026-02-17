import './css/MeusPedidos.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MeusPedidos = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${url}/api/order/order/myorders`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        },
      })
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    if (!status) return 'status-processando'
    const map = {
      'Processando': 'status-processando',
      'Em andamento': 'status-em-andamento',
      'Sendo preparado': 'status-sendo-preparado',
      'Enviado': 'status-enviado',
      'Finalizado': 'status-finalizado',
      'Cancelado': 'status-cancelado',
    }
    return map[status] || 'status-processando'
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="pedidos-container">
        <h1>Meus Pedidos</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="pedidos-container">
      <h1><i className="fa-solid fa-bag-shopping"></i> Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="pedidos-empty">
          <i className="fa-solid fa-box-open"></i>
          <p>Voce ainda nao tem pedidos</p>
          <Link to="/allProducts">Comece a comprar!</Link>
        </div>
      ) : (
        orders.map((order) => (
          <div className="pedido-card" key={order._id}>
            <div className="pedido-header">
              <h3>Pedido #{order.orderId}</h3>
              <span className={`pedido-status ${getStatusClass(order.statusOrder)}`}>
                {order.statusOrder || 'Processando'}
              </span>
            </div>

            <div className="pedido-items">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div className="pedido-item" key={index}>
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="pedido-item-info">
                      <p>{item.name}</p>
                      <span>Tam: {item.size} | Qtd: {item.quantity}</span>
                    </div>
                    <p>R${Number(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                  </div>
                ))
              ) : (
                <div className="pedido-item">
                  <img src={order.image} alt={order.name} />
                  <div className="pedido-item-info">
                    <p>{order.name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pedido-footer">
              <p>{formatDate(order.dateOrder)}</p>
              <p className="pedido-total">
                Total: R${Number(order.totalAmount || order.toReceive || 0).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MeusPedidos
