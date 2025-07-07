

export default function FamilyCard({ img, head, para, bord}){
    return(
        <div className={`h-auto w-44 py-2 px-4 ${!bord && 'lg:border-r border-[#E4E4E4]'}`}>
            <img src={img} className="mt-6 mx-auto" alt={img} />
            <p className="text-2xl font-bold Classico mt-4 mb-6">{head}</p>
            <p className="text-base font-normal	">{para}</p>
        </div>
    )
}