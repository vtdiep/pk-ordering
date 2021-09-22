import styled from 'styled-components';

const StyledViewCheckoutButton = styled.div`
  grid-column: 1 / span 4;
  grid-row-start: 3;
  background-color: salmon;
  position: sticky;
  bottom: 0;
`;

const StyledSpan = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 20px;
`;

export const ViewCheckoutButton = () => {
  return (
    <StyledViewCheckoutButton>
      <StyledSpan>
        <h3>Checkout</h3>
        <p>Item Count</p>
      </StyledSpan>
    </StyledViewCheckoutButton>
  );
};
