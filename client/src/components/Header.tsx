import styled from 'styled-components';

const StyledHeader = styled.header`
  background-color: aquamarine;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Image = styled.img``;

const StyledH1 = styled.h1`
  padding-left: 0rem;
  padding-right: 0rem;
  flex: 1;
`;

const P = styled.p``;
const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Container>
        <Image src="https://placekitten.com/200/200" alt="Store Logo" />
      </Container>
      <Container>
        <StyledH1>Store Name</StyledH1>
      </Container>
      <Container>
        <P></P>
      </Container>
    </StyledHeader>
  );
};
