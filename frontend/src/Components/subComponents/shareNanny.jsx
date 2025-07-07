
import share1 from '../../assets/images/share1.png'
import share2 from '../../assets/images/share2.png'
import { AnimatedWrapper } from './animation'

export default function ShareNanny() {
    return (
        <div>
            <AnimatedWrapper
                animationConfig={{
                    from: { opacity: 0, y: -50 },
                    to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                }}
            >
                <p className='font-normal Classico uppercase offer-font mb-10 text-center'>Most Common Ways to Share a Nanny</p>
            </AnimatedWrapper>
            <div className="flex justify-evenly gap-y-12 flex-wrap items-center">
                <AnimatedWrapper
                    animationConfig={{
                        from: { opacity: 0, y: -50 },
                        to: { opacity: 1, y: 0, duration: 2.5, ease: "power3.out" },
                    }}
                >
                    <div className="w-96 max-lg:px-2 max-lg:w-full flex justify-center text-center ">
                        <div>
                            <p className="font-2xl uppercase font-bold Classico">Share at One Family's Home</p>
                            <img className='my-6' src={share1} alt="share1" />
                            <p className='line1-20 text-lg'>Families agree to have the nanny provide care at one of their homes. This setup simplifies logistics and allows the children to become familiar with a single environment.</p>
                        </div>
                    </div>
                </AnimatedWrapper>
                <div>
                    <p className="text-2xl Elliana-Samantha">OR</p>
                </div>
                <AnimatedWrapper
                    animationConfig={{
                        from: { opacity: 0, y: -50 },
                        to: { opacity: 1, y: 0, duration: 2.5, ease: "power3.out" },
                    }}
                >
                    <div className="w-96 max-lg:px-2 max-lg:w-full flex justify-center text-center ">
                        <div>
                            <p className="font-2xl uppercase font-bold Classico">Alternate Between Homes</p>
                            <img className='my-6' src={share2} alt="share2" />
                            <p className='line1-20 text-lg'>Families alternate hosting the nanny at their respective homes. This arrangement ensures that both families share the hosting responsibilities and children get comfortable in different settings.</p>
                        </div>

                    </div>
                </AnimatedWrapper>
            </div>
        </div>
    )
}