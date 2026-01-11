import { useContext, useEffect, useState } from 'react'
import './Welcome.css'
import { AdminContext } from '../../context/AdminContext'

const Welcome = () => {
  const {allproducts, fetchInfo} = useContext(AdminContext)
  const [enableProdutos, setEnableProdutos] = useState([])

  const countAllProducts = allproducts.length

  useEffect(()=>{
    fetchInfo()
    const filterEnable = allproducts.filter(p => p.enable)
    setEnableProdutos(filterEnable)
  },[])

  return (
    <div className="container-geral">
      <div className="container-dashboard">
        <h3>Bem vindo ao Painel Administrativo!</h3>
      </div>

      <div className="containerCommon">      
        {/* MOSTRAR QUANTOS PRODUTOS TEM NO ESTOQUE */}
        <div className="box">
          <p>Todos os Produtos:</p>
          <hr className='hr'></hr>
          <i className="fa-solid fa-dolly icon"></i>
          <div className='group-box'>
            <span>{countAllProducts}</span>
          </div>
        </div>
        <div className="box">
          <p>Produtos Ativos:</p>
          <hr className='hr'></hr>
          <i className="fa-solid fa-square-check icon"></i>
          <div className='group-box'>
            <span>{enableProdutos.length}</span>
          </div>
        </div>

        {/* MOSTRAR QUANTOS PRODUTOS VENDIDOS */}
        <div className="box">
          <p>Total Vendido:</p>
          <hr className='hr'></hr>
          <i className="fa-solid fa-sack-dollar icon"></i>
          <div className='group-box'>
            <span>1.200,00</span>
          </div>
        </div>
        <div className="box">
          <p>Populares:</p>
          <hr className='hr'></hr>
          <i className="fa-solid fa-fire icon"></i>
          <div className='group-box'>
            {/* adicionar no model "bestSeller" */}
            <span>15</span>
          </div>
        </div>

        {/* ESTATISTICA DO MES QUE MAIS VENDEU */}
        <div className="statistic">
          
        </div>

        {/* QUANTO VENDEU */}
        <div className="valueSell">

        </div>
      </div>
    </div>
  )
}

export default Welcome