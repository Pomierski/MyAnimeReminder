import styled, { css } from "styled-components";

const Button = styled.button`
  cursor: pointer;
  ${(props) =>
    props.primary &&
    css`
      border: 0;
      border-radius: 999px;
      background: ${(props) => props.theme.accentColor};
      background: linear-gradient(
        90deg,
        ${(props) => props.theme.accentColor} 0%,
        ${(props) => props.theme.darkAccentColor} 100%
      );
      padding: 0.5rem 2rem;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    `}
  ${(props) =>
    props.icon &&
    css`
      border: 0;
      background: 0;
      color: ${(props) => props.theme.accentColor};
      font-size: 1.5rem;
      height: 1.5rem;
      padding: 0.25rem;

      &:focus {
        outline: none;
      }
    `}
    margin: ${(props) => props.margin}
`;

export default Button;
