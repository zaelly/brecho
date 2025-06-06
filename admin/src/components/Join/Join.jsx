
const Join = (props) => {
    const JoinChat = ()=>{
        console.log('Ola')
    }
  return (
    <div className="Join" onClick={JoinChat}>
        {/* quando clica em um chat ao lado aparece 
        as mensagens desse chat */}
        <div className="chatBox-header">
            {/* imagem do user */}
            <img src="" alt="" />
            <p>Nome do usuario</p>
        </div> 
    </div>
  )
}

export default Join