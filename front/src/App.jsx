import './App.css'
import Navbar from './Components/Navbar/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Shop from './Pages/Shop'
import Products from './Pages/Products'
import Category from './Pages/Category'
import Favorits from './Pages/Favorits'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
import Footer from './Components/footer/Footer'
import men_benner from './Components/Assets/banner_men.png'
import women_benner from './Components/Assets/banner_women.png'
import kids_benner from './Components/Assets/banner_kids.png'
import Unissex_benner from './Components/Assets/UNISEXFASHION.png'
import AllProducts from './Pages/AllProducts'
import ShowAllProducts from './Components/ShowAllProducts/ShowAllProducts'
import ProductsFilter from './Components/ProductsFilter/ProductsFilter'

function App() {

  return (
    <>
    <div className="app-container">
      <BrowserRouter>
        <Navbar/>
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Shop/>}/>
            <Route path='/men' element={<Category banner={men_benner} category="Masculino"/>}/>
            <Route path='/women' element={<Category banner={women_benner} category="Feminino"/>}/>
            <Route path='/kid' element={<Category banner={kids_benner} category="kid"/>}/>
            <Route path='/Unissex' element={<Category banner={Unissex_benner} category="Unissex"/>}/>
            <Route path='/TodosOsProdutos' element={<ShowAllProducts/>}/>
            <Route path="/products" element={<Products/>}>
              <Route path=':productId' element={<Products/>}/>
            </Route>
            <Route path="/search" element={<ProductsFilter/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/LoginSignup" element={<LoginSignup/>}/>
            <Route path="/Favoritos" element={<Favorits/>}/>
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
