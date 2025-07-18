import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AnimatedWrapper({
  children,
  animationConfig = {},
  triggerConfig = {},
}) {
  const wrapperRef = useRef(null);
  const hasAnimated = useRef(false); // 👈 prevent re-trigger

  useEffect(() => {
    if (!wrapperRef.current || hasAnimated.current) return;
    // Apply animation using GSAP
    hasAnimated.current = true;
    const animation = gsap.fromTo(
      wrapperRef.current,
      animationConfig.from || { opacity: 0, y: 50 },
      {
        ...animationConfig.to,
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: triggerConfig.start || "top 90%",
          end: triggerConfig.end || "bottom 10%",
          scrub: triggerConfig.scrub || false,
          markers: triggerConfig.markers || false, // Set to `true` for debugging
          once: false, // This ensures the animation runs every time the component enters the viewport
        },
      }
    );

    // Cleanup on unmount
    return () => {
      if (animation.scrollTrigger) animation.scrollTrigger.kill();
      animation.kill();
    };
  }, [animationConfig, triggerConfig]);

  return <div ref={wrapperRef}>{children}</div>;
}
