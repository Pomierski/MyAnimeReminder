import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 1.3rem;
  border: 1px solid ${(props) => props.theme.darkAccentColor};
  border-radius: 999px;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  width: 100%;
  background: ${(props) => props.theme.accentColor};
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.accentColor} 0%,
    ${(props) => props.theme.darkAccentColor} 100%
  );
  transform: scaleX(${(props) => props.progress || 0});
  transform-origin: left;
  transition: transform 0.5s;
`;

const Value = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  margin: 0 auto;
  transform: translateY(-50%);
  color: ${(props) => props.theme.mainColor};
  font-size: 0.8rem;
  font-weight: bold;
  width: fit-content;
  z-index: 2;
`;

const ProgressBar = ({ progress, max }) => (
  <Wrapper>
    <Value>
      {progress} / {max || "?"}
    </Value>
    <Bar progress={progress / (max || 1)} />
  </Wrapper>
);

export default ProgressBar;
