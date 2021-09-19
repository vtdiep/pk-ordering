import styled from 'styled-components';

const StyledNav = styled.nav`
  grid-column: 1 / span 4;
`;

const StyledUL = styled.ul`
  display: flex;
  list-style-type: none;
  column-gap: 20px;
  background-color: red;
`;

export const Nav = () => {
  return (
    <StyledNav>
      <StyledUL>
        <li>Nav1</li>
        <li>Nav2</li>
      </StyledUL>
    </StyledNav>
  );
};
