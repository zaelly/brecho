import './css/Sobre.css'

const Sobre = () => {
  return (
    <div className="sobre-container">
      <div className="sobre-banner">
        <i className="fa-solid fa-leaf"></i>
        <h2>Moda Circular e Sustentavel</h2>
      </div>

      <h1>Sobre o Reverto Brecho</h1>

      <p>
        O Reverto Brecho e uma plataforma de comercio eletronico colaborativo que
        tem como objetivo principal promover a moda circular e o consumo consciente.
        Acreditamos que a moda pode prosperar sem depender da exploracao de pessoas
        e sem prejudicar o meio ambiente.
      </p>

      <h2>O que e Moda Circular?</h2>
      <p>
        A moda circular e um modelo que busca reutilizar e prolongar a vida util das
        roupas, diminuindo a necessidade de producao de novas pecas. Diferente da moda
        rapida (fast fashion), que gera toneladas de residuos texteis e muitas vezes
        envolve condicoes de trabalho precarias, a moda circular valoriza pecas que
        ja foram produzidas, dando a elas uma nova chance.
      </p>

      <div className="sobre-cards">
        <div className="sobre-card">
          <i className="fa-solid fa-recycle"></i>
          <h3>Sustentabilidade</h3>
          <p>
            Cada peca comprada em um brecho e uma peca a menos produzida pela
            industria da moda, reduzindo o impacto ambiental.
          </p>
        </div>
        <div className="sobre-card">
          <i className="fa-solid fa-hand-holding-heart"></i>
          <h3>Consumo Consciente</h3>
          <p>
            Incentivamos as pessoas a comprarem com maior reflexao, valorizando
            a qualidade e a historia de cada peca.
          </p>
        </div>
        <div className="sobre-card">
          <i className="fa-solid fa-users"></i>
          <h3>Colaboracao</h3>
          <p>
            Nossa plataforma conecta vendedores e compradores que compartilham
            os mesmos valores de sustentabilidade.
          </p>
        </div>
      </div>

      <h2>Por que comprar em brechos?</h2>
      <p>
        A industria textil e uma das mais poluentes do mundo. Segundo pesquisas,
        o consumo global de texteis aumentou 811% desde 1960, gerando uma quantidade
        enorme de lixo textil. Ao comprar em brechos, voce contribui para a reducao
        desse impacto, alem de encontrar pecas unicas com precos mais acessiveis.
      </p>

      <div className="sobre-destaque">
        <p>
          "Cada peca de roupa de um brecho tem uma historia unica, e voce se sente
          bem sabendo que esta fazendo uma escolha que beneficia o planeta e as pessoas."
        </p>
      </div>

      <h2>Nossa Missao</h2>
      <p>
        Queremos ser uma ponte entre quem quer vender e quem quer comprar roupas
        de segunda mao, criando uma comunidade colaborativa que valoriza a
        sustentabilidade social e ambiental. Nosso objetivo e que cada vez mais
        pessoas adotem habitos de consumo mais conscientes, contribuindo para um
        mundo melhor.
      </p>

      <h2>Como funciona?</h2>
      <p>
        Vendedores podem se cadastrar na plataforma e criar sua propria loja
        virtual, adicionando seus produtos com fotos e descricoes. Compradores
        podem navegar pelas categorias, buscar produtos, adicionar ao carrinho
        e finalizar a compra de forma simples e segura. Alem disso, compradores
        e vendedores podem se comunicar diretamente pelo chat da plataforma.
      </p>
    </div>
  )
}

export default Sobre
