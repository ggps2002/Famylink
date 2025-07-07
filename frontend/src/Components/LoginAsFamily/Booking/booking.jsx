import { useEffect, useState } from "react";
import Requests from "./request";
import Upcoming from "./upcoming";
import Cancelled from "./cancelled";
import Completed from "./completed";
import { useLocation } from "react-router-dom";

export default function Booking() {
  const [val, setVal] = useState("pending");

  const location = useLocation();

  useEffect(() => {
    // Check if there's an initialTab value in the location state
    if (location.state?.initialTab) {
      setVal(location.state.initialTab);
    }
  }, [location.state]);

  const handleClick = (e) => {
    const value = e.currentTarget.getAttribute("data-value");
    setVal(value); // Do something with the value
  };
  return (
    <div className="padding-navbar1 Quicksand">
      <div className="shadow border-[1px] border-[#D6DDEB] bg-white rounded-xl my-5">
        <p className="lg:text-3xl text-2xl font-bold edit-padding Classico">Bookings</p>
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
                data-value="accepted"
                style={
                  val === "accepted" ? { borderBottom: "1px solid black" } : {}
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
                  Rejected Applications
                </p>
              </div>
            </div>

            <hr />
            {val == "pending" && (
              <div className="mt-5">
                <Requests type={'family'}/>
              </div>
            )}
            {val == "accepted" && (
              <div className="mt-5">
                <Completed type={'family'}/>
              </div>
            )}
            {val == "cancelled" && (
              <div className="mt-5">
                <Cancelled type={'family'}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
