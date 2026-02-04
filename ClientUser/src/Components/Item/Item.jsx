import { Link } from 'react-router-dom'
import { getThumbnailUrl } from '../../utils/cloudinary'
import './Item.css'

const Item = (props) => {

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Gerar URL otimizada do Cloudinary
  const getImageUrl = () => {
    if (props.image?.includes('cloudinary.com')) {
      return getThumbnailUrl(props.image, 300);
    }
    return props.thumbnail || props.image;
  };

  return (
    <div className="item">
        <Link to={`/products/${props.id}`}>
          <img onClick={handleScrollToTop} src={getImageUrl()} alt={props.name} loading="lazy" />
        </Link>
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
  )
}

export default Item