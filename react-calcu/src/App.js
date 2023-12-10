import {useReducer} from "react"
import "./style.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"



export const ACTIONS ={
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}
function reducer(state, { type, payload }){
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if(state.overwrite){
                return {
                    ...state,
                    currentoperand: payload.digit,
                    overwrite:false
                }
            }
            if(payload.digit === "0" && state.currentoperand === "0" ){
                return state
            }
            if(payload.digit === "." && state.currentoperand.includes(".")){
                return state
            }
            return{
                ...state,
                currentoperand: `${state.currentoperand || "" }${payload.digit}`,
            }
            case ACTIONS.CHOOSE_OPERATION:
                if(state.currentoperand ==  null && state.previousoperand == null) {
                    return state
                }

                if(state.currentoperand ==  null) {
                    return {
                        ...state,
                        operation: payload.operation,
                    }
                }

                if(state.previousoperand ==  null ){
                    return {
                        ...state,
                        operation:payload.operation,
                        previousoperand: state.currentoperand,
                        currentoperand: null,
                    }
                }

                return {
                    ...state,
                    previousoperand:evaluate(state),
                    operation: payload.operation,
                    currentoperand: null
                }
            case ACTIONS.CLEAR:
                return {}
            case ACTIONS.DELETE_DIGIT:
                if(state.overwrite) {
                    return{
                        ...state,
                        overwrite:false,
                        currentoperand: null
                    }
                }
                if (state.currentoperand == null) return state
                if (state.currentoperand.length === 1) {
                    return {
                        ...state,
                        currentoperand: null
                    }
                }
                return{
                    ...state,
                    currentoperand: state.currentoperand.slice(0, -1)
                }
            case ACTIONS.EVALUATE:
                if(state.operation == null || 
                    state.currentoperand == null || 
                    state.previousoperand == null) {
                        return state
                    }

                    return{
                        ...state,
                        overwrite:true,
                        previousoperand: null,
                        operation:null,
                        currentoperand: evaluate(state),
                    }
    }
}

function evaluate({currentoperand, previousoperand, operation}) {
    const prev = parseFloat(previousoperand)
    const current = parseFloat(currentoperand)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation =""
    switch (operation) {
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current
            break
        case "x":
            computation = prev * current
            break
        case "÷":
            computation = prev / current
            break
    }

    return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
    maximunfractionDigits: 0,
})

function formatOperand(operand){
    if (operand == null) return
    const [integer, decimal] = operand.split('.')
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {
    const [{ currentoperand, previousoperand, operation }, dispatch] = useReducer( reducer,
       {} 
       )

    return (

        <div className="calcu-grid">
            <div className="output">
                <div className="previous-operand">
                  { previousoperand } { operation } </div>
                <div className="current-operand">{formatOperand (currentoperand) } </div>
            </div>

            <button className="span-two" onClick={() => dispatch ({ type: ACTIONS.CLEAR})}
            >
              AC
            </button>

            <button onClick={() => dispatch ({ type: ACTIONS.DELETE_DIGIT})}
            >
              Del
            </button>

            <OperationButton operation="÷" dispatch={dispatch}/>
            <DigitButton digit="1" dispatch={dispatch}/> 
            <DigitButton digit="2" dispatch={dispatch}/> 
            <DigitButton digit="3" dispatch={dispatch}/> 
            <OperationButton operation="x" dispatch={dispatch}/>
            <DigitButton digit="4" dispatch={dispatch}/> 
            <DigitButton digit="5" dispatch={dispatch}/> 
            <DigitButton digit="6" dispatch={dispatch}/> 
            <OperationButton operation="+" dispatch={dispatch}/>
            <DigitButton digit="7" dispatch={dispatch}/> 
            <DigitButton digit="8" dispatch={dispatch}/> 
            <DigitButton digit="9" dispatch={dispatch}/> 
            <OperationButton operation="-" dispatch={dispatch}/>
            <DigitButton digit="." dispatch={dispatch}/> 
            <DigitButton digit="0" dispatch={dispatch}/> 
            <button className="span-two"onClick={() => dispatch ({ type: ACTIONS.EVALUATE})}>=</button>
        </div>
    )
}

export default App