import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import Ra from "../subComponents/rate";
import Prog from "../LoginAsFamily/subcomponents/progress";
import Reviews from "../LoginAsFamily/subcomponents/Reviews";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { customFormat, formatSentence } from "../subComponents/toCamelStr";
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
import { findMatchingRate1 } from "../../Config/helpFunction";
import useSocket from "../../Config/socket";
import { Button } from "antd";
import { getSubscriptionStatusThunk } from "../Redux/cardSlice";

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

  return (
    <div className="padding-navbar1 Quicksand">
      {!isSubscribed && (
        <>
          <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50" />
          <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-6 rounded-xl shadow-xl text-center">
            <p className="text-2xl font-semibold mb-2">Subscribe to Unlock</p>
            <p className="mb-4 text-gray-600">
              Unlock full caregiver details and messaging
            </p>
            <Button
              onClick={() => navigate("/pricing")}
              className="bg-[#38AEE3] text-white px-4 py-1 rounded-full hover:opacity-80"
            >
              Upgrade Now
            </Button>
          </div>
        </>
      )}
      <div className="shadow-xl border-[1px] border-[#D6DDEB] bg-white my-8 px-6 py-4 rounded-2xl text-center">
        {
          <div
            onClick={favourite}
            className="flex justify-end items-center gap-x-1 text-red-600 cursor-pointer"
          >
            {isFavorited ? <HeartFilled /> : <HeartOutlined />}

            <p className="text-lg underline">Save</p>
          </div>
        }

        <div className="flex justify-center">
          <div>
            {data?.user?.imageUrl ? (
              <img
                className="bg-black mx-auto rounded-full w-24 h-24 object-contain"
                src={data?.user?.imageUrl}
                alt="img"
              />
            ) : (
              <Avatar
                className="rounded-full text-black"
                size="96"
                color={"#38AEE3"}
                name={data?.user?.name
                  ?.split(" ") // Split by space
                  .slice(0, 2) // Take first 1–2 words
                  .join(" ")}
              />
            )}
            <p className="my-2 font-bold lg:text-3xl text-2xl">
              {data?.user?.name}
            </p>
            <p className="font-semibold text-lg">
              {data?.user?.location?.format_location}
            </p>
            {/* <p className="font-semibold text-lg">
              Zip Code: {data?.user?.zipCode}
            </p> */}
            {(data?.user?.gender || data?.user?.age) && (
              <p className="mb-2 text-lg">
                {data?.user?.gender}{" "}
                {data?.user?.age && `| Age: ${data?.user?.age}`}
              </p>
            )}

            {data?.[data?.jobType]?.preferredSchedule && (
              <p
                style={{ background: "#E7F6FD" }}
                className="mx-auto my-4 px-2 py-1 rounded-lg w-20 text-sm"
              >
                {data?.[data?.jobType]?.preferredSchedule}
              </p>
            )}

            <Ra
              points={data?.user?.averageRating ? data?.user?.averageRating : 0}
              size={16}
            />
            <div className="flex flex-wrap justify-center gap-4 my-4">
              <Button
                onClick={handleMessage}
                style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
                className="bg-white mt-2 px-6 h-10 rounded-full font-normal text-base hover:-translate-y-1 duration-700 delay-150 hover:scale-110"
              >
                Message
              </Button>
              {!nannyShare && !data?.hired && (
                <Button
                  style={{ background: "#85D1F1", color: "white" }}
                  onClick={handleClick}
                  loading={loading}
                  className="mt-2 px-6 h-10 rounded-full font-normal text-base hover:-translate-y-1 duration-700 delay-150 hover:scale-110"
                >
                  {buttonText}
                </Button>
              )}
            </div>
            {data?.hired && (
              <NavLink
                to={"/nanny"}
                className={
                  "text-[#38AEE3]  over:-translate-y-1 duration-700 delay-150 hover:opacity-60"
                }
              >
                Candidates already hired
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        {!isSubscribed && (
          <>
            <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50 rounded-2xl" />
            <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-6 rounded-xl shadow-xl text-center">
              <p className="text-2xl font-semibold mb-2">Subscribe to Unlock</p>
              <p className="mb-4 text-gray-600">
                Unlock full caregiver details
              </p>
              <Button
                onClick={() => navigate("/pricing")}
                className="bg-[#38AEE3] text-white px-4 py-1 rounded-full hover:opacity-80"
              >
                Upgrade Now
              </Button>
            </div>
          </>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-6 w-full">
          <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div min-h-40">
            <p className="mb-2 font-bold text-2xl">Description</p>
            <p className="leading-5">{data?.[data?.jobType]?.jobDescription}</p>
          </div>
          <div className="width-2div">
            <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl">
              <p className="mb-2 font-bold text-2xl">Looking For</p>
              <div>
                <p className="text-base">
                  <span className="font-semibold text-lg Quicksand">
                    Availability:
                  </span>{" "}
                  {data?.[data?.jobType]?.preferredSchedule}
                </p>
                <p className="text-base capitalize">
                  <span className="font-semibold text-lg Quicksand">
                    Hourly rate:
                  </span>{" "}
                  {data?.[data?.jobType]?.hourlyRate
                    ? findMatchingRate1(data?.[data?.jobType]?.hourlyRate)
                    : "Not Specified"}
                </p>
                <p className="text-base capitalize">
                  <span className="font-semibold text-lg Quicksand ">
                    Preferred:
                  </span>{" "}
                  {data?.[data?.jobType]?.mode
                    ? data?.[data?.jobType]?.mode
                    : "Not Specified"}
                </p>
              </div>
            </div>
            <div className="border-[1px] border-[#D6DDEB] bg-white mt-4 p-4 rounded-2xl">
              <p className="mb-2 font-bold text-2xl">Requirements:</p>
              <div>
                <p className="text-base">
                  <span className="font-semibold text-lg Quicksand">
                    Specific type:{" "}
                  </span>
                  {data?.jobType ? (
                    <span>{formatSentence(data?.jobType)}</span>
                  ) : (
                    <span>No need</span>
                  )}
                </p>
                <p className="text-base">
                  <span className="font-semibold text-lg Quicksand">
                    Goal:{" "}
                  </span>
                  {data[data.jobType]?.goal ? (
                    <span>
                      {Array.isArray(data[data.jobType]?.goal) &&
                        data[data.jobType].goal.join(", ")}
                    </span>
                  ) : (
                    <span>No need</span>
                  )}
                </p>
                <p className="text-base">
                  <span className="font-semibold text-lg Quicksand">
                    Often Require:{" "}
                  </span>
                  {data[data.jobType]?.require ? (
                    <span>{data?.[data?.jobType]?.require}</span>
                  ) : (
                    <span>No need</span>
                  )}
                </p>
                {data[data.jobType]?.typeOf && (
                  <p className="text-base">
                    <span className="font-semibold text-lg Quicksand">
                      Types:{" "}
                    </span>
                    {data[data.jobType]?.typeOf ? (
                      <span>{data[data.jobType].typeOf.join(", ")}</span>
                    ) : (
                      <span>No need</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-6 my-8 w-full">
          <div className="flex gap-6 border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
            <div>
              <p className="mb-2 font-bold text-2xl">Number of Child</p>
              <p>
                {data?.user?.noOfChildren && data?.user?.noOfChildren?.length}
              </p>
            </div>
            <div>
              <p className="mb-2 font-bold text-2xl">Age of Children</p>
              <p>
                {data?.user?.noOfChildren?.info &&
                  Object.entries(data?.user?.noOfChildren?.info)
                    .map(([child, age]) => `${formatSentence(child)}: ${age}`)
                    .join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-6 my-8 w-full">
          <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
            <p className="mb-2 font-bold text-2xl">Reviews</p>
            {data?.user?.reviews && data?.user?.reviews?.length > 0 ? (
              <div>
                <div className="flex gap-4">
                  <div>
                    {data?.user?.averageRating && (
                      <p className="font-bold text-4xl text-center Quicksand">
                        {data?.user?.averageRating}
                      </p>
                    )}

                    <Ra
                      points={
                        data?.user?.averageRating
                          ? data?.user?.averageRating
                          : 0
                      }
                      size={8}
                    />
                    <p style={{ fontSize: 8 }}>
                      {data?.user?.reviews?.length} Reviews
                    </p>
                  </div>
                  <div>
                    <Prog num={5} pro={100} color={"#029E76"} />
                    <Prog num={4} pro={70} color={"#029E76"} />
                    <Prog num={3} pro={60} color={"#FEA500"} />
                    <Prog num={2} pro={40} color={"#FF5269"} />
                    <Prog num={1} pro={30} color={"#FF5269"} />
                  </div>
                </div>

                <div className="mt-10 pr-10 max-h-48 overflow-auto">
                  {data?.user?.reviews &&
                    data?.user?.reviews.map((v, i) => (
                      <Reviews
                        key={i}
                        size={8}
                        points={v?.rating}
                        para={v?.msg}
                        name={v?.reviewer?.name}
                        img={v?.reviewer?.imageUrl}
                        hr={i !== data?.user?.reviews.length - 1} // Only add <hr> if it's not the last item
                      />
                    ))}
                </div>
              </div>
            ) : (
              <p>No reviews available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
