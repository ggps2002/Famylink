import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { ProfileCard1 } from "../../subComponents/profileCard";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toCamelCase } from "../../subComponents/toCamelStr";
import { convertAgeRanges } from "../../../Config/helpFunction";
import Loader from "../../subComponents/loader";
import { fetchAllPostJobThunk } from "../../Redux/postJobSlice";
// ProfileList component
export default function ProfileList({
  location,
  priceRange,
  availability,
  careOptions,
  services,
  maxChildren,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { data, pagination, isLoading } = useSelector((state) => state.jobPost);
  console.log(data)
  const pageSize = 4;
  useEffect(() => {
    const filters = {
      page: currentPage,
      limit: pageSize,
    };
    if (location > 0) {
      filters.location = location
    }
    if (careOptions.length > 0) {
      const { min, max } = convertAgeRanges(careOptions);
      filters.minAge = min;
      filters.maxAge = max;
    }
    if (priceRange[0] >= 0 && priceRange[1] >= 0) {
      filters.minRate = priceRange[0];
      filters.maxRate = priceRange[1];
    }
    if (maxChildren) {
      filters.maxChildren = maxChildren;
    }
    if (services.length > 0) {
      const camelCaseAvailability = services.map(toCamelCase);
      filters.jobType = camelCaseAvailability.join(", ");
    }
    if (availability?.length > 0) {
      availability?.length == 1
        ? (filters.preferredSchedule = availability.join(", "))
        : (filters.preferredSchedule = availability);
    }
    dispatch(fetchAllPostJobThunk(filters));
  }, [
    dispatch,
    currentPage,
    location,
    careOptions,
    priceRange,
    availability,
    services,
    maxChildren,
  ]);
  useEffect(() => {
    setCurrentPage(1);
  }, [location, careOptions, priceRange, maxChildren]);
  const total = pagination.totalRecords; // Use the nannies directly after fetching

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the range of items being shown (e.g., "Showing 1-08 from 100")
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-col w-full px-0 lg:px-4 2xl:px-8">
      <div
        className={
          "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4"
        }
      >
        {isLoading ? (
          <Loader />
        ) : data?.length > 0 ? (
          data.map((profile) => (
            <NavLink
              key={profile._id}
              to={`jobDescription/${profile._id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ProfileCard1
                img={profile.user.imageUrl}
                name={profile.user.name}
                intro={profile?.[profile?.jobType]?.jobDescription || "N/A"}
                loc={profile?.user.location}
                hr={profile?.user?.noOfChildren?.length}
                rate={profile?.user?.averageRating}
                time={profile?.[profile?.jobType]?.preferredSchedule}
                nanny={true}
                zipCode={profile?.user?.zipCode}
              />
            </NavLink>
          ))
        ) : (
          <div className="col-span-full text-start text-gray-600">
            <p>No profiles available at the moment. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Ant Design Pagination */}
      <div className="mt-6 w-full flex justify-end">
        {!isLoading && data?.length !== 0 && (
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-500 Quicksand">
              Showing {startItem}-{endItem} from {total}
            </p>
            <Pagination
              className="font-bold pagination-custom Quicksand"
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
