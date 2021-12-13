import { motion, MotionProps } from "framer-motion";
import React from "react";
import styled from "styled-components";

interface PropTypes extends MotionProps {
  children?: React.ReactNode;
}

const Wrapper = styled(motion.div)`
  padding: 0.5rem 2rem 0 2rem;
  width: 100%;
  height: 100%;
  z-index: 3;
  top: 0;
  left: 0;
  position: fixed;
  background: ${(props) => props.theme.bgColor};
  opacity: 0;
  overflow-y: auto;
`;

const Drawer = (props: PropTypes) => (
  <Wrapper {...props}>{props.children}</Wrapper>
);

export default Drawer;
