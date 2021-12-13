import styled, { keyframes } from "styled-components";

const rotate = keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `;

const Loader = styled.div`
  width: 70px;
  height: 70px;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid #333;
  border-top: 2px solid ${(props) => props.theme.accentColor};
  animation-name: ${rotate};
  animation-iteration-count: infinite;
  animation-duration: 1s;
`;

export default Loader;
