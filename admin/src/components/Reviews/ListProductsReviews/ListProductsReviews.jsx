import { useContext } from "react";
import "./ListReview.css"
import React, { useEffect } from 'react'
import { AdminContext } from "../../../context/AdminContext";

const ListProductsReviews = () => {
  const { fetchInfo, allproducts } = useContext(AdminContext);
  useEffect(() => {
    fetchInfo();
  }, []);

  const productsWithReviews = allproducts.filter(
    product => product.reviews && product.reviews.length > 0
  );

  return (
    <div className="container-geral">
      <div className="listProductReviews">
        <div className="productReview">
          <h3>Avaliações dos Produtos</h3>

          <div className="allproducts">

            {productsWithReviews.length === 0 && (
              <p>Nenhum produto com avaliações.</p>
            )}

            {productsWithReviews.map((product) => (
              <div
                className="productView"
                key={product._id}
                onClick={() => console.log(product.reviews)}
              >
                <div className="productReview-format-main">
                  <img src={product.thumbnail} alt={product.name} />
                  <div className="overlay"></div>
                </div>

                <div className="productReview-format-text">
                  <p className="title">{product.name}</p>

                  <p className="reviewText">
                    {product.reviews.length}{" "}
                    {product.reviews.length === 1
                      ? "Avaliação"
                      : "Avaliações"}
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
