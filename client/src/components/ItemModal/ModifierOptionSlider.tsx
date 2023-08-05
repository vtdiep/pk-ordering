import { useState } from 'react';
import styled from 'styled-components';

const ModifierOptionSliderStyled = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  background-color: palegoldenrod;
  justify-items: center;
  align-items: center;


  label {
    grid-column: span 3;
    align-self: flex-end;
  }
  button{
    align-self: center;
    padding: 5px;
    background-color: white;
    border: darkslategray 1px solid;
    border-radius: 5px;
  }

`;

interface Props {
  max: number;
  min: number;
  canUpdateTotal: (step:number) => boolean
  updateTotal: (step:number) => void
}


export const ModifierOptionSlider = ({ max, min = 0, canUpdateTotal, updateTotal }: Props) => {
  const [value, setValue] = useState(0);

  function updateVal(ev: React.ChangeEvent<HTMLInputElement>) {
    let newValue = parseInt(ev.target.value)
    let delta = newValue - value
    updateValByAmt(delta)
  }
  

  function updateValByAmt(step: number) {
    let newValue = value + step;
    let delta = step
    if(newValue > max) {
      delta = max - value
    }
    else if( newValue < 0 ){
      delta = -value
    }

    if(canUpdateTotal(delta)){
      setValue(value+delta)
      updateTotal(delta)
    } 

  }
  

  return (
    <ModifierOptionSliderStyled>
      <label htmlFor="quantity">{value}</label>
      <button type="button" onClick={(ev) => updateValByAmt(-1)}>
        <label htmlFor="subtractQuantity">-</label>
      </button>
      <input
        type="range"
        name="quantity"
        id="quantity"
        value={value}
        max={max}
        onChange={updateVal}
      />
      <button type="button" onClick={(ev) => updateValByAmt(1)}>
        <label htmlFor="addQuantity">+</label>
      </button>
    </ModifierOptionSliderStyled>
  );
};
