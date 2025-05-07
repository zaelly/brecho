import './Hero.css'
import arrow_icon from '../Assets/arrow_icon.png'
import hero_img from '../Assets/hero.png'
import { Link } from 'react-router-dom'

const Hero = () => {

    const handleLink = ()=>{
        //vai para uma tela onde tem outros produtos de outros vendedores
        console.log("")
    }

  return (
    <>
        <div className="hero">
            <div className="hero-left">
                <h2>NOVIDADES</h2>
                <div>
                    <div className="hand-hand-icon">
                        <p>Novas</p>
                    </div>
                    <p>coleções</p>
                    <p>para todos</p>
                </div>
                <Link to="/allProducts">
                    <div className="hero-latest-btn" onClick={handleLink}>
                        <div>
                            Últimos Lançamentos
                        </div>
                        <img src={arrow_icon} alt="" />
                    </div>
                </Link>
            </div>
            <div className="hero-right">
                <img className='iconModel' src={hero_img} alt="" />
            </div>
        </div>
    </>
  )
}

export default Hero