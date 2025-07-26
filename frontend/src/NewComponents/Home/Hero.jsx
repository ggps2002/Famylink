import Button from "../Button";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { Spin, Input } from "antd";
import { fireToastMessage } from "../../toastContainer";
import { api } from "../../Config/api";
import { Star, X } from "lucide-react";

function Hero() {
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
        // form.setFieldsValue({
        //   zipCode: finalZip,
        // });
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      setZipCode("");
      // form.setFieldsValue({ zipCode: "" });
      fireToastMessage({
        type: "error",
        message: "Invalid ZIP code. Please enter a valid U.S. ZIP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataRetrieve = async () => {
    if (!zipCode) {
      fireToastMessage({
        type: "error",
        message: "Enter a valid US zip code first",
      });
      return;
    }
    setIsLoading(true);

    try {
      const { data } = await api.get(`userData/service-providers/${zipCode}`);
      const response = data?.data || [];
      console.log("Service provider response:", response);
      // const shuffled = [...response].sort(() => 0.5 - Math.random());
      // return shuffled.slice(0, 3);
      setData(response);
      setShowResults(true);
    } catch (err) {
      console.error("Error fetching service providers:", err);
      fireToastMessage({
        type: "error",
        message: "Could not load service providers. Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setData([]);
  };

  return (
    <div className="Livvic container min-h-screen px-4 sm:px-6 lg:px-8">
      <header>
        <div className="flex justify-between items-center py-2 sm:py-4">
          <div className="flex gap-1 items-center">
            <img src="/logo.svg" alt="logo" className="w-6 h-6 sm:w-8 sm:h-8" />
            <p className="font-bold text-lg sm:text-xl Livvic-Bold text-white">
              FamilyLink
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <NavLink to="login">
              <Button
                btnText="Log in"
                className="text-white text-sm sm:text-base"
              />
            </NavLink>
            <NavLink to="joinNow">
              <Button
                btnText={"Join now"}
                className="bg-[#AEC4FF] text-sm sm:text-base"
              />
            </NavLink>
          </div>
        </div>
      </header>

      <div className="mt-20 sm:mt-32">
        <h1 className="Livvic-Bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight sm:leading-[50px] md:leading-[60px] lg:leading-[80px]">
          Find the Right Childcare—
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Without the Guesswork
        </h1>
        <h2 className="Livvic text-[#FFFFFF99] text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-2xl">
          Smart matching for nannies, tutors, coaches, and everything your
          family needs.
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-7 max-w-md sm:max-w-lg">
          <div className="flex-1">
            <div className="relative">
              <Spin
                spinning={loading}
                size="small"
                className="absolute z-10 left-3 top-1/2 -translate-y-1/2"
              >
                <Input
                  name="zipCode"
                  placeholder="Enter zip code to find caregivers"
                  onChange={(e) => {
                    const zip = e.target.value;
                    setZipCode(zip);
                  }}
                  onBlur={(e) => handleZipValidation(e.target.value.trim())}
                  value={zipCode}
                  className="w-full p-3 sm:p-4 pr-12 rounded-full"
                  maxLength={10}
                />
              </Spin>
            </div>
          </div>
          <Button
            btnText="Find a Match"
            className="bg-[#AEC4FF] w-full sm:w-auto px-6 py-3 sm:py-4"
            action={() => handleDataRetrieve()}
            isLoading={isLoading}
            loadingBtnText="Searching..."
          />
        </div>
      </div>

      {/* Results Section with Background Overlay */}
      {showResults && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#AEC4FF]/30">
            {/* Results Header */}
            <div className="flex justify-between items-center p-6 sm:p-8 border-b border-[#AEC4FF]/20 bg-gradient-to-r from-[#AEC4FF]/5 to-[#85D1F1]/5">
              <div>
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold Livvic-Bold">
                  Available Caregivers in {zipCode}
                </h3>
                <p className="text-[#FFFFFF99] text-sm sm:text-base mt-1">
                  {data.length} caregiver{data.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={handleCloseResults}
                className="flex items-center gap-2 bg-[#AEC4FF]/20 hover:bg-[#AEC4FF]/30 text-white px-3 sm:px-4 py-2 rounded-full transition-all duration-200 border border-[#AEC4FF]/40 hover:border-[#AEC4FF]/60"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Close</span>
              </button>
            </div>

            {/* Results Grid with Scroll */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {data.length > 0 ? (
                  data.map((person, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-[#f8faff] shadow-xl hover:shadow-2xl rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full transition-all duration-300 hover:scale-[1.02] border border-[#AEC4FF]/30 hover:border-[#AEC4FF]/50"
                    >
                      <div className="mb-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-3">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-800 Livvic-Bold">
                            {person.name}
                          </h4>
                          <span className="inline-block bg-[#AEC4FF] text-gray-800 text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
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
                            <span className="bg-[#AEC4FF]/20 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                              {person.rate}
                            </span>
                            <span className="bg-[#85D1F1]/20 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                              {person.availability?.option || "Available"}
                            </span>
                            <span className="bg-[#AEC4FF]/15 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                              {person.experience?.option || "Experienced"}
                            </span>
                          </p>

                          <p className="text-gray-600 text-sm italic leading-relaxed">
                            "{person.description?.slice(0, 80) || "Dedicated caregiver ready to help your family"}..."
                          </p>

                          <div className="bg-gradient-to-r from-[#AEC4FF]/10 to-[#85D1F1]/10 px-3 py-2 rounded-lg border border-[#AEC4FF]/20">
                            <p className="text-sm font-medium">
                              <span className="text-gray-600">Service:</span> 
                              <span className="text-[#0f3460] ml-1">{person.service}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <NavLink
                        to="joinNow"
                        onClick={() => {
                          handleCloseResults();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="mt-auto"
                      >
                        <button className="w-full bg-gradient-to-r from-[#85D1F1] to-[#AEC4FF] hover:from-[#AEC4FF] hover:to-[#85D1F1] text-[#0f3460] font-bold text-sm sm:text-base px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg border border-[#AEC4FF]/30">
                          {person.cta || "Connect Now"}
                        </button>
                      </NavLink>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-gradient-to-br from-[#AEC4FF]/10 to-[#85D1F1]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#AEC4FF]/30">
                      <p className="text-white text-lg mb-2">No caregivers found in this area</p>
                      <p className="text-[#FFFFFF99] text-sm">Try searching with a different ZIP code</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;