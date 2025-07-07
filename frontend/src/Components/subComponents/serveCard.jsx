import { NavLink } from "react-router-dom";
import { AnimatedWrapper } from "./animation";


export default function ServeCard({ img, head, link }) {
    return (
        <AnimatedWrapper
            animationConfig={{
                from: { opacity: 0, y: -50 },
                to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
            }}
        >
            <div className="w-96">
                <img className="object-cover" src={img} alt={img} />
                <p className="text-4xl font-normal Elliana-Samantha my-8">{head}</p>
                <NavLink to={link} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <button style={{ background: "#DEEBEB" }} className='py-1 px-10 text-base font-normal transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-700 ...'>Learn More</button>
                </NavLink>
            </div>
        </AnimatedWrapper>
    )
}