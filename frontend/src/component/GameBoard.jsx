const GameBoard =(props)=> {
    return (
    <div className="container">

        <div className="grid">    
                <div className="row">
                        <div  className={props.classes[0]} onClick={()=>props.handleClick(0)}>

                        </div>
                        <div className={props.classes[1]} onClick={()=>props.handleClick(1)}>
                        
                        </div>
                        <div className={props.classes[2]} onClick={()=>props.handleClick(2)}>
                        
                        </div>
                </div>

                <div className="row">
                        <div className={props.classes[3]} onClick={()=>props.handleClick(3)}>
                        
                        </div>
                        <div className={props.classes[4]} onClick={()=>props.handleClick(4)}>
                        
                        </div>
                        <div className={props.classes[5]} onClick={()=>props.handleClick(5)}>
                        
                        </div>
                </div>

                <div className="row">
                        <div className={props.classes[6]} onClick={()=>props.handleClick(6)}>
                        
                        </div>
                        <div className={props.classes[7]} onClick={()=>props.handleClick(7)}>
                        
                        </div>
                        <div className={props.classes[8]} onClick={()=>props.handleClick(8)}>
                        
                        </div>
                </div>
        </div>
        <button onClick = {props.endGame} className="btn btn-danger">
                End Game
        </button>
</div>
)}
export default GameBoard