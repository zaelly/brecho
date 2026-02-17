import './css/Favorits.css'
import { useContext, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { Link } from 'react-router-dom'

const Favorits = () => {
  const { favorites, removeFavorite, all_product, fetchFavorites } = useContext(ShopContext)

  useEffect(() => {
    fetchFavorites()
  }, [])

  // pegar os produtos que estao nos favoritos
  const favProducts = all_product.filter(p => favorites.includes(p._id))

  return (
    <div className="favorits-container">
      <h1><i className="fa-solid fa-heart" style={{color:'red'}}></i> Meus Favoritos</h1>

      {favProducts.length === 0 ? (
        <div className="favorits-empty">
          <i className="fa-regular fa-heart"></i>
          <p>Voce ainda nao tem produtos favoritos</p>
          <Link to="/allProducts">Ver todos os produtos</Link>
        </div>
      ) : (
        <div className="favorits-list">
          {favProducts.map((product) => {
            const price = product.inOffer ? product.new_price : product.current_price
            return (
              <div className="favorit-card" key={product._id}>
                <button
                  className="favorit-remove"
                  onClick={() => removeFavorite(product._id)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <Link to={`/products/${product._id}`}>
                  <img src={product.thumbnail} alt={product.name} />
                </Link>
                <div className="favorit-card-info">
                  <p>{product.name}</p>
                  <p className="favorit-price">R${Number(price).toFixed(2).replace(".", ",")}</p>
                  {product.inOffer && (
                    <p style={{textDecoration:'line-through', color:'#999', fontSize:'12px'}}>
                      R${Number(product.old_price).toFixed(2).replace(".", ",")}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Favorits
