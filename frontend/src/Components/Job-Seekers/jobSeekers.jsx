import Sec1 from "../subComponents/sec1";
import img4 from '../../assets/images/img4.png'
import Sec4 from "../subComponents/sec4";
import Sec2 from "../subComponents/sec2";
import st1 from '../../assets/images/step1.png'
import st2 from '../../assets/images/step2.png'
import st3 from '../../assets/images/step3.png'
import st4 from '../../assets/images/step4.png'
import JoinLink from "../subComponents/joinLInk";
import WorkStep from "../subComponents/worksStep";
import Sec3 from "../subComponents/sec3";
import FrequentAskQuestion from "../subComponents/frequentAskQues";
import GetStarted from "../subComponents/getStarted";
import j7 from '../../assets/images/j7.png'
import j8 from '../../assets/images/j8.png'
import j9 from '../../assets/images/j9.png'
import j0 from '../../assets/images/j0.png'
import { AnimatedWrapper } from "../subComponents/animation";

export default function JobSeekers() {

    const step1 = [
        { title: "Step 1", description: "Sign up and create a detailed profile showcasing your experience, skills, and certifications.", head: "Create Your Profile", img: st1 },
        { title: "Step 2", description: "Explore a variety of job opportunities that match your preferences and availability.", head: "Browse Job Listings", img: st2 },
        { title: "Step 3", description: "Communicate directly with families to discuss job details and arrange interviews.", head: "Connect with Families", img: st3 },
        { title: "Step 4", description: "Secure the job that fits your skills and schedule, and start making a difference.", head: "Get Hired", img: st4 }
    ];

    const faq = [
        {
            question: 'Can I offer additional services like tutoring or pet sitting on my profile?',
            answer: 'Yes! FamyLink allows job seekers to highlight all of their skills, whether it’s language tutoring, swim instruction, or even occasional pet care. This helps you stand out and increase job opportunities.'
        },
        {
            question: 'Can I set my own rate, or is it determined by families?',
            answer: 'You set your own hourly rate, and families can decide whether they’d like to move forward based on your listed pricing.'
        },
        {
            question: 'How do I get more job offers?',
            answer: 'Completing your profile with a detailed bio, experience, and references increases visibility. Upgrading to a premium profile can also boost your ranking in searches and provide unlimited messaging with families.'
        },
        {
            question: 'What if I only want to work for a few hours a week?',
            answer: 'You can set your availability based on your preferred schedule. Families looking for part-time or occasional help will be able to find your profile.'
        }
    ]
    return (
        <div className="pb-12" style={{ background: "linear-gradient(176.7deg, #FFCADA -21.31%, rgba(246, 238, 233, 0.4) 52.57%, #FFF1F5 100%)" }}>
            <div className="padd-res">
                <Sec1 pic={img4} head={"Find your ideal job with ease"} preHead={"Discover jobs that match your passion and skills"} />

                <div className="bg-white">
                    <Sec4 head={"Join FamilyLink Community"} subHead={"Discover rewarding opportunities in childcare and beyond. Whether you're a nanny, babysitter, tutor, music instructor, sports coach, or specialized caregiver, FamyLink connects you with families seeking your skills and expertise."} />
                </div>
                <div className="bg-white  mt-12 py-12 px-1">
                    <Sec2 head={"Types of Job Opportunities"} border={true} btn={true} />
                </div>

                <div className="bg-white  mt-12 py-12 px-1">
                    <JoinLink head={"Why Join FamyLink?"} subHead={"Benefits of Joining FamyLink"} head1={"Connect with Families"} head2={"Flexible Opportunities"} head3={"Professional Network"} head4={"Resources and Support"} subHead1={"Easily find families in need of your services."} subHead2={"Choose from full-time, part-time, and occasional jobs."} subHead3={"Join a vibrant community of fellow caregivers for support and networking"} subHead4={"Tap into our dynamic resources to boost your skills and career, it's social, it's fun, and it's all here for you"} img1={j7} img2={j8} img3={j9} img4={j0} />
                </div>

                <div className="bg-white  mt-12 py-12 px-1">
                    <WorkStep steps={step1} head={"How It Works"} subHead={"Steps to Get Started"} />
                </div>

                <div className="bg-white  mt-12 py-12 px-1">
                    <AnimatedWrapper
                        animationConfig={{
                            from: { opacity: 0, y: -100 },
                            to: { opacity: 1, y: 0, duration: 2.5, ease: "power3.out" },
                        }}
                    >
                        <Sec3 first={true} />
                    </AnimatedWrapper>
                </div>

                <div className="bg-white px-12 py-12 mt-12 justify-center items-center text-center">
                    <FrequentAskQuestion faq={faq}/>
                </div>

                <div className="bg-white px-12 py-12 mt-12 justify-center items-center text-center">
                    <GetStarted head={"Get Started"} subHead={"Kickstart your journey with FamyLink and find the perfect job that matches your skills and passion"} />
                </div>
            </div>
        </div>
    )
}