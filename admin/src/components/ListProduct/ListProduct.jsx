import React, { useContext, useEffect } from 'react'
import './ListProduct.css'
import { AdminContext } from '../../context/AdminContext'

const ListProduct = () => {

  const {fetchInfo, allproducts, remove_product} = useContext(AdminContext);

  useEffect(()=>{
    fetchInfo();
  },[])

  return (
    <div className='container-geral'>
      <div className="list-product">
        <h1>Todos os Produtos</h1>
        <div className="listproduct-format-main">
          <p>Produtos</p>
          <p>Título</p>
          <p>Preço</p>
          <p>Preço Oferta</p>
          <p>Categoria</p>
          <p>Unid.</p>
          <p>Remover</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproducts.map((product)=>(
            <React.Fragment key={product._id}>
              <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt="" className="listproduct-product-img" />
                <p>{product.name}</p>
                <p>R${product.inOffer ? (Number(product.old_price).toFixed(2)) : (Number(product.current_price).toFixed(2))}</p>
                <p>
                  {product.inOffer ? (
                    `R$${Number(product.new_price).toFixed(2)}`
                  ) : (
                    '-'
                  )}
                </p>
                <p>{product.category}</p>
                <p>{product.unit}</p>
                <i className="fa-solid fa-square-xmark" onClick={() => remove_product(product._id)}></i>
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListProduct