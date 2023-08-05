import { useState } from 'react';
import styled from 'styled-components';
import { UnifiedModInfo } from '../../types/UnifiedModInfo';
import { ModifierOptionSlider } from './ModifierOptionSlider';
import { ModData } from '../../types/ModData';
import { Choices } from '../../types/Modifiers';
import { ModifierOptionBox } from './ModifierOptionBox';

const ModifierOptionStyled = styled.div`
    background-color: royalblue;
    margin: 0px;
    
        padding: 5px 0 0 0;
    & >h3{
        color: white;
        margin: 0px;
    }    
    
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    width: 50%;
    border: 5px white;
    padding:10px;
    margin: 10px auto 10px auto;

`;

const ModifierOptionsDiv = styled.div`

    
`

export const ModifierOption = ({
  name,
  required_selection,
  max_selection,
  max_single_select,
  free_selection,
  choices,
}: UnifiedModInfo) => {
  const [totalSelectionCount, setTotalSelectionCount] = useState(0);

  /**
   *
   * @param step
   * @returns whether or not totalSelectionCount can be changed by given step
   */
  function canUpdateTotalSelectionCount(step: number) {
    let newTotal = totalSelectionCount + step;
    if (newTotal > max_selection || newTotal < 0) {
      return false;
    }
    return true;
  }

  function updateTotalSelectionCount(step: number) {
    setTotalSelectionCount(totalSelectionCount + step);
  }

  if (choices == undefined || choices.length == 0) return null;

  let testData: Choices = {
    choice_id: 0,
    name: 'Test Data',
    mi_price: null,
    display_order: 0,
    description: 'Test Data Description',
  };

  let entries = choices.map((choice) => {
    return(
    <ModifierOptionBox
      name={choice.name}
      required_selection={0}
      max_selection={max_selection}
      max_single_select={max_single_select || max_selection}
      free_selection={free_selection}
      choice={choice}
      canUpdateTotalSelectionCount={canUpdateTotalSelectionCount}
      updateTotalSelectionCount={updateTotalSelectionCount}
    ></ModifierOptionBox>
    )
  });

  return (
    <ModifierOptionStyled>
      <h3>{name}</h3>
      <p>total: {totalSelectionCount} / {max_selection}</p>
      {/* <ModifierOptionSlider max={3} min={0} canUpdateTotal={canUpdateTotalSelectionCount} updateTotal={updateTotalSelectionCount}></ModifierOptionSlider>
    <ModifierOptionSlider max={3} min={0} canUpdateTotal={canUpdateTotalSelectionCount} updateTotal={updateTotalSelectionCount}></ModifierOptionSlider> */}
      {/* <ModifierOptionBox
        name={''}
        required_selection={0}
        max_selection={3}
        max_single_select={1}
        free_selection={0}
        choice={testData}
        canUpdateTotalSelectionCount={canUpdateTotalSelectionCount}
        updateTotalSelectionCount={updateTotalSelectionCount}
      ></ModifierOptionBox> */}

    {/* <ModifierOptionsDiv> */}
      {entries}
    {/* </ModifierOptionsDiv> */}
    </ModifierOptionStyled>
  );
};
