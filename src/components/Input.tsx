import styled from "styled-components";

const Input = styled.input`
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme.accentColor};
  background: none;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.mainColor};
  padding: 0.5rem 0;

  &:focus {
    outline: 1px solid ${(props) => props.theme.darkAccentColor};
  }
`;

export default Input;
