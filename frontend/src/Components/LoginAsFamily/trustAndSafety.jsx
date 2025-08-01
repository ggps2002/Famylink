

import line from '../../assets/images/lineVer.png'

export default function TrustsAndSafety() {
    return (
        <div className="padding-navbar1 Quicksand">
            <div className="relative img-main1 h-96 bg-cover mt-10 rounded-3xl bg-center flex items-center justify-center">
                <div style={{ background: "#DEEBEB99" }} className="absolute rounded-3xl inset-0 bg-opacity-60"></div>
                <div className="relative z-10 text-center max-w-3xl px-4">
                    <h2 className="text-4xl font-semibold">Trust & Safety</h2>
                    <p className="mt-2 font-normal text-black leading-5">Creating a reliable space for families and caregivers to connect.
                    </p>
                </div>
            </div>

            <div className="flex justify-center text-center my-14">
                <div className='dashboard-width'>
                    <img className='h-5 mb-5 mx-auto' src={line} alt="line" />
                    <p className="leading-5 font-normal">At Famlink, your trust matters. We’ve built our platform to support safe, respectful connections between families and caregivers through secure messaging, detailed profiles, and clear community standards.</p>
                    <p className="leading-5 my-4 font-normal">We encourage all users to communicate openly, ask questions, and use references when making decisions. Our team is dedicated to providing tools and tips that help you feel confident every step of the way.</p>
                    <p className="leading-5 font-normal">As our community grows, so will our safety features—because your peace of mind is always a priority.</p>
                </div>
            </div>
        </div>
    )
}