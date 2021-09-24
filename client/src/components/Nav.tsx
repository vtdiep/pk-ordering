import styled from 'styled-components';

const StyledNav = styled.nav`
  grid-column: 1 / span 4;
  border-bottom: 1px solid grey;
  padding-top: 5px;
  padding-bottom: 5px;

  position: sticky;
  top: 0;
  background-color: #f7f7f7;
`;

const StyledUL = styled.ul`
  display: flex;
  list-style-type: none;
  column-gap: 20px;
  background-color: #e4e4e4;

  margin-left: auto;
  margin-right: auto;
  padding: 10px 10px 0 10px;

  & li {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  @media (min-width: 640px) {
    /* max size of card + card gutter */
    max-width: calc(640px * 2 + 20px);
  }
`;

const ULContainer = styled.div`
  @media (min-width: 640px) {
    margin-left: 20px;
    margin-right: 20px;
  }
`;

export const Nav = () => {
  return (
    <StyledNav>
      <ULContainer>
        <StyledUL>
          <li>Navigation Text</li>
          <li>Nav2</li>
          <li>Navigation Text Long Long Long</li>
        </StyledUL>
      </ULContainer>
    </StyledNav>
  );
};
