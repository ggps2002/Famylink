import ChatInterface from "./chatInterface";
export default function MessageFrame() {
    return (
        <div className="padding-navbar1 Quicksand">
            <div className="shadow border-[1px] border-[#D6DDEB] bg-white rounded-xl my-5">
                <p className='lg:text-3xl text-2xl font-bold edit-padding'>Messages</p>
                <div className="padding-sub pb-10">
                    <ChatInterface />
                </div>
            </div>
        </div >
    )
}