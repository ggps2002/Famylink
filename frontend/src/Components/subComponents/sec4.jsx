
import { NavLink } from 'react-router-dom'
import lineVer from '../../assets/images/lineVer.png'
import { AnimatedWrapper } from './animation'

export default function Sec4({ btn, head, subHead }) {
    return (
        <div className='flex justify-center text-center items-center'>
            <div className='my-16'>
                {
                    head &&
                    <AnimatedWrapper
                        animationConfig={{
                            from: { opacity: 0, y: -50 },
                            to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                        }}
                    >
                        <p className='font-normal Livvic uppercase px-3 offer-font mb-10'>{head}</p></AnimatedWrapper>
                }
                <img className='my-0 mx-auto' src={lineVer} alt="lineVer" />
                <p className='home-sec2 pt-10 line1-20'>{subHead}</p>
                {
                    btn &&
                    <NavLink to={'/joinNow'}>
                        <button style={{ background: "#85D1F1" }} className='py-1 mt-10 px-6 text-base font-normal transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-700 ...'>Let's Work Together</button>
                    </NavLink>
                }
            </div>
        </div>
    )
}