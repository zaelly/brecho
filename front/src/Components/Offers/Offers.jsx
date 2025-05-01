import './Offers.css'
import exclusive_img from '../Assets/exclusive_image.png'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Ofertas</h1>
            <h1>Exclusivas para você</h1>
            <p>OS PRODUTOS MAIS VENDIDOS</p>
            <button>Confira Agora</button>
        </div>
        <div className="offers-right">
            <img src={exclusive_img} alt="" />
        </div>
    </div>
  )
}

export default Offers