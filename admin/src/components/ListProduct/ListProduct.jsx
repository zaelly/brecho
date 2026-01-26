import React, { useContext, useEffect } from 'react'
import './ListProduct.css'
import { AdminContext } from '../../context/AdminContext'
import { Link } from 'react-router-dom';

const ListProduct = () => {

  const {fetchInfo, allproducts, remove_product, url} = useContext(AdminContext);

  useEffect(()=>{
    fetchInfo();
  },[])

  return (
   <div className="container-geral">
    <div className="list-product">
      <h1>Todos os Produtos</h1>

      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Título</th>
              <th>Preço</th>
              <th>Preço Oferta</th>
              <th>Categoria</th>
              <th>Unid.</th>
              <th>Editar</th>
              <th>Remover</th>
            </tr>
          </thead>

          <tbody>
            {allproducts.map((product) => (
              <tr key={product._id}>
                <td data-label="Produto">
                  <img
                    src={`${url}/images/${product.thumbnail}`}
                    alt={product.name}
                    className="listproduct-product-img"
                  />
                </td>

                <td data-label="Título">{product.name}</td>

                <td data-label="Preço">
                  R$
                  {product.inOffer
                    ? Number(product.old_price).toFixed(2)
                    : Number(product.current_price).toFixed(2)}
                </td>

                <td data-label="Preço Oferta">
                  {product.inOffer
                    ? `R$${Number(product.new_price).toFixed(2)}`
                    : "-"}
                </td>

                <td data-label="Categoria">{product.category}</td>

                <td data-label="Unid.">{product.unit}</td>

                <td data-label="Editar">
                  <Link to={`/admin/editproduto/${product._id}`} className="action edit">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                </td>

                <td data-label="Remover">
                  <button
                    className="action delete"
                    onClick={() => remove_product(product._id)}
                  >
                    <i className="fa-solid fa-delete-left"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default ListProduct