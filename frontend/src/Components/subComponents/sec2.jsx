import OfferCard from "./offerCard";
import o1 from "../../assets/images/o1.png";
import o2 from "../../assets/images/o2.png";
import o3 from "../../assets/images/o3.png";
import o4 from "../../assets/images/o4.png";
import o5 from "../../assets/images/o5.png";
import o6 from "../../assets/images/o6.png";
import o7 from "../../assets/images/o7.png";
import o8 from "../../assets/images/o8.png";
import { NavLink } from "react-router-dom";
import { AnimatedWrapper } from "./animation";

export default function Sec2({ border, head, btn }) {
  return (
    <div className="flex flex-col justify-center items-center lg:pt-10 lg:pb-5">
      <AnimatedWrapper
        animationConfig={{
          from: { opacity: 0, y: -50 },
          to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
        }}
      >
        <p
          style={{
            borderBottom: !border && "16px solid #DEEBEB",
            display: "inline-block",
          }}
          className="px-3 font-normal uppercase Classico offer-font text-center lg:leading-[12px] leading-tight"
        >
          {head}
        </p>
      </AnimatedWrapper>

      <div className="gap-6 w-full grid sm:grid-cols-2 lg:grid-cols-4 place-items-center my-10">
        {[o1, o2, o3, o4, o5, o6, o7, o8].map((image, index) => (
          <AnimatedWrapper
            key={index}
            animationConfig={{
              from: { opacity: 0, y: 50 },
              to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            }}
            triggerConfig={{
              start: "top 90%",
              markers: false,
            }}
          >
            <OfferCard
              im={image}
              head={
                [
                  "Nanny",
                  "Babysitter",
                  "Private Educator",
                  "Specialized Caregiver",
                  "Sports Coaches",
                  "Music Instructor",
                  "Swim Instructor",
                  "House Manager",
                ][index]
              }
              para={
                [
                  "Connect with experienced nannies for full-time, part-time, or live-in care.",
                  "Find reliable babysitters for occasional or regular childcare needs.",
                  "Discover qualified educators and tutors to provide personalized academic support for your child.",
                  "Find caregivers for doula services, night nursing, special needs care, and more to support your family.",
                  "Hire skilled coaches for sports like soccer, basketball, tennis, and more to enhance your child's athletic skills.",
                  "Find talented music instructors to teach your child various musical instruments.",
                  "Locate certified swim instructors for swimming lessons and water safety.",
                  "Hire professional house managers or housekeepers to help maintain an organized and efficient home.",
                ][index]
              }
              color={
                [
                  "#F1C3D4",
                  "#F2C9B5",
                  "#FAF1D6",
                  "#FEEBCA",
                  "#CFE0B9",
                  "#BFD4E2",
                  "#D9F1F1",
                  "#DED1E1EE",
                ][index]
              }
            />
          </AnimatedWrapper>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {!btn && (
          <NavLink to="/joinNow" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <button
              style={{ border: "1px solid #DEEBEB" }}
              className="px-10 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ease-in-out hover:scale-110"
            >
              Find Care
            </button>
          </NavLink>
        )}
        <NavLink to="/joinNow" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <button
            style={{ background: "#85D1F1" }}
            className="px-10 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ease-in-out hover:scale-110"
          >
            Find a Job
          </button>
        </NavLink>
      </div>
    </div>
  );
}
