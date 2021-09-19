import styled from 'styled-components';
import { MenuItemCard, StyledMenuItemCard } from './MenuItemCard';

const StyledMenu = styled.div`
  background-color: rosybrown;
`;

const MenuItemContainer = styled.div`
  background-color: #d8b3a5;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  /* row-gap: 20px; */
`;

const MenuItemContainerTitle = styled.h2`
  grid-column: 1 / span 2;
  @media (min-width: 320px) {
    grid-column: 1 / span 1;
  }
`;

const MenuItemCards = styled.div`
  display: grid;
  flex: 1;

  @media (min-width: 320px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
    row-gap: 20px;

    & ${StyledMenuItemCard}:nth-child(2n + 1) {
      margin-left: auto;
    }
  }
`;

const MenuItemCardsContainer = styled.div`
  display: flex;
  grid-column: 1 / span 2;

  /* justify-content: center; */

  @media (min-width: 640px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

export const Menu = () => {
  return (
    <StyledMenu>
      <MenuItemContainer>
        <MenuItemContainerTitle>Menu Title</MenuItemContainerTitle>
        <MenuItemCardsContainer>
          <MenuItemCards>
            <MenuItemCard />

            <MenuItemCard />

            <MenuItemCard />
          </MenuItemCards>
        </MenuItemCardsContainer>
      </MenuItemContainer>
    </StyledMenu>
  );
};
