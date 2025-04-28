import  './breadcrums.css'

const Breadcrums = (props) => {
    const {product} = props;
  return (
    <div className='breadcrum'>
        HOME <i className="fa-solid fa-arrow-right"></i> REVERTO 
        <i className="fa-solid fa-arrow-right"></i> {product.category} 
        <i className="fa-solid fa-arrow-right"></i> {product.name}
    </div>
  )
}

export default Breadcrums