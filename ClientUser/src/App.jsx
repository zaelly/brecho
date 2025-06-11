import './App.css'
import Navbar from './Components/Navbar/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Shop from './Pages/Shop'
import Products from './Pages/Products'
import Category from './Pages/Category'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
import Footer from './Components/footer/Footer'
import men_banner from './Components/Assets/banner_men.png'
import women_banner from './Components/Assets/banner_women.png'
import kids_banner from './Components/Assets/banner_kids.png'
import Unissex_banner from './Components/Assets/UNISEXFASHION.png'
import desconto_banner from './Components/Assets/desconto_banner.png'
import AllProducts from './Pages/AllProducts'
import ProductsFilter from './Components/ProductsFilter/ProductsFilter'
import PerfilUser from './Pages/PerfilUser'

function App() {

  return (
    <>
    <div className="app-container">
      <BrowserRouter>
        <Navbar/>
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Shop/>}/>
            <Route path='/men' element={<Category banner={men_banner} category="Masculina"/>}/>
            <Route path='/women' element={<Category banner={women_banner} category="Feminina"/>}/>
            <Route path='/kid' element={<Category banner={kids_banner} category="kid"/>}/>
            <Route path='/Unissex' element={<Category banner={Unissex_banner} category="Unissex"/>}/>
            <Route path='/Imperdiveis' element={<Category banner={desconto_banner} category="Imperdiveis"/>}/>
            <Route path="/products" element={<Products/>}>
              <Route path=':productId' element={<Products/>}/>
            </Route>
            <Route path="/search" element={<ProductsFilter/>}/>
            <Route path="/profile" element={<PerfilUser/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/LoginSignup" element={<LoginSignup/>}/>
            <Route path='/allProducts' element={<AllProducts/>}/>
          </Routes>
        </main>
        <Footer/>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
