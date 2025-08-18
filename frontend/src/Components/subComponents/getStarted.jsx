import { NavLink } from "react-router-dom"
import { AnimatedWrapper } from "./animation"

export default function GetStarted({ head, subHead, btn, link }) {
  return (
    <div>
      <AnimatedWrapper
        animationConfig={{
          from: { opacity: 0, y: -50 },
          to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
        }}
      >
        <p className='px-3 font-normal uppercase Livvic offer-font'>{head}</p></AnimatedWrapper>
      <p className='text-lg'>{subHead}</p>
      <NavLink to='/joinNow' onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <button
          style={{ background: '#85D1F1' }}
          className='mt-10 px-6 py-1 font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110'
        >
          {btn ? btn : 'Find a Job'}
        </button>
      </NavLink>
    </div>
  )
}
