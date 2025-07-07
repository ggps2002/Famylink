
import { useSelector } from "react-redux"
import App from "../subComponents/modal"

export default function SettingNanny() {
    const { user } = useSelector((s) => s.auth)
    return (
        <div className="padding-navbar1 Quicksand">
            <div className="shadow border-[1px] border-[#D6DDEB] bg-white my-5 rounded-xl">
                <p className='font-bold lg:text-3xl text-2xl edit-padding'>Setting</p>
                <div className="pb-10 padding-sub">
                    <p className="mb-5 font-bold text-2xl">Account Setting</p>
                    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <App head={'Email'} />
                        <App head={'Password'} />
                        <App head={'Phone Number'} />
                        {/* <App head={'Payments'} /> */}
                        <App head={'National ID'} />
                        {/* <App head={'Delete Account'} /> */}
                        {
                            !user?.verified.emailVer &&
                            <App head={'Email Verification'} />
                        }
                    </div>
                </div>

                <div className="pb-10 padding-sub">
                    <p className="mb-5 font-bold text-2xl">Notifications</p>
                    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <App head={'Email Notification'} />
                        {/* <App head={'SMS'} enable={true} /> */}
                    </div>
                </div>

            </div>
        </div>
    )
}