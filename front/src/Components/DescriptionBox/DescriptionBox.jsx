import { useEffect, useState } from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
    const [widthResize, setWindowWidth] = useState(window.innerWidth)

    useEffect(()=>{
        const handleSize = ()=>{
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleSize);
        return ()=> window.removeEventListener("resize", handleSize)
    })
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
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                        Sapiente autem non repellendus quos, 
                        quis provident eligendi enim cum aliquam libero porro molestiae nobis, 
                        nulla tempore, ut laboriosam. Tempora, necessitatibus libero.
                        <span>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                            Provident totam, ullam, magnam exercitationem quod, dolorem ipsum 
                            debitis necessitatibus corrupti aperiam corporis aliquid eaque 
                            numquam tempora quidem adipisci maiores assumenda minima.   
                        </span>
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
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                    Sapiente autem non repellendus quos, 
                    quis provident eligendi enim cum aliquam libero porro molestiae nobis, 
                    nulla tempore, ut laboriosam. Tempora, necessitatibus libero.
                    <span>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                        Provident totam, ullam, magnam exercitationem quod, dolorem ipsum 
                        debitis necessitatibus corrupti aperiam corporis aliquid eaque 
                        numquam tempora quidem adipisci maiores assumenda minima.   
                    </span>
                </p>
            </div>
        </div> 
        )}
    </>
  )
}

export default DescriptionBox