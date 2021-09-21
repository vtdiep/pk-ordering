import styled from 'styled-components';

const StyledHeader = styled.header`
  background-color: papayawhip;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
`;
const Image = styled.img`
  width: 30vw;
  max-width: 100px;
  padding: 10px;

  @media (max-width: 640px) {
    max-width: 75px;
    padding: 5px;
  }
`;

const StyledH1 = styled.h1`
  padding-left: 20px;
  flex: 1;
  text-align: left;
  margin: 0px;
  font-size: clamp(1.5em, 4vw, 2.5em);
`;

const P = styled.p`
  padding-right: 20px;
`;
const Container = styled.div`
  display: flex;
  flex: 0;
  /* justify-content: center; */
`;

const Container2 = styled.div`
  display: flex;
  flex: 2;
  /* justify-content: center; */
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Container>
        <Image src="https://placekitten.com/200/200" alt="Store Logo" />
      </Container>
      <Container2>
        <StyledH1>Store Name</StyledH1>
      </Container2>
      <Container>
        <P>abc</P>
      </Container>
    </StyledHeader>
  );
};
