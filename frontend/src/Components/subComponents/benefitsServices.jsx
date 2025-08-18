
const BenefitCard = ({ icon, title, description }) => {
    return (
        <div className="flex w-64 gap-4 items-center">
            <div>
                <img src={icon} alt={title} className="rounded-full w-full h-full object-contain" />
            </div>
            <div>
                <h3 className="text-lg font-semibold Livvic line1-20">{title}</h3>
                <p className="text-gray-600 line1-20">{description}</p>
            </div>

        </div>
    );
};

export default function BenefitsSer({ benefits, head }) {
    return (
        <div>
            <div>
                <h2 className="font-normal text-center Livvic uppercase px-3 offer-font mb-10">
                    {head}
                </h2>
                <div className="flex flex-wrap justify-center gap-y-12 gap-x-24">
                    {
                        benefits.map((v, i) => (

                            <BenefitCard icon={v.icon} title={v.title} description={v.description} />

                        ))
                    }
                </div>

            </div>
        </div>
    )
}