import { useState } from "react";
import { AnimatedWrapper } from "../subComponents/animation";
import { Check } from "lucide-react";



const Card = ({ head, price, data, buy }) => {
    return (
        <div className="lg:w-96 w-full min-h-[543px] bg-white rounded-3xl p-6 flex flex-col shadow-lg">
            {/* Header */}
            <div className="mb-6 Classico">
                <p className="text-2xl text-[#050A30]">{head}</p>
                <p className="text-5xl mt-2">
                    ${price}
                    <sub className="text-2xl font-normal text-black">/mo</sub>
                </p>
            </div>

            {/* Features List */}
            <div className="flex-1 flex flex-col gap-8 mt-4">
                {data?.map((v, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="p-1.5 bg-[#38AEE3] rounded-full">
                            <Check className="text-white size-3" />
                        </div>
                        <p className="text-lg text-[#050A30]">{v}</p>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <button className={`mt-8  ${buy ? `bg-[#38AEE380]` : 'bg-[#38AEE3]'} hover:opacity-80 text-white font-medium w-52 mx-auto h-10 rounded-full transition-all duration-300 ease-in-out`}>
                {buy ? `Already Using` : 'Buy Now'}
            </button>

        </div>
    );
};

export default function Pricing() {
    const [activeTab, setActiveTab] = useState('tab1');

    const tabs = [
        { id: 'tab1', label: 'For Families' },
        { id: 'tab2', label: 'For Job Seekers' },
        { id: 'tab3', label: 'For Businesses' },
    ];
    const cardData = [
        {
            head: 'Free',
            price: 0,
            data: ['Post jobs for free', 'Browse caregiver profiles (limited details)', 'Voice messages anywhere', 'View limited nanny share profiles (cannot message)'],
            buy: true
        },
        {
            head: 'Messaging Plan',
            price: 9.99,
            data: ['Unlocks full messaging with caregivers and nanny share families', 'View detailed caregiver profiles']
        },
        {
            head: 'Nanny Share Plan',
            price: 14.99,
            data: ['Includes all features from Messaging Plan', 'Unlimited nanny share matches', 'Cost-splitting calculator and agreement templates']
        },
    ]
    return (
        <div className="lg:py-12 py-6 px-1" style={{
            background: 'linear-gradient(176.7deg, #D9F1F1 -21.31%, rgba(246, 238, 233, 0.4) 52.57%, #FFF1F5 100%)'

        }}>
            <div className='padd-res'>
                <AnimatedWrapper
                    animationConfig={{
                        from: { opacity: 0, y: -50 },
                        to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                    }}
                >
                    <p className='Classico !font-normal lg:text-6xl text-3xl'>Subscription Plans &<br className="lg:block hidden" /> Pricing</p>
                    <p className="Elliana-Samantha font-normal lg:mt-8 mt-2 lg:text-3xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                </AnimatedWrapper>
            </div>

            <div className="flex justify-center">
                <div className="inline-flex items-start justify-center rounded-full lg:my-16 my-8 bg-white mx-auto shadow-md">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`lg:w-40 px-3 py-2 lg:text-lg text-sm rounded-full font-normal transition duration-300 ease-in-out ${isActive
                                    ? 'bg-[#38AEE3] text-white'
                                    : 'bg-white text-[#38AEE3]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mx-2">
                {
                    cardData.map((v, i) => (
                        <AnimatedWrapper
                            animationConfig={{
                                from: { opacity: 0, y: -50 },
                                to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                            }}
                        >
                            <div key={i}>
                                <Card head={v.head} price={v.price} data={v.data} buy={v?.buy} />
                            </div>
                        </AnimatedWrapper>
                    ))
                }
            </div>

        </div>
    )
}