import { NavLink } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { AnimatedWrapper } from "./animation";
import dot from '../../assets/images/dot.png'

export default function VerticalTimeline({ steps, head, subHead, btn, bg, btnText }) {
    const [activeStep, setActiveStep] = useState(0);
    const containerRef = useRef(null);

    // Using framer-motion's scroll progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    // Adding smooth animation to scroll progress
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        // Options for the IntersectionObserver
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5, // Activate when 50% of the element is in view
        };

        // Callback for observing intersection changes
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const stepIndex = Number(entry.target.id.split("-")[1]);
                    setActiveStep(stepIndex);
                }
            });
        };

        // Create an IntersectionObserver
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all step items
        const stepElements = document.querySelectorAll(".step-item");
        stepElements.forEach((el) => observer.observe(el));

        // Cleanup observer on unmount
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <AnimatedWrapper
                animationConfig={{
                    from: { opacity: 0, y: -50 },
                    to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                }}
            >
                <p className='font-normal text-center Livvic uppercase px-3 offer-font'>{head}</p>
            </AnimatedWrapper>

            <p className="font-lg text-center pb-10">{subHead}</p>
            <div ref={containerRef} className="relative mx-auto max-w-4xl">
                {/* Vertical line with scroll animation */}
                <motion.div
                    className="absolute left-1/2 h-full w-0.5 bg-[#85D1F1] transform -translate-x-1/2"
                    style={{ scaleY, originY: 0 }}
                />
                {steps?.map((step, index) => (
                    <div
                        key={index}
                        id={`step-${index}`}
                        className={`flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                    >


                        <img src={dot} className="absolute lg:left-[50.11%] left-[50.48%]  object-fit w-4 h-4 transform -translate-x-1/2 z-10" alt="dot" />
                        {/* Step content */}
                        <div className={`px-8 ${index % 2 === 0 ? "w-1/2" : "w-1/2"
                            }`}>
                            <motion.h3
                                className={`lg:text-2xl text-[10px] font-normal text-[#85D1F1]  ${index % 2 === 0 ? "text-end" : "text-start"
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {step.title}
                            </motion.h3>
                        </div>
                        <div className={`w-1/2 px-4`}>
                            <motion.p
                                className="text-gray-600"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            >
                                <div className={`flex border-[1px] border-[#D6DDEB] bg-[${bg}] gap-4 items-start lg:p-4 p-2`}>
                                    <div>
                                        <img className="w-20 h-20 object-contain" src={step.img} alt={step.img} />
                                    </div>
                                    <div>
                                        <p className="lg:text-2xl text-[8px] font-bold Livvic lg:leading-[24px] leading-[10px]">{step.head}</p>
                                        <p className="lg:text-base lg:leading-[16px] leading-[10px] text-[8px] lg:mt-3 mt-[3px]">{step.description}</p>
                                    </div>
                                </div>
                            </motion.p>
                        </div>
                    </div>
                ))}
            </div>
            {
                btn &&
                <NavLink to='/joinNow' className='flex' onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <button style={{ background: "#85D1F1" }} className='mt-10 mx-auto px-6 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110'>{btnText.length > 0 ? btnText :"Start Your Nanny Share Today"}</button>
                </NavLink>
            }
        </>
    );
}
