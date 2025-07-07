
import Sec1 from "../subComponents/sec1"
import Sec4 from "../subComponents/sec4"
import JoinLink from "../subComponents/joinLInk"
import img6 from '../../assets/images/img6.png'
import ser1 from '../../assets/images/ser1.png'
import ser2 from '../../assets/images/ser2.png'
import ser3 from '../../assets/images/ser3.png'
import ser4 from '../../assets/images/ser4.png'
import ser5 from '../../assets/images/ser5.png'
import ser6 from '../../assets/images/ser6.png'
import st1 from '../../assets/images/step9.png'
import st2 from '../../assets/images/step10.png'
import st3 from '../../assets/images/step11.png'
import st4 from '../../assets/images/step12.png'
import BenefitsSer from "../subComponents/benefitsServices"
import WorkStep from "../subComponents/worksStep"
import ComingSoon from "../subComponents/comingSoon"
import FrequentAskQuestion from "../subComponents/frequentAskQues"
import GetStarted from "../subComponents/getStarted"
import { NavLink } from "react-router-dom"

export default function Services() {
    const benefits = [
        {
            icon: ser4,
            title: 'Simplified Processes',
            description: 'Save time and reduce hassle with our user-friendly tools.',
        },
        {
            icon: ser5,
            title: 'Peace of Mind',
            description: 'Know that your caregivers are vetted and your agreements are solid.',
        },
        {
            icon: ser6,
            title: 'Customization',
            description: 'Tailor contracts and services to fit your unique needs.',
        },
    ];

    const step1 = [
        { title: "Step 1", description: "Create an account and access our suite of services.", head: "Sign Up", img: st1 },
        { title: "Step 2", description: "Select the service you need – payroll management, background checks, or job contract templates.", head: "Choose a Service", img: st2 },
        { title: "Step 3", description: "Tailor the service to your specific requirements and start using it immediately.", head: "Customize and Implement", img: st3 },
        { title: "Step 4", description: "Receive continuous support and updates to keep your processes running smoothly.", head: "Ongoing Support", img: st4 }
    ];
    return (
        <div className="relative">
            {/* Slightly blurred background */}
            <div
                className="pb-12 pointer-events-none select-none"
                style={{
                    background: 'linear-gradient(176.68deg, #E8E1D5 -21.31%, rgba(255, 255, 255, 0.2) 124.93%)',
                    width: "auto"
                }}
            >
                <div className="padd-res">
                    <Sec1
                        head={"Comprehensive Services for Your Peace of Mind"}
                        preHead={"Streamline your childcare management with our essential services"}
                        pic={img6}
                    />

                    <div className="bg-white">
                        <Sec4
                            subHead={
                                <>
                                    At{" "}
                                    <NavLink
                                        to={"/joinNow"}
                                        className="cursor-pointer text-blue-600 transition-colors duration-300 hover:text-blue-400"
                                    >
                                        FamyLink,
                                    </NavLink>{" "}
                                    we offer a range of services to support families and caregivers...
                                </>
                            }
                        />
                    </div>

                    {/* <div className="bg-white mt-12 py-12 px-1">
                        <JoinLink
                            head={"Service Highlights"}
                            img1={ser1}
                            img2={ser2}
                            img3={ser3}
                            head1={"Payroll Management"}
                            head2={"Background Checks"}
                            head3={"Job Contract Templates"}
                            subHead1={"Effortlessly manage..."}
                            subHead2={"Ensure the safety..."}
                            subHead3={"Create clear..."}
                            share={true}
                        />
                    </div>

                    <div className="bg-white mt-12 py-12 px-1">
                        <BenefitsSer head={"Benefits of Our Services"} benefits={benefits} />
                    </div>

                    <div className="bg-white mt-12 py-12 px-1">
                        <WorkStep steps={step1} head={"How It Works"} subHead={"How Our Services Work"} />
                    </div> */}
                </div>
            </div>

            {/* Coming Soon overlay */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/50 backdrop-blur-lg z-10">
                <ComingSoon bg={true} />
            </div>
        </div>
    );


}