import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Requests from "../LoginAsFamily/Booking/request";
import Upcoming from "../LoginAsFamily/Booking/upcoming";
import Cancelled from "../LoginAsFamily/Booking/cancelled";
import Completed from "../LoginAsFamily/Booking/completed";
import Withdraw from "../LoginAsFamily/Booking/withdraw";

export default function BookingNanny() {
    const [val, setVal] = useState('pending');
    const location = useLocation();

    useEffect(() => {
        // Check if there's an initialTab value in the location state
        if (location.state?.initialTab) {
            setVal(location.state.initialTab);
        }
    }, [location.state]);

    const handleClick = (e) => {
        const value = e.currentTarget.getAttribute('data-value');
        setVal(value);
    };
    
    return (
        <div className="padding-navbar1 Quicksand">
            <div className="shadow border-[1px] border-[#D6DDEB] bg-white rounded-xl my-5">
                <p className='lg:text-3xl text-2xl font-bold edit-padding'>Bookings</p>
                <div>
                    <div className="padding-sub pb-10">
                        <div className="grid grid-cols-3 gap-0 place-items-stretch">
                            <div
                                data-value="pending"
                                style={
                                    val === "pending" ? { borderBottom: "1px solid black" } : {}
                                }
                                onClick={handleClick}
                                className="cursor-pointer flex justify-center items-center w-full"
                            >
                                <p className="text-header-booking font-semibold text-center pb-2">
                                    Pending Applications
                                </p>
                            </div>
                            <div
                                data-value="completed"
                                style={
                                    val === "completed" ? { borderBottom: "1px solid black" } : {}
                                }
                                onClick={handleClick}
                                className="cursor-pointer flex justify-center items-center w-full"
                            >
                                <p className="text-header-booking font-semibold text-center pb-2">
                                    Accepted Applications
                                </p>
                            </div>
                            <div
                                data-value="cancelled"
                                style={
                                    val === "cancelled" ? { borderBottom: "1px solid black" } : {}
                                }
                                onClick={handleClick}
                                className="cursor-pointer flex justify-center items-center w-full"
                            >
                                <p className="text-header-booking font-semibold text-center pb-2">
                                    Withdrawn Applications
                                </p>
                            </div>
                        </div>
                        <hr />
                        {val === 'pending' && <div className="mt-5"><Requests type={'nanny'} /></div>}
                        {val === 'cancelled' && <div className="mt-5"><Withdraw type={'nanny'} /></div>}
                        {val === 'completed' && <div className="mt-5"><Completed type={'nanny'} /></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
