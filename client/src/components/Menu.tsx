import styled from 'styled-components';
import { MenuItemCard } from './MenuItemCard';

const StyledMenu = styled.div`
  background-color: rosybrown;
`;

const MenuItemContainer = styled.div`
  background-color: lightgoldenrodyellow;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 20px;

  @media (min-width: 320px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MenuItemContainerTitle = styled.h2`
  grid-column: 1 / span 2;
  @media (min-width: 320px) {
    grid-column: 1 / span 1;
  }
  @media (min-width: 640px) {
    grid-column: 1 / span 2;
  }
`;

export const Menu = () => {
  return (
    <StyledMenu>
      <MenuItemContainer>
        <MenuItemContainerTitle>Menu Title</MenuItemContainerTitle>

        <MenuItemCard />

        <MenuItemCard />

        <MenuItemCard />
      </MenuItemContainer>
    </StyledMenu>
  );
};
