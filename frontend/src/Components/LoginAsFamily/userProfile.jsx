import Reviews from "./subcomponents/Reviews";
import Ra from "../subComponents/rate";
import Prog from "./subcomponents/progress";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { customFormat, formatSentence } from "../subComponents/toCamelStr";
import { fireToastMessage } from "../../toastContainer";
import { useEffect } from "react";
import { ProfileCard1 } from "../subComponents/profileCard";
import { fetchPostJobByCurrentUserThunk } from "../Redux/postJobSlice";
import Loader from "../subComponents/loader";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const location = window.location.origin;
  const { data, isLoading } = useSelector((s) => s.jobPost);

  useEffect(() => {
    dispatch(fetchPostJobByCurrentUserThunk());
  }, [dispatch]);
  if (isLoading) {
    return <Loader />;
  }
  // console.log(data)
  return (
    <div className="padding-navbar1 Quicksand">
      <div className="shadow-xl bg-white my-8 px-6 py-4 rounded-2xl text-center">
        <div className="flex justify-center">
          <div>
            {user?.imageUrl ? (
              <img
                className="mx-auto rounded-full w-24 h-24 object-cover"
                src={user?.imageUrl}
                alt="img"
              />
            ) : (
              <Avatar
                className="rounded-full text-black"
                size="96"
                color={"#38AEE3"}
                name={
                  user?.name
                    ?.split(" ") // Split by space
                    .slice(0, 2) // Take first 1–2 words
                    .join(" ") // Re-join them
                }
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
                to={"/family/edit"}
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
              <p className="font-normal text-16-12 truncate overflow-hidden whitespace-nowrap flex-grow">
                {location}/profile/{user?._id}
              </p>
              <button
                style={{
                  background: "#38AEE3",
                  borderRadius: "0px 50px 50px 0px",
                }}
                className="hover:opacity-60 my-0 px-2 py-2 font-normal text-16-12 text-white duration-700 delay-150"
                onClick={() => {
                  const textToCopy = `${location}/profile/${user?._id}`; // Replace with the text you want to copy
                  navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                      fireToastMessage({ message: "Link copied successfully" }); // Optional success message
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

      <div className="flex flex-wrap gap-x-4 gap-y-6 w-full">
        <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
          <p className="mb-2 font-bold text-2xl">Description</p>
          <p className="leading-5">
            {user?.aboutMe ? user?.aboutMe : "No description available."}
          </p>
        </div>

        <div className="width-2div">
          <div>
            {!isLoading && data[0] && (
              <ProfileCard1
                img={data[0]?.user?.imageUrl}
                jobType={formatSentence(data[0]?.jobType)}
                intro={data[0]?.[data[0]?.jobType]?.jobDescription || "N/A"}
                loc={data[0]?.user?.location}
                hr={data[0]?.user?.noOfChildren?.length}
                rate={data[0]?.user?.averageRating}
                time={data[0]?.[data[0]?.jobType]?.preferredSchedule}
                nanny={true}
                imageNot={true}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 my-8 w-full">
        <div className="flex gap-6 border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl width-div">
          <div>
            <p className="mb-2 font-bold text-2xl">Number of Child</p>
            <p>{user?.noOfChildren?.length} Children</p>
          </div>
          <div>
            <p className="mb-2 font-bold text-2xl">Age of Children</p>
            <p>
              {user?.noOfChildren?.info &&
                Object.entries(user?.noOfChildren?.info)
                  .map(
                    ([child, age]) =>
                      `${formatSentence(child)}: ${age} years old`
                  )
                  .join(", ")}
            </p>
          </div>
        </div>
        <div className="width-2div">
          <div className="border-[1px] border-[#D6DDEB] bg-white p-4 rounded-2xl">
            <p className="mb-2 font-bold text-2xl">Service:</p>
            <div className="items-center">
              {Array.isArray(user?.services) && user?.services.length > 0 ? (
                user?.services.map((v, i) => (
                  <div key={i} className="flex items-start">
                    <p className="w-1/2 font-semibold Quicksand">
                      {customFormat(v)}:
                    </p>
                    <span className="w-1/2 font-normal">Yes</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start">
                  <p className="w-1/2 font-semibold Quicksand">Nanny:</p>
                  <span className="w-1/2 font-normal">Yes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-[1px] border-[#D6DDEB] bg-white mb-8 p-4 rounded-2xl width-div">
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
    </div>
  );
}
