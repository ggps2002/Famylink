import CardForInfo from "../LoginAsFamily/subcomponents/cardForInfo";
import Reviews from "../LoginAsFamily/subcomponents/Reviews";
import Ra from "../subComponents/rate";
import Prog from "../LoginAsFamily/subcomponents/progress";
import image from "../../assets/images/s1.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { format, parseISO } from "date-fns";
import { customFormat } from "../subComponents/toCamelStr";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { fireToastMessage } from "../../toastContainer";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const location = window.location.origin;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timingKey = "specificDaysAndTime"; // The key you want to access
  const timingValue = user?.additionalInfo.find(
    (info) => info.key === timingKey
  )?.value; // Access the specific object based on the key

  let timingText = "";
  if (timingValue && typeof timingValue === "object") {
    timingText = Object.keys(timingValue)
      .filter((day) => timingValue[day]?.checked) // Only include days where checked is true
      .map((day) => {
        const { start, end } = timingValue[day]; // Destructure start and end from the day object

        // Format the start and end times
        const formattedStart = format(parseISO(start), "hh:mm a"); // Convert start time
        const formattedEnd = format(parseISO(end), "hh:mm a"); // Convert end time

        return `${day} ${formattedStart} - ${formattedEnd}`; // Format the string as "day start - end"
      })
      .join(", "); // Join all the strings with a comma
  }

  const jobDescriptionKey = "jobDescription"; // The key you want to access
  const jobDescriptionValue = user?.additionalInfo.find(
    (info) => info.key === jobDescriptionKey
  )?.value;

  const salaryExp = user?.additionalInfo.find(
    (info) => info.key === "salaryExp"
  )?.value;

  return (
    <div className="padding-navbar1 Quicksand">
      <div className="shadow-xl border-[1px] border-[#D6DDEB] bg-white my-8 px-6 py-4 rounded-2xl text-center">
        <div className="flex items-center justify-center">
          <div>
            {user?.imageUrl ? (
              <img
                className="mx-auto rounded-full w-24 object-contain"
                src={user?.imageUrl}
                alt="img"
              />
            ) : (
              <Avatar
                className="rounded-full text-black"
                size="96"
                color={"#38AEE3"}
                name={user?.name
                  ?.split(" ") // Split by space
                  .slice(0, 2) // Take first 1–2 words
                  .join(" ")}
              />
            )}
            <p className="my-2 font-bold lg:text-3xl text-2xl">{user.name}</p>
            {user?.location && (
              <p className="font-semibold text-lg">
                {user?.location?.format_location}
              </p>
            )}

            <div className="mt-4 mb-2">
              <NavLink
                to={"/nanny/edit"}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <button
                  style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
                  className="bg-white mx-4 my-0 mt-2 px-6 py-2 rounded-full font-normal text-base hover:-translate-y-1 duration-700 delay-150 hover:scale-110"
                >
                  Edit Profile
                </button>
              </NavLink>
            </div>
            <div
              style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
              className="flex items-center gap-2 mb-4 pl-4 rounded-full max-w-full md:max-w-[500px]"
            >
              <p
                className="font-normal text-16-12 truncate overflow-hidden whitespace-nowrap flex-grow"
                title={`${location}/profile/${user?._id}`}
              >
                {location}/profile/{user?._id}
              </p>

              <button
                style={{
                  background: "#38AEE3",
                  borderRadius: "0px 50px 50px 0px",
                  flexShrink: 0, // prevents the button from shrinking
                }}
                className="hover:opacity-60 px-2 py-2 font-normal text-16-12 text-white duration-700 delay-150"
                onClick={() => {
                  const textToCopy = `${location}/profile/${user?._id}`;
                  navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                      fireToastMessage({ message: "Link copied successfully" });
                    })
                    .catch((err) => {
                      fireToastMessage({ type: "error", message: err });
                    });
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl">
        <p className="mb-2 font-bold text-2xl">Weekly Schedule</p>

        <div className="flex flex-wrap justify-left gap-x-10 gap-y-5">
          {days.map((day, index) => {
            const dayData = user?.additionalInfo.find(
              (info) => info.key === "specificDaysAndTime"
            )?.value[day];
            return (
              <div
                key={index}
                className={`pr-8 ${
                  index < days.length - 1 ? "schdule-Border" : ""
                }`}
              >
                <p className="font-semibold text-lg">{day}</p>
                {dayData && dayData.checked ? (
                  <>
                    <p>
                      Start{" "}
                      <span className="font-bold">
                        {new Date(dayData.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                    <p>
                      End{" "}
                      <span className="font-bold">
                        {new Date(dayData.end).toLocaleTimeString([], {
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
        <p className="mb-2 font-bold text-2xl">Hourly Rate</p>

        <div className="flex flex-wrap justify-between gap-x-10 gap-y-5">
          {Object.entries(salaryExp || {}).map(([key, value], i) => (
            <div
              key={key} // Ensure you provide a unique key for each child
              className="flex justify-between border-2 px-4 py-1 rounded-3xl w-72 text-gray-500 cursor-pointer"
            >
              <p className="text-lg">{i + 1} Child</p>
              <p className="font-bold text-black text-lg">${value}/hr</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 w-full">
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
          <p className="mb-2 font-bold text-2xl">About Me</p>
          <p className="leading-5">{jobDescriptionValue}</p>
        </div>
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-2div">
          <p className="mb-2 font-bold text-2xl">Looking For</p>
          <div>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">
                Availability:
              </span>{" "}
              {
                user?.additionalInfo.find(
                  (info) => info.key === "avaiForWorking"
                )?.value.option
              }
            </p>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">Start:</span>{" "}
              {
                user?.additionalInfo.find((info) => info.key === "availability")
                  ?.value.option
              }
            </p>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">
                Age group:
              </span>{" "}
              {user?.additionalInfo
                .find((info) => info.key === "ageGroupsExp")
                ?.value.option.map((v, i, arr) => (
                  <span key={i}>
                    {customFormat(v).split(" ")[0]}
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 my-8 w-full">
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
          <p className="mb-2 font-bold text-2xl">Qualifications</p>
          <div>
            <p className="text-base">
              <span className="font-semibold text-lg Quicksand">
                Certifications:{" "}
              </span>
              {user.additionalInfo
                .find((info) => info.key === "certification")
                ?.value.option.map((v, i) => (
                  <span key={i}>
                    {customFormat(v)}
                    {i <
                    user.additionalInfo.find(
                      (info) => info.key === "certification"
                    )?.value.option.length -
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
              {user.additionalInfo
                .find((info) => info.key === "language")
                ?.value.option.map((v, i) => (
                  <span key={i}>
                    {customFormat(v)}
                    {i <
                    user.additionalInfo.find((info) => info.key === "language")
                      ?.value.option.length -
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
                user?.additionalInfo.find((info) => info.key === "experience")
                  ?.value.option
              }{" "}
              of experience caring for:
            </p>
            {user.additionalInfo
              .find((info) => info.key === "ageGroupsExp")
              ?.value.option.map((v, i) => (
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
          {user?.reviews && user?.reviews.length > 0 ? (
            <div>
              <div className="flex gap-4">
                <div>
                  <p className="font-bold text-4xl text-center Quicksand">
                    {user?.averageRating}
                  </p>
                  <Ra points={user?.averageRating} size={8} />
                  <p style={{ fontSize: 8 }}>{user?.reviews.length} Reviews</p>
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
                {user?.reviews?.map((v, i) => (
                  <Reviews
                    size={8}
                    points={v?.rating}
                    para={v?.msg}
                    name={v?.userId?.name}
                    img={v?.userId?.imageUrl}
                    hr={i !== user?.reviews.length - 1} // Only add <hr> if it's not the last item
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
            {user.phoneNo ? <CheckOutlined /> : <CloseOutlined />}
          </div>

          <div className="flex">
            <p className="w-52 font-semibold text-lg Quicksand">National ID</p>
            {user?.verified?.nationalIDVer == "true" ? (
              <CheckOutlined />
            ) : (
              <CloseOutlined />
            )}
          </div>

          <div className="flex">
            <p className="w-52 font-semibold text-lg Quicksand">Email</p>
            {user?.verified?.emailVer ? <CheckOutlined /> : <CloseOutlined />}
          </div>
        </div>
      </div>
    </div>
  );
}
