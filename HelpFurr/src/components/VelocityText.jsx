import "../index.css";
import React, { useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Dynamically calculate the number of repetitions and wrapping range
  const textWidth = children.length * 10; // Adjust the factor based on font size
  const viewportWidth = window.innerWidth;
  const repetitions = Math.ceil(viewportWidth / textWidth);
  const wrapRange = 100 / repetitions;

  const x = useTransform(baseX, (v) => `${wrap(-wrapRange, 0, v)}%`);

  const directionFactor = useRef(1);
  const updateX = useCallback(() => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  }, [baseVelocity, velocityFactor, baseX]);

  useAnimationFrame(updateX);

  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        {Array.from({ length: repetitions }, (_, i) => (
          <span key={i}>{children}</span>
        ))}
      </motion.div>
    </div>
  );
}

function VelocityText() {
  return (
    <section>
      <ParallaxText baseVelocity={-5}>Framer Motion</ParallaxText>
      <ParallaxText baseVelocity={5}>Scroll velocity</ParallaxText>
    </section>
  );
}

export default VelocityText;
