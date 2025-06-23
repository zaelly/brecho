import Sidebar from '../../components/sidebar/Sidebar'
import './Admin.css'
import {Routes, Route} from 'react-router-dom'
import AddProduct from '../../components/AddProduct/AddProduct.jsx'
import ListProduct from '../../components/ListProduct/ListProduct.jsx'
import SellerProfile from '../../components/PerfilSeller/SellerProfile.jsx'
import NewOrders from '../../components/OrderProducts/NewOrders.jsx'
import ViewOrder from '../../components/OrderProducts/ViewOrder.jsx'
import Notifications from '../../components/Notifications/Notifications.jsx'

const Admin = () => {
  return (
    <div className="Admin">
      <Sidebar/>
      <Routes>
        <Route path='addproduct' element={<AddProduct/>}/>
        <Route path='listproduct' element={<ListProduct/>}/>
        <Route path='profile' element={<SellerProfile/>}/>
        <Route path='neworder' element={<NewOrders/>}/>
        <Route path='vieworder' element={<ViewOrder/>}/>
        <Route path='notifications' element={<Notifications/>}/>
      </Routes>
    </div>
  )
}

export default Admin