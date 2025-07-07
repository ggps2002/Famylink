import s1 from '../../../assets/images/s1.png'

export default function CardComm({ val, head, para, img}){
    return(
        <div className="card-comm">
            <img className='rounded-xl w-full h-48 object-fill' src={img} alt="img" />
            <p className='font-bold text-sm leading-5'>{val}</p>
            <p className='my-3 font-bold text-2xl lg:leading-normal leading-none'>{head}</p>
            <p className="font-normal leading-normal whitespace-pre-line">{para}</p>
        </div>
    )
}