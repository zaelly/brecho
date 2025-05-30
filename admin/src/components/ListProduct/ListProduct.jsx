import React, { useEffect, useState } from 'react'
import './ListProduct.css'

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

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


  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_product = async(id) => {
    await fetch('http://localhost:4000/api/products/seller/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token') 
      },
      body: JSON.stringify({ id: _id })
    });
    await fetchInfo();
  };

  return (
    <div className='list-product'>
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
              <p>R${Number(product.old_price).toFixed(2)}</p>
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
  )
}

export default ListProduct