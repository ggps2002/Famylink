



export default function OfferCard({ im, head, para, color}){
    return(
        <div style={{ background: `${color}` }} className="w-72 h-80 rounded-3xl py-8 px-6">
            <img className='h-24 w-24 rounded-full' src={im} alt={im} />
            <p className='Classico text-2xl	font-bold text-left pt-10 pb-2'>{head}</p>
            <p className='font-normal text-base text-left'>{para}</p>
        </div>
    )
}