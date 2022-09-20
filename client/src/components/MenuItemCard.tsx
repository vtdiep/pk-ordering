import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const StyledMenuItemCard = styled.div`
  display: grid;
  /* grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto; */

  background-color: #ebeaea;
  align-self: center;
  /* justify-self: center; */
  border: #7e6e69 1px solid;
  /* margin-left: auto;
  margin-right: auto; */

  max-width: 640px;
  width: 100%;

  @media (min-width: 320px) {
    grid-column: 1 / span 1;
  }
  @media (min-width: 640px) {
    grid-column: unset;
  }
`;

const MenuItemCardItemName = styled.h3`
  grid-row-start: 1;
`;

const MenuItemCardItemDescription = styled.p`
  grid-row-start: 2;
  align-self: end;
`;
const MenuItemCardItemPrice = styled.p``;
const MenuItemCardImage = styled.img`
  grid-row: 1 / span 3;
  grid-column-start: 2;
  justify-self: center;
  align-self: center;
`;

const StyledLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;

  background-color: #ebeaea;
  align-self: center;
  /* border: #7e6e69 1px solid; */

  /* max-width: 640px; */
  width: 100%;

  @media (min-width: 320px) {
    grid-column: 1 / span 1;
  }
  @media (min-width: 640px) {
    grid-column: unset;
  }
`;

type MenuItemCardProps = {
  name: string;
  description: string;
  imgURL: string;
  price: string | number;
};

const handleClick = (e:any) =>{
  document.body.style.overflow = 'hidden';
}

export const MenuItemCard = ({
  name,
  description,
  imgURL,
  price,
}: MenuItemCardProps) => {
  let location = useLocation()

  return (
    
      <StyledMenuItemCard>
        <StyledLink to={`/item/${name}`} state={{background: location}} onClick={handleClick} >
        <MenuItemCardItemName>{name}</MenuItemCardItemName>
        <MenuItemCardItemDescription>{description}</MenuItemCardItemDescription>
        <MenuItemCardItemPrice>{price}</MenuItemCardItemPrice>
        <MenuItemCardImage src="http://placekitten.com/100/100" alt="" />
        </StyledLink>
      </StyledMenuItemCard>
    

  );
};
