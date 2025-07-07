import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestThunk } from "../../Redux/requestedData";
import Avatar from "react-avatar";
import {
  formatDate,
  formatTime,
  timeAgo,
} from "../../subComponents/toCamelStr";
import Loader from "../../subComponents/loader";
export default function AplliedList() {
  const { data, pagination, isLoading } = useSelector((state) => state.reqData);
  // console.log(data)
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 2; // Number of profiles per page

  const fetchRequests = async (page) => {
    await dispatch(fetchRequestThunk({ page, limit })).unwrap();
  };

  useEffect(() => {
    fetchRequests(currentPage); // Fetch requests when the component mounts or current page changes
  }, [currentPage, dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };

  // Calculate the range of items being shown
  const total = pagination ? pagination.totalRecords : 0; // Total number of records
  const startItem = (currentPage - 1) * limit + 1; // Start item index
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="px-4">
      <div>
        {data.map((profile) => (
          <NavLink
            to={`/nanny/jobDescription/${profile?.familyId?._id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 my-8 px-8 py-4 border rounded-2xl">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <div>
                  {profile?.familyId.imageUrl ? (
                    <img
                      className="bg-black rounded-full w-20 h-20 object-contain"
                      src={profile?.familyId?.imageUrl}
                      alt="img"
                    />
                  ) : (
                    <Avatar
                      className="rounded-full text-black"
                      size="80"
                      color={"#38AEE3"}
                      name={profile?.familyId?.name
                        ?.split(" ") // Split by space
                        .slice(0, 2) // Take first 1–2 words
                        .join(" ")}
                    />
                  )}
                </div>

                <div>
                  <p className="font-bold text-2xl">
                    {profile?.familyId?.name}
                  </p>
                  <div className="mt-1">
                    <p>
                      {
                        Object.keys(
                          profile?.familyId?.additionalInfo.find(
                            (info) => info.key === "noOfChildren"
                          )?.value || {}
                        ).length
                      }{" "}
                      Children
                    </p>

                    <div>
                      {profile?.familyId?.additionalInfo?.find(
                        (info) => info.key === "specificDaysAndTime"
                      )?.value &&
                        Object.keys(
                          profile.familyId.additionalInfo.find(
                            (info) => info.key === "specificDaysAndTime"
                          ).value
                        ).map((day, index) => {
                          const specificDaysAndTime =
                            profile.familyId.additionalInfo.find(
                              (info) => info.key === "specificDaysAndTime"
                            ).value;
                          const { start, end } = specificDaysAndTime[day];

                          // Convert start and end time to a more readable format
                          const startTime = new Date(start).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          );
                          const endTime = new Date(end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <div key={index} className="flex flex-wrap gap-x-4">
                              <p>
                                <span className="font-bold">Day:</span> {day}
                              </p>
                              <p>
                                <span className="font-bold">Time:</span>{" "}
                                {startTime} - {endTime}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    <p>
                      <span className="font-bold">Zip Code:</span>{" "}
                      {profile?.familyId?.location?.format_location}
                    </p>
                    {/* {profile?.familyId?.zipCode && <p>
                      <span className='font-bold'>Zip Code:</span>{' '}
                      {profile?.familyId?.zipCode}
                    </p>} */}
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-end">
                <div>
                  <p className="text-black text-end">
                    Initiated {formatDate(profile.createdAt)}
                  </p>
                  <p style={{ color: "#9EA3A2" }} className="text-end text-xs">
                    {timeAgo(profile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Ant Design Pagination */}
      <div className="flex justify-end mt-6">
        {!isLoading ? (
          <>
            <p
              style={{ color: "#667085" }}
              className="mt-1 mr-4 font-medium text-sm Quicksand"
            >
              Showing {startItem}-{endItem} from {total}
            </p>
            <Pagination
              className="font-bold pagination-custom Quicksand"
              current={currentPage} // Use currentPage instead of page
              pageSize={limit} // Use pageSize instead of limit
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
