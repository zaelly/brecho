import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <div className="texts">
        <h1>Receba Ofertas Exclusivas No Seu Email</h1>
        <p>Increve-se no nosso canal de noticias e fique por dentro de tudo!</p>
      </div>
        <div className='inpt'>
          <input type="email" placeholder='Adicione seu Email aqui' />
          <button>Inscreva-se</button>
        </div>
    </div>
  )
}

export default NewsLetter