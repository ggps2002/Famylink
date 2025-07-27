import { useRef } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import Ra from "../subComponents/rate";
import Prog from "../LoginAsFamily/subcomponents/progress";
import Reviews from "../LoginAsFamily/subcomponents/Reviews";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import {
  customFormat,
  formatSentence,
  formatTime,
} from "../subComponents/toCamelStr";
import { addOrRemoveFavouriteThunk } from "../Redux/favouriteSlice";
import { refreshTokenThunk } from "../Redux/authSlice";
import {
  requestThunk,
  statusThunk,
  withDrawThunk,
} from "../Redux/bookHireSlice";
import { fireToastMessage } from "../../toastContainer";
import { fetchFamilyByIdThunk } from "../Redux/familyData";
import { fetchOtherReqThunk } from "../Redux/fetchOtherReq";
import { createChatThunk } from "../Redux/chatSlice";
import { fetchPostJobByIdThunk } from "../Redux/postJobSlice";
import Loader from "../subComponents/loader";
import {
  findMatchingRate1,
  formatCreatedAt,
  formatTimeRange,
} from "../../Config/helpFunction";
import useSocket from "../../Config/socket";
import { Button } from "antd";
import { getSubscriptionStatusThunk } from "../Redux/cardSlice";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
} from "lucide-react";
import CustomButton from "../../NewComponents/Button";

function formatJobTitle(jobType) {
  if (!jobType) return "Job Needed";

  const withSpaces = jobType.replace(/([a-z])([A-Z])/g, "$1 $2");
  const capitalized = withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return `${capitalized} Needed`;
}

export default function ProfileNanny() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { socket } = useSocket();
  const nannyShare = pathname.split("/")[1] === "family";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useSelector((state) => state.jobPost);
  const { user, accessToken } = useSelector((state) => state.auth);
  const isFavorited = user.favourite?.includes(id);
  const subscription = useSelector(
    (state) => state.cardData.subscriptionStatus
  );
  const isSubscribed = subscription?.active;

  const [buttonText, setButtonText] = useState("Apply");

  const ratingCount = data?.user?.reviews?.reduce((acc, review) => {
    const rating = Math.floor(review.rating);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = data?.user?.reviews?.length || 0;

  // Helper function to format location
  const formatLocation = () => {
    if (!data?.user?.zipCode || !data?.user?.location) return "";
    const parts = data?.user?.location.format_location.split(",") || [];
    const city = parts.at(-3)?.trim();
    const state = parts.at(-2)?.trim().split(" ")[0];
    return city && state ? `${city}, ${state}` : "";
  };

  const ratingPercentages = [5, 4, 3, 2, 1].map((num) => {
    const count = ratingCount?.[num] || 0;
    const pro = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { num, pro };
  });

  useEffect(() => {
    dispatch(fetchPostJobByIdThunk(id));
    dispatch(getSubscriptionStatusThunk());
  }, [dispatch, id]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const { data } = await dispatch(statusThunk(id)).unwrap();
      const fetchedStatus = data?.bookings;

      setStatus(fetchedStatus);

      if (fetchedStatus?.length > 0) {
        const currentStatus = fetchedStatus[0];
        let newButtonText = "Apply";
        if (currentStatus.status === "pending") newButtonText = "With draw";
        else if (currentStatus.status === "accepted")
          newButtonText = "Cancel Booking";
        else if (
          currentStatus.status === "completed" &&
          !currentStatus?.booking?.nannyReview
        )
          newButtonText = "Give review";

        setButtonText(newButtonText);
      } else {
        setButtonText("Apply");
      }
    } catch {
      setButtonText("Apply");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [dispatch, id]);

  const favourite = async () => {
    await dispatch(
      addOrRemoveFavouriteThunk({ favouriteUserId: id, accessToken })
    );
    await dispatch(refreshTokenThunk());
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const { data: bookingData } = await dispatch(requestThunk(id)).unwrap();
      const updateContent = {
        bookingId: bookingData?.booking._id,
        senderId: user._id,
        receiverId: data.user._id,
        content: "Send request",
        type: "Booking",
      };
      await new Promise((resolve) =>
        socket?.emit("sendNotification", { content: updateContent }, resolve)
      );
      fetchStatus();
      fireToastMessage({ success: true, message: bookingData.message });
      await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
    } catch (error) {
      fireToastMessage({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const scrollRef = useRef(null);
  const scrollAmount = 300; // adjust scroll distance as needed

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleWithdraw = async () => {
    const { _id } = status[0]?.booking;
    setLoading(true);
    try {
      const { status, data } = await dispatch(withDrawThunk(_id)).unwrap();
      if (status === 200) {
        fireToastMessage({ success: true, message: data.message });
        fetchStatus();
        await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
      }
    } catch (error) {
      fireToastMessage({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (buttonText === "Apply") await handleBooking();
    else if (buttonText === "With draw") await handleWithdraw();
    else if (buttonText === "Accept Request") navigate("/nanny/booking");
    else if (buttonText === "Cancel Booking")
      navigate("/nanny/booking", { state: { initialTab: "upcoming" } });
    else if (buttonText === "Give review")
      navigate("/nanny/booking", { state: { initialTab: "accepted" } });
  };

  const handleMessage = async () => {
    try {
      const participants = [user?._id, data?.user?._id];
      const { status } = await dispatch(
        createChatThunk({ participants })
      ).unwrap();
      if (status === 201 || status === 200) {
        navigate(nannyShare ? `/family/message/` : `/nanny/message/`);
      }
    } catch (error) {
      fireToastMessage({ type: "error", message: error.message });
    }
  };

  if (isLoading) return <Loader />;

  console.log("data:", data);
  return (
    // <div className="padding-navbar1 Quicksand">
    //   {!isSubscribed && (
    //     <>
    //       <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50" />
    //       <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-6 rounded-xl shadow-xl text-center">
    //         <p className="text-2xl font-semibold mb-2">Subscribe to Unlock</p>
    //         <p className="mb-4 text-gray-600">
    //           Unlock full caregiver details and messaging
    //         </p>
    //         <Button
    //           onClick={() => navigate("/pricing")}
    //           className="bg-[#38AEE3] text-white px-4 py-1 rounded-full hover:opacity-80"
    //         >
    //           Upgrade Now
    //         </Button>
    //       </div>
    //     </>
    //   )}
    //   <div className="shadow-xl border-[1px] border-[#D6DDEB] bg-white my-8 px-6 py-4 rounded-2xl text-center">
    //     {
    //       <div
    //         onClick={favourite}
    //         className="flex justify-end items-center gap-x-1 text-red-600 cursor-pointer"
    //       >
    //         {isFavorited ? <HeartFilled /> : <HeartOutlined />}

    //         <p className="text-lg underline">Save</p>
    //       </div>
    //     }

    //     <div className="flex justify-center">
    //       <div>
    //         {data?.user?.imageUrl ? (
    //           <img
    //             className="bg-black mx-auto rounded-full w-24 h-24 object-contain"
    //             src={data?.user?.imageUrl}
    //             alt="img"
    //           />
    //         ) : (
    //           <Avatar
    //             className="rounded-full text-black"
    //             size="96"
    //             color={"#38AEE3"}
    //             name={data?.user?.name
    //               ?.split(" ") // Split by space
    //               .slice(0, 2) // Take first 1–2 words
    //               .join(" ")}
    //           />
    //         )}
    //         <p className="my-2 font-bold lg:text-3xl text-2xl">
    //           {data?.user?.name}
    //         </p>
    //         <p className="font-semibold text-lg">
    //           {data?.user?.location?.format_location}
    //         </p>
    //         {/* <p className="font-semibold text-lg">
    //           Zip Code: {data?.user?.zipCode}
    //         </p> */}
    //         {(data?.user?.gender || data?.user?.age) && (
    //           <p className="mb-2 text-lg">
    //             {data?.user?.gender}{" "}
    //             {data?.user?.age && `| Age: ${data?.user?.age}`}
    //           </p>
    //         )}

    //         {data?.[data?.jobType]?.preferredSchedule && (
    //           <p
    //             style={{ background: "#E7F6FD" }}
    //             className="mx-auto my-4 px-2 py-1 rounded-lg w-20 text-sm"
    //           >
    //             {data?.[data?.jobType]?.preferredSchedule}
    //           </p>
    //         )}

    //         <Ra
    //           points={data?.user?.averageRating ? data?.user?.averageRating : 0}
    //           size={16}
    //         />
    //         <div className="flex flex-wrap justify-center gap-4 my-4">
    //           <Button
    //             onClick={handleMessage}
    //             style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
    //             className="bg-white mt-2 px-6 h-10 rounded-full font-normal text-base hover:-translate-y-1 duration-700 delay-150 hover:scale-110"
    //           >
    //             Message
    //           </Button>
    //           {!nannyShare && !data?.hired && (
    //             <Button
    //               style={{ background: "#85D1F1", color: "white" }}
    //               onClick={handleClick}
    //               loading={loading}
    //               className="mt-2 px-6 h-10 rounded-full font-normal text-base hover:-translate-y-1 duration-700 delay-150 hover:scale-110"
    //             >
    //               {buttonText}
    //             </Button>
    //           )}
    //         </div>
    //         {data?.hired && (
    //           <NavLink
    //             to={"/nanny"}
    //             className={
    //               "text-[#38AEE3]  over:-translate-y-1 duration-700 delay-150 hover:opacity-60"
    //             }
    //           >
    //             Candidates already hired
    //           </NavLink>
    //         )}
    //       </div>
    //     </div>
    //   </div>

    //   <div className="relative">
    //     {!isSubscribed && (
    //       <>
    //         <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50 rounded-2xl" />
    //         <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-6 rounded-xl shadow-xl text-center">
    //           <p className="text-2xl font-semibold mb-2">Subscribe to Unlock</p>
    //           <p className="mb-4 text-gray-600">
    //             Unlock full caregiver details
    //           </p>
    //           <Button
    //             onClick={() => navigate("/pricing")}
    //             className="bg-[#38AEE3] text-white px-4 py-1 rounded-full hover:opacity-80"
    //           >
    //             Upgrade Now
    //           </Button>
    //         </div>
    //       </>
    //     )}
    //     <div className="flex flex-wrap gap-x-4 gap-y-6 w-full">
    //       <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div min-h-40">
    //         <p className="mb-2 font-bold text-2xl">Description</p>
    //         <p className="leading-5">{data?.[data?.jobType]?.jobDescription}</p>
    //       </div>
    //       <div className="width-2div">
    //         <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl">
    //           <p className="mb-2 font-bold text-2xl">Looking For</p>
    //           <div>
    //             <p className="text-base">
    //               <span className="font-semibold text-lg Quicksand">
    //                 Availability:
    //               </span>{" "}
    //               {data?.[data?.jobType]?.preferredSchedule}
    //             </p>
    //             <p className="text-base capitalize">
    //               <span className="font-semibold text-lg Quicksand">
    //                 Hourly rate:
    //               </span>{" "}
    //               {data?.[data?.jobType]?.hourlyRate
    //                 ? findMatchingRate1(data?.[data?.jobType]?.hourlyRate)
    //                 : "Not Specified"}
    //             </p>
    //             <p className="text-base capitalize">
    //               <span className="font-semibold text-lg Quicksand ">
    //                 Preferred:
    //               </span>{" "}
    //               {data?.[data?.jobType]?.mode
    //                 ? data?.[data?.jobType]?.mode
    //                 : "Not Specified"}
    //             </p>
    //           </div>
    //         </div>
    //         <div className="border-[1px] border-[#D6DDEB] bg-white mt-4 p-4 rounded-2xl">
    //           <p className="mb-2 font-bold text-2xl">Requirements:</p>
    //           <div>
    //             <p className="text-base">
    //               <span className="font-semibold text-lg Quicksand">
    //                 Specific type:{" "}
    //               </span>
    //               {data?.jobType ? (
    //                 <span>{formatSentence(data?.jobType)}</span>
    //               ) : (
    //                 <span>No need</span>
    //               )}
    //             </p>
    //             <p className="text-base">
    //               <span className="font-semibold text-lg Quicksand">
    //                 Goal:{" "}
    //               </span>
    //               {data[data.jobType]?.goal ? (
    //                 <span>
    //                   {Array.isArray(data[data.jobType]?.goal) &&
    //                     data[data.jobType].goal.join(", ")}
    //                 </span>
    //               ) : (
    //                 <span>No need</span>
    //               )}
    //             </p>
    //             <p className="text-base">
    //               <span className="font-semibold text-lg Quicksand">
    //                 Often Require:{" "}
    //               </span>
    //               {data[data.jobType]?.require ? (
    //                 <span>{data?.[data?.jobType]?.require}</span>
    //               ) : (
    //                 <span>No need</span>
    //               )}
    //             </p>
    //             {data[data.jobType]?.typeOf && (
    //               <p className="text-base">
    //                 <span className="font-semibold text-lg Quicksand">
    //                   Types:{" "}
    //                 </span>
    //                 {data[data.jobType]?.typeOf ? (
    //                   <span>{data[data.jobType].typeOf.join(", ")}</span>
    //                 ) : (
    //                   <span>No need</span>
    //                 )}
    //               </p>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="flex flex-wrap gap-x-4 gap-y-6 my-8 w-full">
    //       <div className="flex gap-6 border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
    //         <div>
    //           <p className="mb-2 font-bold text-2xl">Number of Child</p>
    //           <p>
    //             {data?.user?.noOfChildren && data?.user?.noOfChildren?.length}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="mb-2 font-bold text-2xl">Age of Children</p>
    //           <p>
    //             {data?.user?.noOfChildren?.info &&
    //               Object.entries(data?.user?.noOfChildren?.info)
    //                 .map(([child, age]) => `${formatSentence(child)}: ${age}`)
    //                 .join(", ")}
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="padding-navbar1 w-full flex justify-between">
      <div className="w-full flex flex-col items-center space-y-4">
        {/* Head */}
        <div className="shadow-soft p-6 w-full lg:w-1/2 rounded-[20px] space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="Livvic-SemiBold text-2xl text-primary">
              {formatJobTitle(data?.jobType)}
            </h1>
            <div className="flex gap-2">
              <div className="py-2 px-4 rounded-full bg-[#ECF1FF] Livvic-SemiBold text-sm">
                {data?.[data?.jobType]?.preferredSchedule}
              </div>
              <div
                onClick={favourite}
                className="flex justify-end items-center gap-x-1 text-red-600 cursor-pointer"
              >
                {" "}
                {isFavorited ? (
                  <HeartFilled className="text-tertiary" />
                ) : (
                  <Heart className="text-tertiary" height={20} width={20} />
                )}
              </div>
            </div>
          </div>
          <p className="Livvic-Medium items-center text-sm text-[#555555] flex gap-4">
            <MapPin className="w-5 h-5" />{" "}
            {formatLocation(data?.user?.location)}
          </p>
          <p className="Livvic-Medium items-center text-sm text-[#555555] flex gap-4">
            <img src="/care-person.svg" alt="nanny" />{" "}
            {data?.user?.noOfChildren?.length} kids (
            {data?.user?.noOfChildren?.info &&
              Object.entries(data.user.noOfChildren.info)
                .map(([child, age]) => age && `${age} yrs old`)
                .filter(Boolean)
                .join(", ")}
            )
          </p>
          <p className="Livvic-Medium items-center text-sm text-[#555555] flex gap-4">
            <Calendar className="w-5 h-5" /> {formatCreatedAt(data?.createdAt)}
          </p>
          <p className="Livvic-Medium items-center text-sm text-[#222222] flex gap-4">
            {data?.user?.imageUrl ? (
              <img
                className="bg-black mx-auto rounded-full w-6 h-6 object-contain"
                src={data?.user?.imageUrl}
                alt="img"
              />
            ) : (
              <Avatar
                className="rounded-full text-black"
                size="24"
                color={"#38AEE3"}
                name={data?.user?.name
                  ?.split(" ") // Split by space
                  .slice(0, 2) // Take first 1–2 words
                  .join(" ")}
              />
            )}
            {data?.user?.name}
          </p>
        </div>
        <div className="shadow-soft p-6 w-full lg:w-1/2 rounded-[20px] space-y-2">
          <h1 className="Livvic-SemiBold text-2xl text-primary mb-2">
            Children Information
          </h1>
          {data?.user?.noOfChildren?.info &&
            Object.entries(data.user.noOfChildren.info)
              .map(
                ([child, age]) => `• ${child}, ${age ? ` ${age} yrs old` : ""}`
              )
              .filter(Boolean)
              .join(", ")}
        </div>
        <div className="shadow-soft p-6 w-full lg:w-1/2 rounded-[20px] space-y-2">
          <h1 className="Livvic-SemiBold text-2xl text-primary mb-4">
            Expectations
          </h1>
          <div className="text-sm text-gray-700 space-y-2">
            {data?.[data?.jobType]?.expectationsCaregiver &&
              Object.entries(data[data.jobType].expectationsCaregiver).map(
                ([activity, specify], idx) => (
                  <p key={idx} className="text-[#555555] Livvic-Medium">
                    •{" "}
                    {activity
                      .replace(/([A-Z])/g, " $1") // insert space before capital letters
                      .replace(/^./, (c) => c.toUpperCase())}
                    <span className="text-[#555555] Livvic-SemiBold">
                      {specify ? `: ${specify}` : ""}
                    </span>
                  </p>
                )
              )}
          </div>
        </div>
        <div className="shadow-soft p-6 w-full lg:w-1/2 rounded-[20px] space-y-2">
          <h1 className="Livvic-SemiBold text-2xl text-primary mb-4">
            Schedule
          </h1>
          {data?.[data?.jobType]?.specificDays &&
            Object.entries(data[data.jobType]?.specificDays).map(
              ([day, time], idx) => (
                <>
                  <p key={idx} className="text-[#555555] Livvic-SemiBold">
                    • {day}
                  </p>
                  <p className="text-[#666666] Livvic-Medium">
                    {formatTimeRange(time.start, time.end)}
                  </p>
                </>
              )
            )}
        </div>
        <div className="shadow-soft p-3 sm:p-4 md:p-6 rounded-[20px] w-full max-w-full lg:w-1/2">
          <p className="Livvic-SemiBold text-base md:text-lg text-primary">
            Reviews
          </p>
          {data?.user?.reviews && data?.user?.reviews.length > 0 ? (
            <div className="mt-4">
              <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4 lg:gap-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="Livvic-Bold text-2xl sm:text-3xl md:text-4xl">
                      {data?.user?.averageRating}
                    </p>
                    <Ra points={data?.user?.averageRating} size={20} />
                    <p className="Livvic-SemiBold text-sm">
                      {user?.reviews.length} Reviews
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    {ratingPercentages.map(({ num, pro }, i) => (
                      <Prog key={i} num={num} pro={pro} color={"#029E76"} />
                    ))}
                  </div>
                </div>
                <div className="flex self-center lg:self-end gap-2 md:gap-4 justify-center">
                  <div
                    onClick={scrollLeft}
                    className="p-2 rounded-full border border-[#EEEEEE] cursor-pointer hover:bg-gray-50 touch-manipulation"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <div
                    onClick={scrollRight}
                    className="p-2 rounded-full border border-[#EEEEEE] cursor-pointer hover:bg-gray-50 touch-manipulation"
                  >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-start">
                <div
                  ref={scrollRef}
                  className="mt-6 md:mt-10 flex flex-nowrap gap-2 sm:gap-3 md:gap-4 overflow-x-auto lg:overflow-x-hidden scroll-smooth snap-x snap-mandatory overflow-y-hidden w-full"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#CBD5E0 transparent",
                  }}
                >
                  {data?.user?.reviews?.map((v, i) => (
                    <Reviews
                      key={i}
                      size={8}
                      points={v?.rating}
                      para={v?.msg}
                      name={v?.reviewer?.name}
                      img={v?.reviewer?.imageUrl}
                      hr={i !== data?.user?.reviews.length - 1} // Only add <hr> if it's not the last item
                      created={v?.createdAt}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm md:text-base">No reviews available</p>
          )}
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          {!nannyShare && !data?.hired && (
            <CustomButton
              btnText={buttonText}
              action={() => handleClick()}
              className=" bg-[#AEC4FF]"
            />
          )}
          <CustomButton
            btnText={"Message"}
            action={() => handleMessage()}
            className="border border-[#EEEEEE] text-[#555555]"
          />
        </div>
        {data?.hired && (
          <NavLink
            to={"/nanny"}
            className={
              "text-green-800  over:-translate-y-1 duration-700 delay-150 hover:opacity-60"
            }
          >
            Candidates already hired
          </NavLink>
        )}
      </div>
    </div>
  );
}

{
  /* <div className="shadow-soft p-4 md:p-6 rounded-[20px]">
          <p className="Livvic-SemiBold text-base md:text-lg text-primary">
            Reviews
          </p>
          {data?.user?.reviews && data?.user?.reviews.length > 0 ? (
            <div className="mt-4">
              <div className="flex flex-col items-center md:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="Livvic-Bold text-3xl md:text-4xl">
                      {data?.user?.averageRating}
                    </p>
                    <Ra points={data?.user?.averageRating} size={20} />
                    <p className="Livvic-SemiBold text-sm">
                      {user?.reviews.length} Reviews
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {ratingPercentages.map(({ num, pro }, i) => (
                      <Prog key={i} num={num} pro={pro} color={"#029E76"} />
                    ))}
                  </div>
                </div>
                <div className="flex self-center md:self-end gap-2 md:gap-4 justify-center">
                  <div
                    onClick={scrollLeft}
                    className="p-2 rounded-full border border-[#EEEEEE] cursor-pointer hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <div
                    onClick={scrollRight}
                    className="p-2 rounded-full border border-[#EEEEEE] cursor-pointer hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-start">
                <div
                  ref={scrollRef}
                  className="mt-6 md:mt-10 flex flex-nowrap gap-3 md:gap-4 overflow-x-hidden scroll-smooth snap-x snap-mandatory overflow-y-hidden"
                >
                  {data?.user?.reviews?.map((v, i) => (
                    <Reviews
                      key={i}
                      size={8}
                      points={v?.rating}
                      para={v?.msg}
                      name={v?.reviewer?.name}
                      img={v?.reviewer?.imageUrl}
                      hr={i !== data?.user?.reviews.length - 1} // Only add <hr> if it's not the last item
                      created={v?.createdAt}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm md:text-base">No reviews available</p>
          )}
        </div> */
}
