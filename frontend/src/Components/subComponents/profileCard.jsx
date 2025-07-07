import star from "../../assets/images/star.png";
import Avatar from "react-avatar";

export default function ProfileCard({
  nanny,
  img,
  time,
  name,
  intro,
  loc,
  hr,
  exp,
  rate,
  zipCode,
}) {
  return (
    <div
      className={`flex flex-col justify-between shadow-custom-shadow border-[#D6DDEB] w-full min-h-96 bg-white p-4 rounded-2xl Quicksand`}
    >
      <div className="max-lg:w-full">
        <div className="flex justify-between">
          {img ? (
            <img
              className="bg-black rounded-full w-20 h-20 object-contain"
              src={img}
              alt="img"
            />
          ) : (
            <Avatar
              className="rounded-full text-black"
              size="80"
              color={"#38AEE3"}
              name={name
                ?.split(" ") // Split by space
                .slice(0, 2) // Take first 1–2 words
                .join(" ")}
            />
          )}

          <div>
            {time && (
              <p
                style={{ background: "#E7F6FD" }}
                className="px-2 py-1 rounded-lg text-sm"
              >
                {time}
              </p>
            )}
          </div>
        </div>
        <p className="my-2 font-bold text-2xl">{name}</p>
      </div>

      <p className="font-medium flex-1">
        {intro.length > 400 ? `${intro.substring(0, 400)}...` : intro}
      </p>

      <div>
        {loc && (
          <p className="my-2 font-semibold text-lg">{loc?.format_location}</p>
        )}
        {/* {zipCode && <p className="my-2 font-semibold text-lg">{zipCode}</p>} */}

        <div className="flex justify-between items-center">
          {!nanny ? (
            <p>
              {hr && (
                <span className="font-semibold">
                  {hr}hr <span className="font-normal">with kids | </span>
                </span>
              )}
              <span className="font-semibold">{exp}</span> experience
            </p>
          ) : (
            <p>
              <span className="font-semibold">
                {hr} <span className="font-normal">kids</span>
              </span>
            </p>
          )}
          {rate && (
            <div
              style={{ background: "#FBF5DE" }}
              className="flex gap-x-1 px-2 rounded-xl"
            >
              <p>{rate}</p>
              <img className="object-contain" src={star} alt="star" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileCard1({
  nanny,
  img,
  name,
  intro,
  loc,
  hr,
  time,
  rate,
  imageNot,
  jobType,
  zipCode,
}) {
  return (
    <div
      className={`flex flex-col justify-between shadow-custom-shadow border-[#D6DDEB] w-full ${
        imageNot ? `` : `lg:min-h-96`
      } bg-white p-4 rounded-2xl Quicksand `}
    >
      <div className="max-lg:w-full">
        <div className="flex items-start justify-between">
          {img ? (
            <img
              className="bg-black rounded-full w-20 h-20 object-contain"
              src={img}
              alt="img"
            />
          ) : (
            !imageNot && (
              <Avatar
                className="rounded-full text-black"
                size="80"
                color={"#38AEE3"}
                name={name
                  ?.split(" ") // Split by space
                  .slice(0, 2) // Take first 1–2 words
                  .join(" ")}
              />
            )
          )}
          {imageNot && <p className=" font-bold text-2xl">{jobType}</p>}
          {time && (
            <p
              style={{ background: "#E7F6FD" }}
              className="px-2 py-1 rounded-lg text-sm"
            >
              {time}
            </p>
          )}
        </div>
        <p className="my-2 font-bold text-2xl">{name}</p>
      </div>

      <p className="font-medium flex-1">
        {intro.length > 300 ? `${intro.substring(0, 300)}...` : intro}
      </p>

      <div>
        {loc && (
          <p className="my-2 font-semibold text-lg">{loc?.format_location}</p>
        )}
        {/* {zipCode && (
          <p className="my-2 font-semibold text-lg">Zip Code: {zipCode}</p>
        )} */}
        <div className="flex justify-between items-center">
          {!nanny ? (
            <p>
              {hr && (
                <span className="font-semibold">
                  {hr} <span className="font-normal">kids</span>
                </span>
              )}
            </p>
          ) : (
            <p>
              <span className="font-semibold">
                {hr} <span className="font-normal">kids</span>
              </span>
            </p>
          )}
          {Number(rate) > 0 && (
            <div
              style={{ background: "#FBF5DE" }}
              className="flex gap-x-1 px-2 rounded-xl"
            >
              <p>{rate}</p>
              <img className="object-contain" src={star} alt="star" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
