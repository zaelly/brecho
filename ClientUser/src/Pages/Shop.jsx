import Hero from "../Components/Hero/Hero"
import NewColletions from "../Components/newColletions/NewColletions"
import NewsLetter from "../Components/NewsLetter/NewsLetter"
import Offers from "../Components/Offers/Offers"
import Popular from "../Components/Popular/Popular"

const Shop = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offers/>
      <NewColletions/>
      <NewsLetter/>
    </div>
  )
}

export default Shop