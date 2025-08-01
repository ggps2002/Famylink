import React, { useState } from "react";
import Button from "../Button";
import { NavLink } from "react-router-dom";
import { Spin, Input } from "antd";
import { fireToastMessage } from "../../toastContainer";
import { api } from "../../Config/api";
import { Star, X } from "lucide-react";

function JobPreview() {
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [caregiverData, setCaregiverData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState(""); // "caregivers" or "jobs"

  const handleZipValidation = async (zip) => {
    if (!zip) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error("Invalid ZIP");

      const data = await res.json();
      const finalZip = data["post code"];
      if (finalZip) {
        setZipCode(finalZip);
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      setZipCode("");
      fireToastMessage({
        type: "error",
        message: "Invalid ZIP code. Please enter a valid U.S. ZIP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async () => {
    if (!zipCode) {
      fireToastMessage({
        type: "error",
        message: "Enter a valid US zip code first",
      });
      return;
    }
    setIsLoading(true);
    setSearchType("jobs");

    try {
      const { data } = await api.get(
        `postJob/job-seeker-opportunities/${zipCode}`
      );
      const response = data?.data || [];
      console.log("Job seeker opportunities response:", response);
      setJobData(response);
      setCaregiverData([]);
      setShowResults(true);
    } catch (err) {
      console.error("Error fetching job opportunities:", err);
      fireToastMessage({
        type: "error",
        message: "Could not load job opportunities. Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setCaregiverData([]);
    setJobData([]);
    setSearchType("");
  };

  return (
    <>
      <div className="container relative Livvic flex justify-center items-center min-h-[400px] sm:min-h-[600px] my-12 sm:my-20">
        {/* Sun decoration - hidden on mobile */}
        <div className="absolute right-0 top-0 hidden sm:block">
          <img src="/icons/Background/Sun.svg" alt="sun" />
        </div>

        <div className="text-center">
          <h1 className="Livvic-Bold text-2xl sm:text-5xl sm:leading-[70px] ">
           Start Your Journey with Meaningful 
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
           and Well-Paid Child Caregiver Jobs 
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
           Close to Home.
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 justify-center items-center">
            <div className="relative">
              <Spin
                spinning={loading}
                size="small"
                className="absolute z-10 left-3 top-1/2 -translate-y-1/2"
              >
                <Input
                  name="zipCode"
                  placeholder="Enter zip code to find jobs"
                  onChange={(e) => {
                    const zip = e.target.value;
                    setZipCode(zip);
                  }}
                  onBlur={(e) => handleZipValidation(e.target.value.trim())}
                  value={zipCode}
                  className="w-full sm:w-[300px] p-3 sm:p-4 pr-12 rounded-full border-2"
                  maxLength={10}
                />
              </Spin>
            </div>

            {/* <Button
              btnText={
                isLoading && searchType === "caregivers"
                  ? "Searching..."
                  : "Find Care"
              }
              className="bg-[#AEC4FF] w-full sm:w-auto px-6 py-3 sm:py-4"
              action={handleFindCare}
              isLoading={isLoading && searchType === "caregivers"}
              loadingBtnText="Searching..."
            /> */}
            <Button
              btnText={
                isLoading && searchType === "jobs"
                  ? "Searching..."
                  : "Find Care"
              }
              className="bg-[#AEC4FF] w-full sm:w-auto px-6 py-3 sm:py-4"
              action={handlePostJob}
              isLoading={isLoading && searchType === "jobs"}
              loadingBtnText="Searching..."
            />
          </div>
        </div>

        {/* Rainbow decoration - hidden on mobile */}
        <div className="absolute left-0 -bottom-4 hidden sm:block">
          <img src="/icons/Background/Rainbow.svg" alt="rainbow" />
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden bg-white">
            {/* Results Header */}
            <div className="flex justify-between items-center p-6 sm:p-8 ">
              <div>
                <h3 className=" text-xl sm:text-2xl md:text-3xl font-bold Livvic-Bold">
                  {searchType === "caregivers"
                    ? `Available Caregivers in ${zipCode}`
                    : `Job Opportunities in ${zipCode}`}
                </h3>
                <p className=" text-sm sm:text-base mt-1">
                  {searchType === "caregivers"
                    ? `${caregiverData.length} caregiver${
                        caregiverData.length !== 1 ? "s" : ""
                      } found`
                    : `${jobData.length} job${
                        jobData.length !== 1 ? "s" : ""
                      } found`}
                </p>
              </div>
              <button
                onClick={handleCloseResults}
                className="flex items-center gap-2  px-3 sm:px-4 py-2 rounded-full transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Close</span>
              </button>
            </div>

            {/* Results Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 sm:p-8">
              {/* Caregivers Results */}
              {searchType === "caregivers" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {caregiverData.length > 0 ? (
                    caregiverData.map((person, index) => (
                      <div
                        key={index}
                        className=" rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full transition-all duration-300"
                      >
                        <div className="mb-4">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-3">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-800 Livvic-Bold">
                              {person.name}
                            </h4>
                            <span className="inline-block border border-[#EEEEEE] text-[#555555] text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
                              {person.role}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex items-center">
                              {[...Array(person.rating || 5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-1">
                              ({person.rating || 5}.0)
                            </span>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-gray-700 flex flex-wrap gap-2">
                              <span className="px-2 py-1 rounded text-xs font-medium">
                                {person.rate}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium">
                                {person.availability?.option || "Available"}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium">
                                {person.experience?.option || "Experienced"}
                              </span>
                            </p>

                            <p className="text-gray-600 text-sm italic leading-relaxed">
                              "
                              {person.description?.slice(0, 80) ||
                                "Dedicated caregiver ready to help your family"}
                              ..."
                            </p>

                            <div className="px-3 py-2 rounded-lg">
                              <p className="text-sm font-medium">
                                <span className="text-gray-600">Service:</span>
                                <span className="text-[#0f3460] ml-1">
                                  {person.service}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <NavLink
                          to="/joinNow"
                          onClick={() => {
                            handleCloseResults();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="mt-auto"
                        >
                          <button className="w-full  font-bold text-sm sm:text-base px-4 py-3 rounded-full transition-all duration-300 bg-primary text-primary">
                            {person.cta || "Connect Now"}
                          </button>
                        </NavLink>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-gradient-to-br from-[#AEC4FF]/10 to-[#85D1F1]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#AEC4FF]/30">
                        <p className="text-white text-lg mb-2">
                          No caregivers found in this area
                        </p>
                        <p className="text-[#FFFFFF99] text-sm">
                          Try searching with a different ZIP code
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Jobs Results */}
              {searchType === "jobs" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {jobData.length > 0 ? (
                    jobData.map((job, index) => (
                      <div
                        key={index}
                        className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full transition-all duration-300"
                      >
                        <div className="mb-4 bg-white">
                          {/* Job Title */}
                          <div className="mb-3">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-800 Livvic-Bold mb-2">
                              {job.title}
                            </h4>

                            {/* Rate and Type */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                {job.rate}
                              </span>
                              {job.type && (
                                <span className="bg-[#AEC4FF]/20 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {job.type}
                                </span>
                              )}
                            </div>

                            {/* Job Description (if available) */}
                            {job.description && (
                              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {job.description.slice(0, 100)}...
                              </p>
                            )}

                            {/* Additional Details */}
                            <div className=" px-3 py-2 rounded-lg">
                              <p className="text-sm font-medium text-[#0f3460]">
                                Job Opportunity Available
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <NavLink
                          to="/joinNow"
                          onClick={() => {
                            handleCloseResults();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="mt-auto"
                        >
                          <button className="w-full font-bold text-sm sm:text-base px-4 py-3 rounded-full transition-all duration-300 bg-primary text-primary">
                            {job.action || "Apply Now"}
                          </button>
                        </NavLink>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div>
                        <p className="text-white text-lg mb-2">
                          No job opportunities found in this area
                        </p>
                        <p className="text-[#FFFFFF99] text-sm">
                          Try searching with a different ZIP code
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobPreview;
