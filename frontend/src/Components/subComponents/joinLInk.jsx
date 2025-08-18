import { NavLink } from "react-router-dom";
import { AnimatedWrapper } from "./animation";





export default function JoinLink({ head, subHead, head1, subHead1, img1, head2, subHead2, img2, head3, subHead3, img3, head4, subHead4, img4, btn, share, btnName, link }) {
    return (
        <div className="flex justify-center text-center items-center'">
            <div>
                <AnimatedWrapper
                    animationConfig={{
                        from: { opacity: 0, y: -50 },
                        to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                    }}
                >
                    <p className='font-normal Livvic uppercase px-3 offer-font'>{head}</p>
                </AnimatedWrapper>

                <p className="font-lg">{subHead}</p>
                <div style={{ background: "#FDFCFA" }} className='flex flex-wrap justify-center gap-16 px-12 py-6 mt-10'>
                    {
                        img1 &&
                        <div className={share ? `border-res-share` : `w-52`}>
                            <img className="mx-auto my-0" src={img1} alt="img1" />
                            <div>
                                <p style={{ lineHeight: "25px" }} className='Livvic text-2xl font-bold my-4'>{head1}</p>
                                <p className='line1-20'>{subHead1}</p>
                            </div>
                        </div>
                    }
                    {
                        img2 &&
                        <div className={share ? `border-res-share` : `w-52`}>
                            <img className="mx-auto my-0" src={img2} alt="img2" />
                            <div>
                                <p style={{ lineHeight: "25px" }} className='Livvic text-2xl font-bold my-4'>{head2}</p>
                                <p className='line1-20'>{subHead2}</p>
                            </div>
                        </div>
                    }

                    {
                        img3 &&
                        <div className={share ? `border-radius-share` : `w-52`}>
                            <img className="mx-auto my-0" src={img3} alt="img3" />
                            <div>
                                <p style={{ lineHeight: "25px" }} className='Livvic text-2xl font-bold my-4'>{head3}</p>
                                <p className='line1-20'>{subHead3}</p>
                            </div>
                        </div>
                    }

                    {
                        img4 &&
                        <div className={share ? `w-80` : `w-52`}>
                            <img className="mx-auto my-0" src={img4} alt="img4" />
                            <div>
                                <p style={{ lineHeight: "25px" }} className='Livvic text-2xl font-bold my-4'>{head4}</p>
                                <p className='line1-20'>{subHead4}</p>
                            </div>
                        </div>
                    }

                </div>
                {
                    btn &&
                    <NavLink to={link} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <button style={{ background: "#85D1F1" }} className='py-1 mt-10 px-6 text-base font-normal transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-700 ...'>{btnName ? btnName : 'Learn More'}</button>
                    </NavLink>
                }

            </div>
        </div>
    )
}