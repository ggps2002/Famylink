

import { useLocation } from 'react-router-dom'
import line from '../../assets/images/lineVer.png'
import st1 from '../../assets/images/step1.png'
import st2 from '../../assets/images/step2.png'
import st3 from '../../assets/images/step3.png'
import st4 from '../../assets/images/step4.png'
import WorkStep from '../subComponents/worksStep'
export default function HowItWorks() {
    const { pathname } = useLocation()
    const boolean = (pathname.startsWith('/nanny'))
    const step1 = boolean ? [{ title: "Step 1", description: "Sign up and create a detailed profile showcasing your experience, skills, and certifications.", head: "Create Your Profile", img: st1 },
    { title: "Step 2", description: "Explore a variety of job opportunities that match your preferences and availability.", head: "Browse Job Listings", img: st2 },
    { title: "Step 3", description: "Communicate directly with families to discuss job details and arrange interviews.", head: "Connect with Families", img: st3 },
    { title: "Step 4", description: "Secure the job that fits your skills and schedule, and start making a difference.", head: "Get Hired", img: st4 }] : [
        {
            title: "Step 1",
            head: "Create Your Profile",
            description: "Sign up and build a profile that helps caregivers understand your family, your needs, and your expectations.",
            img: st1
        },
        {
            title: "Step 2",
            head: "Post a Job or Start a Nanny Share",
            description: "Share what kind of help you’re looking for—whether it's a full-time nanny, a part-time tutor, or someone to join a nanny share.",
            img: st2
        },
        {
            title: "Step 3",
            head: "Browse Caregiver Profiles",
            description: "View detailed caregiver profiles based on your preferences for availability, skills, location, and more.",
            img: st3
        },
        {
            title: "Step 4",
            head: "Connect and Interview",
            description: "Message caregivers directly, schedule interviews, and find the right fit for your family’s lifestyle.",
            img: st1
        },
        {
            title: "Step 5",
            head: "Hire with Confidence",
            description: "Use FamyLink to run background checks, access contract templates, and manage communication all in one place.",
            img: st4 // You’ll need to define/import `st5` if it isn’t already
        }
    ];

    return (
        <div className="padding-navbar1 Quicksand">
            <div className="relative img-main h-96 bg-cover mt-10 rounded-3xl bg-center flex items-center justify-center">
                <div style={{ background: "#DEEBEB99" }} className="absolute rounded-3xl inset-0 bg-opacity-60"></div>
                <div className="relative z-10 text-center max-w-3xl px-4">
                    <h2 className="text-4xl font-semibold">How It Works</h2>
                    <p className="mt-2 font-normal text-black leading-5">FamyLink makes it easy to find the right care—or the right opportunity. Whether you're a family
                        looking for support or a caregiver looking for your next role, we’ve made the process simple and
                        stress-free.
                    </p>
                    <p className="mt-2 font-normal text-black leading-5">
                        Create a profile, set your preferences, and start matching. That’s it.
                    </p>
                </div>
            </div>

            <div className="flex justify-center text-center my-14">
                <div className='dashboard-width'>
                    <p className='lg:text-3xl text-2xl font-bold'>Why use Famylink?</p>
                    <img className='h-5 my-5 mx-auto' src={line} alt="line" />
                    <p className="leading-5 font-normal">{boolean ? 'Because your skills deserve the right fit.' : `Because your time matters—and so does your trust.`}</p>
                    <p className="leading-5 font-normal mt-5">{boolean ? 'FamyLink isn’t just another gig platform. We’re a community built for nannies, educators, and caregivers who want to showcase their talents and connect with families who truly value them. From flexible job opportunities to nanny shares and private lessons, FamyLink gives you the tools to find the right match, communicate clearly, and get hired with confidence.' : 'FamyLink is more than just a job board. We’re a community built around parents, caregivers, and educators. From nanny shares and private educators to coaches and house managers, FamyLink gives you smart tools to match, message, and manage—with less guesswork and more confidence.'}</p>
                </div>
            </div>

            <div className=" mb-14 px-1">
                <WorkStep head={"How It Works"} subHead={"Steps to Get Started"} steps={step1} bg={'#FFFFFF'} />
            </div>
        </div>
    )
}