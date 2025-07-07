import React from 'react';
import { AnimatedWrapper } from './animation';

const BenefitCard = ({ icon, title, description }) => {
    return (
        <div className="flex width-card-share gap-4 items-center">
            <div>
                <img src={icon} alt={title} className="rounded-full w-full h-full object-contain" />
            </div>
            <div>
                <h3 className="text-lg font-semibold Classico line1-20">{title}</h3>
                <p className="text-gray-600 line1-20">{description}</p>
            </div>

        </div>
    );
};

const BenefitsSection = ({ benefits, head }) => {

    return (
        <div className='flex justify-center'>
            <section className="">
                <div className="container mx-auto px-4">
                    <AnimatedWrapper
                        animationConfig={{
                            from: { opacity: 0, y: -50 },
                            to: { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
                        }}
                    >
                        <h2 className="font-normal text-center Classico uppercase px-3 offer-font mb-10">
                            {head}
                        </h2>
                    </AnimatedWrapper>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 justify-center mx-auto">
                        {benefits.map((benefit, index) => (
                            <BenefitCard
                                key={index}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>

    );
};

export default BenefitsSection;
