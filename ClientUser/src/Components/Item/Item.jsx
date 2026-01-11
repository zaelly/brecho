import { Link } from 'react-router-dom'
import './Item.css'

const Item = (props) => {

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="item">
        <Link to={`/products/${props.id}`}>
          <img onClick={handleScrollToTop} src={props.thumbnail} alt={props.name} />
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