import { useContext, useEffect, useState } from 'react'
import './Welcome.css'
import { AdminContext } from '../../context/AdminContext'

const Welcome = () => {
  const {allproducts} = useContext(AdminContext)
  const [enableProdutos, setEnableProdutos] = useState([])

  const countAllProducts = allproducts.length

  useEffect(()=>{
    const filterEnable = allproducts.filter(p => p.enable)
    setEnableProdutos(filterEnable)
    
  },[allproducts])

  return (
    <div className="container-geral">
      <div className="container-dashboard">
        <h3>Bem vindo ao Painel Administrativo!</h3>
      </div>

      <div className="containerCommon">      
        {/* MOSTRAR QUANTOS PRODUTOS TEM NO ESTOQUE */}
        <div className="stockContainer">
          <div className="group">
            <label htmlFor="allProducts">Todos os Produtos</label>
            <input type="number" name="allProducts" value={countAllProducts} disabled/>
          </div>
          <div className="group">
            <label htmlFor="enableProducts">Produtos ativos</label>
            <input type="number" name="enableProducts" value={enableProdutos.length} disabled/>
          </div>
        </div>

        {/* MOSTRAR QUANTOS PRODUTOS VENDIDOS */}
        <div className="soldContainer">

        </div>

        {/* MOSTRAR QUAIS PRODUTOS MAIS VENDEM */}
        <div className="bestSellers">

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