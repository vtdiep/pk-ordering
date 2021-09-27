import styled from 'styled-components';
import { MenuContainer } from './MenuContainer';
import { Nav } from './Nav';

const StyledStore = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

export interface StoreProps {
  children?: React.ReactNode;
}

export const Store = () => {
  return (
    <StyledStore>
      <Nav />
      <MenuContainer />
    </StyledStore>
  );
};
