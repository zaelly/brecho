import Sidebar from '../../components/sidebar/Sidebar'
import './Admin.css'
import {Routes, Route} from 'react-router-dom'
import AddProduct from '../../components/AddProduct/AddProduct.jsx'
import ListProduct from '../../components/ListProduct/ListProduct.jsx'
import SellerProfile from '../../components/PerfilSeller/SellerProfile.jsx'
import NewOrders from '../../components/OrderProducts/NewOrders.jsx'
import ViewOrder from '../../components/OrderProducts/ViewOrder.jsx'
import Notifications from '../../components/Notifications/Notifications.jsx'
import { ToastContainer } from 'react-toastify';
import ListProductsReviews from '../../components/Reviews/ListProductsReviews/ListProductsReviews.jsx'
import ChatSeller from '../../components/ChatSeller/ChatSeller.jsx'
import Welcome from '../../components/WelcomePage/Welcome.jsx'

const Admin = () => {
  return (
    <div className="Admin">
      <ToastContainer position="top-right" autoClose={4000} />
      <Sidebar/>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path='addproduct' element={<AddProduct/>}/>
        <Route path='listproduct' element={<ListProduct/>}/>
        <Route path='profile' element={<SellerProfile/>}/>
        <Route path='neworder' element={<NewOrders/>}/>
        <Route path='vieworder' element={<ViewOrder/>}/>
        <Route path='notifications' element={<Notifications/>}/>
        <Route path='reviewsproducts' element={<ListProductsReviews/>}/>
        <Route path="chatseller" element={<ChatSeller/>}/>
      </Routes>
    </div>
  )
}

export default Admin