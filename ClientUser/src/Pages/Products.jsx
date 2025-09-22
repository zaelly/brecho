import { useParams } from 'react-router-dom';
import './css/products.css'
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Products = () => {
  const { all_product } = useContext(ShopContext);
  const { productId, reviewId } = useParams();
  const product = all_product.find((e) =>e._id === productId);
  const review = product?.review?.find((e)=> e._id === reviewId)

  if (!product) {
    return <div className='looping-products'>Produto não encontrado!</div>;
  }

  return (
    <div className="products">
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox product={product} review={review}/>
      <RelatedProducts />
    </div>
  );
};

export default Products;
