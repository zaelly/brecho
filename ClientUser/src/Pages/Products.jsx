import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './css/products.css';
import { ShopContext } from '../Context/ShopContext';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Products = ({ openChat }) => {
  const { all_product } = useContext(ShopContext);
  const { productId, reviewId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const product = all_product.find((e) => e._id === productId);
  const review = product?.review?.find((e) => e._id === reviewId);

  if (!product) {
    return <div className='looping-products'>Produto não encontrado!</div>;
  }

  return (
    <div className="products">
      <div className='container_product'>
        <Breadcrums product={product} />
        {/* Passa o openChat para o botão do ProductDisplay */}
        <ProductDisplay product={product} openChat={openChat} />
        <DescriptionBox product={product} review={review} />
        <RelatedProducts />
      </div>
    </div>
  );
};


export default Products;
