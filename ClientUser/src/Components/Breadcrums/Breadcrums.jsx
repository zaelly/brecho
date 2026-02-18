import { Link } from 'react-router';
import  './breadcrums.css'

const Breadcrums = (props) => {
    const {product} = props;
  return (
    <div className='breadcrum'>
        Reverto <i className="fa-solid fa-arrow-right"></i> <Link to={"/"} style={{"textDecoration": "none"}}>Home</Link> 
        <i className="fa-solid fa-arrow-right"></i> <Link to={`/${product.category}`} style={{"textDecoration": "none"}}>{product.category}</Link> 
        <i className="fa-solid fa-arrow-right"></i> {product.name}
    </div>
  )
}

export default Breadcrums