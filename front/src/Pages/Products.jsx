import { useParams } from 'react-router-dom';
import './css/products.css'
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProucts from '../Components/RelatedProducts/RelatedProucts';

const Products = () => {

  const {all_products} = useContext(ShopContext)
  const {productId} = useParams();
  const product = all_products.find((e)=> e.id === Number(productId))

  return (
    <div className="products">
      <Breadcrums product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProucts/>
    </div>
  )
}

export default Products
