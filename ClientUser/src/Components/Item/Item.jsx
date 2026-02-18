import { Link } from 'react-router-dom'
import { getThumbnailUrl } from '../../utils/cloudinary'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import './Item.css'

const Item = (props) => {
  const { favorites, addFavorite, removeFavorite } = useContext(ShopContext)

  const isFavorite = favorites.includes(props.id)

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if(isFavorite){
      removeFavorite(props.id)
    } else {
      addFavorite(props.id)
    }
  }

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Gerar URL otimizada do Cloudinary
  const getImageUrl = () => {
    if (props.image?.includes('cloudinary.com') || props.thumbnail?.includes('cloudinary.com')) {
      const imageUrl = props.image || props.thumbnail;
      return getThumbnailUrl(imageUrl, 300);
    }
    return props.thumbnail || props.image;
  };

  return (
    <Link to={`/products/${props.id}`}>
      <div className="item">
        <div className="item-favorite-btn" onClick={handleFavorite}>
          <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}
            style={{color: isFavorite ? 'red' : '#888'}}></i>
        </div>
        <img
          onClick={handleScrollToTop}
          src={getImageUrl()}
          alt={props.name}
          loading="lazy"
        />
        <div className="informations">
          <p>{props.name}</p>
          <div className="item-prices">
            {
            props.current_price ? (
                <div className="item-price-new">
                  R${props.current_price.toFixed(2).replace(".",",")}
                </div>
            ):( <>
                <div className="item-price-new">
                  R${props.new_price.toFixed(2).replace(".",",")}
                </div>
                <div className="item-price-old">
                  R${props.old_price.toFixed(2).replace(".",",")}
                </div>
              </>)
            }
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Item
