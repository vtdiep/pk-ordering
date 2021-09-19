import styled from 'styled-components';
import { Menu } from './Menu';

const StyledMenuContainer = styled.div`
  grid-column: 2 / span 2;
  display: flex;
  flex-direction: column;
  /* row-gap: 50px; */

  @media (min-width: 320px) {
    grid-column: 1 / span 4;
  }
`;

export const MenuContainer = () => {
  return (
    <StyledMenuContainer>
      <Menu></Menu>
      <Menu></Menu>
    </StyledMenuContainer>
  );
};
