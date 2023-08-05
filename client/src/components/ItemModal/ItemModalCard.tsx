import styled from 'styled-components';
import { ModchoicesDTO } from "../../types/ModchoicesDTO";
import { ItemModalCardProps } from '../../types/ItemModalCardProps';

const ItemModalCardDiv = styled.div`
background-color: #808080ea;
min-height: 200px;
min-width: 200px;
border: 2px black solid;
margin: 10px;
`;
export const ItemModalCard = ( {modchoices, modData, children}: ItemModalCardProps )=> {
  
  // let {choices, ...rest} = props.mod
  // console.log(choices)
  return <ItemModalCardDiv>
  
  
  {modData?.name}-{modData?.required_selection ? "Required": "Optional"}
  <br/>
  { modData?.max_selection !== undefined && modData.max_selection > 0 ? 
    `Select at most ${modData.max_selection}` : "b"}
    <fieldset>
    {modchoices.choices.map( choice => {
      return <>
      
      <input type='radio' value={choice.choice_id} name={modData?.name}>
      </input>
      {choice.name}?
      <br/>
      {choice.description}
      <br/>
      {choice.price}
      <br/>
      {children}
      <br/>
      </>
    })}
    </fieldset>
    
    
    
    </ItemModalCardDiv>;
  };
  
  const ItemModalSinglePick = ({modchoices, modData, children}: ItemModalCardProps)=>{
    {modchoices.choices.map( choice => {
      return <>
      {choice.name}?
      <br/>
      {choice.description}
      <br/>
      {choice.price}
      <br/>
      {children}
      <br/>
      </>
    })}
    
  }

  /**
   * required/not
   *  {requiredz_selection}
   * not = pick 0
   * pick 1
   * pick many = 
   * pick 1 and many are treated the same
   * 
   * max_selection applies to all situations
   * max_single select applies to all situations
   * free_selection not relevant
   * 
   * required means need to have at >= X
   * optional means >= 0
   * max_selection means <= X
   * 
   * 
   * I can seperate the logic from the visual display
   * 
   * logical component will check selections
   * visual component will display them
   * logical component can accept visual as child or props
   *  >> maybe better as child, easier to read
   * 
   * Item Modal Card = Item Modal Card Logic > Item Modal Card Display
   * 
   * data flow: pass through same structured data; dont want to pass 3 raw data each time and have to recalc 
   * 
  
  mod_id?: number;
  
  name: string;

  required_selection: number;

  max_selection: number;

  max_single_select: number;

  free_selection: number;

  price?: number ;

  description?: string | null;
   */


