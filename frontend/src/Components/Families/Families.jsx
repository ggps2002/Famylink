import Sec1 from "../subComponents/sec1"
import Sec2 from "../subComponents/sec2"
import Sec3 from "../subComponents/sec3"
import img from '../../assets/images/family-pic.png'
import img3 from '../../assets/images/img3.png'
import ser1 from '../../assets/images/ser1.png'
import ser2 from '../../assets/images/ser2.png'
import ser3 from '../../assets/images/ser3.png'
import { TestimonialSlider } from "../subComponents/carousel"
import FrequentAskQuestion from "../subComponents/frequentAskQues"
import { AnimatedWrapper } from "../subComponents/animation"
import { NavLink } from "react-router-dom"

export default function Families() {

    const faq = [
        {
            question: 'Is FamyLink only for finding nannies, or can I hire other types of caregivers?',
            answer: 'FamyLink helps families connect with a variety of caregivers, including private educators, swim instructors, music teachers, and household managers.Whether you need a full- time nanny, a part - time tutor, or a weekend babysitter, you can find the right fit for your needs.'
        },
        {
            question: 'Can I hire a caregiver who also teaches my child a skill, like a second language or piano?',
            answer: 'Absolutely! Many caregivers on FamyLink offer additional skills beyond childcare. You can specify your preferences when posting a job or searching for candidates.'
        },
        {
            question: ' Can I see caregiver rates before messaging them?',
            answer: 'Yes! Caregiver profiles display their hourly rates, availability, and any additional services they offer, helping you make an informed decision before reaching out.'
        },
        {
            question: 'What happens if I hire someone and later decide they’re not the right fit? ',
            answer: 'If you need to make a change, FamyLink allows you to keep your job posting active and find a new caregiver easily. We also provide contract templates to help set clear expectations upfront.'
        }
    ]
    return (
        <div className="pb-12" style={{
            background: 'linear-gradient(176.8deg, rgba(158, 220, 225, 0.5) -44.67%, rgba(218, 244, 239, 0.4) 25.5%, #EFECE6 100%)'
        }}>
            <div className='padd-res'>
                <Sec1 pic={img} head={"Quality care for your family's unique needs"} preHead={"Find your perfect match"} />

                <div className="bg-white py-12">
                    <Sec2 head={"What can we Offer"} border={true} />
                </div>

                <div className="bg-white px-4 mt-12 justify-between gap-12 items-center famil-sec3">
                    <img src={img3} alt="img3" />
                    <div>
                        <p className="Classico uppercase text-4xl mb-12">Nanny Share</p>
                        <div className="mx-8 ">
                            <p className="Classico font-bold lg:text-3xl text-2xl ">Affordable solution for childcare:</p>
                            <p className="text-lg my-6 line1-20">Nanny sharing is a cost-effective and social childcare solution where two or more families hire a  single nanny to care for their children together. It allows families to share the cost while  providing personalized care and fostering social interaction among children.</p>
                            <NavLink to={'/nannShare'} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-base text-cyan-500 underline cursor-pointer transition-colors duration-300 hover:opacity-70">
                                Learn more about nanny share
                            </NavLink>
                        </div>
                    </div>
                </div>

                <div className="bg-white mt-12 justify-center items-center famil-sec3">
                    <AnimatedWrapper
                        animationConfig={{
                            from: { opacity: 0, y: -100 },
                            to: { opacity: 1, y: 0, duration: 2.5, ease: "power3.out" },
                        }}
                    >
                        <Sec3 sec={true} />
                    </AnimatedWrapper>
                </div>

                <div className="bg-white px-12 py-12 mt-12 justify-center items-center text-center">
                    <div>
                        <p className="Classico text-4xl ">Enhance Your Services With Additional Services</p>
                        <p className="text-lg line1-20 mt-6 mx-auto add-width">Streamline your childcare arrangements with our additional services. Ensure peace of  mind and ease with payroll management, comprehensive background checks, and  customizable job contract templates.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-12 my-24">
                        <div className="text-center w-80">
                            <img className="my-0 mx-auto" src={ser1} alt="ser1" />
                            <p className="Classico text-xl font-bold mt-6 mb-3">Payroll Management</p>
                            <p className="text-base">Simplify payment processes and tax filings for your caregivers.</p>
                        </div>
                        <div className="text-center w-80">
                            <img className="my-0 mx-auto" src={ser2} alt="ser2" />
                            <p className="Classico text-xl font-bold mt-6 mb-3">Background Checks</p>
                            <p className="text-base">Access thorough screening options to ensure the safety and  reliability of your caregivers.</p>
                        </div>
                        <div className="text-center w-80">
                            <img className="my-0 mx-auto" src={ser3} alt="ser3" />
                            <p className="Classico text-xl font-bold mt-6 mb-3">Job Contract Templates</p>
                            <p className="text-base">Utilize customizable templates to create clear, professional  agreements with your caregivers.</p>
                        </div>
                    </div>
                    <NavLink to={'/services'} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <button style={{ background: "#85D1F1" }} className='py-1 px-6 text-base font-normal transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-700 ...'>Learn More</button>
                    </NavLink>
                </div>

                <div className='bg-white pt-6  flex flex-wrap justify-center text-center items-center mt-16'>
                    <div>
                        <div>
                            <AnimatedWrapper
                                animationConfig={{
                                    from: { opacity: 0, y: -50 },
                                    to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                                }}
                            >
                                <p style={{

                                    display: "inline-block" // Ensures the border matches the text width
                                }} className=' font-normal Classico uppercase px-3 family-font'>What our families are saying</p></AnimatedWrapper>
                            <p className='text-lg mt-6 mb-14 mx-auto home-sec3 line1-20'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore magna aliqua.</p>
                        </div>
                        <TestimonialSlider />
                    </div>
                </div>

                <div className="bg-white px-12 py-12 mt-12 justify-center items-center text-center">
                    <FrequentAskQuestion faq={faq} head={'Families FAQ (Hiring a Caregiver)'}/>
                </div>
            </div>
        </div>
    )
}