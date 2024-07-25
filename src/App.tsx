import styled from "styled-components";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";

const Wrapper = styled(motion.div)`
  height: 200vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

function App() {
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-800, 800], [-360, 360]);
  const gradient = useTransform(
    x,
    [-800, 800],
    [
      "linear-gradient(135deg, rgb(21, 204, 255), rgb(17, 73, 255))",
      "linear-gradient(135deg, rgb(81, 237, 81), rgb(238, 186, 0))",
    ]
  );
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 5]);
  return (
    <Wrapper style={{ background: gradient }}>
      <Box style={{ x, rotateZ, scale }} drag="x" dragSnapToOrigin />
    </Wrapper>
  );
}

export default App;
