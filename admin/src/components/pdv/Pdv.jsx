import { useState, useEffect, useContext, useRef } from 'react';
import './Pdv.css';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pdv = () => {
  const { allproducts, url } = useContext(AdminContext);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [pixData, setPixData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixStatus, setPixStatus] = useState(null);
  const pollRef = useRef(null);

  const filteredProducts = allproducts.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.marca?.toLowerCase().includes(search.toLowerCase())
  );

  const getPrice = (product) =>
    product.inOffer ? product.new_price : product.current_price;

  const addToCart = (product) => {
    const size = selectedSizes[product._id];
    if (!size) {
      toast.warn('Selecione um tamanho antes de adicionar.');
      return;
    }

    const existing = cart.find(i => i._id === product._id && i.size === size);
    if (existing) {
      if (existing.quantity >= (product.unit || 99)) {
        toast.warn('Quantidade máxima atingida para este produto.');
        return;
      }
      setCart(prev =>
        prev.map(i =>
          i._id === product._id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart(prev => [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          thumbnail: product.thumbnail,
          price: getPrice(product),
          size,
          quantity: 1,
          unit: product.unit,
        },
      ]);
    }
    toast.success(`${product.name} adicionado!`);
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(i => !(i._id === id && i.size === size)));
  };

  const updateQty = (id, size, delta) => {
    setCart(prev =>
      prev.map(i => {
        if (i._id === id && i.size === size) {
          const newQty = i.quantity + delta;
          if (newQty < 1) return i;
          if (newQty > (i.unit || 99)) {
            toast.warn('Quantidade máxima atingida.');
            return i;
          }
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const clearCart = () => {
    setCart([]);
    setSelectedSizes({});
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  // Criar cobrança PIX via AbacatePay
  const createPix = async () => {
    if (cart.length === 0) {
      toast.warn('Adicione produtos ao carrinho primeiro.');
      return;
    }

    setLoadingPix(true);
    setPixData(null);
    setPixStatus(null);

    try {
      const itemsDesc = cart.map(i => `${i.name}(${i.size})x${i.quantity}`).join(', ');
      const description = itemsDesc.substring(0, 37);

      const response = await fetch(`${url}/api/payment/pix/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token-seller': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({
          amount: total,
          description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPixData(data.data);
        setShowModal(true);
        startPolling(data.data.id);
      } else {
        toast.error(data.message || 'Erro ao gerar PIX.');
      }
    } catch (err) {
      console.error('Erro ao criar PIX:', err);
      toast.error('Erro de conexão ao gerar PIX.');
    } finally {
      setLoadingPix(false);
    }
  };

  // Verificar status do PIX periodicamente
  const startPolling = (pixId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${url}/api/payment/pix/check/${pixId}`, {
          headers: {
            'auth-token-seller': localStorage.getItem('auth-token'),
          },
        });
        const data = await response.json();
        if (data.success) {
          setPixStatus(data.data.status);
          if (data.data.status === 'PAID') {
            clearInterval(pollRef.current);
            toast.success('Pagamento confirmado!');
          } else if (['EXPIRED', 'CANCELLED'].includes(data.data.status)) {
            clearInterval(pollRef.current);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar PIX:', err);
      }
    }, 5000);
  };

  const closeModal = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setShowModal(false);
    setPixData(null);
    setPixStatus(null);
    if (pixStatus === 'PAID') {
      clearCart();
    }
  };

  const copyBrCode = () => {
    if (pixData?.brCode) {
      navigator.clipboard.writeText(pixData.brCode);
      toast.success('Código PIX copiado!');
    }
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const statusLabel = {
    PENDING: { text: 'Aguardando pagamento...', cls: 'status-pending' },
    PAID: { text: 'Pago! ✓', cls: 'status-paid' },
    EXPIRED: { text: 'PIX expirado', cls: 'status-expired' },
    CANCELLED: { text: 'PIX cancelado', cls: 'status-expired' },
  };

  return (
    <div className="pdv-container">
      <h2 className="pdv-title">
        <i className="fa-solid fa-cash-register"></i> Ponto de Venda (PDV)
      </h2>

      <div className="pdv-layout">
        {/* Painel de Produtos */}
        <div className="pdv-products-panel">
          <div className="pdv-search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar produto por nome, categoria ou marca..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="pdv-products-grid">
            {filteredProducts.length === 0 ? (
              <p className="pdv-empty">Nenhum produto encontrado.</p>
            ) : (
              filteredProducts.map(product => (
                <div key={product._id} className="pdv-product-card">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="pdv-product-img"
                  />
                  <div className="pdv-product-info">
                    <p className="pdv-product-name">{product.name}</p>
                    <p className="pdv-product-price">
                      R$ {getPrice(product)?.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="pdv-product-stock">
                      Estoque: {product.unit || 0}
                    </p>

                    <div className="pdv-size-select">
                      {product.size?.map(s => (
                        <button
                          key={s}
                          className={`pdv-size-btn ${selectedSizes[product._id] === s ? 'active' : ''}`}
                          onClick={() => handleSizeSelect(product._id, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pdv-add-btn"
                      onClick={() => addToCart(product)}
                      disabled={!product.unit || product.unit <= 0}
                    >
                      <i className="fa-solid fa-plus"></i>
                      {!product.unit || product.unit <= 0 ? 'Sem estoque' : 'Adicionar'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Painel do Carrinho */}
        <div className="pdv-cart-panel">
          <div className="pdv-cart-header">
            <h3><i className="fa-solid fa-receipt"></i> Venda Atual</h3>
            {cart.length > 0 && (
              <button className="pdv-clear-btn" onClick={clearCart}>
                <i className="fa-solid fa-trash"></i> Limpar
              </button>
            )}
          </div>

          <div className="pdv-cart-items">
            {cart.length === 0 ? (
              <div className="pdv-cart-empty">
                <i className="fa-solid fa-cart-shopping"></i>
                <p>Nenhum item adicionado</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item._id}-${item.size}-${idx}`} className="pdv-cart-item">
                  <img src={item.thumbnail} alt={item.name} className="pdv-cart-img" />
                  <div className="pdv-cart-item-info">
                    <p className="pdv-cart-item-name">{item.name}</p>
                    <p className="pdv-cart-item-size">Tam: {item.size}</p>
                    <p className="pdv-cart-item-price">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="pdv-cart-qty">
                    <button onClick={() => updateQty(item._id, item.size, -1)}>
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.size, 1)}>
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <button
                    className="pdv-remove-btn"
                    onClick={() => removeFromCart(item._id, item.size)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pdv-cart-footer">
            <div className="pdv-total">
              <span>Total:</span>
              <span className="pdv-total-value">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              className="pdv-pix-btn"
              onClick={createPix}
              disabled={cart.length === 0 || loadingPix}
            >
              {loadingPix ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Gerando PIX...
                </>
              ) : (
                <>
                  <i className="fa-brands fa-pix"></i> Cobrar via PIX
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal PIX */}
      {showModal && pixData && (
        <div className="pdv-modal-overlay" onClick={closeModal}>
          <div className="pdv-modal" onClick={e => e.stopPropagation()}>
            <button className="pdv-modal-close" onClick={closeModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="pdv-modal-title">
              <i className="fa-brands fa-pix"></i> Cobrança PIX
            </h3>

            <p className="pdv-modal-amount">
              R$ {total.toFixed(2).replace('.', ',')}
            </p>

            {pixStatus && statusLabel[pixStatus] && (
              <div className={`pdv-status ${statusLabel[pixStatus].cls}`}>
                {statusLabel[pixStatus].text}
              </div>
            )}

            {pixData.brCodeBase64 && (
              <div className="pdv-qr-wrapper">
                <img
                  src={pixData.brCodeBase64}
                  alt="QR Code PIX"
                  className="pdv-qr-img"
                />
              </div>
            )}

            <div className="pdv-brcode-box">
              <p className="pdv-brcode-label">Copia e Cola:</p>
              <div className="pdv-brcode-row">
                <input
                  type="text"
                  readOnly
                  value={pixData.brCode || ''}
                  className="pdv-brcode-input"
                />
                <button className="pdv-copy-btn" onClick={copyBrCode}>
                  <i className="fa-solid fa-copy"></i> Copiar
                </button>
              </div>
            </div>

            <p className="pdv-modal-hint">
              <i className="fa-solid fa-circle-info"></i>
              O status é verificado automaticamente a cada 5 segundos.
            </p>

            {pixStatus === 'PAID' && (
              <button className="pdv-confirm-btn" onClick={closeModal}>
                <i className="fa-solid fa-check"></i> Venda Concluída
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pdv;
