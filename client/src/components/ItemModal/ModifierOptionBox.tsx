import styled from 'styled-components';
import { Choices } from '../../types/Modifiers';
import { ModData } from '../../types/ModData';
import { ModifierOptionSlider } from './ModifierOptionSlider';

const ModifierOptionBoxStyled = styled.div`
  background-color: whitesmoke;
  display: flex;
  justify-content: center;
  /* border: 1px solid white; */
  padding-top: 10px;
  padding-bottom: 10px;
/* width: 50%; */
`;

const InputDiv = styled.div`
  flex-basis: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h3{
    font-family: fantasy;
  }
`;

const ModifierNameH3 = styled.h3`
`

type Props = ModData & { choice: Choices } & {
  canUpdateTotalSelectionCount: (step: number) => boolean;
  updateTotalSelectionCount: (step: number) => void;
};

export const ModifierOptionBox = ({
  name,
  required_selection,
  max_selection,
  max_single_select,
  description,
  choice,
  canUpdateTotalSelectionCount,
  updateTotalSelectionCount,
}: Props) => {
  return (
    <ModifierOptionBoxStyled>
      <img src="http://placekitten.com/100/100" alt="" />
      <InputDiv>
        <h3>{choice.name}</h3>
        <p>{choice.description}</p>
      </InputDiv>
      <ModifierOptionSlider
        max={Math.min(max_selection, max_single_select)}
        min={0}
        canUpdateTotal={canUpdateTotalSelectionCount}
        updateTotal={updateTotalSelectionCount}
      ></ModifierOptionSlider>
    </ModifierOptionBoxStyled>
  );
};
