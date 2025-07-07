import AplliedList from './SubComponents/paginationForApplication'

export default function Application() {
    return (
        <div className="padding-navbar1 Quicksand">
            <div className="shadow border-[1px] border-[#D6DDEB] bg-white my-5 py-10 rounded-xl">
                <p className='font-bold lg:text-3xl text-2xl padding-navbar1'>Applications</p>
                <div className='padding-navbar1'>
                   <AplliedList />
                </div>
            </div>
        </div>
    )
}