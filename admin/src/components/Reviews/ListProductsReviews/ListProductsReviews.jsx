import { useContext } from "react";
import "./ListReview.css"
import React, { useEffect, useState } from 'react'
import { AdminContext } from "../../../context/AdminContext";

const ListProductsReviews = () => {
  const [allproducts, setAllProducts] = useState([]);
  const {url} = useContext(AdminContext)

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await fetch(`${url}/api/products/seller/allproducts`, {
        headers: {
          'auth-token-seller': localStorage.getItem('auth-token')
        }
      });
      const data = await response.json();
      setAllProducts(data);
      console.log(data);
    };
    fetchInfo();
  }, []);

  return (
    <div className="container-geral">
      <div className="listProductReviews">
        <div className="productReview">
              <h3>Avaliações dos Produtos</h3>
              <div className="allproducts">
                {allproducts.reviews && allproducts.reviews.length === 0 && <p>Nenhum produto encontrado.</p>}
                  {allproducts.filter(product => product.reviews && product.reviews.length > 0).map((product) => (
                    <div className="productView" key={product._id} onClick={() => console.log(product.reviews)}>
                      <div className="productReview-format-main">
                          <img src={`${url}/images/${product.thumbnail}`} alt={product.name} />
                      <div className="overlay"></div>
                      </div>
                      <div className="productReview-format-text">
                        <p className="title">{product.name}</p>
                        <p className="reviewText">
                            {product.reviews && product.reviews.length > 0
                            ? `${product.reviews.length} ${product.reviews.length === 1 ? 'Avaliação' : 'Avaliações'}`
                            : "Sem avaliações"}
                        </p>
                      </div>
                  </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default ListProductsReviews;
