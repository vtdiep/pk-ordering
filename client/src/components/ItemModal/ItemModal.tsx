import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemModalProps } from '../../types/ItemModalCardProps';
import { useEffect } from 'react';
import { ItemModalCard } from './ItemModalCard';

const StyledDiv = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0px;
  background-color: rgba(91, 112, 131, 0.4);
`;

export const ItemModal = (props: ItemModalProps) => {
  useEffect(() => {
    document.body.style.overflowY = 'hidden';
  }, []);

  let navigate = useNavigate();
  let { itemURLIdentifier } = useParams() ?? "";

  let splitIndex:number = itemURLIdentifier?.lastIndexOf("-") ?? -1
  if(splitIndex === -1) {
    //todo: error msg
    return null
  }
  let itemName = itemURLIdentifier?.substring(0,splitIndex)
  let itemID = itemURLIdentifier?. substring(splitIndex+1)

  return (
    <StyledDiv>
      {itemName}
      {itemID}
      <span
        onClick={(e: any) => {
          document.body.style.overflow = 'unset';
          navigate('/');
        }}
      >
        Close
      </span>
      <ItemModalCard></ItemModalCard>
    </StyledDiv>
  );
};
