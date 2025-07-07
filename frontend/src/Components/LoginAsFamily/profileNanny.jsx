import {
  HeartOutlined,
  CheckOutlined,
  HeartFilled,
  CloseOutlined,
} from "@ant-design/icons";
import Ra from "../subComponents/rate";
import Prog from "./subcomponents/progress";
import Reviews from "./subcomponents/Reviews";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNannyByIdThunk } from "../Redux/nannyData";
import { useCallback, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { customFormat } from "../subComponents/toCamelStr";
import { addOrRemoveFavouriteThunk } from "../Redux/favouriteSlice";
import { refreshTokenThunk } from "../Redux/authSlice";
import {
  requestThunk,
  statusThunk,
  withDrawThunk,
} from "../Redux/bookHireSlice";
import { fireToastMessage } from "../../toastContainer";
import { fetchOtherReqThunk } from "../Redux/fetchOtherReq";
import { SwalFireDelete, SwalFireSuccess } from "../../swalFire";
import { createChatThunk } from "../Redux/chatSlice";

export default function ProfileNanny() {
  const { id } = useParams();
  const [status, setStatus] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          await dispatch(fetchNannyByIdThunk(id));
        } catch (error) {
          console.error("Error fetching nanny data:", error);
        }
      }
    };

    fetchData();
  }, [dispatch, id]);
  const { selectedNanny } = useSelector((s) => s.nannyData);
  const { user } = useSelector((s) => s.auth);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const specificDaysAndTime = selectedNanny?.additionalInfo?.find(
    (info) => info.key === "specificDaysAndTime"
  )?.value;

  // Initialize state with `specificDaysAndTime` or empty times as `null`
  const [daysState, setDaysState] = useState(() => {
    return daysOfWeek.reduce((acc, day) => {
      const specificDay = specificDaysAndTime?.[day];
      acc[day] = {
        checked: !!specificDay,
        start: specificDay?.start || null, // Null if no start time exists
        end: specificDay?.end || null, // Null if no end time exists
      };
      return acc;
    }, {});
  });

  const isFavorited = user.favourite?.includes(id);
  const [buttonText, setButtonText] = useState("Book Now");
  const fetchStatus = useCallback(async () => {
    try {
      // Dispatch the thunk and unwrap the result
      const { data } = await dispatch(statusThunk({ nannyId: id })).unwrap();
      const fetchedStatus = data?.bookings;
      setStatus(fetchedStatus);

      // Set buttonText based on the fetched status
      if (fetchedStatus && fetchedStatus.length > 0) {
        const currentStatus = fetchedStatus[0];
        let newButtonText = "Book Now";

        if (currentStatus.status === "pending") {
          newButtonText =
            currentStatus.userRole === "requester"
              ? "With draw"
              : "Accept Request";
        } else if (currentStatus.status === "accepted") {
          newButtonText = "Cancel Booking";
        }
        // else if (currentStatus.status === 'completed' && !currentStatus?.booking?.isPaid) {
        //     newButtonText = 'Payment is due';
        // }
        // else if (currentStatus.status === 'completed' && !currentStatus?.booking?.nannyReview) {
        //     newButtonText = 'Waiting for review';
        // }
        else if (
          currentStatus.status === "completed" &&
          !currentStatus?.booking?.familyReview
        ) {
          newButtonText = "Give review";
        }
        setButtonText(newButtonText);
      } else {
        setButtonText("Book Now"); // Default text if no status
      }
    } catch (error) {
      setStatus(null);
      setButtonText("Book Now"); // Set default on error
    }
  }, [dispatch, id]); // Only recreate `fetchStatus` when `dispatch` or `id` change

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (!selectedNanny) {
    return <div>Loading...</div>; // You can customize this loading message or spinner
  }

  const favourite = async () => {
    await dispatch(addOrRemoveFavouriteThunk({ favouriteUserId: id }));
    await dispatch(refreshTokenThunk());
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleMessage = async () => {
    try {
      const participants = [id, user._id];
      const { data, status } = await dispatch(
        createChatThunk({ participants })
      ).unwrap();
      if (status == 201 || status == 200) {
        navigate(`/family/message/`);
      }
    } catch (error) {
      fireToastMessage({ type: "error", message: error.message });
    }
  };

  return (
    <div className="padding-navbar1 Quicksand">
      <div className="shadow-xl border-[1px] border-[#D6DDEB] bg-white my-8 px-6 py-4 rounded-2xl text-center">
        <div
          onClick={favourite}
          className="flex justify-end items-center gap-x-1 text-red-600 cursor-pointer"
        >
          {isFavorited ? <HeartFilled /> : <HeartOutlined />}

          <p className="text-lg underline">Save</p>
        </div>

        <div className="flex justify-center">
          <div>
            {selectedNanny?.imageUrl ? (
              <img
                className="mx-auto rounded-full w-24 object-contain"
                src={selectedNanny?.imageUrl}
                alt="img"
              />
            ) : (
              <Avatar
                className="rounded-full text-black"
                size="96"
                color={"#38AEE3"}
                name={
                  selectedNanny?.name
                    ?.split(" ") // Split by space
                    .slice(0, 2) // Take first 1–2 words
                    .join(" ") // Re-join them
                }
              />
            )}

            <p className="my-2 font-bold lg:text-3xl text-2xl">
              {selectedNanny?.name}
            </p>
            <p className="font-semibold text-lg">
              {selectedNanny?.location?.format_location}
            </p>
            {/* <p className='font-semibold text-lg'>{selectedNanny?.zipCode && `Zip Code: ${selectedNanny?.zipCode}`}</p> */}
            {(selectedNanny?.gender || selectedNanny?.age) && (
              <p className="mb-2 text-lg">
                {selectedNanny?.gender}{" "}
                {selectedNanny?.age && `| Age: ${selectedNanny?.age}`}
              </p>
            )}

            {selectedNanny?.additionalInfo[16]?.value.option ? (
              <p
                style={{ background: "#E7F6FD" }}
                className="mx-auto my-4 px-2 py-1 rounded-lg w-20 text-sm"
              >
                {selectedNanny?.additionalInfo[16]?.value.option}
              </p>
            ) : null}

            <Ra
              points={
                selectedNanny?.averageRating ? selectedNanny?.averageRating : 0
              }
              size={16}
            />
            <div className="my-4">
              <button
                onClick={handleMessage}
                style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
                className="bg-white mx-4 my-0 mt-2 px-6 py-2 rounded-full font-normal text-base hover:-translate-y-1 duration-700 delay-150 hover:scale-110"
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl">
        <p className="mb-2 font-bold text-2xl">Weekly Schedule</p>

        <div className="flex flex-wrap justify-left gap-x-10 gap-y-5">
          {days.map((day, index) => {
            const daySchedule = selectedNanny?.additionalInfo?.find(
              (info) => info.key === "specificDaysAndTime"
            )?.value?.[day];

            return (
              <div
                key={index}
                className={`pr-8 ${
                  index < days.length - 1 ? "schdule-Border" : ""
                }`}
              >
                <p className="font-semibold text-lg">{day}</p>
                {daySchedule && daySchedule.checked ? (
                  <>
                    <p>
                      Start{" "}
                      <span className="font-bold">
                        {new Date(daySchedule.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                    <p>
                      End{" "}
                      <span className="font-bold">
                        {new Date(daySchedule.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="w-28">I don't work on {day}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-[1px] border-[#D6DDEB] bg-white my-8 p-4 rounded-2xl">
        <p className="mb-2 font-bold text-2xl">Services</p>

        <div className="flex flex-wrap justify-between gap-x-10 gap-y-5">
          {Object.entries(
            selectedNanny.additionalInfo.find(
              (info) => info.key === "salaryExp"
            )?.value
          )?.map(([key, value], i) => (
            <div className="flex justify-between border-2 px-4 py-1 rounded-3xl w-72 text-gray-500 cursor-pointer">
              <p className="text-lg">{i + 1} Child</p>
              <p className="font-bold text-black text-lg">${value}/hr</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 w-full">
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
          {" "}
          {/* 75% width */}
          <p className="mb-2 font-bold text-2xl">About Me</p>
          <p className="leading-5">
            {
              selectedNanny?.additionalInfo.find(
                (info) => info.key === "jobDescription"
              )?.value
            }
          </p>
        </div>
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-2div">
          {" "}
          {/* 25% width */}
          <p className="mb-2 font-bold text-2xl">Looking For</p>
          <div>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">
                Availability:
              </span>{" "}
              {
                selectedNanny?.additionalInfo.find(
                  (info) => info.key === "avaiForWorking"
                )?.value?.option
              }
            </p>

            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">Start:</span>{" "}
              {
                selectedNanny?.additionalInfo.find(
                  (info) => info.key === "availability"
                )?.value?.option
              }
            </p>

            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">
                Age group:
              </span>{" "}
              {selectedNanny?.additionalInfo
                .find((info) => info.key === "ageGroupsExp")
                ?.value?.option.map((v, i) => (
                  <span key={i}>
                    {customFormat(v).split(" ")[0]}
                    {i <
                    selectedNanny?.additionalInfo.find(
                      (info) => info.key === "ageGroupsExp"
                    )?.value?.option.length -
                      1
                      ? ", "
                      : ""}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 my-8 w-full">
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
          {" "}
          {/* 75% width */}
          <p className="mb-2 font-bold text-2xl">Qualifications</p>
          <div>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">
                Certifications:{" "}
              </span>
              {selectedNanny?.additionalInfo
                .find((info) => info.key === "certification")
                ?.value?.option.map((v, i) => (
                  <span key={i}>
                    {customFormat(v)}
                    {i <
                    selectedNanny?.additionalInfo.find(
                      (info) => info.key === "certification"
                    )?.value?.option.length -
                      1
                      ? ", "
                      : ""}
                  </span>
                ))}
            </p>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">
                Languages:{" "}
              </span>
              {selectedNanny?.additionalInfo
                .find((info) => info.key === "language")
                ?.value?.option.map((v, i) => (
                  <span key={i}>
                    {customFormat(v)}
                    {i <
                    selectedNanny?.additionalInfo.find(
                      (info) => info.key === "language"
                    )?.value?.option.length -
                      1
                      ? ", "
                      : ""}
                  </span>
                ))}
            </p>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">Others:</span>{" "}
              {`${customFormat(
                user.additionalInfo.find((info) => info.key === "ableToCook")
                  ?.value?.option || ""
              )}, ${customFormat(
                user.additionalInfo.find(
                  (info) => info.key === "helpWithHousekeeping"
                )?.value?.option || ""
              )}`}
            </p>
          </div>
        </div>
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-2div">
          <p className="mb-2 font-bold text-2xl">Work Experience</p>
          <div>
            <p className="font-semibold text-lg Quicksand">
              {
                selectedNanny?.additionalInfo.find(
                  (info) => info.key === "experience"
                )?.value?.option
              }{" "}
              of experience caring for:
            </p>
            {selectedNanny?.additionalInfo
              .find((info) => info.key === "ageGroupsExp")
              ?.value?.option.map((v, i) => (
                <p className="text-base">
                  <span className="font-semibold text-lg Quicksand">
                    {customFormat(v).split(" ")[0]}:
                  </span>{" "}
                  {customFormat(v).split(" ").slice(1).join(" ")}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-6 my-8 w-full">
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
          <p className="mb-2 font-bold text-2xl">Reviews</p>
          {selectedNanny?.reviews && selectedNanny?.reviews?.length > 0 ? (
            <div>
              <div className="flex gap-4">
                <div>
                  {selectedNanny?.averageRating && (
                    <p className="font-bold text-4xl text-center Quicksand">
                      {selectedNanny?.averageRating}
                    </p>
                  )}

                  <Ra
                    points={
                      selectedNanny?.averageRating
                        ? selectedNanny?.averageRating
                        : 0
                    }
                    size={8}
                  />
                  <p style={{ fontSize: 8 }}>
                    {selectedNanny?.reviews?.length} Reviews
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
                {selectedNanny?.reviews.map((v, i) => (
                  <Reviews
                    size={8}
                    points={v?.rating}
                    para={v?.msg}
                    name={v?.userId?.name}
                    img={v?.userId?.imageUrl}
                    hr={i !== selectedNanny?.reviews.length - 1} // Only add <hr> if it's not the last item
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No reviews available</p>
          )}
        </div>

        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl h-40 width-2div">
          <p className="mb-2 font-bold text-2xl">Verified Info</p>
          <div className="flex">
            <p className="w-52 font-semibold text-lg Quicksand">Phone Number</p>
            {selectedNanny?.phoneNo ? <CheckOutlined /> : <CloseOutlined />}
          </div>

          <div className="flex">
            <p className="w-52 font-semibold text-lg Quicksand">National ID</p>
            {selectedNanny?.verified?.nationalIDVer == "true" ? (
              <CheckOutlined />
            ) : (
              <CloseOutlined />
            )}
          </div>

          <div className="flex">
            <p className="w-52 font-semibold text-lg Quicksand">Email</p>
            {selectedNanny?.verified?.emailVer ? (
              <CheckOutlined />
            ) : (
              <CloseOutlined />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
