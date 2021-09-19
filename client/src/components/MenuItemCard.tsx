import styled from 'styled-components';

export const StyledMenuItemCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

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
`;

const MenuItemCardImage = styled.img`
  grid-row: 1 / span 2;
  grid-column-start: 2;
  justify-self: center;
  align-self: center;
`;

export const MenuItemCard = () => {
  return (
    <StyledMenuItemCard>
      <MenuItemCardItemName>Item Name</MenuItemCardItemName>
      <MenuItemCardItemDescription>
        Item Description
      </MenuItemCardItemDescription>
      <MenuItemCardImage src="http://placekitten.com/100/100" alt="" />
    </StyledMenuItemCard>
  );
};
