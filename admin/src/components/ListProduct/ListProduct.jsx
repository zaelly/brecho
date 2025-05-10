import React, { useEffect, useState } from 'react'
import './ListProduct.css'

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async ()=>{
    const response = await fetch('http://localhost:4000/seller/allproducts', {
      headers: {
        'auth-token': localStorage.getItem('auth-token'), 
      }
    })

    const data = await response.json();
    setAllProducts(data);
  }

  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_product = async(id) => {
    await fetch('http://localhost:4000/seller/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token') // ou seu método de persistência
      },
      body: JSON.stringify({ id: id })
    });
    await fetchInfo();
  };
  
  return (
    <div className='list-product'>
      <h1>Todos os Produtos</h1>
      <div className="listproduct-format-main">
        <p>Produtos</p>
        <p>Título</p>
        <p>Preço Novo</p>
        <p>Preço Antigo</p>
        <p>Categoria</p>
        <p>Remover</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product)=>{
          return <React.Fragment key={product.id}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-img" />
              <p>{product.name}</p>
              <p>R${product.old_price}</p>
              <p>R${product.new_price}</p>
              <p>{product.category}</p>
              <i className="fa-solid fa-square-xmark" onClick={() => remove_product(product.id)}></i>
            </div>
            <hr />
          </React.Fragment>
        })}
      </div>
    </div>
  )
}

export default ListProduct