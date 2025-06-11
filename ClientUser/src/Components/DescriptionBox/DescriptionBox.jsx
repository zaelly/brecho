import { useEffect, useState } from 'react'
import './DescriptionBox.css'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

const DescriptionBox = () => {
    const [widthResize, setWindowWidth] = useState(window.innerWidth)

    useEffect(()=>{
        const handleSize = ()=>{
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleSize);
        return ()=> window.removeEventListener("resize", handleSize)
    })

    const {all_product} = useContext(ShopContext);
    console.log(all_product)
  return (
    <>
        {widthResize <= 800 ? (
            <div className='descriptionbox'>
                <div className="descriptionbox-navigator">
                    <div className="descriptionbox-nav-box">Descrição</div>
                    <div className="descriptionbox-nav-box ">Avaliações (x)</div>
                </div>
                <div className="descriptionbox-description">
                    <p>
                        {all_product.descriptionProduct}
                    </p>
                </div>
            </div>
        ) : (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Descrição</div>
                <div className="descriptionbox-nav-box ">Avaliações (x)</div>
            </div>
            <div className="descriptionbox-description">
                <p>
                    {all_product.descriptionProduct}
                </p>
            </div>
        </div> 
        )}
    </>
  )
}

export default DescriptionBox